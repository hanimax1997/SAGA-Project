import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdministrationRoutingModule } from './administration-routing.module';
import { MatSelectFilterModule } from 'mat-select-filter';
//Taxe
import { GestionTaxesComponent } from './gestion-taxes/gestion-taxes.component';
import { CreationTaxeDialogComponent } from './gestion-taxes/creation-taxe-dialog/creation-taxe-dialog.component';
import { EditTaxeDialogComponent } from './gestion-taxes/edit-taxe-dialog/edit-taxe-dialog.component';
//Famille Produit
import { GestionFamilleProduitComponent } from './gestion-famille-produit/gestion-famille-produit.component';
import { CreationFamilleProduitDialogComponent } from './gestion-famille-produit/creation-famille-produit-dialog/creation-famille-produit-dialog.component';
import { EditFamilleProduitDialogComponent } from './gestion-famille-produit/edit-famille-produit-dialog/edit-famille-produit-dialog.component';
//Type Risque
import { GestionTypeRisqueComponent } from './gestion-type-risque/gestion-type-risque.component';
import { CreationTypeRisqueComponent } from './gestion-type-risque/creation-type-risque/creation-type-risque.component';
import { EditTypeRisqueDialogComponent } from './gestion-type-risque/edit-type-risque-dialog/edit-type-risque-dialog.component';
///Referentiel
import { GestionProduitsComponent } from './gestion-produits/gestion-produits.component';
//Garantie
import { GestionGarantiesComponent } from './gestion-garanties/gestion-garanties.component';
import { CreationGarantieDialogComponent } from './gestion-garanties/creation-garantie-dialog/creation-garantie-dialog.component';
import { EditGarantieDialogComponent } from './gestion-garanties/edit-garantie-dialog/edit-garantie-dialog.component';
//Sous Garantie
import { GestionSousGarantiesComponent } from './gestion-sous-garanties/gestion-sous-garanties.component';
import { CreationSousGarantiesDialogComponent } from './gestion-sous-garanties/creation-sous-garanties-dialog/creation-sous-garanties-dialog.component';
import { EditSousGarantiesDialogComponent } from './gestion-sous-garanties/edit-sous-garanties-dialog/edit-sous-garanties-dialog.component';
//Durée
import { GestionDureeComponent } from './gestion-duree/gestion-duree.component';
import { CreationDureeDialogComponent } from './gestion-duree/creation-duree-dialog/creation-duree-dialog.component';
import { EditDureeDialogComponent } from './gestion-duree/edit-duree-dialog/edit-duree-dialog.component';
//Formule
import { GestionFormuleComponent } from './gestion-formule/gestion-formule.component'
import { CreationFormuleDialogComponent } from './gestion-formule/creation-formule-dialog/creation-formule-dialog.component'
import { EditFormuleDialogComponent } from './gestion-formule/edit-formule-dialog/edit-formule-dialog.component';
//Reseau Distribution
import { GestionReseauDistributionComponent } from './gestion-reseau-distribution/gestion-reseau-distribution.component';
import { CreationReseauDistributionDialogComponent } from './gestion-reseau-distribution/creation-reseau-distribution-dialog/creation-reseau-distribution-dialog.component';
import { EditReseauDistributionDialogComponent } from './gestion-reseau-distribution/edit-reseau-distribution-dialog/edit-reseau-distribution-dialog.component';
//vehicule 

import { GestionVehiculeComponent } from './gestion-vehicule/gestion-vehicule.component';
import { CreateVehiculeComponent } from './gestion-vehicule/create-vehicule/create-vehicule.component';
import { EditVehiculeComponent } from './gestion-vehicule/edit-vehicule/edit-vehicule.component';
import { ConsultVehiculeComponent } from './gestion-vehicule/consulter-vehicule/consult-vehicule.component';
//Questionnaire
import { GestionQuestionnairesComponent } from './gestion-questionnaires/gestion-questionnaires.component';
import { CreationQuestionnairesDialogComponent } from './gestion-questionnaires/creation-questionnaires-dialog/creation-questionnaires-dialog.component';
import { EditQuestionnairesDialogComponent } from './gestion-questionnaires/edit-questionnaires-dialog/edit-questionnaires-dialog.component';
import { EditQuestionnaireQuestionsDialogComponent } from './gestion-questionnaires/creation-questionnaires-dialog/edit-questionnaire-questions-dialog/edit-questionnaire-questions-dialog.component';
import { CreationQuestionnaireReponsesDialogComponent } from './gestion-questionnaires/creation-questionnaires-dialog/creation-questionnaire-reponses-dialog/creation-questionnaire-reponses-dialog.component';
import { ConsultationQuestionnaireReponsesComponent } from './gestion-questionnaires/creation-questionnaires-dialog/consultation-questionnaire-reponses/consultation-questionnaire-reponses.component';
import { EditQuestionsQuestionnaireComponent } from './gestion-questionnaires/edit-questions-questionnaire/edit-questions-questionnaire.component';
//Details risque
import { GestionParamRisqueComponent } from './gestion-details-risque/gestion-param-risque.component';
import { CreationParamRisqueDialogComponent } from './gestion-details-risque/creation-param-risque-dialog/creation-param-risque-dialog.component';
import { EditParamRisqueDialogComponent } from './gestion-details-risque/edit-param-risque-dialog/edit-param-risque-dialog.component';
import { CreationQuestionsComponent } from './gestion-questionnaires/creation-questionnaires-dialog/creation-questions/creation-questions.component';
import { GestionProduitRisqueComponent } from './gestion-produit-risque/gestion-produit-risque.component';
import { CreateNewProductComponent } from './gestion-produit-risque/create-new-product/create-new-product.component';
import { EditParmRisqueDialogComponent } from './gestion-produit-risque/create-new-product/edit-parm-risque-dialog/edit-parm-risque-dialog.component';
import { ConsultationProduitComponent } from './gestion-produit-risque/consultation-produit/consultation-produit.component';
import { ShowParamRisqueDialogComponent } from './gestion-produit-risque/create-new-product/show-param-risque-dialog/show-param-risque-dialog.component';

//pack
import { GestionPackComponent } from './gestion-pack/gestion-pack.component';
import { CreationPackComponent } from './gestion-pack/creation-pack/creation-pack.component';
import { CreationCategorieDialogComponent } from './gestion-pack/gestion-categorie/creation-categorie-dialog/creation-categorie-dialog.component';
import { CreationPackGarantieComponent } from './gestion-pack/creation-pack-garantie/creation-pack-garantie.component';
import { SupressionPackGarantieComponent } from './gestion-pack/supression-pack-garantie/supression-pack-garantie.component';
import { ListGarantiesComponent } from './gestion-pack/list-garanties/list-garanties.component';
import { ListSousGarantiesComponent } from './gestion-pack/list-sous-garanties/list-sous-garanties.component';
import { EditPackComponent } from './gestion-pack/edit-pack/edit-pack.component';
import { EditCategorieDialogComponent } from './gestion-pack/gestion-categorie/edit-categorie-dialog/edit-categorie-dialog.component';
import { GestionCategorieComponent } from './gestion-pack/gestion-categorie/gestion-categorie.component';

//USER
import { GestionUserComponent } from './gestion-user/gestion-user.component';
import { AddUserComponent } from './gestion-user/add-user/add-user.component';
import { EditUserComponent } from './gestion-user/edit-user/edit-user.component';
import { ConfirmationDeleteDialogComponent } from '../confirmation-delete-dialog/confirmation-delete-dialog.component';
import { NewConfigVehiculeDialogComponent } from './gestion-vehicule/create-vehicule/new-config-vehicule-dialog/new-config-vehicule-dialog.component';
import { MigrationAutomobileComponent } from './migration-automobile/migration-automobile.component';

import { ProductionComponent } from './get-data/production/components/production.component';
import { SinistreComponent } from './get-data/sinistre/components/sinistre.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    GestionTaxesComponent,
    CreationTaxeDialogComponent,
    EditTaxeDialogComponent,

    GestionFamilleProduitComponent,
    CreationFamilleProduitDialogComponent,
    EditFamilleProduitDialogComponent,

    GestionTypeRisqueComponent,
    CreationTypeRisqueComponent,
    EditTypeRisqueDialogComponent,

    GestionProduitsComponent,

    GestionGarantiesComponent,
    CreationGarantieDialogComponent,
    EditGarantieDialogComponent,

    GestionSousGarantiesComponent,
    CreationSousGarantiesDialogComponent,
    EditSousGarantiesDialogComponent,

    GestionDureeComponent,
    CreationDureeDialogComponent,
    EditDureeDialogComponent,

    GestionFormuleComponent,
    CreationFormuleDialogComponent,
    EditFormuleDialogComponent,

    GestionReseauDistributionComponent,
    CreationReseauDistributionDialogComponent,
    EditReseauDistributionDialogComponent,

    GestionQuestionnairesComponent,
    CreationQuestionnairesDialogComponent,
    EditQuestionnairesDialogComponent,
    EditQuestionnaireQuestionsDialogComponent,
    CreationQuestionnaireReponsesDialogComponent,
    ConsultationQuestionnaireReponsesComponent,
    EditQuestionsQuestionnaireComponent,

    GestionParamRisqueComponent,
    CreationParamRisqueDialogComponent,
    EditParamRisqueDialogComponent,
    CreationQuestionsComponent,
    GestionProduitRisqueComponent,
    CreateNewProductComponent,
    EditParmRisqueDialogComponent,
    ConsultationProduitComponent,
    ShowParamRisqueDialogComponent,

    GestionPackComponent,
    CreationPackComponent,
    CreationCategorieDialogComponent,
    CreationPackGarantieComponent,
    SupressionPackGarantieComponent,
    ListGarantiesComponent,
    ListSousGarantiesComponent,
    EditPackComponent,
    EditCategorieDialogComponent,
    GestionCategorieComponent,

    GestionUserComponent,
    AddUserComponent,
    EditUserComponent,
    EditVehiculeComponent,
    CreateVehiculeComponent,
    GestionVehiculeComponent,
   ConfirmationDeleteDialogComponent,
    ConsultVehiculeComponent,
  NewConfigVehiculeDialogComponent,
  MigrationAutomobileComponent,
  ProductionComponent,
  SinistreComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SharedModule,
    MaterialModule,
    CoreModule,
    MatSelectFilterModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class AdministrationModule { }
