import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Constants } from '../config/constants';
import { Fractionnement } from '../models/fractionnement';

@Injectable({
  providedIn: 'root'
})
export class FractionnementService {

  constructor(private http: HttpClient) { }

  getAllFractionnement():Observable<Fractionnement[]> {
    return this.http.get<Fractionnement[]>(`${Constants.API_ENDPOINT_fractionnement}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error,error.error))
    );
  }


  private logs(response: any) {
     
  }

  private handleEroor(error: Error, errorValue: any) {
    return of(errorValue);
  }
}
