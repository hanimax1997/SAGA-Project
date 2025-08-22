import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { dateFormatPipe } from './pipes/dateFormatPipe';
import { ObligatoireFormatPipe } from './pipes/obligatoireFormat.pipe';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { SousGarantieEmptyComponent } from './snack-bar/sous-garantie-empty/sous-garantie-empty.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { ConsultationStatutColorPipe } from './pipes/consultation-statut-color.pipe';
import { GarantieCategoriePipe } from './pipes/garantie-categorie.pipe';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { TwoDegit } from './pipes/twoDegit.pipe';




@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    dateFormatPipe,
    ConsultationStatutColorPipe,
    ObligatoireFormatPipe,
    SousGarantieEmptyComponent,
    GarantieCategoriePipe,
    SpinnerOverlayComponent,
    TwoDegit
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [ 
    SidebarComponent,
    NavbarComponent,
    MaterialModule,
    dateFormatPipe,
    ObligatoireFormatPipe,
    GarantieCategoriePipe,
    ConsultationStatutColorPipe,
    TwoDegit
  ],

  providers: [

  ],
})
export class SharedModule { }
