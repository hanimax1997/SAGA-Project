import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentUtcDateAdapter } from '../../../core/date/MomentUtcDateAdapter';
import { DataTransferService } from '../../../core/services/data-transfer.service';

import { GestionDevisVieRoutingModule } from './gestion-devis-vie-routing.module';
import { CreateDevisVieComponent } from './create-devis-vie/create-devis-vie.component';
import { GestionDevisVieComponent } from './gestion-devis-vie.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { ConsultDevisVieComponent } from './consult-devis-vie/consult-devis-vie.component';

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
    CreateDevisVieComponent,
    GestionDevisVieComponent,
    ConsultDevisVieComponent   
  ],
  imports: [
    CommonModule,  
    SharedModule,
    MaterialModule,  
    CoreModule,
    GestionDevisVieRoutingModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    // {provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppDateAdapter },
    DataTransferService

  ],
})
export class GestionDevisVieModule { }
