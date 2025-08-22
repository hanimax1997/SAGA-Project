
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';

import { GestionReductionComponent } from './gestion-reduction.component';
import { CreationReductionComponent } from './creation-reduction/creation-reduction.component';
import { ConsultReductionComponent } from '../gestion-reduction/consult-reduction/consult-reduction.component';
import { ModifReductionComponent } from './modif-reduction/modification-reduction.component';

const routes: Routes = [
    {
        path: 'gestion-reduction/creation-reduction', component: CreationReductionComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "BO"] },
      },
      {
        path: 'creation-convention/creation-reduction', component: CreationReductionComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "BO"] },
      },
      {
        path: 'gestion-reduction/consultation-reduction/:idReduction', component: ConsultReductionComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "BO"] },
      },
      {
        path: 'gestion-reduction/modification-reduction/:idReduction', component: ModifReductionComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "BO"] },
      },
      {
        path: 'gestion-reduction', component: GestionReductionComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "BO"] },
      },

]

@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule]
})
export class GestionReductionRoutingModule { }