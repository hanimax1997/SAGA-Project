import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; import { Constants } from '../config/constants';
import { Profession } from '../models/profession';
import { SecteurActivite } from '../models/secteur-activite';
import { ProductCodes } from '../config/produits';
import { AuthentificationService } from './authentification.service';
@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(private http: HttpClient) { }
  getAllUsers() {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GENERIC_ALL_USERS}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  //get pays
  getPays() {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GENERIC_PAYS}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  //get wilaya
  getAllWilayas(idPays: any) {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GENERIC_WILAYA}/${idPays}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }

  //get commune by  wilaya
  getAllCommuneByWilaya(numWilaya: any) {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GENERIC_COMMUNE}/${numWilaya}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }

  getWilayaById(numWilaya: any) {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_wilaya}/${numWilaya}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }

  getCommuneById(numCommune: any) {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_communes}/${numCommune}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }

  
  //get code by commune
  getAllCodeByCommune(numCommune: any) {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_communes}/${numCommune}/code-postal-by-commune`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  //get all zones
  getAllZones() {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GENERIC_ZONE}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  //get all contacts
  getAllContacts() {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GENERIC_CONTACT}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  //get codes postal
  getCodesPostal(numWilaya: any) {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GENERIC_CODES_POSTAL}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  //get reseau de distribution
  getReseauDistribution() {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_RESEAUDISTRIBUTION}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  //get devis
  getDevis() {
    return this.http.get<any[]>(`http://10.132.53.130:9094/api/devis/70`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }

  getParam(id: any): Observable<any> {
    return this.http.get<any>(`${Constants.API_ENDPOINT_dictionnaire}/${id}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getParamMrp(id: any, codeProduit: any): Observable<any> {
    return this.http.get<any>(`${Constants.API_ENDPOINT_dictionnaire}/getbyLien/${id}/${codeProduit}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getCause(id: any, codeProduit: any): Observable<any> {
    return this.http.get<any>(`${Constants.API_ENDPOINT_dictionnaire}/${id}/${codeProduit}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getDictionnaire(): Observable<any> {

    return this.http.get<any>(`${Constants.API_ENDPOINT_PARAMETRE}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getAllProduit(): Observable<any> {

    return this.http.get<any>(`${Constants.API_ENDPOINT_PRODUIT_CODE}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getPorduitById(idProduit:any): Observable<any> {

    return this.http.get<any>(`${Constants.API_ENDPOINT_PRODUIT_BY_ID}/${idProduit}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  addIconToProducts() {
    ProductCodes.products.forEach((produit: any) => {
      ProductCodes.productsIcon.forEach((icon: any) => {
          if(produit.codeProduit==icon.codeProduit){
            Object.assign(produit, { iconProduit: icon.icon });
          }
      })
    })
  }
  getProfession(): Observable<Profession> {
    return this.http.get<Profession>(`${Constants.API_ENDPOINT_profesion}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }

  getSecteur(): Observable<SecteurActivite> {
    return this.http.get<SecteurActivite>(`${Constants.API_ENDPOINT_secteur}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  getAllGenericTables() {
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_GET_ALL_TABLES}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => throwError(error.error))
    );
  }
  // getAllStatus(): Observable<any> {
  //   return this.http.get<any>(`${Constants.API_ENDPOINT_GENERIC_All_Status}`).pipe(
  //       tap((response) => this.logs(response)),
  //       catchError((error) => throwError(error.error))
  //     );
  // }
  //get categorie risque
  // getCategorieRisque() {
  //   return this.http.get<any[]>(`${Constants.API_ENDPOINT_GENERIC_CATEGORIE_RISQUE}`).pipe(
  //     tap((response) => this.logs(response)),
  //     catchError((error) => throwError(error.error))
  //   );
  // }

  private logs(response: any) {
  }


}
