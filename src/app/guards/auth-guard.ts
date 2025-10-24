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
    await this.bdlocal.init();

    const usuario = this.bdlocal.usuarioActual;

    if (usuario) {
      console.log('✅ Usuario autenticado:', usuario);
      return true;
    } else {
      console.warn('⛔ Acceso denegado: no hay sesión activa');
      this.router.navigate(['page404'], {
        queryParams: { error: 'no-autorizado' }
      });
      return false;
    }
  }
}
