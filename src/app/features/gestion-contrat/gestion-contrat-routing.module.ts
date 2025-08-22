import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';


import { ConsultContratComponent } from './consult-contrat/consult-contrat.component';
import { CreationContratComponent } from './creation-contrat/creation-contrat.component';
import { GestionContratComponent } from './gestion-contrat.component';

const routes: Routes = [
    {
        path: 'creation-contrat/:codeProduit/:produit/:idDevis', component: CreationContratComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC"] },
    },
    {
        path: 'consultation-police/:codeProduit/:nomProduit', component: GestionContratComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "GESTION_SINISTRE", "DA", "BO", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "CDC", "CONSULTATION"] },
    },
    {
        path: 'consultation-police/:codeProduit/:nomProduit/:idContrat', component: ConsultContratComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "GESTION_SINISTRE", "DA", "BO", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "CDC", "CONSULTATION"] },
    },
]


@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule]
})
export class GestionContratRoutingModule { }