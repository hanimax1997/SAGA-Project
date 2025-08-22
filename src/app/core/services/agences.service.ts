import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap,throwError } from 'rxjs';
import { agenceExemple } from '../../core/models/agence'
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class AgencesService {

  constructor(private http: HttpClient) { }
  createAgence(agence:any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any[]>(`${Constants.API_ENDPOINT_AGENCE}`, agence, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getAllAgenceDetails() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_DETAIL_AGENCE}`,httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getAllAgence() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GETALL_AGENCE}`,httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }

  uploadAgenceToSapBP(agences: any): Observable<Blob> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'blob' as 'json', // Type explicite pour indiquer une réponse Blob
    };
  
    return this.http.post<Blob>(`${Constants.API_ENDPOINT_AGENCE_SAP_BP}`, agences, httpOption);
  }
  uploadAgenceToSapCC(agences: any): Observable<Blob> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'blob' as 'json', // Type explicite pour indiquer une réponse Blob
    };
  
    return this.http.post<Blob>(`${Constants.API_ENDPOINT_AGENCE_SAP_CC}`, agences, httpOption);
  }
  uploadAgenceToSapCO(agences: any): Observable<Blob> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'blob' as 'json', // Type explicite pour indiquer une réponse Blob
    };
  
    return this.http.post<Blob>(`${Constants.API_ENDPOINT_AGENCE_SAP_CO}`, agences, httpOption);
  }


  editAgence(agence:any,idAgence:any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<any[]>(`${Constants.API_ENDPOINT_AGENCE}/${idAgence}`, agence, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  DesactAgence(idNewAgence:any,infoDesact:any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<any[]>(`${Constants.API_ENDPOINT_DESACTIVE_AGENCE}/${idNewAgence}`, infoDesact, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getAgenceById(idAgence: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_AGENCE}/${idAgence}`,httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
    // return agenceExemple
  }
  filterAgence(filters:any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any[]>(`${Constants.API_ENDPOINT_FILTRE_AGENCE}`, filters, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  private logs(response: any) {
    
  }
}
