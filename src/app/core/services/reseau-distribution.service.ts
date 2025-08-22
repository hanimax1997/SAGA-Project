import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { ReseauDistribution } from '../models/reseau-distribution';
import{ Constants } from '../config/constants'; 
@Injectable({
  providedIn: 'root'
})
export class ReseauDistributionService {

  constructor(private http: HttpClient) {}

  getAllReseauDistribution():Observable<ReseauDistribution[]> {
    return this.http.get<ReseauDistribution[]>(`${Constants.API_ENDPOINT_RESEAUDISTRIBUTION}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error,error.error))
    );
  }

  addReseauDistribution(reseauDistribution : ReseauDistribution):Observable<ReseauDistribution>{
    const httpOption = {
      headers : new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

   return this.http.post<ReseauDistribution>(`${Constants.API_ENDPOINT_RESEAUDISTRIBUTION}`,reseauDistribution, httpOption).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=>this.handleEroor(error,error.error))
    )
  }
  getReseauDistributionById(id: number): Observable<ReseauDistribution>{
    return this.http.get<ReseauDistribution>(`${Constants.API_ENDPOINT_RESEAUDISTRIBUTION}/${id}`);
  }

  updateReseauDistribution(reseauDistributionEdited : ReseauDistribution,id: number): Observable<null> {
    const httpOption = {
      headers : new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

   return this.http.put(`${Constants.API_ENDPOINT_RESEAUDISTRIBUTION}/${id}`,reseauDistributionEdited, httpOption).pipe(
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
