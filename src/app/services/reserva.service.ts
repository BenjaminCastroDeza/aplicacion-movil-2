import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

// 🟩 Interfaz que define la estructura de una reserva
export interface Reserva {
  id?: number;           
  userId: number;        // ID del usuario que realizó la reserva
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

  private _storage: Storage | null = null;  // Instancia del almacenamiento local
  private reservas: Reserva[] = [];         // Lista de reservas en memoria

  constructor(private storage: Storage) {
    this.init(); // Inicializa el almacenamiento al crear el servicio
  }

  // 🟦 Inicializa el almacenamiento y carga las reservas guardadas
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.cargarReservas();
  }

  // 🟦 Carga las reservas existentes desde el almacenamiento local
  async cargarReservas() {
    const data = await this._storage?.get('reservas');
    if (data) this.reservas = data;
  }

  // 🟨 Agrega una nueva reserva al almacenamiento
  async agregarReserva(reserva: Reserva) {
    reserva.id = new Date().getTime(); // Genera un ID único basado en la fecha actual
    this.reservas.push(reserva);
    await this._storage?.set('reservas', this.reservas); // Guarda en Storage
  }

  // 🟨 Actualiza una reserva existente
  async actualizarReserva(reserva: Reserva) {
    const index = this.reservas.findIndex(r => r.id === reserva.id);
    if (index !== -1) {
      this.reservas[index] = { ...reserva };
      await this._storage?.set('reservas', this.reservas);
    } else {
      console.warn('Reserva no encontrada para actualizar:', reserva);
    }
  }

  // 🟩 Obtiene todas las reservas almacenadas
  obtenerReservas(): Reserva[] {
    return this.reservas;
  }

  // 🟦 Obtiene las reservas asociadas a un usuario específico
  getReservasUsuario(userId: number): Reserva[] {
    return this.reservas.filter(r => r.userId === userId);
  }

  // 🟥 Elimina todas las reservas del almacenamiento
  async limpiarReservas() {
    this.reservas = [];
    await this._storage?.set('reservas', this.reservas);
  }
}
