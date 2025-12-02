import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../clases/usuario';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BdlocalService {

  agenda: Usuario[] = [];
  private _storage: Storage | null = null;

  usuarioActual: Usuario | null = null;

  private initialized = false; // <- evita ejecutar init() dos veces

  constructor(private storage: Storage, private toastController: ToastController) {
    this.init();
  }

  /** ============================================
   *  INIT (solo se ejecuta 1 vez)
   *  ============================================ */
  async init() {
    if (this.initialized) return; // ← evita loop
    this.initialized = true;

    this._storage = await this.storage.create();
    await this.cargarUsuarios();
    await this.cargarSesion();

    console.log('BdlocalService inicializado');
  }

  /** ============================================
   *  GENERAR ID
   *  ============================================ */
  async generarIdIncremental(claveContador: string): Promise<number> {
    const contador = (await this._storage?.get(claveContador)) || 0;
    const nuevoId = contador + 1;
    await this._storage?.set(claveContador, nuevoId);
    return nuevoId;
  }

  /** ============================================
   *  CRUD USUARIOS
   *  ============================================ */
  async guardarUsuario(nombre: string, correo: string, contrasena: string, telefono: string) {
    const nuevo = new Usuario(nombre, correo, contrasena, telefono);
    nuevo.id = await this.generarIdIncremental('contadorUsuarios');
    this.agenda.unshift(nuevo);
    await this._storage?.set('agenda', this.agenda);
  }

  async cargarUsuarios() {
    const data = await this._storage?.get('agenda');
    if (data) this.agenda = data;
  }

  async actualizarUsuario(usuario: Usuario) {
    const index = this.agenda.findIndex(u => u.id === usuario.id);
    if (index !== -1) {
      this.agenda[index] = { ...usuario };
      await this._storage?.set('agenda', this.agenda);
      this.presentToast('Usuario actualizado correctamente');
    }
  }

  mostrarBD(): Usuario[] {
    return this.agenda;
  }

  /** ============================================
   *  SESIÓN
   *  ============================================ */

  async setUsuarioActual(usuario: Usuario | null) {
    this.usuarioActual = usuario;

    if (usuario) {
      await this._storage?.set('usuarioActual', usuario);
      console.log('👤 Sesión guardada:', usuario);
    } else {
      await this._storage?.remove('usuarioActual');
      console.log('🚪 Sesión cerrada');
    }
  }

  async cargarSesion() {
    const u = await this._storage?.get('usuarioActual');
    if (u) {
      this.usuarioActual = u;
      console.log('✅ Sesión cargada:', this.usuarioActual);
    } else {
      this.usuarioActual = null; // ← necesario
      console.log('⚠️ No hay sesión activa');
    }
  }

  async logout() {
    await this.setUsuarioActual(null);
    this.presentToast('Has cerrado sesión');
  }

  /** ============================================ */
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}
