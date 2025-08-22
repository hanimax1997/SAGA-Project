import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';
// sinistre 
import { CreateSinistreComponent } from './create-sinistre/create-sinistre.component';
import { GestionSinistresComponent } from './gestion-sinistres.component';
import { ConsultationSinistreComponent } from './consultation-sinistre/consultation-sinistre.component';
import { CreateOpAssureComponent } from './gestion-op/create-op-assure/create-op-assure.component';
import { ModificationSinistreComponent } from './modification-sinistre/modification-sinistre.component';
import { CompletezInfosComponent } from './modification-sinistre/completez-infos/completez-infos.component';
import { TiersComponent } from './modification-sinistre/tiers/tiers.component';
import { BlessesComponent } from './modification-sinistre/blesses/blesses.component';
import { CreationMissionExpertiseComponent } from './gestion-mission-expertise/creation-mission-expertise/creation-mission-expertise.component';
import { GestionMissionExpertiseComponent } from './gestion-mission-expertise/gestion-mission-expertise.component';
import { ConsultationMissionExpertiseComponent } from './gestion-mission-expertise/consultation-mission-expertise/consultation-mission-expertise.component';

import { ReservePaiementComponent } from './modification-sinistre/reserve-paiement/reserve-paiement.component';
import { ReserveRecoursComponent } from './modification-sinistre/reserve-recours/reserve-recours.component';

import { CalculateurComponent } from './gestion-op/calculateur/calculateur.component';
import { CreationInstanceComponent } from './gestion-instances/creation-instance/creation-instance.component';
import { PaiementSinistreComponent } from './paiement-sinistre/paiement-sinistre.component';
import { GestionOpComponent } from './gestion-op/gestion-op.component';
import { ConsultOpComponent } from './gestion-op/consult-op/consult-op.component';
import { GestionInstancesComponent } from './gestion-instances/gestion-instances.component';


const routes: Routes = [
    //mission expertise
    {
        path: 'gestion-missionsExpertise/gestion-mission-expertise/:idSinistre/:produit', component: GestionMissionExpertiseComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "DA", "BO", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "CONSULTATION", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-missionsExpertise/gestion-mission-expertise/:idSinistre/:produit/creation-mission-expertise', component: CreationMissionExpertiseComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-missionsExpertise/gestion-mission-expertise/:idSinistre/consultation-mission-expertise/:idMissionExpertise', component: ConsultationMissionExpertiseComponent,
        canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "DA", "BO", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "CONSULTATION", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },

    //sinistre
    {
        path: 'gestion-sinistre/:codeProduit/:produit', component: GestionSinistresComponent,
        canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "DA","CDC", "BO", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CONSULTATION", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/creation-sinistre', component: CreateSinistreComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/consultation-sinistre/:codeSinistre', component: ConsultationSinistreComponent,
        canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "DA","CDC", "BO", "WEB_HELP", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "CONSULTATION", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre', component: ModificationSinistreComponent,

        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "DA","CDC", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR","CONSULTATION", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/completez-informations-sinistre', component: CompletezInfosComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/tiers', component: TiersComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/blesses', component: BlessesComponent,
        canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },

    },
    {
        path: 'gestion-missionsExpertise/creation-mission-expertise/:idSinistre', component: CreationMissionExpertiseComponent,
        canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    //gestion op 
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/gestion-op', component: GestionOpComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "WEB_HELP", "DA","CDC","CONSULTATION", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
        // , 
    },
    //Consultation op 
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/gestion-op/consult-op/:idOp', component: ConsultOpComponent,
        canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "WEB_HELP", "CONSULTATION", "DA","CDC", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    //OP
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/:codeStatut/reserve-paiement/calculateur/:codeGarantie/:codeReserve/:typeDecompte', component: CalculateurComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },

    //paiement
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/:typeDecompte/:idDecompte/creation-instance', component: CreationInstanceComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/instances', component: GestionInstancesComponent,
        canActivate: [RoleguardService], data: { roles: ["COURTIER","ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "DA","CDC","CONSULTATION", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/:typeDecompte/:codeTypeDecompte/:idDecompte/:idSinistre/:idInstance/paiement', component: PaiementSinistreComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/:statutSinistre/reserve-paiement', component: ReservePaiementComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/:statutSinistre/reserve-recours', component: ReserveRecoursComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR", "GESTIONNAIRE_SINISTRE", "CHEF_PROJET", "RESPONSABLE_SINISTRE", "DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
    },
    {
        path: 'gestion-sinistre/:codeProduit/:nameProduit/gestionnaire-sinistre/:codeSinistre/:statutSinistre/reserve-paiement/create-op-assure/:codeReserve/:codeGarantie', component: CreateOpAssureComponent,
        canActivate: [RoleguardService], data: { roles: ["ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR","GESTIONNAIRE_SINISTRE","CHEF_PROJET","RESPONSABLE_SINISTRE","DIRECTEUR", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP"] },
      },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule]
})
export class GestionSinistresRoutingModule { }