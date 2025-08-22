import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //*************  devis module  
  { path: '', loadChildren: () => import('./gestion-devis-vie/gestion-devis-vie.module').then((m) => m.GestionDevisVieModule) },
  { path: '', loadChildren: () => import('./gestion-contrat-vie/gestion-contrat-vie.module').then((m) => m.GestionContratVieModule) },
  { path: '', loadChildren: () => import('./gestion-avenant-vie/gestion-avenant-vie.module').then((m) => m.GestionAvenantVieModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VieRoutingModule { }
