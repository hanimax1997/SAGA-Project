import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';
import { CreateContratVieComponent } from './create-contrat-vie/create-contrat-vie.component';
import { ConsultContratVieComponent } from './consult-contrat-vie/consult-contrat-vie.component';
import { GestionContratVieComponent } from './gestion-contrat-vie.component';

const routes: Routes = [
  {
    path: 'creation-contrat/vie/:codeProduit/:nomProduit/:idDevis', component: CreateContratVieComponent,
    canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC"] },
  },
{
    path: 'consultation-police/vie/:codeProduit/:nomProduit', component: GestionContratVieComponent,
    canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "GESTION_SINISTRE", "DA", "BO", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "CDC", "CONSULTATION"] },
},
{
    path: 'consultation-police/vie/:codeProduit/:nomProduit/:idContrat', component: ConsultContratVieComponent,
    canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "GESTION_SINISTRE", "DA", "BO", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "CDC", "CONSULTATION"] },
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionContratVieRoutingModule { }
