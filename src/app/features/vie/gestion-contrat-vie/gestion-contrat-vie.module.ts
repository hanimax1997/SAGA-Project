import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionContratVieRoutingModule } from './gestion-contrat-vie-routing.module';
import { GestionContratVieComponent } from './gestion-contrat-vie.component';
import { CreateContratVieComponent } from './create-contrat-vie/create-contrat-vie.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentUtcDateAdapter } from '../../../core/date/MomentUtcDateAdapter';
import { DataTransferService } from '../../../core/services/data-transfer.service';
import { DialogEditRisqueComponent } from './dialog-edit-risque/dialog-edit-risque.component';
import { ConsultContratVieComponent } from './consult-contrat-vie/consult-contrat-vie.component';

export const AppDateAdapter = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@NgModule({
  declarations: [
    GestionContratVieComponent,
    CreateContratVieComponent,
    DialogEditRisqueComponent,
    ConsultContratVieComponent
  ],
  imports: [   
    CommonModule,  
    SharedModule,
    MaterialModule,  
    CoreModule,
    GestionContratVieRoutingModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    // {provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppDateAdapter },
    DataTransferService

  ],
})
export class GestionContratVieModule { }
