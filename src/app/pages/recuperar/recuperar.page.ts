import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BdlocalService } from '../../services/bdlocal.service';
import { Usuario } from '../../clases/usuario';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: false 
})
export class RecuperarPage {

  correo = '';
  usuarioEncontrado: Usuario | null = null;

  constructor(
    private bdlocal: BdlocalService,
    private toast: ToastController,
    private emailComposer: EmailComposer
  ) {}

  async enviarCorreo() {
    await this.bdlocal.cargarUsuarios();
    const lista = this.bdlocal.mostrarBD();
    this.usuarioEncontrado = lista.find(u => u.correo === this.correo) || null;

    if (!this.usuarioEncontrado) {
      this.mostrarToast('No existe un usuario con ese correo');
      return;
    }

    // Armar correo
    const correo = {
      to: this.usuarioEncontrado.correo,
      subject: 'Recuperación de contraseña',
      body: `Hola, tu contraseña es: <b>${this.usuarioEncontrado.contrasena}</b>`,
      isHtml: true
    };

    // Abrir cliente de correo
    this.emailComposer.open(correo);
    this.mostrarToast('Se ha abierto tu app de correo para enviar la contraseña');
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
