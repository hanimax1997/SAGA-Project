import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { ParamRisque } from '../models/param-risque';
import { Constants } from '../config/constants';
import { Dictionnaire } from '../models/dictionnaire';
@Injectable({
  providedIn: 'root'
})
export class ParamRisqueService {

  constructor(private http: HttpClient) { }

  getAllParamRisque(): Observable<ParamRisque[]> {
    return this.http.get<ParamRisque[]>(`${Constants.API_ENDPOINT_param_risque}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
    );
  }

  // getDictionnaire(): Observable<Dictionnaire[]> {
  //   return this.http.get<Dictionnaire[]>(`${Constants.API_ENDPOINT_dictionnaire}`);
  // }
  getParamRisqueList(): Observable<ParamRisque[]> {
    return this.http.get<ParamRisque[]>(`${Constants.API_ENDPOINT_param_risque_list}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
    );
  }

  getListParamRisque(idList: any): Observable<ParamRisque[]> {
    return this.http.get<ParamRisque[]>(`${Constants.API_ENDPOINT_details_param_risque_list}/${idList}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
    );
  }
  getParamRisqueById(id: number): Observable<ParamRisque> {
    return this.http.get<ParamRisque>(`${Constants.API_ENDPOINT_param_risque}/${id}`);
  }

  getParamRisqueByTypeRisque(idTypeRisque: number): Observable<ParamRisque[]> {
    return this.http.get<ParamRisque[]>(`${Constants.API_ENDPOINT_param_risque}/byTypeRisque/${idTypeRisque}`);
  }


  addParamRisque(paramRisque: any): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(`${Constants.API_ENDPOINT_param_risque}`, paramRisque, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
    )
  }

  updateParamRisque(paramRisqueEdited: ParamRisque, idParamRisque: number): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(`${Constants.API_ENDPOINT_param_risque}/${idParamRisque}`, paramRisqueEdited, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }

  desableParamRisque(idParamRisque: number, dateFin: Date): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(`${Constants.API_ENDPOINT_param_risque}/desactiver/${idParamRisque}/${dateFin}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
    )
  }
  getParamByProduit(idProduit: number): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(`${Constants.API_ENDPOINT_param_risque_all}/${idProduit}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, null))
    )
  }
  getWorkFlowByProduit(idProduit: number, idTypeWorkFlow: number): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(`${Constants.API_ENDPOINT_param_risque_devis_workflow}/${idProduit}/${idTypeWorkFlow}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, null))
    )
  }
  getParamRelation(idParam: number, idReponse: number): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(`${Constants.API_ENDPOINT_param_risque_relation}/${idParam}/${idReponse}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => this.handleEroor(error, null))
    )
  }
  getTableParamParent(idParamRisque: number): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(`${Constants.API_ENDPOINT_param_risque_TABLE_PARENT}/${idParamRisque}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => this.handleEroor(error, null))
    )
  }
  getActiviteProfessionnel(): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(`${Constants.API_ENDPOINT_param_risque_activite_professionnel}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => this.handleEroor(error, null))
    )
  }
  getTableParamChild(idParamRisque: number, parentId: any): Observable<null> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(`${Constants.API_ENDPOINT_param_risque_TABLE_PARENT}/${idParamRisque}/${parentId}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => this.handleEroor(error, null))
    )
  }
  private logs(response: any) {

  }


  private handleEroor(error: Error, errorValue: any) {
    return of(errorValue);
  }
}
