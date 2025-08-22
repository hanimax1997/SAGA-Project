import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthentificationService } from '../services/authentification.service';
@Injectable({
  providedIn: 'root'
})
export class RoleguardService {
  userRoles: any | null
  hasRole = false
  constructor(
    private router: Router,
    private authentificationService: AuthentificationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.userRoles = sessionStorage.getItem('roles')

    this.userRoles = JSON.parse(this.userRoles)

    if (this.userRoles != null)
      if (this.userRoles.length != 0) {
        for (const role of this.userRoles) {
          // if (role.name == route.data.role) {
          //   this.hasRole = true
          //   return true;
          // }

          for (const dataRole of route.data.roles) {
            if (role == dataRole) {
              this.hasRole = true
              return true;

            }
          }
          this.hasRole = false
         
        }
       
        if (!this.hasRole) {
          // Si l'utilisateur na pas les habilitations : redirection vers la page d'accueil
          this.router.navigate(['/dashboard']);
          return false;
        }
        return false;

      }

  }
}
