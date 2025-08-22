import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSelectFilterModule } from 'mat-select-filter';

import { ReseauCommercialRoutingModule } from './reseau-commercial-routing.module';

import { GestionAgencesComponent } from './gestion-agences/gestion-agences.component';
import { CreateAgenceComponent } from './gestion-agences/create-agence/create-agence.component';
import { EditAgenceComponent } from './gestion-agences/edit-agence/edit-agence.component';
import { DeleteAgenceDialogComponent } from './gestion-agences/delete-agence-dialog/delete-agence-dialog.component';
import { GestionPersonnesComponent } from './gestion-personnes/gestion-personnes.component';
import { CreationPersonneComponent } from './gestion-personnes/creation-personne/creation-personne.component';
import { EditPersonneComponent } from './gestion-personnes/edit-personne/edit-personne.component';
import { UploadAgencesComponent } from './gestion-agences/upload-agence/upload-agences/upload-agences.component';
@NgModule({
  declarations: [
    GestionAgencesComponent,
    CreateAgenceComponent,
    EditAgenceComponent,
    DeleteAgenceDialogComponent,
    GestionPersonnesComponent,
    CreationPersonneComponent,
    EditPersonneComponent,
    UploadAgencesComponent
  ],
  imports: [
    CommonModule,
    ReseauCommercialRoutingModule,
    SharedModule,
    MaterialModule,
    CoreModule,
    MatSelectFilterModule
  ]
})
export class ReseauCommercialModule { }
