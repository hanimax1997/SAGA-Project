import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { GestionContratRoutingModule } from './gestion-contrat-routing.module';

import { CreationContratComponent } from './creation-contrat/creation-contrat.component';
import { GestionContratComponent } from './gestion-contrat.component';
import { SearchPersonneComponent } from './search-personne/search-personne.component';
import { SearchVehiculeComponent } from './search-vehicule/search-vehicule.component';
import { ConsultContratComponent } from './consult-contrat/consult-contrat.component';

@NgModule({
  declarations: [
    CreationContratComponent,
    GestionContratComponent,
    SearchPersonneComponent,
    SearchVehiculeComponent,
    ConsultContratComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    GestionContratRoutingModule,
    CoreModule
  ]
})
export class GestionContratModule { }
