import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BdlocalService } from '../../services/bdlocal.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {

  usuario = { nombre: '', contrasena: '' };
  listaUsuarios: Usuario[] = [];

  constructor(
    private toastController: ToastController,
    private router: Router,
    private bdlocal: BdlocalService
  ) { }

  async ngOnInit() {
    await this.bdlocal.init();  // 👈 IMPORTANTE: asegura Storage cargado
    this.listaUsuarios = this.bdlocal.mostrarBD();

    console.log('Usuarios cargados:', this.listaUsuarios);

    // 👉 Si ya hay sesión, enviar directo al home
    if (this.bdlocal.usuarioActual) {
      console.log('🔐 Ya había sesión: redirigiendo…');
      this.router.navigate(['/home2']);
    }
  }

  async login() {
    console.log('Intento de login:', this.usuario);

    if (!this.usuario.nombre || !this.usuario.contrasena) {
      this.presentToast('Completa todos los campos', 'middle');
      return;
    }

    await this.bdlocal.cargarUsuarios();
    this.listaUsuarios = this.bdlocal.mostrarBD();

    const usuarioEncontrado = this.listaUsuarios.find(u =>
      u.nombre === this.usuario.nombre &&
      u.contrasena === this.usuario.contrasena
    );

    if (usuarioEncontrado) {
      console.log('✅ Usuario logueado correctamente:', usuarioEncontrado);

      // Guardar sesión
      await this.bdlocal.setUsuarioActual(usuarioEncontrado);

      // 👉 Navegar sin permitir volver atrás
      this.router.navigateByUrl('/home2', { replaceUrl: true });

      this.presentToast(`Bienvenido ${usuarioEncontrado.nombre}`, 'bottom');
    } else {
      this.presentToast('Usuario o contraseña incorrectos', 'middle');
    }
  }

  async presentToast(msg: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position
    });
    await toast.present();
  }
}
