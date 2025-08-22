import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Taxe } from '../models/taxe';
import{ Constants } from '../config/constants'; 
import { catchError, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaxeService {

  constructor(private httpClient: HttpClient) { }

  getTaxesList(): Observable<Taxe[]>{
    return this.httpClient.get<Taxe[]>(`${Constants.API_ENDPOINT_TAXE}`);
  }

  createTaxe(taxe: Taxe): Observable<Object>{
    return this.httpClient.post(`${Constants.API_ENDPOINT_TAXE}`, taxe);
  }

  getTaxeById(id: number): Observable<Taxe>{
    return this.httpClient.get<Taxe>(`${Constants.API_ENDPOINT_TAXE}/${id}`);
  }

  updateTaxe( taxe: Taxe,id: number): Observable<Object>{
    return this.httpClient.put(`${Constants.API_ENDPOINT_TAXE}/${id}`, taxe);
  }

  deleteTaxe(id: number): Observable<Object>{
    return this.httpClient.delete(`${Constants.API_ENDPOINT_TAXE}/${id}`);
  }

}



