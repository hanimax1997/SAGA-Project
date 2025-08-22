import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GestionSinistresRoutingModule } from './gestion-sinistres-rounting.module';
import { MatSelectFilterModule } from 'mat-select-filter';

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

import { GestionnaireSinistreComponent } from './gestionnaire-sinistre/gestionnaire-sinistre.component';
import { ReservePaiementComponent } from './modification-sinistre/reserve-paiement/reserve-paiement.component';
import { ReserveRecoursComponent } from './modification-sinistre/reserve-recours/reserve-recours.component';

import { CalculateurComponent } from './gestion-op/calculateur/calculateur.component';
import { CreationInstanceComponent } from './gestion-instances/creation-instance/creation-instance.component';
import { PaiementSinistreComponent } from './paiement-sinistre/paiement-sinistre.component';
import { GestionOpComponent } from './gestion-op/gestion-op.component';
import { ConsultOpComponent } from './gestion-op/consult-op/consult-op.component';
import { GestionInstancesComponent } from './gestion-instances/gestion-instances.component';
import { EnteteGestionComponent } from './entete-gestion/entete-gestion.component';

import { WithdrawalSinistreDialogComponent } from './modification-sinistre/withdrawal-sinistre-dialog/withdrawal-sinistre-dialog.component';
import { FraudeSinistreDialogComponent } from './modification-sinistre/fraude-sinistre-dialog/fraude-sinistre-dialog.component';
import { ConfirmationMissionDialogComponent } from './gestion-mission-expertise/confirmation-mission-dialog/confirmation-mission-dialog.component';
import { EditAssistanceDialogComponent } from './modification-sinistre/edit-assistance-dialog/edit-assistance-dialog.component';
import { GestionDocumentsComponent } from './gestion-instances/gestion-documents/gestion-documents.component';
import { EditDocumentDialogComponent } from './gestion-instances/edit-document-dialog/edit-document-dialog.component';
import { DeletePersonneDialogComponent } from './modification-sinistre/delete-personne-dialog/delete-personne-dialog.component';
import { EditReserveDialogComponent } from './modification-sinistre/edit-reserve-dialog/edit-reserve-dialog.component';

@NgModule({
  declarations: [
    CreateSinistreComponent,
    GestionSinistresComponent,
    ConsultationSinistreComponent,
    CreateOpAssureComponent,
    ModificationSinistreComponent,
    CompletezInfosComponent,
    TiersComponent,
    BlessesComponent,
    CreationMissionExpertiseComponent,
    GestionMissionExpertiseComponent,
    ConsultationMissionExpertiseComponent,
    GestionnaireSinistreComponent,
    ReservePaiementComponent,
    ReserveRecoursComponent,
    CalculateurComponent,
    CreationInstanceComponent,
    PaiementSinistreComponent,
    GestionOpComponent,
    ConsultOpComponent,
    GestionInstancesComponent,
    EnteteGestionComponent,
    WithdrawalSinistreDialogComponent,
    FraudeSinistreDialogComponent,
    ConfirmationMissionDialogComponent,
    EditAssistanceDialogComponent,
    GestionDocumentsComponent,
    EditDocumentDialogComponent,
    DeletePersonneDialogComponent,
    EditReserveDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    GestionSinistresRoutingModule,
    CoreModule,
    MatSelectFilterModule
  ]
})
export class GestionSinistresModule { }
