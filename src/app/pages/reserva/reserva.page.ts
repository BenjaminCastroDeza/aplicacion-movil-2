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

  usuarioActual!: Usuario;

  reserva: Partial<Reserva> = {
    nombre: '',
    fecha: '',
    hora: '',
    personas: 1,
    pago: 'pendiente',
    comprobante: ''
  };

  horasDisponibles: string[] = [];

  constructor(
    private toastController: ToastController,
    private reservaService: ReservaService,
    private bdlocal: BdlocalService
  ) { }

  async ngOnInit() {
    this.generarHoras();
    this.usuarioActual = this.bdlocal.usuarioActual!;
    if (!this.usuarioActual) {
      console.warn('No hay usuario logueado');
    } else {
      console.log('Usuario actual:', this.usuarioActual);
    }
  }
  generarHoras() {
    for (let i = 12; i <= 20; i++) {
      const horaStr = i.toString().padStart(2, '0') + ':00';
      this.horasDisponibles.push(horaStr);
    }
  }

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
      id: new Date().getTime(),
      userId: this.usuarioActual.id!, // ✅ asignar a usuario correcto
      nombre: this.reserva.nombre!,
      fecha: this.reserva.fecha!,
      hora: this.reserva.hora!,
      personas: this.reserva.personas!,
      pago: 'pendiente',
      comprobante: ''
    };

    await this.reservaService.agregarReserva(nuevaReserva);

    this.presentToast('Reserva realizada con éxito');

    this.reserva = { nombre: '', fecha: '', hora: '', personas: 1, pago: 'pendiente', comprobante: '' };
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
