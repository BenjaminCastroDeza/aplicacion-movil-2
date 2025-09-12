import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicacion
})
export class ReservaService {

  // Array que almacena las reservas realizadas
  private reservas: any[] = [];

  // Agrega una nueva reserva al listado
  agregarReserva(reserva: any) {
    this.reservas.push(reserva);
  }
  //Retorna todas las reservas almacenadas
  obtenerReservas() {
    return this.reservas;
  }

  //Elimina todas las reservas almacenadas
  limpiarReservas() {
    this.reservas = [];
  }
}
