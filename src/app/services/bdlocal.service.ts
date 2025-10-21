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

  constructor(private storage: Storage, private toastController: ToastController) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.cargarUsuarios();
    console.log('BdlocalService listo');
  }

  guardarUsuario(nombre: string, correo: string, contrasena: string, telefono: string) {
    const existe = this.agenda.find(c => c.telefono === telefono);
    if (!existe) {
      const nuevo = new Usuario(nombre, correo, contrasena, telefono);
      this.agenda.unshift(nuevo);
      this._storage?.set('agenda', this.agenda);
      console.log('Usuario agregado:', nuevo);
      this.presentToast("Usuario agregado");
    } else {
      console.warn('Usuario ya existe:', telefono);
      this.presentToast("Usuario ya existe");
    }
  }

  async cargarUsuarios() {
    const data = await this._storage?.get('agenda');
    if (data) this.agenda = data;
    console.log('Usuarios cargados:', this.agenda);
  }

  async quitarUsuarios(telefono: string) {
    const existe = this.agenda.find(c => c.telefono === telefono);
    if (existe) {
      this.agenda = this.agenda.filter(c => c.telefono !== telefono);
      await this._storage?.set('agenda', this.agenda);
      console.log('Usuario eliminado:', telefono);
      this.presentToast("Usuario eliminado");
    } else {
      console.warn('Ese usuario no existe:', telefono);
      this.presentToast("Ese usuario no existe");
    }
  }

  async borrarBD() {
    await this._storage?.clear();
    this.agenda = [];
    console.log('Base de datos eliminada');
    this.presentToast("Base de datos eliminada");
  }

  // ✅ Método sincrónico para obtener el array directamente
  mostrarBD(): Usuario[] {
    return this.agenda;
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
