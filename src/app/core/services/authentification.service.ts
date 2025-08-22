import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Constants } from '../config/constants';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { NgZone } from '@angular/core';
const httpOption = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private userSubject: BehaviorSubject<User | null>;

  public user: Observable<User | null>;
  constructor(
    private router: Router,
    private http: HttpClient,
    private zone: NgZone
  ) {

    // this.userSubject = new BehaviorSubject<User | null>(
    //   JSON.parse(sessionStorage.getItem('access_token') || 'null')
    // );
    // this.user = this.userSubject.asObservable();
    this.userSubject = new BehaviorSubject<User | null>(null); // Initialize with null
    this.user = this.userSubject.asObservable();
  }
  public get userValue(): User | null {
    return this.userSubject.value;
  }
  authBody = {
    "username": "",
    "password": "",
  }
  public async loadUserFromStorage(): Promise<void> {

    return new Promise<void>((resolve) => {
      const storedToken = sessionStorage.getItem('access_token');
      console.log(storedToken)
      if (storedToken) {
        this.userSubject.next(JSON.parse(storedToken));
      }
        
      console.log(this.userValue)
      resolve();
    });
  }
  // login() {
  //   const httpOption = {
  //     headers: new HttpHeaders({

  //       'Access-Control-Allow-Origin': '*',

  //     })
  //   };
  //   return this.http.post<any>(`${Constants.API_ENDPOINT_AUTH}`, this.authBody, httpOption)
  //     .subscribe((res: any) => {
  //       localStorage.setItem('access_token', res.access_token);


  //       this.router.navigate(['']);
  //       this.startRefreshTokenTimer()

  //     },
  //       (err) => { sessionStorage.setItem('error_auth', "true") });
  // }
  private loggedIn = new BehaviorSubject<boolean>(false);

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }

  getLoggedIn() {
    return this.loggedIn.asObservable();
  }
  login() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',

        'skip': ''

      })
    };
    return this.http.post<any[]>(Constants.API_ENDPOINT_AUTH, this.authBody, httpOption)
      .pipe(map((user: any) => {

        sessionStorage.setItem('access_token', JSON.stringify(user));
        this.userSubject.next(user);

        this.startRefreshTokenTimer();
        return user;
      }));
  }

  // login() {
  //   const httpOption = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Origin': '*',

  //       'skip': ''

  //     })
  //   };
  //   return this.http.post<any[]>(`${Constants.API_ENDPOINT_AUTH}`, this.authBody, httpOption).pipe(
  //     tap((user: any) => {
  //       this.startRefreshTokenTimer();
  //       return user;
  //     }),
  //     catchError((error) => throwError(error))
  //   );
  // }
  getUserId(userEmail: any) {
    const httpOption = {
      headers: new HttpHeaders({

        'Access-Control-Allow-Origin': '*',

      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_GET_USERID}/${userEmail}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(this.refreshToken().subscribe()))
    )
  }
  getByUserId(userid: any) {
    const httpOption = {
      headers: new HttpHeaders({

        'Access-Control-Allow-Origin': '*',

      })
    };
    return this.http.get<any>(`${Constants.API_ENDPOINT_GET_BY_USERID}/${userid}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(this.refreshToken().subscribe()))
    )
  }

  refreshToken() {

    return this.http.get<any>(`${Constants.API_ENDPOINT_REFRESH_TOKEN}`)
      .pipe(map((user) => {
        console.log(user)
        sessionStorage.setItem('access_token', JSON.stringify(user));
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      },

      ));
  }
  getToken() {
    return sessionStorage.getItem('access_token');
  }
  // helper methods
  logout() {

    // this.http.post<any>(`${environment.apiUrl}/users/revoke-token`, {}, { withCredentials: true }).subscribe();
  
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    sessionStorage.removeItem('access_token');

    sessionStorage.removeItem('roles');
    this.router.navigate(['/login']);
    sessionStorage.removeItem('isUserIn')
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem("agence")
  }

  private refreshTokenTimeout: any

  public startRefreshTokenTimer() {

    let jwtSplit: string | null | undefined

    jwtSplit = this.userValue?.access_token?.split('.')[1];

    const jwtToken = JSON.parse(atob(jwtSplit!));
    this.getUserId(jwtToken.sub).subscribe(data => {
      sessionStorage.setItem("userId", JSON.stringify(data.userid))
      // sessionStorage.setItem("agence", JSON.stringify(data.agence[0]?.idAgence))
      // sessionStorage.setItem("test", JSON.stringify(data.agences))
      sessionStorage.setItem("agence", JSON.stringify(data.agences[0]?.idAgence))

    })
    sessionStorage.setItem('roles', JSON.stringify(jwtToken.roles))

    sessionStorage.setItem('userEmail', JSON.stringify(jwtToken.sub))

    const expires = new Date(jwtToken.exp * 1000);



    // const timeout = (expires.getTime() - Date.now()) - (8 * 60 * 1000);
    // console.log(timeout)
    // const timeout = (expires.getTime() - Date.now() - (62 * 60000));
    // this.refreshTokenTimeout = setTimeout(() => {
    //   this.refreshToken().subscribe();

    // }, timeout);

    const refreshThreshold = 8 * 60 * 1000; // 8 minutes
    const refreshInterval = 22 * 60 * 1000; // 22 minute

    const checkRefresh = () => {
        const timeLeft = expires.getTime() - Date.now();
        // console.log("timeLeft refreshThreshold ", timeLeft, refreshThreshold)
        if (timeLeft < refreshThreshold) {
            this.refreshToken().subscribe();
        } else {
            setTimeout(checkRefresh, refreshInterval);
        }
    };

    checkRefresh();
  }
  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  get isLoggedIn(): boolean {
    let authToken = sessionStorage.getItem('access_token');
    let user = authToken !== null ? true : false
    sessionStorage.setItem('isUserIn', String(user))
    return authToken !== null ? true : false;
  }




  changePass(bodyChange: any) {
    return this.http.post<any[]>(`${Constants.API_ENDPOINT_CHANGE_PASSWORD}`, bodyChange, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error))
    );
  }

  ForgetPass(email: any) {

    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_FORGET_PASSWORD}/${email}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  resetPass(body: any) {
    return this.http.post<any[]>(`${Constants.API_ENDPOINT_RESET_PASSWORD}`, body, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error))
    );
  }

}
