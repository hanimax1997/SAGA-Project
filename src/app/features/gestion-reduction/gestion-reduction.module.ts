import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GestionReductionRoutingModule } from './gestion-reduction-routing.module';


// reduction 
import { GestionReductionComponent } from '../gestion-reduction/gestion-reduction.component';
import { CreationReductionComponent } from '../gestion-reduction/creation-reduction/creation-reduction.component';
import { DesactivationReductionDialogComponent } from '../gestion-reduction/desactivation-reduction-dialog/desactivation-reduction-dialog.component';
import { ConsultReductionComponent } from './consult-reduction/consult-reduction.component';
import { ModifReductionComponent } from './modif-reduction/modification-reduction.component';



@NgModule({
  declarations: [
    DesactivationReductionDialogComponent,
    CreationReductionComponent,
    GestionReductionComponent,
    ConsultReductionComponent,
    ModifReductionComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    GestionReductionRoutingModule ,
    CoreModule
  ]
})
export class GestionReductionModule { }
