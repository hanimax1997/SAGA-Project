import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';

import { SoumettreAvenantVieComponent } from './soumettre-avenant-vie/soumettre-avenant-vie.component';
import { ApplicationAvenantVieComponent } from './application-avenant-vie/application-avenant-vie.component'
import { ConsultationAvenantVieComponent } from './consultation-avenant-vie/consultation-avenant-vie.component';
import { GestionAvenantVieComponent } from './gestion-avenant-vie.component';
import { GestionAvenantComponent } from '../../gestion-avenant/gestion-avenant.component';
import { ConsultQuittanceComponent } from '../../gestion-avenant/consult-quittance/consult-quittance.component';

const routes: Routes = [
  {
    path: 'consultation-avenants/vie/:codeProduit/:idContrat', component: GestionAvenantVieComponent,
    canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "GESTION_SINISTRE", "DA", "BO", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CDC", "CONSULTATION"] },
},
{
    path: 'application-avenant/vie/:codeProduit/:idTypeAvenant/:idContrat', component: ApplicationAvenantVieComponent,
    canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "GESTIONNAIRE_SINISTRE","CDC"] },
},
{
    path: 'consultation-avenant/vie/:codeProduit/:idContratAvenant', component: ConsultationAvenantVieComponent,
    canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CDC"] },
},

{
    path: 'consultation-contrat-avenant/vie/:codeProduit/:idContratAvenant', component: ConsultationAvenantVieComponent,
    canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "GESTION_SINISTRE", "DA", "BO", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CDC", "CONSULTATION"] },
},

 {
     path: 'consultation-quittance/vie/:codeProduit/:idQuittance', component: ConsultQuittanceComponent,
     canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CDC", "CONSULTATION"] },
 },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionAvenantVieRoutingModule { }
