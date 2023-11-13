import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent, ToastController } from '@ionic/angular';
import axios from 'axios';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  temas: any = [];
  temas_propiedades: any = [];
  isModalThemesProperties: boolean = false;
  newThemeProperty: { propertyName: string; propertyValue: string } = { propertyName: '', propertyValue: '' };
  currentTheme: any;

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {}

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  ionViewWillEnter(): void {
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.getThemes();
    this.getThemesProperties();
  }

  cerrarSesion() {
    let token = localStorage.getItem('token');
    let data = '';
    let config = {
      headers: {
        authorization: token,
      },
    };
    axios
      .post('http://localhost:3000/user/logout', data, config)
      .then(async (result) => {
        if (result.data.success == true) {
          localStorage.removeItem('token');
          this.presentToast('Sesión Finalizada');
          this.router.navigate(['/login']);
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch(async (error) => {
        this.presentToast(error.message);
      });
  }

  ngOnInit(): void {}

  getThemes() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/themes/list', config)
      .then((result) => {
        if (result.data.success == true) {
          this.temas = result.data.temas;
        } else {
          console.error(result.data.error);
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        console.error(error.message);
        this.presentToast(error.message);
      });
  }

  getThemesProperties() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/themes_properties/list', config)
      .then((result) => {
        if (result.data.success == true) {
          this.temas_propiedades = result.data.themes_properties;
        } else {
          console.error(result.data.error);
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        console.error(error.message);
        this.presentToast(error.message);
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  abrirModalThemesProperties(tema: any) {
    this.isModalThemesProperties = true;
    this.currentTheme = tema;
  }

  cerrarModalThemesProperties() {
    this.isModalThemesProperties = false;
    this.newThemeProperty = { propertyName: '', propertyValue: '' };
  }

  guardarThemesProperties() {
    if (!this.newThemeProperty.propertyName || !this.newThemeProperty.propertyValue) {
      console.error('Por favor, completa todos los campos.');
      return;
    }

    const themeProperty = {
      theme_id: this.currentTheme.id,
      property_name: this.newThemeProperty.propertyName,
      property_value: this.newThemeProperty.propertyValue,
    };

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    axios
      .post('http://localhost:3000/themes_properties/insertar', themeProperty, config)
      .then((result) => {
        if (result.data.success === true) {
          this.presentToast('Propiedad de tema agregada.');
          this.getThemesProperties()
        } else {
          console.error("Error al agregar propiedad de tema", result.data.error);
        }
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud', error);
      });

    this.cerrarModalThemesProperties();
  }
}
