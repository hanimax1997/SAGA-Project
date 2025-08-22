import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';

import { GestionAgencesComponent } from './gestion-agences/gestion-agences.component';
import { CreateAgenceComponent } from './gestion-agences/create-agence/create-agence.component';
import { EditAgenceComponent } from './gestion-agences/edit-agence/edit-agence.component';


import { GestionPersonnesComponent } from './gestion-personnes/gestion-personnes.component';
import { CreationPersonneComponent } from './gestion-personnes/creation-personne/creation-personne.component';
import { EditPersonneComponent } from './gestion-personnes/edit-personne/edit-personne.component';
const routes: Routes = [
  //agences
  {
    path: 'reseau-commercial/gestion-agences', component: GestionAgencesComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'reseau-commercial/gestion-agences/creation-agence', component: CreateAgenceComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'reseau-commercial/gestion-agences/modification-agence/:id', component: EditAgenceComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },

  //personne

    //Personne
    {
      path: 'gestion-personnes', component: GestionPersonnesComponent,
      canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE", "BACKOFFICE", "BO"] },
    },
    {
      path: 'gestion-personnes/create', component: CreationPersonneComponent,
      canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE", "BACKOFFICE", "BO"] },
    },
    {
      path: 'gestion-personnes/:idPersonne/edit', component: EditPersonneComponent,
      canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE", "BACKOFFICE", "BO"] },
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReseauCommercialRoutingModule { }
