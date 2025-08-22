import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class PackService {

  constructor(private http: HttpClient) { }

  getPackById(idPack: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_PACK_DESC}/${idPack}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }

  getPackVoyage(body:any): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(`${Constants.API_ENDPOINT_GET_PACK_VOYAGE}`,body, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )

   
  }
  getDestinationFromPack(idPack: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_CONTROLE_DESTINATION}/${idPack}/destination`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getPackByProduit(idProduit: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_PACK_BY_PRODUIT}/${idProduit}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getPackByProduitParam(idProduit: any,param:any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'skip': ''
      })
    };

    return this.http.post<any>(`${Constants.API_ENDPOINT_PACK_BY_PRODUIT_PARAM}/${idProduit}`,param, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getAllPack(): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_GET_PACK}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getAllCategory(): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_CATEGORY}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getSousCategory(idCategory: any): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_SOUS_CATEGORY}/` + idCategory + `/souscategorie`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  // getTypeValeur(): Observable<any> {
  //   const httpOption = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   };

  //   return this.http.get<any>(`${Constants.API_ENDPOINT_TYPE_VALEUR}`, httpOption).pipe(
  //     tap((response) => this.logs(response)),
  //     catchError((error) => throwError(error.error))
  //   )
  // }
  addPack(pack: any): Observable<any> {

    const httpOption : any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    };
    
    return this.http.post<any>(`${Constants.API_ENDPOINT_PACK}`, pack, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  editPack(pack: any,idPack:any): Observable<any> {
    const httpOption  : any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    };

    return this.http.put<any>(`${Constants.API_ENDPOINT_PACK}/${idPack}`, pack, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }

  getPackAndCategories(idPack: any): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_PACK}/${idPack}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getGarantiePack(idPack: any): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_PACK}/${idPack}/garantie`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getGarantiePackCategories(idPack: any, idGarantie: any): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_PACK}/${idPack}/garantie/${idGarantie}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getSousGarantiePack(idPack: any, idGarantie: any): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_PACK}/${idPack}/garantie/sousgarantie/${idGarantie}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }
  getSousGarantiePackCategories(idPack: any, idGarantie: any, idSousGarantie: any): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_PACK}/${idPack}/garantie/sousgarantie/${idGarantie}/${idSousGarantie}`, httpOption).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    )
  }

  private logs(response: any) {
     
  }
}
