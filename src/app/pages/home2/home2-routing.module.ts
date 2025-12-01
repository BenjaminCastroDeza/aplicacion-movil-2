import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Home2Page } from './home2.page';

const routes: Routes = [
  {
    path: '',
    component: Home2Page,
    children: [
      {
        path: '',
        component: Home2Page
      },
      {
        path: 'reserva',
        loadChildren: () =>
          import('../reserva/reserva.module').then(m => m.ReservaPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'mis-reservas',
        loadChildren: () =>
          import('../mis-reservas/mis-reservas.module').then(m => m.MisReservasPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Home2PageRoutingModule {}