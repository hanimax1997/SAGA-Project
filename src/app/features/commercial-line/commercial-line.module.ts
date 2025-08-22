import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../../core/date/MomentUtcDateAdapter';
import { DataTransferService } from '../../core/services/data-transfer.service';
import { commercialLineRoutingModule } from './commercial-line-rounting.module';
// import { VieRoutingModule } from './vie-routing.module';
import { GestionDevisCommercialLineModule } from './gestion-devis-commercial-line/gestion-devis-commercial-line.module';
// import { GestionContratVieModule } from './gestion-contrat-vie/gestion-contrat-vie.module';
// import { GestionAvenantModule } from '../gestion-avenant/gestion-avenant.module';
import { GestionDevisCommercialLineComponent } from './gestion-devis-commercial-line/gestion-devis-commercial-line/gestion-devis-commercial-line.component';

// const routes: Routes = [
//   //*************  devis module  
//   // { path: '', loadChildren: () => import('./gestion-devis-commercial-line/gestion-devis-vie.module').then((m) => m.GestionDevisVieModule) },
//   // { path: '', loadChildren: () => import('./gestion-contrat-vie/gestion-contrat-vie.module').then((m) => m.GestionContratVieModule) },
//   // { path: '', loadChildren: () => import('./gestion-avenant-vie/gestion-avenant-vie.module').then((m) => m.GestionAvenantVieModule) },


//   { path: '', loadChildren: () => import('./gestion-devis-commercial-line/gestion-devis-commercial-line.module').then((m) => m.GestionDevisCommercialLineModule) },


// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class commercialLinesRoutingModule { }



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
   
  ],
  imports: [
    CommonModule,
    commercialLineRoutingModule,
    // GestionAvenantModule,
    // GestionContratVieModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    // {provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppDateAdapter },
    DataTransferService

  ],
})
export class commercialLineModule { }

