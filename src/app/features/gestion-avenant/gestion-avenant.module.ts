import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionAvenantRoutingModule } from './gestion-avenant-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { GestionAvenantComponent } from './gestion-avenant.component';
import { ApplicationAvenantComponent } from './application-avenant/application-avenant.component';
import { ConsultContratAvenantComponent } from './consult-contrat-avenant/consult-contrat-avenant.component';
import { ConsultationAvenantComponent } from './consultation-avenant/consultation-avenant.component';
import { ConsultQuittanceComponent } from './consult-quittance/consult-quittance.component';
import { CreationAvenantComponent } from './creation-avenant/creation-avenant.component';
import { SoumettreAvenantComponent } from './soumettre-avenant/soumettre-avenant.component';
import { ConsultAvenantComponent } from './consult-avenant/consult-avenant.component';
import { ValidationAvenantComponent } from './validation-avenant/validation-avenant.component';
import { EditRisqueDialogComponent } from './edit-risque-dialog/edit-risque-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    GestionAvenantComponent,
    ApplicationAvenantComponent,
    ConsultContratAvenantComponent,
    ConsultationAvenantComponent,
    ConsultQuittanceComponent,
    CreationAvenantComponent,
    SoumettreAvenantComponent,
    ConsultAvenantComponent,
    ValidationAvenantComponent,
    EditRisqueDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    GestionAvenantRoutingModule,
    CoreModule,
    MatSelectFilterModule
  ]
})
export class GestionAvenantModule { }
