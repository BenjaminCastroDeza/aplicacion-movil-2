import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Reserva {
  id?: number;
  userId: number;       // ID del usuario dueño de la reserva
  nombre: string;
  fecha: string;
  hora: string;
  personas: number;
  pago: string;
  comprobante?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private _storage: Storage | null = null;
  private reservas: Reserva[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.cargarReservas();
  }

  async cargarReservas() {
    const data = await this._storage?.get('reservas');
    if (data) this.reservas = data;
  }

  async agregarReserva(reserva: Reserva) {
    reserva.id = new Date().getTime();
    this.reservas.push(reserva);
    await this._storage?.set('reservas', this.reservas);
  }
  
  async actualizarReserva(reserva: Reserva) {
    const index = this.reservas.findIndex(r => r.id === reserva.id);
    if (index !== -1) {
      this.reservas[index] = { ...reserva };
      await this._storage?.set('reservas', this.reservas);
    } else {
      console.warn('Reserva no encontrada para actualizar:', reserva);
    }
  }

  obtenerReservas(): Reserva[] {
    return this.reservas;
  }

  getReservasUsuario(userId: number): Reserva[] {
    return this.reservas.filter(r => r.userId === userId);
  }

  async limpiarReservas() {
    this.reservas = [];
    await this._storage?.set('reservas', this.reservas);
  }
}
