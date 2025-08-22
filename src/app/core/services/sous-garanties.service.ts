import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { SousGaranties } from '../models/sous-garanties';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class SousGarantiesService {

  constructor(private http: HttpClient) { }

  // getAllSousGaranties():Observable<SousGaranties[]> {
  //   return this.http.get<SousGaranties[]>(`${Constants.API_ENDPOINT_SOUSGARANTIES}`).pipe(
  //     tap((response) => this.logs(response)),
  //     catchError((error) => this.handleEroor(error,[]))
  //   );
  // } /getByGarantie/
  getSousGarantiesByGarantie(idGarantie: any): Observable<SousGaranties[]> {
    return this.http.get<SousGaranties[]>(`${Constants.API_ENDPOINT_SOUSGARANTIES}/getByGarantie/${idGarantie}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, []))
    );
  }
  // getCategoryById(id: number){
  //   return SOUSGARANTIES_CATEGORY_DATA
  //   // return this.http.get<any[]>(`${Constants.}`).pipe(
  //   //   tap((response) => this.logs(response)),
  //   //   catchError((error) => throwError(error.error))
  //   // );
  // }
  // getSousGarantiesByGarantieTest(idGarantie: any) {
  //   let data = ELEMENT_DATA.filter((obj: any) => {
  //     return obj.idGarantie == idGarantie
  //   });
  //   return data
  // }

  addSousGarantie(sousgaranties: SousGaranties, idGarantie: number): Observable<SousGaranties> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<SousGaranties>(`${Constants.API_ENDPOINT_SOUSGARANTIES}/${idGarantie}`, sousgaranties, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, null))
    )
  }
  getSousGarantieById(id: number): Observable<SousGaranties> {
    return this.http.get<SousGaranties>(`${Constants.API_ENDPOINT_SOUSGARANTIES}/${id}`);
  }
  updateSousGarantie(sousgarantieEdited: SousGaranties, id: number): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(`${Constants.API_ENDPOINT_SOUSGARANTIES}/${id}`, sousgarantieEdited, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, null))
    )
  }

  private logs(response: any) {
     
  }

  private handleEroor(error: Error, errorValue: any) {
    return of(errorValue);
  }
}
