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

  // Cada vez que se entra a la página, actualizamos los datos editables
  ionViewWillEnter() {
    this.resetUsuarioEdit();
  }

  // Carga el primer usuario registrado (o el que haya iniciado sesión)
  async cargarUsuarioActual() {
    await this.bdlocal.cargarUsuarios();           // Espera a que los datos se carguen
    const lista = await this.bdlocal.mostrarBD(); // Array de usuarios

    if (lista.length > 0) {
      this.usuario = { ...lista[0] };   // Aquí puedes ajustar según el usuario logueado
      this.resetUsuarioEdit();
      console.log('Usuario cargado:', this.usuario);
    } else {
      console.warn('No hay usuarios en la base de datos');
      this.usuario = new Usuario('', '', '', '');
      this.resetUsuarioEdit();
    }
  }

  // Copia los datos actuales a la versión editable
  resetUsuarioEdit() {
    if (this.usuario) {
      this.usuarioEdit = { ...this.usuario };
    }
  }

  // Guarda los cambios realizados en el formulario
async guardarCambios() {
  // Comprobamos si hubo cambios reales
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

  // Actualizamos los datos locales
  this.usuario = { ...this.usuarioEdit };

  // Guardamos en el storage (actualiza si existe)
  await this.bdlocal.actualizarUsuario(this.usuario);

  console.log('Usuario actualizado:', this.usuario);
}

}
