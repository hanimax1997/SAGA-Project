import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { FeaturesRoutingModule } from './features-routing.module';
// import { FeaturesComponent } from './features.component';
// import { MaterialModule } from '../material/material.module';
// import { SharedModule } from '../shared/shared.module';
// import { CoreModule } from '../core/core.module';
// import { NgChartsModule } from 'ng2-charts';

import { MaterialModule } from '../material/material.module';
import { FeaturesRoutingModule } from './features-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { NgChartsModule } from 'ng2-charts';
import { FeaturesComponent } from './features.component';

import { MatSelectFilterModule } from 'mat-select-filter';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConsultationStatutColorPipe } from './consultation/consultation-statut-color.pipe';




//date adapter 
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../core/date/MomentUtcDateAdapter';

import { ErrorComponent } from './error/error.component';



// Modules 
import { PageNoExistComponent } from './page-no-exist/page-no-exist.component';
import { DataTransferService } from '../core/services/data-transfer.service';
import { GestionReductionModule } from './gestion-reduction/gestion-reduction.module';
import { GestionConventionModule } from './gestion-convention/gestion-convention.module';
import { GestionSinistresModule } from './gestion-sinistres/gestion-sinistres.module';
import { GestionDevisModule } from './gestion-devis/gestion-devis.module';
import { GestionContratModule } from './gestion-contrat/gestion-contrat.module';
import { AdministrationModule } from './administration/administration.module';
import { ReseauCommercialModule } from './reseau commercial/reseau-commercial.module';
import { GestionAvenantModule } from './gestion-avenant/gestion-avenant.module';
import { ProductCommercialLineComponent } from './product-commercial-line/product-commercial-line.component';
import { CreateProductCommercialLineComponent } from './product-commercial-line/create-product-commercial-line/create-product-commercial-line.component';
import { ConsultProductCommercialLineComponent } from './product-commercial-line/consult-product-commercial-line/consult-product-commercial-line.component';
import { CreateSiteComponent } from './product-commercial-line/create-site/create-site.component';
import { VieModule } from './vie/vie.module';
import { CreateDevisCommercialLineComponent } from './commercial-line/gestion-devis-commercial-line/create-devis-commercial-line/create-devis-commercial-line.component';
import { GestionDevisCommercialLineComponent } from './commercial-line/gestion-devis-commercial-line/gestion-devis-commercial-line/gestion-devis-commercial-line.component';
import { commercialLineModule } from './commercial-line/commercial-line.module';




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
  imports: [
    commercialLineModule,
    VieModule,
    GestionReductionModule,
    GestionConventionModule,
    GestionSinistresModule,
    GestionDevisModule,
    GestionContratModule,
    AdministrationModule,
    ReseauCommercialModule,
    GestionAvenantModule,
    MaterialModule,
    MatSelectFilterModule,
    CommonModule,
    FeaturesRoutingModule,
    SharedModule,
    NgChartsModule,
    CoreModule
  ],
  declarations: [
    FeaturesComponent,
    DashboardComponent,
    ConsultationStatutColorPipe,
    ErrorComponent,
    PageNoExistComponent,
    ProductCommercialLineComponent,
    CreateProductCommercialLineComponent,
    ConsultProductCommercialLineComponent,
    CreateSiteComponent,

  ],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    // {provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppDateAdapter },
    DataTransferService

  ],


})
export class FeaturesModule { }
