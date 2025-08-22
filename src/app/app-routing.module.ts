import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';

import { FeaturesComponent } from './features/features.component';
import { AuthguardService } from './core/guards/authguard.service';
import { TestResvComponent } from './public/test-resv/test-resv.component';
import { CustomReuseStrategy } from './core/config/CustomReuseStrategy';
import { ResetPasswordComponent } from './public/login/reset-password/reset-password.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
  // { path: 'testt', component: TestResvComponent },

  { path: 'reset-password/:key', component: ResetPasswordComponent, pathMatch: 'full' },
  {
    path: 'maintenance', component: TestResvComponent, pathMatch: 'full'
  },


  {
    path: '',
    component: FeaturesComponent,
    canActivate: [AuthguardService],
    loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }


