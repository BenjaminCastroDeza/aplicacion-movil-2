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
  ) {}

  async ngOnInit() {
    // Cargar usuarios desde storage de manera segura
    await this.bdlocal.cargarUsuarios();
    this.listaUsuarios = this.bdlocal.mostrarBD();

    console.log('Usuarios cargados:', this.listaUsuarios);
  }

  async login() {
    console.log('Intento de login:', this.usuario);

    if (!this.usuario.nombre || !this.usuario.contrasena) {
      this.presentToast('Completa todos los campos', 'middle');
      return;
    }

    // Asegurarse de cargar los datos más recientes
    await this.bdlocal.cargarUsuarios();
    this.listaUsuarios = this.bdlocal.mostrarBD();
    console.log('Usuarios disponibles para validar:', this.listaUsuarios);

    // Buscar usuario
  const usuarioEncontrado = this.listaUsuarios.find(u =>
    u.nombre === this.usuario.nombre && u.contrasena === this.usuario.contrasena
  );

  if (usuarioEncontrado) {
    this.bdlocal.usuarioActual = usuarioEncontrado; // ✅ guardar sesión
    console.log('Login exitoso:', usuarioEncontrado);
    this.presentToast('Bienvenido ' + usuarioEncontrado.nombre, 'top');
    this.router.navigate(['/home2']);
  }

    // Limpiar campos
    this.usuario = { nombre: '', contrasena: '' };
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
