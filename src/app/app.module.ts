import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//modules
import { MaterialModule } from './material/material.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

//services
import { ScriptLoaderService } from './core/services/script-loader.service';
import { AuthService } from './core/services/auth.service';
//date
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
//interceptor 
import { JwtInterceptor } from './core/services/jwt.interceptor';
import { AuthguardService } from './core/guards/authguard.service';
import { RoleguardService } from './core/guards/roleguard.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from './core/date/MomentUtcDateAdapter';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CustomDateAdapter } from './shared/pipes/CustomDateAdapter';
import { NgChartsModule } from 'ng2-charts';
import { VersionCheckService } from './core/services/version-check.service';
import { AuthentificationService } from './core/services/authentification.service';

@NgModule({
  declarations: [
    AppComponent,
   

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    HttpClientModule,
    NgChartsModule,

  ],
  providers: [
    ScriptLoaderService,
    AuthService,
    DatePipe,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    AuthguardService,
    RoleguardService,
    VersionCheckService,
    AuthentificationService,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthentificationService) => () => authService.loadUserFromStorage(),
      deps: [AuthentificationService],
      multi: true
    }

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
 