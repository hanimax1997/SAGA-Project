import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
//   //*************  devis module  
//   { path: '', loadChildren: () => import('./gestion-devis-comme/gestion-devis-vie.module').then((m) => m.GestionDevisVieModule) },
//   { path: '', loadChildren: () => import('./gestion-contrat-vie/gestion-contrat-vie.module').then((m) => m.GestionContratVieModule) },
//   { path: '', loadChildren: () => import('./gestion-avenant-vie/gestion-avenant-vie.module').then((m) => m.GestionAvenantVieModule) },

 { path: '', loadChildren: () => import('./gestion-devis-commercial-line/gestion-devis-commercial-line.module').then((m)=> m.GestionDevisCommercialLineModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class commercialLineRoutingModule { }
