// src/app/services/bdlocal.service.ts
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
  
  usuarioActual?: Usuario | null// ✅ usuario logueado


  constructor(private storage: Storage, private toastController: ToastController) {
    this.init();
  }
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.cargarUsuarios();
    await this.cargarSesion(); // ✅ cargar sesión al iniciar
    console.log('BdlocalService listo');
  }
  guardarUsuario(nombre: string, correo: string, contrasena: string, telefono: string) {
    const nuevo = new Usuario(nombre, correo, contrasena, telefono);
    nuevo.id = new Date().getTime(); // ID único
    this.agenda.unshift(nuevo);
    this._storage?.set('agenda', this.agenda);
    console.log('Usuario agregado:', nuevo);
    this.presentToast("Usuario agregado");
  }

  async cargarUsuarios() {
    const data = await this._storage?.get('agenda');
    if (data) this.agenda = data;
    console.log('Usuarios cargados:', this.agenda);
  }

  async actualizarUsuario(usuario: Usuario) {
    const index = this.agenda.findIndex(u => u.id === usuario.id);
    if (index !== -1) {
      this.agenda[index] = { ...usuario };
      await this._storage?.set('agenda', this.agenda);
      console.log('Usuario actualizado en storage:', this.agenda[index]);
      this.presentToast('Usuario actualizado correctamente');
    } else {
      this.presentToast('No se encontró el usuario para actualizar');
    }
  }
  async setUsuarioActual(usuario: Usuario | null) {
  this.usuarioActual = usuario;
  await this._storage?.set('usuarioActual', usuario); // persistencia real
}

async cargarSesion() {
  const u = await this._storage?.get('usuarioActual');
  if (u) this.usuarioActual = u;
}

  mostrarBD(): Usuario[] {
    return this.agenda;
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}
