// src/app/pages/registro/registro.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BdlocalService } from '../../services/bdlocal.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  usuario = { nombre: '', correo: '', contrasena: '', telefono: '' };

  constructor(
    private bdlocal: BdlocalService,
    private toastController: ToastController,
    private router: Router
  ) {}

  agregarUsuario() {
    console.log('Formulario:', this.usuario);

    // Validación
    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.contrasena || !this.usuario.telefono) {
      console.warn('Faltan campos por completar');
      this.presentToast('Completa todos los campos');
      return;
    }

    // Guardar usuario
    this.bdlocal.guardarUsuario(
      this.usuario.nombre,
      this.usuario.correo,
      this.usuario.contrasena,
      this.usuario.telefono
    );

    // Limpiar formulario
    this.usuario = { nombre: '', correo: '', contrasena: '', telefono: '' };

    console.log('Navegando a Home');
    this.router.navigate(['/inicio']);
  }

  irInicio() {
    this.router.navigate(['/inicio']);
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }
}
