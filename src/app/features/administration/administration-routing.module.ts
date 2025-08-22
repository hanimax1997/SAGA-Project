import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleguardService } from 'src/app/core/guards/roleguard.service';

import { GestionTaxesComponent } from './gestion-taxes/gestion-taxes.component';
import { GestionFamilleProduitComponent } from './gestion-famille-produit/gestion-famille-produit.component';
import { GestionTypeRisqueComponent } from './gestion-type-risque/gestion-type-risque.component';
import { GestionProduitsComponent } from './gestion-produits/gestion-produits.component';
import { GestionGarantiesComponent } from './gestion-garanties/gestion-garanties.component';
import { GestionSousGarantiesComponent } from './gestion-sous-garanties/gestion-sous-garanties.component';
import { GestionDureeComponent } from './gestion-duree/gestion-duree.component';
import { GestionFormuleComponent } from './gestion-formule/gestion-formule.component'
import { GestionReseauDistributionComponent } from './gestion-reseau-distribution/gestion-reseau-distribution.component';
import { GestionPackComponent } from './gestion-pack/gestion-pack.component';
import { CreationPackComponent } from './gestion-pack/creation-pack/creation-pack.component'
import { GestionQuestionnairesComponent } from './gestion-questionnaires/gestion-questionnaires.component';
import { EditQuestionsQuestionnaireComponent } from './gestion-questionnaires/edit-questions-questionnaire/edit-questions-questionnaire.component';
import { CreationQuestionnairesDialogComponent } from './gestion-questionnaires/creation-questionnaires-dialog/creation-questionnaires-dialog.component';
import { GestionProduitRisqueComponent } from './gestion-produit-risque/gestion-produit-risque.component';
import { CreateNewProductComponent } from './gestion-produit-risque/create-new-product/create-new-product.component';
import { ConsultationProduitComponent } from './gestion-produit-risque/consultation-produit/consultation-produit.component';
import { GestionCategorieComponent } from './gestion-pack/gestion-categorie/gestion-categorie.component'
import { ListGarantiesComponent } from './gestion-pack/list-garanties/list-garanties.component';
import { ListSousGarantiesComponent } from './gestion-pack/list-sous-garanties/list-sous-garanties.component';
import { EditPackComponent } from './gestion-pack/edit-pack/edit-pack.component';
import { GestionVehiculeComponent } from './gestion-vehicule/gestion-vehicule.component';
import { CreateVehiculeComponent } from './gestion-vehicule/create-vehicule/create-vehicule.component';
import { EditVehiculeComponent } from './gestion-vehicule/edit-vehicule/edit-vehicule.component'
import { ConsultVehiculeComponent } from './gestion-vehicule/consulter-vehicule/consult-vehicule.component';
import { GestionUserComponent } from './gestion-user/gestion-user.component';
import { ResetPasswordComponent } from 'src/app/public/login/reset-password/reset-password.component';
import { AddUserComponent } from './gestion-user/add-user/add-user.component';
import { EditUserComponent } from './gestion-user/edit-user/edit-user.component';
import { MigrationAutomobileComponent } from './migration-automobile/migration-automobile.component';

const routes: Routes = [
  {
    path: 'gestion-produits', component: GestionProduitsComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-taxes', component: GestionTaxesComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-famille-produit', component: GestionFamilleProduitComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-type-risque', component: GestionTypeRisqueComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-duree', component: GestionDureeComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-formule', component: GestionFormuleComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-reseaux-distribution', component: GestionReseauDistributionComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-garanties', component: GestionGarantiesComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-garanties/:id/gestion-sous-garanties', component: GestionSousGarantiesComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  // pack 
  {
    path: 'gestion-produits/gestion-pack', component: GestionPackComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-pack/creation-pack', component: CreationPackComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  //vehicule
  {
    path: 'gestion-vehicules', component: GestionVehiculeComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", ,"DATA","ANALYSTE"] },
  },
  {
    path: 'gestion-vehicules/creation-vehicule', component: CreateVehiculeComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN","DATA","ANALYSTE"] },
  },
  {
    path: 'gestion-vehicules/modifier-vehicule/:idVehicule', component: EditVehiculeComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN","DATA", "ANALYSTE"] },
  },
  {
    path: 'gestion-vehicules/consulter-vehicule/:idVehicule', component: ConsultVehiculeComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN","DATA", "ANALYSTE"] },
  },
  //Questionnaire
  {
    path: 'gestion-produits/gestion-questionnaires', component: GestionQuestionnairesComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-questionnaires/:idQuestionnaire/edit-questions', component: EditQuestionsQuestionnaireComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-questionnaires/create', component: CreationQuestionnairesDialogComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-produit-risque', component: GestionProduitRisqueComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-produit-risque/create', component: CreateNewProductComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-produits/gestion-produit-risque/:idProduitRisque/edit', component: ConsultationProduitComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-referentiels/gestion-pack', component: GestionPackComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-referentiels/gestion-pack/creation-pack', component: CreationPackComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-referentiels/gestion-pack/modification-pack/:idPack', component: EditPackComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-referentiels/gestion-pack/:idPack/parametres', component: GestionCategorieComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-referentiels/gestion-pack/:idPack/garanties', component: ListGarantiesComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-referentiels/gestion-pack/:idPack/garanties/:idGarantie/parametres', component: GestionCategorieComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-referentiels/gestion-pack/:idPack/garanties/:idGarantie/sous-garanties', component: ListSousGarantiesComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-referentiels/gestion-pack/:idPack/garanties/:idGarantie/sous-garanties/:idSousGarantie/parametres', component: GestionCategorieComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },

  //user
  {
    path: 'gestion-user', component: GestionUserComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-user/add-user', component: AddUserComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-user/edit-user/:id', component: EditUserComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'gestion-user', component: GestionUserComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE"] },
  },
  {
    path: 'migration-auto', component: MigrationAutomobileComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN", "ANALYSTE", "MIGRATION"] },
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
