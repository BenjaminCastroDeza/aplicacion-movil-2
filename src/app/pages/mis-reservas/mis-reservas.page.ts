import { Component } from '@angular/core';
import { ReservaService, Reserva } from '../../services/reserva.service';
import { BdlocalService } from '../../services/bdlocal.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.page.html',
  styleUrls: ['./mis-reservas.page.scss'],
  standalone: false
})
export class MisReservasPage {
  // Lista de reservas del usuario logueado
  reservas: Reserva[] = [];

  // Usuario actualmente autenticado
  usuario!: Usuario;

  constructor(private reservaService: ReservaService, private bdlocal: BdlocalService) { }

  // Se ejecuta cada vez que la vista va a mostrarse
  async ionViewWillEnter() {
    this.usuario = this.bdlocal.usuarioActual!;
    if (!this.usuario) {
      console.warn('No hay usuario logueado');
      this.reservas = [];
      return;
    }

    this.filtrarReservas();
  }

  // Filtra las reservas del usuario actual
  filtrarReservas() {
    this.reservas = this.reservaService.getReservasUsuario(this.usuario.id!);
    console.log('Reservas filtradas:', this.reservas);
  }

  // Permite subir un comprobante de pago mediante la cámara o galería
  async subirComprobante(index: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      // Guarda la imagen como comprobante y marca el pago como confirmado
      this.reservas[index].comprobante = image.dataUrl || '';
      this.reservas[index].pago = 'confirmado';

      // Actualiza la reserva en el servicio y el almacenamiento local
      await this.reservaService.actualizarReserva(this.reservas[index]);

    } catch (error) {
      console.log('No se seleccionó imagen');
    }
  }
}
