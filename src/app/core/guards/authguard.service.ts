import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';
@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthentificationService
) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;

    if (user) {
        // logged in so return true
        return true;
    } else {
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}



}