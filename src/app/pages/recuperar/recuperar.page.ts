import { Component } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { BdlocalService } from '../../services/bdlocal.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: false
})
export class RecuperarPage {

  paso = 1; // Paso 1: ingresar correo / Paso 2: nueva contraseña
  correo = '';
  nuevaContrasena = '';
  usuarioEncontrado: Usuario | null = null;

  constructor(
    private bdlocal: BdlocalService,
    private toast: ToastController,
    private nav: NavController
  ) {}

  async buscarUsuario() {
    await this.bdlocal.cargarUsuarios();
    const lista = this.bdlocal.mostrarBD();

    // Buscar por correo
    this.usuarioEncontrado = lista.find(u => u.correo === this.correo) || null;

    if (!this.usuarioEncontrado) {
      this.mostrarToast('No existe un usuario con ese correo');
      return;
    }

    this.paso = 2;
  }

  async cambiarContrasena() {
    if (this.nuevaContrasena.trim().length < 4) {
      this.mostrarToast('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    // Actualizar contraseña
    this.usuarioEncontrado!.contrasena = this.nuevaContrasena;
    await this.bdlocal.actualizarUsuario(this.usuarioEncontrado!);

    this.mostrarToast('Contraseña actualizada correctamente');

    this.nav.back();
  }

  volver() {
    this.paso = 1;
  }

  async mostrarToast(msg: string) {
    const t = await this.toast.create({
      message: msg,
      duration: 1500,
      position: 'middle'
    });
    await t.present();
  }
}
