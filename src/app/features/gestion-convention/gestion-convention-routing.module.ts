import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';

//convention  
import { CreationConventionComponent } from './creation-convention/creation-convention.component';
import { GestionConventionComponent } from './gestion-convention.component';
import { ConsultConventionComponent } from './consult-convention/consult-convention.component';
const routes: Routes = [

    // convention 
    {
        path: 'gestion-convention', component: GestionConventionComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "BO"] },
    },
    {
        path: 'gestion-convention/creation-convention', component: CreationConventionComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "BO"] },
    },
    {
        path: 'gestion-convention/consultation-convention/:idConvention', component: ConsultConventionComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "METIER", "BACKOFFICE", "BO"] },
    },

]


@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule]
})
export class GestionConventionRoutingModule { }