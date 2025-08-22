import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { MaterialModule } from '../material/material.module';
import { LoginComponent } from './login/login.component';
import { TestResvComponent } from './test-resv/test-resv.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './login/forget-password/forget-password.component';
import { ChangePasswordComponent } from './login/change-password/change-password.component';


@NgModule({
  declarations: [
    PublicComponent,
    LoginComponent,
    TestResvComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MaterialModule
  ]
})
export class PublicModule { }
