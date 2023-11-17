import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSelect, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.page.html',
  styleUrls: ['./topic-details.page.scss'],
})
export class TopicDetailsPage implements OnInit {
  topic: any; // Variable para almacenar los detalles del tópico actual
  private activatedRoute = inject(ActivatedRoute); // Inyección de dependencia para ActivatedRoute
  accion = 'Agregar Topico'; // Variable para mostrar la acción (agregar o detalles)
  topicoComentarios: any = []; // Arreglo para almacenar los comentarios del tópico
  Comentarios: string = "Comentarios"; // Título de la sección de comentarios
  isModal: boolean = false; // Variable para controlar la apertura/cierre del modal de comentarios
  newComentario: string = ""; // Nuevo comentario a agregar
  private platform = inject(Platform); // Inyección de dependencia para Platform

  usuarios: any = []; // Arreglo para almacenar la lista de usuarios
  usuariosSeleccionados: number[] = []; // Arreglo para almacenar usuarios seleccionados para compartir
  @ViewChild('selectUsuarios', { static: false }) selectUsuarios: IonSelect | undefined; // Referencia al componente IonSelect (selectUsuarios)
  mostrarSelectUsuarios: boolean = false; // Variable para controlar la apertura/cierre del modal de compartir usuarios
  userId = 0; // ID del usuario actualmente logueado

  topicsShareMe: any = []; // Arreglo para almacenar tópicos compartidos con el usuario

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ionViewWillEnter(): void {
    // Verificar si el usuario no está logueado
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = parseInt(localStorage.getItem('user_id') || '0', 10);
  }

  ngOnInit() {
    // Obtener la lista de usuarios
    this.getUsers();

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    // Obtener el ID del tópico de la URL
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;

    // Realizar una solicitud HTTP para obtener los detalles del tópico
    axios
      .get('http://localhost:3000/topics/buscarPorCodigo/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          if (id !== '0') {
            this.accion = 'Detalles Tópico'; // Cambiar la acción a "Detalles" si el ID no es '0'
          }
          if (result.data.topic != null) {
            this.topic = result.data.topic;
          } else {
            this.topic = {};
          }
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });

    // Obtener los comentarios relacionados con el tópico
    this.getTopicsComments(id);
  }

  // Método para obtener los comentarios relacionados con el tópico
  getTopicsComments(topic_id: string) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    axios
      .get('http://localhost:3000/topic-details/' + topic_id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.topicoComentarios = result.data.topicos;

          if (this.topicoComentarios.length == 0) {
            this.Comentarios = "Sin Comentarios"; // Cambiar el título a "Sin Comentarios" si no hay comentarios
            console.log(this.topicoComentarios.length);
          }
        } else {
          console.log(result.data);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  // Método para formatear una fecha en un formato específico
  formatDate(date: string): string {
    const fecha = new Date(date);
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Sumar 1 ya que los meses comienzan desde 0 (enero)
    const anio = fecha.getFullYear();

    const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;

    return `${horaFormateada} ${fechaFormateada}`;
  }

  // Método para abrir o cerrar el modal de comentarios
  abrirCerrarModal() {
    this.isModal = !this.isModal;
  }

  // Método para guardar un comentario
  guardarComentario() {
    const user_id = localStorage.getItem('user_id');
    const comentarioTopico = {
      text: this.newComentario,
      topic_id: this.topic.id,
      user_id: user_id,
    };

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    axios.post('http://localhost:3000/topics-details/comment', comentarioTopico, config)
      .then((result) => {
        if (result.data.success === true) {
          this.presentToast("Comentario agregado.");
          this.newComentario = '';
          this.abrirCerrarModal();
          this.getTopicsComments(this.topic.id); // Actualizar la lista de comentarios después de agregar uno
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Método para obtener el texto personalizado en el botón de retroceso
  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }

  // Método para obtener la lista de usuarios
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
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  // Método para abrir el modal de selección de usuarios para compartir
  compartir(topico: any) {
    this.mostrarSelectUsuarios = true;
    if (this.selectUsuarios) {
      this.selectUsuarios.open();
    }
  }

  // Método para abrir o cerrar el modal de selección de usuarios para compartir
  abrirCerrarModalCompartir() {
    this.mostrarSelectUsuarios = !this.mostrarSelectUsuarios;
  }

  // Método para grabar la acción de compartir con usuarios seleccionados
  grabarCompartir() {
    this.abrirCerrarModalCompartir();
    const user_id = localStorage.getItem('user_id');
    const datosShareTopics = {
      user_shared_id: user_id,
      topic_id: this.topic.id,
      user_destination_ids: this.usuariosSeleccionados,
    };

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    axios.post('http://localhost:3000/topics-shared', datosShareTopics, config)
      .then((result) => {
        if (result.data.success === true) {
          this.presentToast("Tópico compartido.");
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Método para mostrar un mensaje emergente (toast)
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }

  // Método para eliminar un comentario
  async deleteComment(commentId: string) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      const url = `http://localhost:3000/topic-details/comment/${commentId}`;
      const response = await axios.delete(url, config);

      if (response.data.success) {
        console.log(`Comentario con ID ${commentId} eliminado con éxito.`);
        this.presentToast('Comentario eliminado con éxito.');
        // Actualizar la lista de comentarios para reflejar la eliminación
        this.getTopicsComments(this.topic.id);
      } else {
        console.error('Error al eliminar el comentario:', response.data.error);
        this.presentToast('Error al eliminar el comentario.');
      }
    } catch (error) {
      console.error('Error al realizar la petición:', error);
      this.presentToast('Error al realizar la petición.');
    }
  }

  // Método para mostrar un cuadro de diálogo de confirmación antes de eliminar un comentario
  async confirmDeleteComment(commentId: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: '¿Desea eliminar el comentario?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteComment(commentId);
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
}
