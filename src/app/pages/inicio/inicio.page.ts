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

  // Datos ingresados por el usuario en el formulario de login
  usuario = { nombre: '', contrasena: '' };

  // Lista de usuarios registrados
  listaUsuarios: Usuario[] = [];

  constructor(
    private toastController: ToastController,
    private router: Router,
    private bdlocal: BdlocalService
  ) { }

  // Carga inicial de usuarios almacenados
  async ngOnInit() {
    await this.bdlocal.cargarUsuarios();
    this.listaUsuarios = this.bdlocal.mostrarBD();
    console.log('Usuarios cargados:', this.listaUsuarios);
  }

  // Verifica las credenciales e inicia sesión
  async login() {
    console.log('Intento de login:', this.usuario);

    // Validación de campos vacíos
    if (!this.usuario.nombre || !this.usuario.contrasena) {
      this.presentToast('Completa todos los campos', 'middle');
      return;
    }

    // Cargar datos actualizados antes de validar
    await this.bdlocal.cargarUsuarios();
    this.listaUsuarios = this.bdlocal.mostrarBD();
    console.log('Usuarios disponibles para validar:', this.listaUsuarios);

    // Buscar coincidencia con usuario registrado
    const usuarioEncontrado = this.listaUsuarios.find(u =>
      u.nombre === this.usuario.nombre && u.contrasena === this.usuario.contrasena
    );

    if (usuarioEncontrado) {
      console.log('✅ Usuario logueado correctamente:', usuarioEncontrado);

      // Guarda la sesión activa en Storage
      await this.bdlocal.setUsuarioActual(usuarioEncontrado);

      // Navega a Home2 enviando el nombre del usuario
      this.router.navigate(['/home2'], { state: { nombre: usuarioEncontrado.nombre } });

      // Mensaje de bienvenida
      this.presentToast(`Bienvenido ${usuarioEncontrado.nombre}`, 'bottom');
    } else {
      console.warn('❌ Usuario no encontrado o credenciales incorrectas');
      this.presentToast('Usuario o contraseña incorrectos', 'middle');
    }
  }

  // Muestra un mensaje temporal (toast)
  async presentToast(msg: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position
    });
    await toast.present();
  }
}
