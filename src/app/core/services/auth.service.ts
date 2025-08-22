import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Login } from '../login/login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //   constructor(private http: HttpClient, private router:Router) { }
  //   logins: Login[] | undefined;
  //   loginFind: Login | undefined;
  //   isUserIn:boolean=false
  //   getAllLogin():Observable<Login[]> {
  //     return this.http.get<Login[]>('api/logins').pipe(
  //       tap((response) => this.logs(response)),
  //       catchError((error) => this.handleEroor(error,[]))
  //     );
  //   }
  //   authLogin(username:string,password:string){
  //     this.getAllLogin().subscribe(loginList => this.logins = loginList)

  //     this.loginFind = this.logins?.find(login => login.username == username && login.password == password)
  //     sessionStorage.setItem('isUserIn',String(this.loginFind));
  //     if (this.loginFind) {

  //       this.isUserIn=true
  //       return this.isUserIn
  //     }
  //     else {
  //       console.error(`vous avez une erreur`)
  //       this.isUserIn=false
  //       return this.isUserIn
  //     }
  //   }
  //   isUserLoggedIn(){
  //     return  this.isUserIn
  //   }
  //   logOut(){

  //     sessionStorage.removeItem('isUserIn');
  //     window.location.href = "login";

  //   }
  //   private logs(response: any) {

  //   }

  //   private handleEroor(error: Error, errorValue: any) {
  //     console.error(error)
  //     return of(errorValue);
  //   }
}
