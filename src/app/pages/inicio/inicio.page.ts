import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {

  // Guarda el nombre y la contraseña que ingresa el usuario
  usuario: { nombre: string; contrasena: string } = { nombre: '', contrasena: '' };

  constructor(private toastController: ToastController, private router: Router) {}

  ngOnInit() {}

  // Si ambos campos están completos, navega a la página principal y pasa el usuario
  // Si falta algun dato, muestra un mensaje de error
  
  login() {
    if (this.validateModel(this.usuario)) {
      const navigationExtras: NavigationExtras = { state: { usuario: this.usuario } };
      this.router.navigate(['/home2'], navigationExtras);
    } else {
      this.presentToast('middle', 'Nombre de usuario o contraseña incorrectos' , 1000);
    }
  }

  // Verifica que todos los campos del usuario esten completos
  validateModel(model: { [key: string]: string }): boolean {
    for (const [key, value] of Object.entries(model) as [string, string][]) {
      if (value.trim() === '') {
        return false;
      }
    }
    return true;
  }


  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, duration?: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration ? duration : 1000,
      position: position
    });
    await toast.present();
  }
}
