import { Component } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.page.html',
  styleUrls: ['./mis-reservas.page.scss'],
  standalone: false
})
export class MisReservasPage {
  // Arreglo con todas las reservas del usuario
  reservas: any[] = [];

  constructor(private reservaService: ReservaService) { }

  //Cada vez que se entra a la pagina, actualiza la lista de reservas.

  ionViewWillEnter() {
    this.reservas = this.reservaService.obtenerReservas();
  }

//Permite al usuario seleccionar una imagen de la galeria como comprobante de pago.
  async subirComprobante(index: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      // Actualiza la reserva con la imagen y cambia el estado de pago
      this.reservas[index].comprobante = image.dataUrl;
      this.reservas[index].pago = 'confirmado';
    } catch (error) {
      // El usuario canceló o hubo un error
      console.log('No se seleccionó imagen');
    }
  }
}