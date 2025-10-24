import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BdlocalService } from '../../services/bdlocal.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  usuario!: Usuario;       // Datos actuales del usuario
  usuarioEdit!: Usuario;   // Copia editable para el formulario

  constructor(
    private toastController: ToastController,
    private bdlocal: BdlocalService
  ) { }

  async ngOnInit() {
    await this.cargarUsuarioActual();
  }

  ionViewWillEnter() {
    this.resetUsuarioEdit();
  }

  // Carga el usuario actualmente logueado según su ID
  async cargarUsuarioActual() {
    await this.bdlocal.cargarUsuarios();
    const lista = this.bdlocal.mostrarBD();

    if (lista.length > 0) {
      // Aquí podrías usar un servicio de sesión para traer al usuario logueado
      this.usuario = { ...lista[0] };
      this.resetUsuarioEdit();
      console.log('Usuario cargado:', this.usuario);
    } else {
      this.usuario = new Usuario('', '', '', '');
      this.resetUsuarioEdit();
      console.warn('No hay usuarios en la base de datos');
    }
  }

  resetUsuarioEdit() {
    if (this.usuario) {
      this.usuarioEdit = { ...this.usuario };
    }
  }

  async guardarCambios() {
    const sinCambios =
      this.usuario.nombre === this.usuarioEdit.nombre &&
      this.usuario.correo === this.usuarioEdit.correo &&
      this.usuario.contrasena === this.usuarioEdit.contrasena &&
      this.usuario.telefono === this.usuarioEdit.telefono;

    if (sinCambios) {
      const toast = await this.toastController.create({
        message: 'No se realizaron cambios',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
      return;
    }

    // Actualizamos datos locales
    this.usuario = { ...this.usuarioEdit };

    // Guardamos cambios en storage usando ID
    await this.bdlocal.actualizarUsuario(this.usuario);

    console.log('Usuario actualizado:', this.usuario);
  }
}
