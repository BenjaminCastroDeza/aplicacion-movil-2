// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BdlocalService } from '../services/bdlocal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private bdlocal: BdlocalService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Asegurar que storage está listo
    await this.bdlocal.init();

    // Comprobar sesión guardada
    const usuario = this.bdlocal.usuarioActual;

    if (usuario) {
      console.log('🔐 Acceso permitido. Sesión activa:', usuario);
      return true;
    }

    console.warn('⛔ Acceso denegado. No hay sesión activa.');

    // Si no está logeado → enviarlo al login
    this.router.navigate(['/inicio'], {
      queryParams: { auth: 'required' }
    });

    return false;
  }
}
