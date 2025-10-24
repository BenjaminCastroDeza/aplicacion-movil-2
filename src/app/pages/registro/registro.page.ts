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
  // Datos del formulario de registro
  usuario = { nombre: '', correo: '', contrasena: '', telefono: '' };

  constructor(
    private bdlocal: BdlocalService,
    private toastController: ToastController,
    private router: Router
  ) { }

  // Agrega un nuevo usuario
  async agregarUsuario() {
  console.log('Formulario:', this.usuario);

  // Validación de campos vacíos
  if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.contrasena || !this.usuario.telefono) {
    this.presentToast('Completa todos los campos');
    return;
  }

  // Validar si ya existe un usuario con el mismo nombre o correo
  await this.bdlocal.cargarUsuarios();
  const existe = this.bdlocal.mostrarBD().some(u =>
    u.nombre.trim().toLowerCase() === this.usuario.nombre.trim().toLowerCase() ||
    u.correo.trim().toLowerCase() === this.usuario.correo.trim().toLowerCase() ||
    u.telefono.trim() === this.usuario.telefono.trim()
  );

  if (existe) {
    this.presentToast('El usuario o correo ya está registrado');
    return;
  }

  // Guardar usuario nuevo
  this.bdlocal.guardarUsuario(
    this.usuario.nombre,
    this.usuario.correo,
    this.usuario.contrasena,
    this.usuario.telefono
  );

  // Limpiar formulario y redirigir
  this.usuario = { nombre: '', correo: '', contrasena: '', telefono: '' };
  this.router.navigate(['/inicio']);
}

  // Redirige manualmente a la página de inicio
  irInicio() {
    this.router.navigate(['/inicio']);
  }

  // Muestra mensaje corto en pantalla
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'top',
    });
    toast.present();
  }
}
