import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Questionnaires } from '../models/questionnaires';
import{ Constants } from '../config/constants'; 

@Injectable({
  providedIn: 'root'
})
export class QuestionnairesService {

  constructor(private http: HttpClient) { }

  getAllQuestionnaires():Observable<Questionnaires[]> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.get<Questionnaires[]>(`${Constants.API_ENDPOINT_Questionnaires}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }

  addQuestionnaire(questionnaire : Questionnaires):Observable<Questionnaires>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

   return this.http.post<Questionnaires>(`${Constants.API_ENDPOINT_Questionnaires}/complet`,questionnaire, httpOption).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> throwError(error.error))
    )
  }
  getQuestionnaireById(id: string|null): Observable<Questionnaires>{
    return this.http.get<Questionnaires>(`${Constants.API_ENDPOINT_Questionnaires}/${id}`).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> throwError(error.error))
    );
  }
  updateQuestionnaire(id:number,questionnaireEdited : Questionnaires): Observable<Questionnaires> {
    const httpOption = {
      headers : new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

   return this.http.put<Questionnaires>(`${Constants.API_ENDPOINT_Questionnaires}/${id}`,questionnaireEdited, httpOption).pipe(
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
