import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Reponses } from '../models/reponses';
import{ Constants } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class ReponsesService {

  constructor(private http: HttpClient) { }

  // getAllReponses():Observable<Reponses[]> {
  //   return this.http.get<Reponses[]>(`${Constants.API_ENDPOINT_Reponses}`).pipe(
  //     tap((response) => this.logs(response)),
  //     catchError((error) => this.handleEroor(error,[]))
  //   );
  // } /getByQuestionnaire/
  getReponsesByQuestion(idQuestion:any):Observable<Reponses[]> {
    return this.http.get<Reponses[]>(`${Constants.API_ENDPOINT_Questions}/${idQuestion}/reponses`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  addReponse(reponses : any,idQuestion:number|undefined):Observable<Reponses>{
    const httpOption = {
      headers : new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

   return this.http.post<Reponses>(`${Constants.API_ENDPOINT_Questions}/${idQuestion}/reponse`,reponses, httpOption).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> throwError(error.error))
    )
  }
  getReponseById(id: number): Observable<Reponses>{
    return this.http.get<Reponses>(`${Constants.API_ENDPOINT_reponses}/${id}`).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> throwError(error.error))
    );
  }
  updateReponse(reponseEdited : Reponses,idQuestion:number|undefined, id:number|undefined): Observable<Reponses> {
      const httpOption = {
        headers : new HttpHeaders({
          'Content-Type':'application/json'
        })
      };

    return this.http.put<Reponses>(`${Constants.API_ENDPOINT_Questions}/${idQuestion}/reponse/${id}`,reponseEdited, httpOption).pipe(
        tap((response)=>this.logs(response)),
        catchError((error)=> throwError(error.error))
      )
  }

  private logs(response: any) {
     
  }

  private handleEroor(error: Error, errorValue: any) {
    return of(errorValue);
  }
}
