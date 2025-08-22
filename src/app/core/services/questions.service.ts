import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Questions } from '../models/questions';
import{ Constants } from '../config/constants'; 
@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }

  // getAllQuestions():Observable<Questions[]> {
  //   return this.http.get<Questions[]>(`${Constants.API_ENDPOINT_Questions}`).pipe(
  //     tap((response) => this.logs(response)),
  //     catchError((error) => this.handleEroor(error,[]))
  //   );
  // } /getByQuestionnaire/

  getQuestionsByQuestionnaire(idQuestionnaire:any):Observable<Questions[]> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.get<Questions[]>(`${Constants.API_ENDPOINT_Questionnaires}/${idQuestionnaire}/questions-by-questionnaire`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  
  addQuestion(questions : Questions,idQuestionnaire:string|null):Observable<Questions>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

   return this.http.post<Questions>(`${Constants.API_ENDPOINT_Questionnaires}/${idQuestionnaire}/question`,questions, httpOption).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> throwError(error.error))
    )
  }
  getQuestionById(id: number): Observable<Questions>{
    return this.http.get<Questions>(`${Constants.API_ENDPOINT_Questions}/${id}`).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> throwError(error.error))
    );
  }
  updateQuestion(questionEdited : Questions, id:number|undefined, idQuestionnaire: string|null): Observable<Questions> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.put<Questions>(`${Constants.API_ENDPOINT_Questionnaires}/${idQuestionnaire}/question/${id}`,questionEdited, httpOption).pipe(
        tap((response)=>this.logs(response)),
        catchError((error)=>throwError(error.error))
      )
  }

  private logs(response: any) {
     
  }

  private handleEroor(error: Error, errorValue: any) {
    return of(errorValue);
  }
}
