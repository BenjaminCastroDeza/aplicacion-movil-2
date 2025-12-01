import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ReservaService, Reserva } from '../../services/reserva.service';
import { BdlocalService } from '../../services/bdlocal.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
  standalone: false
})
export class ReservaPage implements OnInit {

  // Usuario logueado
  usuarioActual!: Usuario;

  // Modelo del formulario de reserva
  reserva: Partial<Reserva> = {
    nombre: '',
    fecha: '',
    hora: '',
    personas: 1,
    pago: 'pendiente',
    comprobante: ''
  };

  // Opciones de horas a mostrar
  horasDisponibles: string[] = [];

  constructor(
    private toastController: ToastController,
    private reservaService: ReservaService,
    private bdlocal: BdlocalService
  ) { }

  // Inicializa horas y obtiene usuario actual
async ngOnInit() {
  this.generarHoras();
  await this.bdlocal.cargarSesion();          // 👈 asegura sesión cargada
  this.usuarioActual = this.bdlocal.usuarioActual!;
  if (!this.usuarioActual) {
    console.warn('No hay usuario logueado');
  } else {
    console.log('Usuario actual:', this.usuarioActual);
  }
}

  // Genera horas en formato HH:00 entre 12 y 20
  generarHoras() {
    for (let i = 12; i <= 20; i++) {
      const horaStr = i.toString().padStart(2, '0') + ':00';
      this.horasDisponibles.push(horaStr);
    }
  }

  // Valida y crea una nueva reserva
  async hacerReserva() {
    if (!this.reserva.nombre || !this.reserva.fecha || !this.reserva.hora || !this.reserva.personas) {
      this.presentToast('Por favor, completa todos los campos');
      return;
    }

    if (!this.usuarioActual) {
      this.presentToast('No hay usuario logueado');
      return;
    }

    const nuevaReserva: Reserva = {
      userId: this.usuarioActual.id!, // Asigna la reserva al usuario
      nombre: this.reserva.nombre!,
      fecha: this.reserva.fecha!,
      hora: this.reserva.hora!,
      personas: this.reserva.personas!,
      pago: 'pendiente',
      comprobante: ''
    };

    await this.reservaService.agregarReserva(nuevaReserva);

    this.presentToast('Reserva realizada con éxito');

    // Limpia el formulario
    this.reserva = { nombre: '', fecha: '', hora: '', personas: 1, pago: 'pendiente', comprobante: '' };
  }

  // Muestra un toast breve
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
