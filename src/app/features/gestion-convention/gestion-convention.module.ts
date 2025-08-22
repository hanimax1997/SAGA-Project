import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GestionConventionRoutingModule } from './gestion-convention-routing.module';
// convention
import { GestionConventionComponent } from './gestion-convention.component';
import { CreationConventionComponent } from './creation-convention/creation-convention.component';
import { DesactivationConventionDialogComponent } from './desactivation-convention-dialog/desactivation-convention-dialog.component';
import { EditConventionDialogComponent } from './edit-convention-dialog/edit-convention-dialog.component';
import { ConsultConventionComponent } from './consult-convention/consult-convention.component';

@NgModule({
  declarations: [
    GestionConventionComponent,
    CreationConventionComponent,
    DesactivationConventionDialogComponent,
    EditConventionDialogComponent,
    ConsultConventionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    GestionConventionRoutingModule,
    CoreModule 
  ]
})
export class GestionConventionModule { }
