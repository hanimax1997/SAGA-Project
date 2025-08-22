import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

//devis
import { GestionDevisComponent } from './gestion-devis.component';
import { ConsultDevisComponent } from './consult-devis/consult-devis.component';
import { CreationDevisComponent } from './creation-devis/creation-devis.component';
import { GestionDevisRoutingModule } from './gestion-devis-routing.module';
import { DialogRisqueComponent } from './dialog-risque/dialog-risque.component';
import { DialogRisquePackComponent } from './dialog-risque-pack/dialog-risque-pack.component';
import { ListRisqueDialogComponent } from './creation-devis/list-risque-dialog/list-risque-dialog.component';



@NgModule({
  declarations: [
    GestionDevisComponent,
    ConsultDevisComponent,
    CreationDevisComponent,
    DialogRisqueComponent,
    DialogRisquePackComponent,
    ListRisqueDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    GestionDevisRoutingModule,
    CoreModule
  ]
})
export class GestionDevisModule { }
