import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../../../core/date/MomentUtcDateAdapter';
import { DataTransferService } from '../../../core/services/data-transfer.service';
import { GestionAvenantVieRoutingModule } from './gestion-avenant-vie-routing.module';
import { GestionAvenantVieComponent } from './gestion-avenant-vie.component';
import { ApplicationAvenantVieComponent } from './application-avenant-vie/application-avenant-vie.component';
import { SoumettreAvenantVieComponent } from './soumettre-avenant-vie/soumettre-avenant-vie.component';
import { ConsultationAvenantVieComponent } from './consultation-avenant-vie/consultation-avenant-vie.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ValidationAvenantVieComponent } from './validation-avenant-vie/validation-avenant-vie.component';


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
    GestionAvenantVieComponent,
    ApplicationAvenantVieComponent,
    ConsultationAvenantVieComponent,
    SoumettreAvenantVieComponent,
    ConsultationAvenantVieComponent,
    ApplicationAvenantVieComponent,
    SoumettreAvenantVieComponent,
    ValidationAvenantVieComponent
    
  ],
  imports: [
    CommonModule,   
    SharedModule,
    MaterialModule,  
    CoreModule,
    GestionAvenantVieRoutingModule,
    MatSelectFilterModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    // {provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppDateAdapter },
    DataTransferService

  ],
})
export class GestionAvenantVieModule { }
