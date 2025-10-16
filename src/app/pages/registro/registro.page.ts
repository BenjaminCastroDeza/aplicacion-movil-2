import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Dbusuario } from '../../services/dbusuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {
  usuario = { nombre: '', correo: '', contrasena: '', telefono: '' };

  constructor(
    private toastController: ToastController,
    private router: Router,
    private dbusuario: Dbusuario
  ) {}

  async crearCuenta() {
    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.contrasena || !this.usuario.telefono) {
      this.presentToast('middle', 'Completa todos los campos', 1000);
      return;
    }

    // Espera a que la base de datos esté lista
    const dbReady = await this.dbusuario.dbState().toPromise();
    if (!dbReady) {
      this.presentToast('middle', 'Base de datos no lista, intenta de nuevo', 1000);
      return;
    }

    try {
      // Guardar usuario en SQLite
      await this.dbusuario.dbReady
      await this.dbusuario.agregarUsuario(
        this.usuario.nombre,
        this.usuario.correo,
        this.usuario.contrasena,
        this.usuario.telefono
      );

      // Mostrar toast de confirmación
      await this.presentToast('middle', 'Cuenta creada correctamente', 1000);

      // Limpiar formulario
      this.usuario = { nombre: '', correo: '', contrasena: '', telefono: '' };

      // Navegar a la página de inicio
      this.router.navigate(['/inicio']);
    } catch (err) {
      this.presentToast('middle', 'Error al guardar usuario', 1000);
      console.error(err);
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, duration?: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration ?? 1000,
      position
    });
    await toast.present();
  }
}
