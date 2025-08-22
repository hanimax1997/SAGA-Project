import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentUtcDateAdapter } from 'src/app/core/date/MomentUtcDateAdapter';
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { GestionDevisCommercialLineRoutingModule } from './gestion-devis-commercial-line-routing.module';


import { CreateDevisCommercialLineComponent } from '../create-devis-commercial-line/create-devis-commercial-line.component';
import { GestionDevisCommercialLineComponent } from './gestion-devis-commercial-line.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
// import { ConsultDevisVieComponent } from './consult-devis-vie/consult-devis-vie.component';

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
    CreateDevisCommercialLineComponent,
    GestionDevisCommercialLineComponent,
    // ConsultDevisVieComponent   
  ],
  imports: [
    CommonModule,  
    SharedModule,
    MaterialModule,  
    CoreModule,
    GestionDevisCommercialLineRoutingModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    // {provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppDateAdapter },
    DataTransferService

  ],
})
export class GestionDevisCommercialLineModule { }
