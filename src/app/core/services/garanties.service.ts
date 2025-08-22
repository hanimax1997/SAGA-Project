import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Garanties } from '../models/garanties';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class GarantiesService {

  constructor(private http: HttpClient) { }

  getAllGaranties(): Observable<Garanties[]> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.get<Garanties[]>(`${Constants.API_ENDPOINT_GARANTIES}`,httpOption).pipe(
    
      catchError((error) => this.handleError(error))
    );
    
  }

  // getAllGarantiesTest(){

  //   return ELEMENT_DATA
  // }
  // getCategoryById(id: number){
  //   return GARANTIES_CATEGORY_DATA
  //   // return this.http.get<any[]>(`${Constants.}`).pipe(
  //   //   tap((response) => this.logs(response)),
  //   //   catchError((error) => throwError(error.error))
  //   // );
  // }
  addGarantie(garantie: Garanties): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
   return this.http.post<any>(`${Constants.API_ENDPOINT_GARANTIES}`,garantie, httpOption).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> error)
   );
  }
  
  getGarantieById(id: number): Observable<Garanties> {
    return this.http.get<Garanties>(`${Constants.API_ENDPOINT_GARANTIES}/${id}`);
  }

  //Update Garantie 
  updateGarantie(id: number, garantieEdited: Garanties): Observable<Garanties> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Garanties>(`${Constants.API_ENDPOINT_GARANTIES}/${id}`, garantieEdited, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleError(error))
    )
  }

  private logs(response: any) {
     
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(err.error.message);
  }
}
