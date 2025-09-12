import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.page.html',
  styleUrls: ['./home2.page.scss'],
  standalone: false
})
export class Home2Page implements OnInit {

  // Guarda el nombre del usuario para mostrarlo en pantalla
  nombreUsuario: string = '';

  // Se usan Router para navegar entre paginas y ReservaService para borrar las reservas al cerrar sesión
  constructor(
    private router: Router,
    private reservaService: ReservaService // Servicio para manejar las reservas
  ) { }

  //Cuando se carga la página, obtiene el nombre del usuario para mostrarlo en el saludo
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { usuario: { nombre: string, contrasena: string } };

    if (state && state.usuario) {
      this.nombreUsuario = state.usuario.nombre;
      console.log('Usuario recibido:', this.nombreUsuario);
    }
  }

  // Borra todas las reservas guardadas
  // Lleva al usuario de vuelta a la pantalla de inicio

  logout() {
    this.reservaService.limpiarReservas();
    this.router.navigate(['/inicio']);
  }
}

