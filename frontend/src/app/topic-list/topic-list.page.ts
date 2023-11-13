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
  topicos: any = [];
  topicosCompartidosConmigo: any = [];
  textoTopicosCompartidos: string = "Topicos compartidos con el Usuario:"

  private platform = inject(Platform);
  public alertButtons = ['Aceptar', 'Cancelar'];

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  updateColor(id: string, color: string) {
    // Implementa la lógica para actualizar el color del tópico aquí
    console.log(`Actualizando color del tópico ${id} a ${color}`);
    // Por ejemplo, puedes hacer una solicitud HTTP a tu backend para actualizar el color
  }
  ionViewWillEnter(): void {
    //verificar si el usuario no esta logueado
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.getTopics();
    this.getTopicsShareMe()

  }

  ngOnInit() {
  }

  async confirmDelete(id: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Desea eliminar el registro?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteTopic(id);
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
        this.presentToast(error.message);
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
}
