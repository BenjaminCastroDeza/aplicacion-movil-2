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

  ngOnInit() {
    // Intentar primero obtener el nombre desde el state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { nombre: string };
    
    if (state && state.nombre) {
      this.nombre = state.nombre;
      // Guardar temporalmente en el servicio para persistencia en recargas
      this.bdlocal.usuarioActual = { nombre: this.nombre } as any;
      console.log('Usuario recibido desde state:', this.nombre);
    } else if (this.bdlocal.usuarioActual) {
      // Si no hay state, tomar el usuario guardado en el servicio
      this.nombre = this.bdlocal.usuarioActual.nombre;
      console.log('Usuario recibido desde servicio:', this.nombre);
    } else {
      console.warn('No se encontró usuario logueado');
      this.nombre = '';
    }
  }

  logout() {
    this.reservaService.limpiarReservas();
    this.bdlocal.usuarioActual = null;
    this.router.navigate(['/inicio']);
  }
}
