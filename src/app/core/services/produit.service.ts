import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Produit } from '../models/produit';
import{ Constants } from '../config/constants'; 

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private http: HttpClient) { }

  getAllProduits():Observable<Produit[]> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.get<Produit[]>(`${Constants.API_ENDPOINT_produit}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error,error.error))
    );
  }

  getProduitById(id: string|null): Observable<Produit>{
    return this.http.get<Produit>(`${Constants.API_ENDPOINT_produit}/${id}`).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> this.handleEroor(error,error.error))
    );
  }

  updateProduit(id:number,produitEdited : Produit): Observable<Produit> {
    const httpOption = {
      headers : new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

   return this.http.put<Produit>(`${Constants.API_ENDPOINT_produit}/${id}`,produitEdited, httpOption).pipe(
      tap((response)=>this.logs(response)),
      catchError((error)=> this.handleEroor(error,error.error))
    )
 }  


 addProduit(produit : any):Observable<any>{
  const httpOption = {
    headers : new HttpHeaders({
      'Content-Type':'application/json'
    })
  };

 return this.http.post<any>(`${Constants.API_ENDPOINT_produit}`,produit, httpOption).pipe(
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
