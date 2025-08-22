import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './login/forget-password/forget-password.component';
import { ChangePasswordComponent } from './login/change-password/change-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

const routes: Routes = [{ path: '', component: LoginComponent },
{ path: 'forgot-password', component: ForgetPasswordComponent },
{ path: 'change-password', component: ChangePasswordComponent },
//{ path: 'reset-password/:key', component: ResetPasswordComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
