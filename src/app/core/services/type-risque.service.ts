import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { TYPERISQUE } from '../models/type-risque';
import{ Constants } from '../config/constants'; 
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeRisqueService {

  constructor(private httpClient: HttpClient) { }

  getTypeRisqueList(): Observable<TYPERISQUE[]>{
    return this.httpClient.get<TYPERISQUE[]>(`${Constants.API_ENDPOINT_TYPERISQUE}`);
  }

  createTypeRisque(typeRisque: TYPERISQUE): Observable<Object>{
    return this.httpClient.post(`${Constants.API_ENDPOINT_TYPERISQUE}`, typeRisque);
  }

  getTypeRisqueById(id: number): Observable<TYPERISQUE>{
    return this.httpClient.get<TYPERISQUE>(`${Constants.API_ENDPOINT_TYPERISQUE}/${id}`);
  }

  updateTypeRisque( typeRisque: TYPERISQUE,id: number): Observable<Object>{
  
    return this.httpClient.put(`${Constants.API_ENDPOINT_TYPERISQUE}/${id}`, typeRisque);
  }

  deleteTypeRisque(id: number): Observable<Object>{
    return this.httpClient.delete(`${Constants.API_ENDPOINT_TYPERISQUE}/${id}`);
  }

}
