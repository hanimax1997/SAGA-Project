import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';

//devis
import { CreationDevisComponent } from './creation-devis/creation-devis.component';
import { GestionDevisComponent } from './gestion-devis.component';
import { ConsultDevisComponent } from './consult-devis/consult-devis.component';



const routes: Routes = [

    {
        path: 'creation-devis/:codeProduit/:produit', component: CreationDevisComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC"] },
    },

    {
        path: 'consultation/:codeProduit/:nomProduit', component: GestionDevisComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC", "CONSULTATION"] },
    },

    {
        path: 'consultation/:codeProduit/:produit/:idDevis', component: ConsultDevisComponent,
        canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC", "CONSULTATION"] },
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule]
})
export class GestionDevisRoutingModule { }