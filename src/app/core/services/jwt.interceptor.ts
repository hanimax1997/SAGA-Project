import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Observable,
  Subscription,
  catchError,
  finalize,
  throwError,
} from 'rxjs';
import { SpinnerOverlayService } from './spinner-overlay.service';
// import { environment } from '../../environment';
import { AuthentificationService } from './authentification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private spinnerOverlayService: SpinnerOverlayService,
    private authentificationService: AuthentificationService,
    private _snackBar: MatSnackBar,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {

    const authToken = this.authentificationService.getToken();
    const user = this.authentificationService.userValue;
    const isLoggedIn = user && user.access_token;
    const spinnerSubscription: Subscription =
      this.spinnerOverlayService.spinner$.subscribe();
 
    if ((request.method == 'POST' || request.method == 'PUT') && isLoggedIn
    ) {

      if (request.headers.get('skip') == null)
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + user.access_token,
          },
          body: { ...request.body, auditUser: sessionStorage.getItem('userId') },
        });
      else {
        const newHeaders = request.headers.delete('skip');
        request = request.clone({
          headers: newHeaders,
          setHeaders: {
            Authorization: 'Bearer ' + user?.access_token,
          },
        });
      }
    } else {
      if(user?.access_token){
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + user?.access_token,
          },
        });
      }
    }
    return next.handle(request).pipe(
      finalize(() => spinnerSubscription.unsubscribe()),
      catchError(err => {
        if ([401, 403].includes(err.status) && this.authentificationService.userValue) {
          // auto logout if 401 or 403 response returned from API
          this.authentificationService.logout();

          this._snackBar.open("Session expirée.", 'fermer', {
            horizontalPosition: "end",
            panelClass: ['warning-snackbar'],
            duration: 10000,
          })

        }
        const error = (err && err.error && err.error.message) || err.statusText;
        console.error(err);
        return throwError(err);

      })
    );

    //   catchError((error: HttpErrorResponse) => {
    //     // let errorMsg = '';
    //     // if (error.error instanceof ErrorEvent) {
    //     //     console.log('this is client side error');
    //     //     errorMsg = `Error: ${error.error.message}`;
    //     // }
    //     // else {
    //     //     console.log('this is server side error');
    //     //     errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
    //     // }
    //     let errorReturn = error.error;

    //     if (errorReturn.code == 403 && errorReturn.erreur == 'Forbidden')
    //       return throwError(() => {
    //         this.authentificationService.logout();
    //       });
    //     else return errorReturn;
    //   })

  }
}
