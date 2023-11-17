// Importaciones de Angular e Ionic
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import axios from 'axios';

// Decorador del componente con el selector, la plantilla HTML y el estilo CSS
@Component({
  selector: 'app-theme-details',
  templateUrl: './theme-details.page.html',
  styleUrls: ['./theme-details.page.scss'],
})

// Clase del componente que implementa OnInit para la inicialización
export class ThemeDetailsPage implements OnInit {
  private platform = inject(Platform); // Inyección del servicio Platform para detectar la plataforma
  themesProperties: any = []; // Arreglo para almacenar propiedades de temas
  private activatedRoute = inject(ActivatedRoute); // Inyección de ActivatedRoute para capturar parámetros de la URL
  isModalThemesProperties: boolean = false; // Estado para controlar la visualización del modal
  newThemeProperty: { propertyName: string; propertyValue: string } = { propertyName: '', propertyValue: '' }; // Propiedad para nuevo tema
  currentTheme: any; // Tema actual seleccionado
  titulo: string = ''; // Título para el modal
  idpropiedad: number = 0; // ID de la propiedad actual

  constructor() { }

  ngOnInit() {
    // Captura el ID del tema al cargar la página y obtiene sus propiedades
    const id_theme = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.getThemesProperties(id_theme);
  }

  getBackButtonText() {
    // Método para obtener el texto del botón de regreso según la plataforma
    const isIos = this.platform.is('ios');
    return isIos ? '' : '';
  }

  getThemesProperties(temaid: string) {
    // Método para obtener las propiedades de un tema específico
    console.log(temaid);
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/themes_properties/buscarPorTema/' + temaid, config)
      .then((result) => {
        if (result.data.success == true) {
          this.themesProperties = result.data.themes_properties;
          console.log(this.themesProperties);
        } else {
          console.log(result.data);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  confirmDeleteProperties(id: string, temaid: any) {
    // Método para confirmar y ejecutar la eliminación de una propiedad de tema
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete('http://localhost:3000/themes_properties/delete/' + id, config)
      .then((result) => {
        if (result.data.success === true) {
          console.log(temaid);
          this.getThemesProperties(temaid);
        } else {
          console.log("error");
        }
      });
  }

  abrirModalThemesProperties() {
    // Método para abrir el modal de propiedades de temas
    this.isModalThemesProperties = true;
    const id_theme = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.currentTheme = id_theme;
    this.titulo = 'Agregar';
  }

  cerrarModalThemesProperties() {
    // Método para cerrar el modal de propiedades de temas
    this.isModalThemesProperties = false;
    this.newThemeProperty = { propertyName: '', propertyValue: '' };
  }

  guardarThemesProperties(titulo: string) {
    // Método para guardar las propiedades de un tema, ya sea nuevo o editado
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    if (titulo == 'Agregar') {
      // Agregar una nueva propiedad de tema
      if (!this.newThemeProperty.propertyName || !this.newThemeProperty.propertyValue) {
        console.error('Por favor, completa todos los campos.');
        return;
      }
  
      const themeProperty = {
        theme_id: this.currentTheme,
        property_name: this.newThemeProperty.propertyName,
        property_value: this.newThemeProperty.propertyValue,
      }; 
  
      axios
        .post('http://localhost:3000/themes_properties/insertar', themeProperty, config)
        .then((result) => {
          if (result.data.success === true) {
            this.getThemesProperties(themeProperty.theme_id);
          } else {
            console.error("Error al agregar propiedad de tema", result.data.error);
          }
        })
        .catch((error) => {
          console.error('Error al realizar la solicitud', error);
        });
  
      this.cerrarModalThemesProperties();
    } else {
      // Editar una propiedad de tema existente
      const id_theme = this.activatedRoute.snapshot.paramMap.get('id') as string;
      const themeProperty = {
        id: this.idpropiedad,
        theme_id: id_theme,
        property_name: this.newThemeProperty.propertyName,
        property_value: this.newThemeProperty.propertyValue,
      };
      console.log(themeProperty);
      
      axios
        .post('http://localhost:3000/themes_properties/update', themeProperty, config)
        .then((result) => {
          if (result.data.success === true) {
            this.getThemesProperties(id_theme);
            this.newThemeProperty.propertyName = '';
            this.newThemeProperty.propertyValue = '';
            this.isModalThemesProperties = false;
          } else {
            console.error("Error al agregar propiedad de tema", result.data.error);
          }
        })
        .catch((error) => {
          console.error('Error al realizar la solicitud', error);
        });
    }
  }

  abrirCerrarModal(property: any) {
    // Método para abrir o cerrar el modal y establecer los valores actuales de la propiedad de tema
    this.isModalThemesProperties = !this.isModalThemesProperties;
    this.newThemeProperty.propertyName = property.property_name;
    this.newThemeProperty.propertyValue = property.property_value;
    this.idpropiedad = property.id;
    this.titulo = "Editar";
  }
}
