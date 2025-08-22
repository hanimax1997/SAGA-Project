import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';

import { GestionAvenantComponent } from './gestion-avenant.component';
import { ApplicationAvenantComponent } from './application-avenant/application-avenant.component';
import { ConsultContratAvenantComponent } from './consult-contrat-avenant/consult-contrat-avenant.component';
//import { ConsultAvenantComponent } from './consult-avenant/consult-avenant.component';
import { ConsultationAvenantComponent } from './consultation-avenant/consultation-avenant.component';
import { ConsultQuittanceComponent } from './consult-quittance/consult-quittance.component';

const routes: Routes = [
    {
        path: 'consultation-avenants/:codeProduit/:idContrat', component: GestionAvenantComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "GESTION_SINISTRE", "DA", "BO", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CDC", "CONSULTATION"] },
    },
    {
        path: 'application-avenant/:codeProduit/:idTypeAvenant/:idContrat', component: ApplicationAvenantComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "GESTIONNAIRE_SINISTRE","CDC"] },
    },
    {
        path: 'consultation-avenant/:codeProduit/:idContratAvenant', component: ConsultationAvenantComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CDC"] },
    },

    {
        path: 'consultation-contrat-avenant/:codeProduit/:idContratAvenant', component: ConsultContratAvenantComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "GESTION_SINISTRE", "DA", "BO", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CDC", "CONSULTATION"] },
    },

    {
        path: 'consultation-quittance/:codeProduit/:idQuittance', component: ConsultQuittanceComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CDC", "CONSULTATION"] },
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule]
})
export class GestionAvenantRoutingModule { }