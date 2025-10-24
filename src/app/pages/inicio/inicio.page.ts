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
    console.log('✅ Usuario logueado correctamente:', usuarioEncontrado);

    // 🔹 Guardar la sesión activa en el Storage
    await this.bdlocal.setUsuarioActual(usuarioEncontrado);

    // 🔹 Navegar a Home2 con el nombre en el state
    this.router.navigate(['/home2'], { state: { nombre: usuarioEncontrado.nombre } });

    // (Opcional) Toast de bienvenida
    this.presentToast(`Bienvenido ${usuarioEncontrado.nombre}`, 'bottom');
  } else {
    console.warn('❌ Usuario no encontrado o credenciales incorrectas');
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
