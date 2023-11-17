// Importación de módulos y servicios necesarios para el componente
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

// Decorador que define el componente, su HTML y CSS asociados
@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.page.html',
  styleUrls: ['./theme-list.page.scss'],
})
export class ThemeListPage implements OnInit {
  temas: any = []; // Array para almacenar los temas
  originalTemas: any = []; // Copia del array de temas para resetear cambios
  private platform = inject(Platform); // Inyección del servicio Platform
  public alertButtons = ['Aceptar', 'Cancelar']; // Botones para las alertas
  porcentaje=0.05; // Variable para el porcentaje utilizado en una barra de progreso (no mostrado en el HTML)


  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

 // Ciclo de vida que se ejecuta cuando la vista está por entrar
 ionViewWillEnter(): void {
  // Verificar si el usuario está logueado
  let token = localStorage.getItem('token');
  if (!token) {
    // Si no hay token, redirige al login
    this.router.navigate(['/login']);
    return;
  }
  // Si hay token, obtener la lista de temas
  this.getThemes();
}
  
// Ciclo de vida que se ejecuta en la inicialización del componente
  ngOnInit() {}

  // Función para confirmar la eliminación de un tema
  async confirmDelete(id: string) {
    // Crea una alerta para la confirmación
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Desea eliminar el registro?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // Si se acepta, llama a la función para eliminar el tema
            this.deleteTheme(id);
          },
        },
        {
          text: 'Cancelar',
          handler: () => {
            // Si se cancela, simplemente registra el evento
            console.log('Cancelado');
          },
        },
      ],
    });
    // Presenta la alerta al usuario
    await alert.present();
  }

  // Función para obtener los temas desde el servidor
  async getThemes() {
    let token = localStorage.getItem('token');
    // Configuración de los headers de la petición HTTP
    let config = {
      headers: {
        Authorization: token,
      },
    };
    try {
      // Realiza la petición HTTP GET para obtener los temas
      const result = await axios.get('http://localhost:3000/themes/list', config);
      if (result.data.success === true) {
        // Si es exitosa, almacena los temas en la variable correspondiente
        this.temas = result.data.temas;
        // También actualiza la copia de los temas
        this.originalTemas = [...this.temas];
      } else {
        // Si hay un error, lo registra en la consola
        console.log(result.data.error);
      }
    } catch (error: any) {
      // Si hay un error en la petición, lo registra en la consola
      console.log(error.message);
    }
  }

  // Función para eliminar un tema utilizando su ID
  deleteTheme(id: any) {
    let token = localStorage.getItem('token');
    // Configuración de los headers de la petición HTTP
    let config = {
      headers: {
        Authorization: token,
      },
    };
    // Realiza la petición HTTP DELETE para eliminar el tema
    axios
      .delete('http://localhost:3000/themes/delete/' + id, config)
      .then((result) => {
        if (result.data.success === true) {
          // Si es exitosa, muestra un mensaje y recarga los temas
          this.presentToast('Tema Eliminado');
          this.getThemes();
        } else {
          // Si hay un error, muestra un mensaje con el error
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        // Si hay un error en la petición, muestra un mensaje con el error
        this.presentToast(error.message);
      });
  }


  // Función para obtener el texto del botón de regreso dependiendo de la plataforma
  getBackButtonText() {
    const isIos = this.platform.is('ios');
    // Devuelve un texto vacío si es iOS, de lo contrario también puede devolver un texto vacío o personalizar
    return isIos ? '' : '';
  }

  // Función para mostrar un mensaje 'toast' informativo en pantalla
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    // Presenta el toast en la pantalla
    await toast.present();
  }

  // Función para reordenar los temas cuando el usuario cambia su posición
  reorder(event: any) {
    // Extrae el tema movido de su posición original
    const moverItem = this.temas.splice(event.detail.from, 1)[0];
    // Inserta el tema movido en su nueva posición
    this.temas.splice(event.detail.to, 0, moverItem);
    // Completa la acción de reordenar
    event.detail.complete();
    // Actualiza la copia de los temas para reflejar el nuevo orden
    this.originalTemas = [...this.temas];
  }

  // Función para ordenar los temas alfabéticamente de A a Z
  sortAZ() {
    this.temas.sort((a: any, b: any) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      // Compara los nombres para determinar el orden
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
  }

  // Función para ordenar los temas alfabéticamente de Z a A
  sortZA() {
    this.temas.sort((a: any, b: any) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      // Compara los nombres para determinar el orden inverso
      return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
    });
  }

  // Función para ordenar los temas por ID en orden ascendente
  sortIdAsc() {
    this.temas.sort((a: any, b: any) => a.id - b.id);
  }

  // Función para ordenar los temas por ID en orden descendente
  sortIdDesc() {
    this.temas.sort((a: any, b: any) => b.id - a.id);
  }

  // Función para guardar el orden de los temas
  saveOrder() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    // Prepara los datos de orden para enviar al servidor
    const orderData = this.temas.map((tema: any, index: any) => ({ id: tema.id, order_index: index }));
    // Envía la petición al servidor para actualizar el orden
    axios.post('http://localhost:3000/themes/update-order', orderData, config)
      .then((result) => {
        if (result.data.success) {
          // Si la respuesta es exitosa, muestra un mensaje de éxito
          this.presentToast('Orden guardado con éxito');
        }
      })
      .catch((error) => {
        // Si hay un error, muestra un mensaje de error
        this.presentToast('Error al guardar el orden: ' + error.message);
      });
  }

  // Función para manejar el cambio en la barra de rango (no implementado en el HTML actual)
  cambioRango(event: any) {
    // Registra el evento y actualiza el porcentaje basado en el valor de la barra de rango
    console.log(event);
    this.porcentaje = event.detail.value / 100;
  }

}
