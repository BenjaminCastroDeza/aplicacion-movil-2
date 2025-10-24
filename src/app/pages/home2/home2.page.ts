import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { BdlocalService } from '../../services/bdlocal.service';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.page.html',
  styleUrls: ['./home2.page.scss'],
  standalone: false
})
export class Home2Page implements OnInit {

  // Nombre del usuario logueado
  nombre: string = '';

  constructor(
    private router: Router,
    private reservaService: ReservaService,
    private bdlocal: BdlocalService
  ) { }

  // Carga la sesión y muestra el nombre del usuario
  async ngOnInit() {
    await this.bdlocal.cargarSesion();

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { nombre: string };

    if (state && state.nombre) {
      this.nombre = state.nombre;
      await this.bdlocal.setUsuarioActual({ nombre: this.nombre } as any);
    } else if (this.bdlocal.usuarioActual) {
      this.nombre = this.bdlocal.usuarioActual.nombre;
    } else {
      this.nombre = '';
    }
  }

  // Cierra sesión y redirige a inicio
  logout() {
    this.reservaService.limpiarReservas();
    this.bdlocal.logout();
    this.router.navigate(['/inicio']);
  }
}
