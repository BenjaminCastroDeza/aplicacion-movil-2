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

  nombre: string = '';

  constructor(
    private router: Router,
    private reservaService: ReservaService,
    private bdlocal: BdlocalService
  ) { }

  async ngOnInit() {
    await this.bdlocal.cargarSesion(); // 👈 asegura que cargue el usuario del storage

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { nombre: string };

    if (state && state.nombre) {
      this.nombre = state.nombre;
      await this.bdlocal.setUsuarioActual({ nombre: this.nombre } as any); // 👈 guarda también en storage
    } else if (this.bdlocal.usuarioActual) {
      this.nombre = this.bdlocal.usuarioActual.nombre;
    } else {
      this.nombre = '';
    }
  }


  logout() {
    this.reservaService.limpiarReservas();
    this.bdlocal.logout(); // <-- limpia Storage también
    this.router.navigate(['/inicio']);
  }
}
