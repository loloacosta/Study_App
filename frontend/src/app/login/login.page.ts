import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public message!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  usuario: any = '';
  isModal: boolean = false
  emailRecuperacion: string = ''
  usuarios: any = []

  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    //con este comando se recupera el id que se pasa
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
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

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }

  loginUser() {
    console.log('usuario: ', this.usuario);
    var data = {
      email: this.usuario.email,
      password: this.usuario.password,
    };
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
  ionViewWillEnter(): void {
    //verificar si el usuario esta logueado
    let token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }


  showRecoverPasswordModal() {
    this.isModal = !this.isModal;
  }

  getUsers() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/users/list', config)
      .then((result) => {
        if (result.data.success == true) {
          this.usuarios = result.data.usuarios;
          //console.log(this.usuarios);
          
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

  verificarCorreo() {
    return this.usuarios.find((usuario: any) => usuario.email === this.emailRecuperacion);
  }



  enviarEmail(newPassword: string) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };


    const dataSend = {
      destinoEmail: this.emailRecuperacion,
      subject: 'STUDYAPP - Recuperar Coontraseña',
      text: `Su nueva contraseña es: ${newPassword}`
    }
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

  crearNuevaPassword(id: number) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
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

  recuperarPassword() {
    this.getUsers()
  }

//final

}



