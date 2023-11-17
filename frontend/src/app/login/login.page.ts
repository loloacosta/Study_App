// Importación de módulos y bibliotecas necesarios
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import axios from 'axios';

// Declaración del componente
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Declaración de propiedades de la clase
  public message!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  usuario: any = '';
  isModal: boolean = false;
  emailRecuperacion: string = '';
  usuarios: any = [];

  // Constructor del componente
  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  // Método que se ejecuta al iniciar el componente
  ngOnInit() {
    // Recupera un ID de la ruta actual
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    // Realiza una solicitud GET a una URL para obtener datos
    axios
      .get('http://localhost:3000/users/buscarPorCodigo/0')
      .then((result) => {
        if (result.data.success == true) {
          if (result.data.usuario != null) {
            this.usuario = result.data.usuario;
          } else {
            this.usuario = {};
          }
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  // Método para obtener el texto del botón de retroceso
  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }

  // Método para iniciar sesión del usuario
  loginUser() {
    console.log('usuario: ', this.usuario);
    var data = {
      email: this.usuario.email,
      password: this.usuario.password,
    };
    // Realiza una solicitud POST para iniciar sesión
    axios
      .post('http://localhost:3000/user/login', data)
      .then(async (result) => {        
        if (result.data.success == true) {
          this.presentToast('Bienvenido a StudyApp');
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('user_id', result.data.user_id);
          this.router.navigate(['/home']);
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch(async (error) => {
        this.presentToast(error.message);
      });
  }

  // Método que se ejecuta antes de mostrar la vista
  ionViewWillEnter(): void {
    // Verificar si el usuario está logueado
    let token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  // Método para mostrar un mensaje emergente (toast)
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  // Método para mostrar u ocultar el modal de recuperación de contraseña
  showRecoverPasswordModal() {
    this.isModal = !this.isModal;
  }

  // Método para obtener la lista de usuarios
  getUsers() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    // Realiza una solicitud GET para obtener la lista de usuarios
    axios
      .get('http://localhost:3000/users/list', config)
      .then((result) => {
        if (result.data.success == true) {
          this.usuarios = result.data.usuarios;
          // Verificar si el correo de recuperación existe en la lista de usuarios
          const usuario = this.verificarCorreo()

          if (usuario)
            this.crearNuevaPassword(usuario.id)
          else
            this.presentToast("No existe el usuario");

        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  // Método para verificar si un correo existe en la lista de usuarios
  verificarCorreo() {
    return this.usuarios.find((usuario: any) => usuario.email === this.emailRecuperacion);
  }

  // Método para enviar un correo con una nueva contraseña
  enviarEmail(newPassword: string) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    const dataSend = {
      destinoEmail: this.emailRecuperacion,
      subject: 'STUDYAPP - Recuperar Contraseña',
      text: `Su nueva contraseña es: ${newPassword}`
    };
    // Realiza una solicitud POST para enviar un correo con la nueva contraseña
    axios.post('http://localhost:3000/themes_properties/enviaremail', dataSend, config)
      .then((result) => {
        if (result.data.success) {
          this.presentToast(`Se le ha enviado la nueva contraseña al correo ${this.emailRecuperacion}`);
        }
      })
      .catch((error) => {
        console.log(error);
        this.presentToast('Error: ' + error.message);
      });
  }

  // Método para crear una nueva contraseña
  crearNuevaPassword(id: number) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    // Realiza una solicitud GET para crear una nueva contraseña
    axios
      .get('http://localhost:3000/users/new-password/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.enviarEmail(result.data.newPassword)

        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  // Método para recuperar la contraseña
  recuperarPassword() {
    this.getUsers()
  }
}

