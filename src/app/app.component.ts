import { Component, HostListener, OnInit } from '@angular/core';
import * as $ from 'jquery'
import { GenericService } from './core/services/generic.service'; $
import { Dictionnaire } from './core/config/dictionnaire';
import { ProductCodes } from './core/config/produits';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { AuthentificationService } from './core/services/authentification.service';
import { VersionCheckService } from './core/services/version-check.service';
import { User } from './core/models/user';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '(document:storage)': 'onStorageChange($event)'
  }
})
export class AppComponent implements OnInit {
  title = 'saga';
  isUserLoggedIn = false
  port = environment.portAgence
  user: User;
  constructor(private versionCheckService:VersionCheckService,private authentificationService: AuthentificationService, private genericService: GenericService, router: Router) {
    this.authentificationService.user.subscribe((x:any) => this.user = x);

  }
  ngOnInit() {
   //  this.versionCheckService.initVersionCheck(environment.versionCheckURL);
    // console.log("test 0.0.3")
 
    this.authentificationService.getLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        // Do something in app.component.ts after login
        this.genericService.getDictionnaire().subscribe(data => {
          Dictionnaire.dictionnaire = data
          sessionStorage.setItem("dictionnaire", JSON.stringify(data))
        })
        //populate produit 
        this.genericService.getAllProduit().subscribe(data => {
          ProductCodes.products = data
          sessionStorage.setItem("products", JSON.stringify(data))

        })
      }
    });


    // this.isUserLoggedIn=Boolean(sessionStorage.getItem('isUserIn'))
    // if(this.isUserLoggedIn){
    //   // populate dictionnaire 
    //   this.genericService.getDictionnaire().subscribe(data => {
    //     Dictionnaire.dictionnaire=data
    //     sessionStorage.setItem("dictionnaire",JSON.stringify(data))
    //   })
    //   //populate produit 
    //   this.genericService.getAllProduit().subscribe(data => {
    //     ProductCodes.products = data
    //     sessionStorage.setItem("products", JSON.stringify(data))

    //   })

    // }

  }

}
