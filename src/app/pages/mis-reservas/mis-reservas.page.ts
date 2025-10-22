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
  reservas: Reserva[] = [];
  usuario!: Usuario;

  constructor(private reservaService: ReservaService, private bdlocal: BdlocalService) { }

async ionViewWillEnter() {
  this.usuario = this.bdlocal.usuarioActual!;
  if (!this.usuario) {
    console.warn('No hay usuario logueado');
    this.reservas = [];
    return;
  }

  this.filtrarReservas();
}

filtrarReservas() {
  this.reservas = this.reservaService.getReservasUsuario(this.usuario.id!);
  console.log('Reservas filtradas:', this.reservas);
}

  async subirComprobante(index: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      // Aseguramos que dataUrl no sea undefined
      this.reservas[index].comprobante = image.dataUrl || '';
      this.reservas[index].pago = 'confirmado';

      // Actualizar reserva en el servicio y storage
      await this.reservaService.actualizarReserva(this.reservas[index]);

    } catch (error) {
      console.log('No se seleccionó imagen');
    }
  }
}