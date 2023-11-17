import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.page.html',
  styleUrls: ['./topic-list.page.scss'],
})


export class TopicListPage implements OnInit {
   // Arreglo para almacenar los tópicos obtenidos del servidor
   topicos: any = [];
   // ID del tópico compartido seleccionado
   sharedTopicId = 0;
   // Arreglo para almacenar los tópicos compartidos con el usuario
   topicosCompartidosConmigo: any = [];
   // Texto para mostrar cuando hay tópicos compartidos
   textoTopicosCompartidos: string = "Topicos compartidos con el Usuario:"

  // Servicio de plataforma para detectar en qué plataforma está corriendo la app
  private platform = inject(Platform);
  // Botones de alerta que se usarán en las confirmaciones
  public alertButtons = ['Aceptar', 'Cancelar'];

    // Constructor del componente, inyecta los servicios necesarios
  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  // updateColor(id: string, color: string) {
  //   // Implementa la lógica para actualizar el color del tópico aquí
  //   console.log(`Actualizando color del tópico ${id} a ${color}`);
  // }


 // Método que se ejecuta cuando el componente está por mostrarse
  ionViewWillEnter(): void {
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    // Obtener tópicos y tópicos compartidos al entrar en la vista
    this.getTopics();
    this.getTopicsShareMe();
  }

    // Método que se ejecuta en la inicialización del componente
  ngOnInit() {
  }

    // Método para obtener los tópicos del servidor
    getTopics() {
      let token = localStorage.getItem('token');
      let config = {
        headers: {
          Authorization: token,
        },
      };
      axios
        .get('http://localhost:3000/topics/list', config)
        .then((result) => {
          if (result.data.success == true) {
            this.topicos = result.data.topicos;
  
          } else {
            console.log(result.data.error);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

  async confirmDelete(id: number, texto: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Desea eliminar el registro?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // Determina qué tipo de eliminación realizar basado en el texto
            texto == "eliminartopico" ? this.deleteTopic(id) : this.deleteCompartidos(id);    
          },
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          },
        },
      ],
    });
    await alert.present();
  }

  // Método para eliminar un tópico utilizando su ID
  deleteTopic(id: any) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete('http://localhost:3000/topics/delete/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.presentToast('Topico Eliminado');
          this.getTopics();
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.error.includes('llave foránea')) {
          this.presentToast('Primero elimina los comentarios asociados a este tópico.');
        } else {
          this.presentToast(error.message);
        }
      });
  }


  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? '' : '';
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  //Ordenar visualmente
  reorder(event: any) {
    const moverItem = this.topicos.splice(event.detail.from, 1)[0];
    this.topicos.splice(event.detail.to, 0, moverItem);
    event.detail.complete();
  }

  sortAZ() {
    this.topicos.sort((a: any, b: any) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  sortZA() {
    this.topicos.sort((a: any, b: any) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }

  sortIdAsc() {
    this.topicos.sort((a: any, b: any) => a.id - b.id);
  }

  sortIdDesc() {
    this.topicos.sort((a: any, b: any) => b.id - a.id);
  }

  // Método para obtener los tópicos compartidos con el usuario
  getTopicsShareMe() {
    const user_id = localStorage.getItem('user_id');

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/topics/shared_me/' + user_id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.topicosCompartidosConmigo = result.data.topicos
          if (this.topicosCompartidosConmigo.length == 0) {
            this.textoTopicosCompartidos = "No se compartieron topicos con el Usuario actual"
          }
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  saveOrder() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    const orderData = this.topicos.map((tema: any, index: any) => ({ id: tema.id, order_index: index }));
    console.log(orderData);

    axios.post('http://localhost:3000/topics/update-order', orderData, config)
      .then((result) => {
        if (result.data.success) {
          this.presentToast('Orden guardado con éxito');
        }
      })
      .catch((error) => {
        this.presentToast('Error al guardar el orden: ' + error.message);
      });
  }




  deleteCompartidos(id_compartido: number) {


    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios

      .delete('http://localhost:3000/topics/shared-me-delete/' + id_compartido, config)
      .then((result) => {
        if (result.data.success == true) {
          console.log(id_compartido);
          this.getTopicsShareMe()
          this.presentToast('Eliminado...');
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        this.presentToast(error.message);
      });
  }







}
