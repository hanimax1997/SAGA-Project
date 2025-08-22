import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Formules } from '../models/formules';
import{ Constants } from '../config/constants'; 
@Injectable({
  providedIn: 'root'
})
export class FormulesService {

  constructor(private http: HttpClient) {}

  getAllFormules():Observable<Formules[]> {
    return this.http.get<Formules[]>(`${Constants.API_ENDPOINT_Formule}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error,[]))
    );
  }

  addFormule(formule : Formules):Observable<Formules>{
    const httpOption = {
      headers : new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

   return this.http.post<Formules>(`${Constants.API_ENDPOINT_Formule}`,formule, httpOption).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=>this.handleEroor(error,error.error))
    )
  }
  getFormuleById(id: number): Observable<Formules>{
    return this.http.get<Formules>(`${Constants.API_ENDPOINT_Formule}/${id}`);
  }

  updateFormule(formuleEdited : Formules,id: number): Observable<null> {
    const httpOption = {
      headers : new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

   return this.http.put(`${Constants.API_ENDPOINT_Formule}/${id}`,formuleEdited, httpOption).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=>this.handleEroor(error,error.error))
    )
 }

  private logs(response: any) {
     
  }

  private handleEroor(error: Error, errorValue: any) {
    return of(errorValue);
  }
}
