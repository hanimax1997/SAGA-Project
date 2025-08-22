import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';
import { CreateDevisVieComponent } from './create-devis-vie/create-devis-vie.component';
import { GestionDevisVieComponent } from './gestion-devis-vie.component';
import { ConsultDevisVieComponent } from './consult-devis-vie/consult-devis-vie.component';


const routes: Routes = [
  
  {
    path: 'creation-devis/vie/:codeProduit/:nomProduit', component: CreateDevisVieComponent,
    canActivate: [RoleguardService], data: { roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC"] },
  },
  {
    path: 'consultation/vie/:codeProduit/:nomProduit', component: GestionDevisVieComponent,
    canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC", "CONSULTATION"] },
  },
  {
    path: 'consultation/vie/:codeProduit/:nomProduit/:idDevis', component: ConsultDevisVieComponent,
    canActivate: [RoleguardService], data: {  roles: ["CDC_BEA","COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC", "CONSULTATION"] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionDevisVieRoutingModule { }
