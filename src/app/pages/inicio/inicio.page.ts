import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Dbusuario } from '../../services/dbusuario';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {

  usuario: { nombre: string; contrasena: string } = { nombre: '', contrasena: '' };

  constructor(
    private toastController: ToastController,
    private router: Router,
    private dbUsuario: Dbusuario
  ) { }

  ngOnInit() { }

  async login() {
    if (!this.usuario.nombre || !this.usuario.contrasena) {
      this.presentToast('middle', 'Completa todos los campos', 1000);
      return;
    }

    // Espera que la DB esté lista
    await this.dbUsuario.dbReady();

    // Valida el usuario
    const existe = await this.dbUsuario.validarUsuario(this.usuario.nombre, this.usuario.contrasena);

    if (existe) {
      this.router.navigate(['/home2'], { state: { nombre: this.usuario.nombre } });
    } else {
      this.presentToast('middle', 'Usuario o contraseña incorrectos', 1000);
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
