import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ReservaService } from '../../services/reserva.service'; // Importa el servicio de reservas

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
  standalone: false
})
export class ReservaPage implements OnInit {

  // Objeto que almacena los datos de la reserva
  reserva = {
    nombre: '',
    fecha: '',
    hora: '', 
    personas: 1,  
    pago: 'pendiente',
    comprobante: ''
  }

  // Array que contiene las horas disponibles para reservas
  horasDisponibles: string[] = [];

  constructor(
    private toastController: ToastController,
    private reservaService: ReservaService
  ) {}

  ngOnInit() {
    this.generarHoras();
  }

  // Genera un listado de horas disponibles desde las 12:00 hasta las 20:00
  generarHoras() {
    for (let i = 12; i < 21; i++) {
      const horaStr = i.toString().padStart(2, '0') + ':00';
      this.horasDisponibles.push(horaStr);
    }
  }

  // Guarda la reserva ingresada en el formulario
  async hacerReserva() {
    // Validación de campos obligatorios
    if (!this.reserva.nombre || !this.reserva.fecha || !this.reserva.hora || !this.reserva.personas) {
      this.presentToast('Por favor, completa todos los campos');
      return;
    }

    // Guarda la reserva mediante el servicio
    this.reservaService.agregarReserva({ ...this.reserva });

    // Muestra mensaje de confirmación
    this.presentToast('Reserva realizada con éxito');

    // Reinicia los datos del formulario
    this.reserva = { nombre: '', fecha: '', hora: '', personas: 1, pago: 'pendiente', comprobante: '' };
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
