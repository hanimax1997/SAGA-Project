import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { moneyPipe } from '../core/pipes/moneyPipe';

import { VersionCheckService } from './services/version-check.service';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    moneyPipe

  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    moneyPipe
  ], providers: [
    VersionCheckService,
  ]
})
export class CoreModule { }
