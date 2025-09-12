import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  // Datos actuales del usuario
  usuario = {
    nombre: 'Benjamin Castro',
    email: 'benjaminc@gmail.com',
    telefono: '919191919'
  };

  //Copia editable de los datos del usuario, usada en el formulario 
  usuarioEdit = { ...this.usuario };

  constructor(private toastController: ToastController) {}

  //Al cargar la página, reinicia los datos editables con los datos actuales
  ngOnInit() {
    this.resetUsuarioEdit();
  }

  // Cada vez que se entra a la página esto reinicia los datos editables con los datos actuales

  ionViewWillEnter() {
    this.resetUsuarioEdit();
  }

  // Restaura los datos editables a los valores actuales del usuario
  resetUsuarioEdit() {
    this.usuarioEdit = { ...this.usuario };
  }

  // Guarda los cambios realizados en el formulario y muestra un mensaje de confirmación
  async guardarCambios() {
    this.usuario = { ...this.usuarioEdit };

    const toast = await this.toastController.create({
      message: 'Datos actualizados correctamente',
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}