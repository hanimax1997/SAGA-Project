import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleguardService } from '../core/guards/roleguard.service';


//404
import { ErrorComponent } from './error/error.component';

import { PageNoExistComponent } from './page-no-exist/page-no-exist.component';

import { ProductCommercialLineComponent } from './product-commercial-line/product-commercial-line.component';
import { CreateProductCommercialLineComponent } from './product-commercial-line/create-product-commercial-line/create-product-commercial-line.component';
import { ConsultProductCommercialLineComponent } from './product-commercial-line/consult-product-commercial-line/consult-product-commercial-line.component';
import { CreateSiteComponent } from './product-commercial-line/create-site/create-site.component';
import { ProductionComponent } from './administration/get-data/production/components/production.component';
import { SinistreComponent } from './administration/get-data/sinistre/components/sinistre.component';



const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: '', loadChildren: () => import('./vie/vie.module').then((m) => m.VieModule) },
  //*************  devis module 
  { path: '', loadChildren: () => import('./gestion-devis/gestion-devis.module').then((m) => m.GestionDevisModule) },
  //*************  contrat module 
  { path: '', loadChildren: () => import('./gestion-contrat/gestion-contrat.module').then((m) => m.GestionContratModule) },
  //*************  sinistres module 
  { path: '', loadChildren: () => import('./gestion-sinistres/gestion-sinistres.module').then((m) => m.GestionSinistresModule) },
  //*************  avenants module 
  { path: '', loadChildren: () => import('./gestion-avenant/gestion-avenant.module').then((m) => m.GestionAvenantModule) },
  //*************  convention module 
  { path: '', loadChildren: () => import('./gestion-convention/gestion-convention.module').then((m) => m.GestionConventionModule) },
  //*************  reduction module 
  { path: '', loadChildren: () => import('./gestion-reduction/gestion-reduction.module').then((m) => m.GestionReductionModule) },
  //*************  administration module 
  { path: '', loadChildren: () => import('./administration/administration.module').then((m) => m.AdministrationModule) },
  //*************  reseaux commerciale module 
  { path: '', loadChildren: () => import('./reseau commercial/reseau-commercial.module').then((m) => m.ReseauCommercialModule) },

  //ProductCommercialLineComponent CreateProductCommercialLineComponent
  {
    path: 'gestion-commercial-line', component: ProductCommercialLineComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN","BO","BO_CL"] },
  },
  {
    path: 'gestion-commercial-line/creation-commercial-line', component: CreateProductCommercialLineComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN","BO","BO_CL"] },
  },
  {
    path: 'gestion-commercial-line/:idContrat', component: ConsultProductCommercialLineComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN","BO","BO_CL"] },
  },
  {
    path: 'gestion-commercial-line/create-site-police/:idContrat', component: CreateSiteComponent,
    canActivate: [RoleguardService], data: { roles: ["ROLE_SUPER_ADMIN","BO","BO_CL"] },
  },
  { path: 'production', component: ProductionComponent },
  { path:'sinistre',component:SinistreComponent},
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
