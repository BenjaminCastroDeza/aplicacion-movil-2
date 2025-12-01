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

  // Usuario actual logueado
  usuario!: Usuario;

  // Copia del usuario para editar en el formulario
  usuarioEdit!: Usuario;

  constructor(
    private toastController: ToastController,
    private bdlocal: BdlocalService
  ) { }

  // Se ejecuta al inicializar la página
  async ngOnInit() {
    await this.cargarUsuarioActual();
  }

  // Se ejecuta cada vez que la vista entra en pantalla
  ionViewWillEnter() {
    this.resetUsuarioEdit();
  }

  // Carga el usuario logueado desde el almacenamiento local
  async cargarUsuarioActual() {
    await this.bdlocal.cargarUsuarios();
    const lista = this.bdlocal.mostrarBD();

    if (lista.length > 0) {
      // Toma el primer usuario como ejemplo de usuario logueado
      this.usuario = { ...lista[0] };
      this.resetUsuarioEdit();
      console.log('Usuario cargado:', this.usuario);
    } else {
      // Si no hay usuarios guardados, inicializa uno vacío
      this.usuario = new Usuario('', '', '', '');
      this.resetUsuarioEdit();
      console.warn('No hay usuarios en la base de datos');
    }
  }

  // Restaura los valores editables al original
  resetUsuarioEdit() {
    if (this.usuario) {
      this.usuarioEdit = { ...this.usuario };
    }
  }

  // Guarda los cambios del perfil si hubo modificaciones
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

    // Actualiza los datos en memoria
    this.usuario = { ...this.usuarioEdit };

    // Guarda los cambios en el storage local
    await this.bdlocal.actualizarUsuario(this.usuario);

    console.log('Usuario actualizado:', this.usuario);
  }
}
