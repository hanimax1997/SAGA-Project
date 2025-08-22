import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { FamilleProduit } from '../models/famille-produit';
import{ Constants } from '../config/constants'; 
import { catchError, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FamilleProduitService {


  constructor(private httpClient: HttpClient) { }

  getFamilleProduitsList(): Observable<FamilleProduit[]>{
    return this.httpClient.get<FamilleProduit[]>(`${Constants.API_ENDPOINT_FAMILLE_PRODUIT}`);
  }

  createFamilleProduit(familleProduit: FamilleProduit): Observable<Object>{
    return this.httpClient.post(`${Constants.API_ENDPOINT_FAMILLE_PRODUIT}`, familleProduit);
  }

  getFamilleProduitById(id: number): Observable<FamilleProduit>{
    return this.httpClient.get<FamilleProduit>(`${Constants.API_ENDPOINT_FAMILLE_PRODUIT}/${id}`);
  }

  updateFamilleProduit(id: number,familleProduit: FamilleProduit): Observable<Object>{
   
    return this.httpClient.put(`${Constants.API_ENDPOINT_FAMILLE_PRODUIT}/${id}`, familleProduit);
  }

  deleteFamilleProduit(id: number): Observable<Object>{
    return this.httpClient.delete(`${Constants.API_ENDPOINT_FAMILLE_PRODUIT}/${id}`);
  }
}
