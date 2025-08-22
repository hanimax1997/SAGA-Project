import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';
import { CreateDevisCommercialLineComponent } from '../create-devis-commercial-line/create-devis-commercial-line.component';
import { GestionDevisCommercialLineComponent } from './gestion-devis-commercial-line.component';




const routes: Routes = [
  
  {
    path: 'creation-devis/commercialLine/:codeProduit/:nomProduit', component: CreateDevisCommercialLineComponent,
    canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC"] },
  },
  {
    path: 'consultation/commercialLine/:codeProduit/:nomProduit', component: GestionDevisCommercialLineComponent,
    canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC", "CONSULTATION"] },
  },
//   {
//     path: 'consultation/vie/:codeProduit/:nomProduit/:idDevis', component: ConsultDevisVieComponent,
//     canActivate: [RoleguardService], data: {  roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "DA", "BO", "CDC", "CONSULTATION"] },
//   },
];
                                                                       
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionDevisCommercialLineRoutingModule { }
