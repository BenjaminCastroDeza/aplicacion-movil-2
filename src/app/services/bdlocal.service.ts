import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../clases/usuario';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BdlocalService {

  // Lista de usuarios guardados
  agenda: Usuario[] = [];
  private _storage: Storage | null = null;

  // Usuario con sesión activa
  usuarioActual?: Usuario | null

  constructor(private storage: Storage, private toastController: ToastController) {
    this.init();
  }

  // Inicializa el storage y carga datos/sesión
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.cargarUsuarios();
    await this.cargarSesion(); // carga sesión al iniciar
    console.log('BdlocalService listo');
  }
    async generarIdIncremental(claveContador: string): Promise<number> {
    const contador = (await this._storage?.get(claveContador)) || 0;
    const nuevoId = contador + 1;
    await this._storage?.set(claveContador, nuevoId);
    return nuevoId;
  }

  // Crea y guarda un nuevo usuario
  async guardarUsuario(nombre: string, correo: string, contrasena: string, telefono: string) {
    const nuevo = new Usuario(nombre, correo, contrasena, telefono);
    nuevo.id = await this.generarIdIncremental('contadorUsuarios'); // 👈 se usa acá
    this.agenda.unshift(nuevo);
    await this._storage?.set('agenda', this.agenda);
  }

  // Carga la lista de usuarios desde Storage
  async cargarUsuarios() {
    const data = await this._storage?.get('agenda');
    if (data) this.agenda = data;
    console.log('Usuarios cargados:', this.agenda);
  }

  // Actualiza un usuario existente por ID
<<<<<<< HEAD
async actualizarUsuario(usuario: Usuario) {
=======
  async actualizarUsuario(usuario: Usuario) {
>>>>>>> 5eb95e6f3031d9d20c5e311279b9e19a530c3b72
    const index = this.agenda.findIndex(u => u.id === usuario.id);
    if (index !== -1) {
      this.agenda[index] = { ...usuario };
      await this._storage?.set('agenda', this.agenda);
<<<<<<< HEAD
      this.presentToast('Usuario actualizado correctamente');
    }
}
=======
      console.log('Usuario actualizado en storage:', this.agenda[index]);
      this.presentToast('Usuario actualizado correctamente');
    } else {
      this.presentToast('No se encontró el usuario para actualizar');
    }
  }
>>>>>>> 5eb95e6f3031d9d20c5e311279b9e19a530c3b72

  // Define o limpia el usuario con sesión activa en Storage
  async setUsuarioActual(usuario: Usuario | null) {
    this.usuarioActual = usuario;
    if (usuario) {
      await this._storage?.set('usuarioActual', usuario);
      console.log('👤 Usuario guardado en Storage:', usuario);
    } else {
      await this._storage?.remove('usuarioActual');
      console.log('🚪 Sesión cerrada, Storage limpio');
    }
  }

  // Carga el usuario con sesión activa desde Storage
  async cargarSesion() {
    if (!this._storage) await this.init(); // asegura storage listo
    const u = await this._storage?.get('usuarioActual');
    if (u) {
      this.usuarioActual = u;
      console.log('✅ Sesión cargada:', this.usuarioActual);
    } else {
      console.log('⚠️ No hay sesión activa guardada');
    }
  }

  // Cierra sesión y limpia Storage
  async logout() {
    this.usuarioActual = null;
    await this._storage?.remove('usuarioActual');
    console.log('🚪 Sesión cerrada, Storage limpio');
    this.presentToast('Has cerrado sesión');
  }

  // Devuelve la base de usuarios en memoria
  mostrarBD(): Usuario[] {
    return this.agenda;
  }

  // Muestra un toast breve
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}
