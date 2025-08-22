import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Constants } from '../config/constants';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { AuthentificationService } from './authentification.service';
import { GenericService } from './generic.service';
import { Dictionnaire } from '../models/dictionnaire';
const httpOption: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }),
};
@Injectable({
  providedIn: 'root',
})


export class SinistresService {

  wilayas: any;
  Commune: any;

  constructor(private http: HttpClient, private authentificationService: AuthentificationService, private genericService: GenericService) { }
  addSinistre(bodySinistre: any) {


    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE}`,
        bodySinistre,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getAllSinistres(codeProduit: any,size:any,index:any) {


    return this.http
      .get<any>(`${Constants.API_ENDPOINT_TEST_SINISTRE}/${codeProduit}?pageNumber=${index}&pageSize=${size}`, httpOption)
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getSinistreByCode(code: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_BY_CODE}/${code}`,
        httpOption
      )
      .pipe(
        tap((response) => this.fillInfo(response)),
        catchError((error) => throwError(error.error))
      );
  }
  fillInfo(infoSinistre: any) {
    this.genericService.getWilayaById(infoSinistre?.contratHistorique?.risqueList?.find((risque: any) => risque?.paramRisque?.codeParam == "P246" || risque?.paramRisque?.codeParam == "P125")?.valeur ?? 1).subscribe({
      next: (data: any) => {
        this.wilayas = data;

        this.genericService.getCommuneById(infoSinistre?.contratHistorique?.risqueList?.find((risque: any) => risque?.paramRisque?.codeParam == "P246" || risque?.paramRisque?.codeParam == "P125")?.valeur ?? 1).subscribe({
          next: (data: any) => {
            this.Commune = data;

            let bodyInfo = {
              codeSinistre:infoSinistre?.codeSinistre,
              idContrat:infoSinistre.contratHistorique?.idContrat?.idContrat,
              dateSurvenance:infoSinistre?.dateSurvenance,
              immatriculation:infoSinistre?.contratHistorique?.risqueList?.find((risque: any) => risque?.paramRisque?.codeParam == "P38" && risque?.risque == infoSinistre?.codeRisque)?.valeur,
              adresse:infoSinistre?.contratHistorique?.risqueList?.find((risque: any) => risque?.paramRisque?.codeParam == "P245" || risque?.paramRisque?.codeParam == "P106" || risque?.paramRisque?.codeParam == "P141")?.valeur,
              wilaya:this.wilayas?.description,
              commune:this.Commune?.description,
              codeRisque:infoSinistre?.codeRisque,
              nomAssure:  infoSinistre?.contratHistorique?.contratPersonneRoleList?.find((personne: any) => personne?.role?.code == "CP235" || personne?.role?.code == "CP236" || personne?.role?.code == "CP238" || personne?.role?.code == "CP240")?.personne?.nom      ,
              prenomAssure:  infoSinistre?.contratHistorique?.contratPersonneRoleList?.find((personne: any) => personne?.role?.code == "CP235" || personne?.role?.code == "CP236" || personne?.role?.code == "CP238" || personne?.role?.code == "CP240")?.personne?.prenom1      ,
              raisonSocial:  infoSinistre?.contratHistorique?.contratPersonneRoleList?.find((personne: any) => personne?.role?.code == "CP235" || personne?.role?.code == "CP236" || personne?.role?.code == "CP238" || personne?.role?.code == "CP240")?.personne?.raisonSocial      ,
            }
            sessionStorage.setItem("infoSinistre",JSON.stringify(bodyInfo))


          },
          error: (error) => {
            console.log(error);
          }
        });

      },
      error: (error) => {
        console.log(error);
      }
    });



  }

  getDictionnaire(id: any): Observable<Dictionnaire[]> {
    return this.http.get<Dictionnaire[]>(`${Constants.API_ENDPOINT_dictionnaire}/${id}`);
  }

  getParam(id: any){
    return this.http.get<any>(`${Constants.API_ENDPOINT_dictionnaire}/${id}`)
    .pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    );
  }

  getParams(id: any): Observable<any> {
    return this.http.get<any>(`${Constants.API_ENDPOINT_dictionnaire}/${id}`).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    );
  }


  getSinistreByID(id: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_BY_ID}/${id}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  // filterSinistre(bodyFilter: any) {


  //   return this.http
  //     .post<any>(
  //       `${Constants.API_ENDPOINT_TEST_SINISTRE_FILTER}`,
  //       bodyFilter,
  //       httpOption
  //     )
  //     .pipe(
  //       tap((response) => response),
  //       catchError((error) => throwError(error.error))
  //     );
  // }

  filterSinistre(bodyFilter: any,index:number,size:number) {

    //done
        return this.http
          .post<any>(
            `${Constants.API_ENDPOINT_TEST_SINISTRE_FILTER}?pageNumber=${index}&pageSize=${size}`,
            bodyFilter,
            httpOption
          )
          .pipe(
            tap((response) => response),
            catchError((error) => throwError(error.error))
          );
      }
    
  getPolicyInformations(bodyGetInfoPolice: any) {


    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_CONTRAT_HISTO}`,
        bodyGetInfoPolice,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
    getPolicyInformationsByRisque(bodyGetInfoPolice: any, idHistorique: any) {


    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_CONTRAT_HISTO_RISQUE}/${idHistorique}`,
        bodyGetInfoPolice,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getIfExisteDoublon(bodyDoublons: any) {

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_DOUBLONS}`,
        bodyDoublons,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getIfExisteDoublonWithZone(bodyDoublons: any) {

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_DOUBLONS_ZONE}`,
        bodyDoublons,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getByLien(type: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_GET_BY_LIEN}/${type}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  // getZonesByCause(causeSinistre: any) {
  //   const httpOption: any = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     }),
  //   };

  //   return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_GET_BY_LIEN}/${causeSinistre}`, httpOption).pipe(
  //     tap((response) => response),
  //     catchError((error) => throwError(error.error))
  //   )
  // }
  getNatureSinistre(bodyNature: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_NATURE}`,
        bodyNature,
        httpOptions
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  //********************Modification  */
  // getTypeByFraude(type: any) {
  //   const httpOption: any = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     }),
  //   };

  //   return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_GET_BY_LIEN}/${type}`, httpOption).pipe(
  //     tap((response) => response),
  //     catchError((error) => throwError(error.error))
  //   )
  // }
  updateInfosSinistre(bodyUpdate: any, code: any, codeProduit: any) {


    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_UPDATE_INFOS}/${code}/codeProduit/${codeProduit}`,
        bodyUpdate,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  updateInfosPersonne(bodyUpdate: any, idPersonne: any) {

    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_UPDATE_PERSONNE}/${idPersonne}`,
        bodyUpdate,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  addPersonne(bodyUpdate: any, idSinistre: any) {

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_ADD_PERSONNE}/${idSinistre}`,
        bodyUpdate,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  desistementSinistre(idSinistre: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };

    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_DESISTER_SINISTRE}/${idSinistre}`,
        null,
        httpOptions
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  AddFraude(body: any, idSinistre: any) {

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_FRAUDE}/${idSinistre}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  updateFraude(body: any, idFraude: any) {


    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_UPDATE_FRAUDE}/${idFraude}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  editAssisteur(body: any, idAssistance: any) {


    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_EDIT_ASSISTEUR}/${idAssistance}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  addAssisteur(body: any, idSinistre: any) {


    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_ADD_ASSISTEUR}/${idSinistre}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  annulerSinistre(idSinistre: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };

    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_CANCEL}/${idSinistre}`,
        null,
        httpOptions
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  reouvrirSinistre(idSinistre: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };

    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_REOPEN}/${idSinistre}`,
        null,
        httpOptions
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  cloturerSinistre(idSinistre: any, body: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };
    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_CLOTURER}/${idSinistre}`,
        body,
        httpOptions
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getInfoModifSinistre(codeSinistre: any) {


    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_GET_INFOMODIF}/${codeSinistre}`,
        null,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getInfosModif(code: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_GET_INFOMODIF}/${code}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  //********************** Gestionnaire  *********************/
  //get reserve de paiement
  getReserveByCodeSinistre(codeSinistre: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_GET_RESERVE_PAIEMENT}/${codeSinistre}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getReserveById(idReserve: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_GET_RESERVE_BYID}/${idReserve}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getReserveNames(codeReserve: any, codeGarantie: any) {

    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_GET_RESERVE_BYID}/${codeGarantie}/${codeReserve}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getRecoursTab(codeSinistre: any, codeRecouvrement: string) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_GET_RESERVE_RECOURS_TAB}/${codeSinistre}/${codeRecouvrement}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }

  createRecours(body: any,codeProduit: any) {



    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_RECOURS_CREATE}/${codeProduit}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }

  getModifierReserveByCodeGarantieAndCodeReserve(codeSinistre: any, modifierReserveBody: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };
    return this.http.put<any>(`${Constants.API_ENDPOINT_TEST_SINISTRE_MODIFIER_RESERVE}/${codeSinistre}`,modifierReserveBody, httpOptions).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )

  }

  transferRecour(idSinistre:any){
    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_RECOUR_SINISTRE}/${idSinistre}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }


  getInfoRecours(codeRecouvrement: any, codeReserve: any, codeSinistre: any,codeProduit: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_GET_RECOURS}/${codeRecouvrement}/${codeReserve}/${codeSinistre}/${codeProduit}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  updateRecours(body: any) {


    return this.http
      .put<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_RECOURS_UPDATE}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  addBenef(body: any) {


    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_RECOURS_ADDBENEF}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getAllBenefByOR(idReglement: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_RECOURS_ALLBENEF}/${idReglement}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  addOR(body: any) {


    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_CREATE_OR}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getAllOrByIdRecours(idRecours: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_CREATE_OR}/${idRecours}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }

  //********************** Add OP  *********************/
  addOp(code: any, codeReserve: any, codeGarantie: any, body: any) {

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_CREATE_OP}/${code}/${codeGarantie}/${codeReserve}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
 
  getListExpert(code: any) {
    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_LIST_EXPERT}/${code}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  
  getOpBySinistre(code: any) {
    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_OP_BY_SINISTRE}/${code}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  getTiers(code: any) {
    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_OP_LIST_TIERS}/${code}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  getBlesses(code: any) {
    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_OP_LIST_BLESSE}/${code}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  filterOp(bodyFilter: any, code:any) {
    return this.http.post<any>(`${Constants.API_ENDPOINT_TEST_OP_FILTER}/${code}`, bodyFilter, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  getOpById(idOp: any) {

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_OP_BY_ID}/${idOp}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )

  }
  approuvOp(idOp: any, auditUser:any, statut:any) {

    return this.http.put<any>(`${Constants.API_ENDPOINT_TEST_OP_APPROUVE}/${idOp}/${auditUser}/${statut}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )

  }
  annulationOp(idOp: any, auditUser: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };
    return this.http.put<any>(`${Constants.API_ENDPOINT_TEST_OP_ANNULATION}/${idOp}/${auditUser}`, httpOptions).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  annulationReserve(idreserve: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };
    return this.http.put<any>(`${Constants.API_ENDPOINT_TEST_SINISTRE_CANCEL_RESERVE}/${idreserve}`,null, httpOptions).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }

  //********************** Output  *********************/
  outputClassement(sinistre: any, body: any) {
    let contrat = sinistre?.contratHistorique;
    let assure = contrat?.contratPersonneRoleList?.find(
      (p: any) =>
        p?.role?.idParam == 235 ||
        p?.role?.idParam == 236 ||
        p?.role?.idParam == 238 ||
        p?.role?.idParam == 280
    )?.personne;

    const docDefinitionClassement: any = {
      watermark: { text: '', color: 'blue', opacity: 0.1 },
      pageMargins: [45, 90, 45, 60],
      border: [false, false, false, false],
      content: [
        {
          layout: 'noBorders',
          style: 'table',
          table: {
            widths: ['*', '*'],
            alignment: 'center',
            body: [
              [
                {
                  text: [
                    {
                      text: `Police d'assurance N° : `,
                      bold: true,
                      fontSize: '12',
                    },
                    { text: contrat?.idContrat?.idContrat, fontSize: '12' },
                  ],
                  alignment: 'left',
                },
                {
                  text: [
                    { text: `Assuré(e) : `, bold: true, fontSize: '12' },
                    {
                      text:
                        assure?.raisonSocial != undefined
                          ? assure?.raisonSocial
                          : assure?.nom + ' ' + assure?.prenom1,
                      fontSize: '12',
                    },
                  ],
                  alignment: 'left',
                },
              ],
              [
                {
                  text: [
                    {
                      text: `Dossier sinistre N° : `,
                      bold: true,
                      fontSize: '12',
                    },
                    { text: sinistre?.codeSinistre, fontSize: '12' },
                  ],
                  alignment: 'left',
                },
                {
                  text: [
                    {
                      text: `Adresse assuré(e) : `,
                      bold: true,
                      fontSize: '12',
                    },
                    {
                      text: assure?.adressesList[
                        assure?.adressesList.length - 1
                      ]?.description,
                      fontSize: '12',
                    },
                  ],
                  alignment: 'left',
                },
              ],
              [
                {
                  text: [
                    { text: `Date sinistre : `, bold: true, fontSize: '12' },
                    {
                      text: sinistre?.dateSurvenance?.split('T')[0],
                      fontSize: '12',
                    },
                  ],
                  alignment: 'left',
                },
                {},
              ],
            ],
          },
        },
        {
          text: `Madame, Monsieur,
          \nAu titre de l'affaire sus visée, et des suites de l'étude de votre dossier de demande d'indemnisation, nous avons le regret de porter à votre connaissance le classement sans suite de votre dossier.
          \nLa présente décision est motivée du fait :`,
          fontSize: 12,
          color: 'black',
        },
        body?.sousMotif?.code != "CP535" ?
          {
            style: 'table',
            table: {
              widths: [10, '*'],
              alignment: 'center',
              body: [
                [
                  {
                    text: [
                      { text: body?.sousMotif?.code == "CP527" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center',
                  },
                  {
                    text: [
                      {
                        text: `•  Absence de garantie(s).`,
                        bold: true,
                        fontSize: '12',
                      },
                    ],
                    alignment: 'left',
                  },
                ],
                [
                  {
                    text: [
                      { text: body?.sousMotif?.code == "CP528" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center',
                  },
                  {
                    text: [
                      {
                        text: `•  Sinistre n'entrant pas dans le cadre de la garantie.`,
                        bold: true,
                        fontSize: '12',
                      },
                    ],
                    alignment: 'left',
                  },
                ],
                [
                  {
                    text: [
                      { text: body?.sousMotif?.code == "CP529" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center',
                  },
                  {
                    text: [
                      {
                        text: `•  Inexistence de dommage en rapport avec le sinistre.`,
                        bold: true,
                        fontSize: '12',
                      },
                    ],
                    alignment: 'left',
                  },
                ],
                [
                  {
                    text: [
                      { text: body?.sousMotif?.code == "CP530" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center',
                  },
                  {
                    text: [
                      {
                        text: `•  Montant des dommages inférieur à la franchise.`,
                        bold: true,
                        fontSize: '12',
                      },
                    ],
                    alignment: 'left',
                  },
                ],
                [
                  {
                    text: [
                      { text: body?.sousMotif?.code == "CP531" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center',
                  },
                  {
                    text: [
                      {
                        text: `•  Exclusion \ Déchéance.`,
                        bold: true,
                        fontSize: '12',
                      },
                    ],
                    alignment: 'left',
                  },
                ],
                [
                  {
                    text: [
                      { text: body?.sousMotif?.code == "CP532" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center',
                  },
                  {
                    text: [
                      {
                        text: `•  Documents non présentés par le client.`,
                        bold: true,
                        fontSize: '12',
                      },
                    ],
                    alignment: 'left',
                  },
                ],
                [
                  {
                    text: [
                      { text: body?.sousMotif?.code == "CP533" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center',
                  },
                  {
                    text: [
                      {
                        text: `•  Dommages antérieurs.`,
                        bold: true,
                        fontSize: '12',
                      },
                    ],
                    alignment: 'left',
                  },
                ],
                [
                  {
                    text: [
                      { text: body?.sousMotif?.code == "CP534" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center',
                  },
                  {
                    text: [
                      { text: `•  Fraude avérée.`, bold: true, fontSize: '12' },
                    ],
                    alignment: 'left',
                  },
                ],
              ],
            },
          } : {},
        {
          margin: [0, 0, 0, 20],
          text: `Motif :`,
          fontSize: 12,
          color: 'black',
        },
        {
          table: {
            widths: ["100%"],
            alignment: 'center',
            body: [
              [
                {
                  text: [
                    { text: body?.description, bold: true, fontSize: '12' },
                  ],
                  alignment: 'left',
                },
              ],
            ],
          },
        },
        {
          text: `\nNous  vous  remercions  de  votre  confiance  renouvelée  et  vous  prions  de  croire,  Madame,  Monsieur, en l'expression de nos sentiments les plus distingués.`,
          fontSize: 12,
          color: 'black',
        },
        {
          style: 'table',
          layout: 'noBorders',
          table: {
            widths: ['*', '*'],
            alignment: 'center',
            body: [
              [
                {
                  text: [
                    { text: `Fait à : `, bold: true, fontSize: '12' },
                    { text: `Alger`, fontSize: '12' },
                  ],
                  alignment: 'left',
                },
                {
                  text: `Signature :`,
                  bold: true,
                  fontSize: '12',
                  alignment: 'center',
                },
              ],
              [
                {
                  text: [
                    { text: `Le : `, bold: true, fontSize: '12' },
                    { text: sinistre?.auditDate?.split('T')[0], fontSize: '12' },
                  ],
                  alignment: 'left',
                },
                {
                  text: ``,
                  bold: true,
                  fontSize: '12',
                  alignment: 'left',
                },
              ],
            ],
          },
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          color: '#d14723',
          fontSize: 10,
          alignment: 'right',
        },
        BG: {
          fontSize: 8,
        },
        table: {
          margin: [0, 20, 0, 20],
        },
        headerTable: {
          alignment: 'left',
          bold: true,
          fontSize: 12,
          color: '#00008F',
         
        },
      },
    };

    pdfMake
      .createPdf(docDefinitionClassement)
      .download('Classement_sans_suite_' + sinistre?.codeSinistre);
  }

  outputOp(sinistre: any, historique: any,infoOP:any) {

    let contrat = sinistre?.sinistre?.contratHistorique;
    let assure = contrat?.contratPersonneRoleList?.find((p: any) => p?.role?.idParam == 235 || p?.role?.idParam == 236 || p?.role?.idParam == 238 || p?.role?.idParam == 280)?.personne
    let vehicule = contrat?.risqueList
    let pageNumero = 0
    let beneficiaire: any = {}
    let condition = sinistre?.decompteOp != null ? sinistre?.decompteOp?.sinistreReserve?.codeGarantie : infoOP?.decompteRecours?.sinistreReserve?.codeGarantie
    let garantie = contrat?.paramContratList?.find((g: any) => g?.idPackComplet?.garantie?.codeGarantie == condition)?.idPackComplet?.garantie?.description

    console.log("sinistre?.typeOp?.code ", sinistre?.typeOp?.code)
    console.log("sinistre ", sinistre);

    console.log("sinistre?.decompteOp?.expert ", sinistre?.decompteOp?.expert)
    console.log("sinistre?.decompteOp?.adversaire ", sinistre?.decompteOp?.adversaire)
    console.log("sinistre?.decompteOp?.adversaire ", sinistre?.decompteOp?.adversaire)


    let docDefinitionClassement1:any;
    if(sinistre?.sinistre?.produit?.codeProduit == 96  || sinistre?.sinistre?.produit?.codeProduit == 95){
      console.log("sinistre",sinistre);
       docDefinitionClassement1={
        watermark: { text: '', color: 'blue', opacity: 0.1 },
        pageMargins: [45, 130, 45, 90],
        border: [false, false, false, false],
        header: function(currentPage: any, pageCount: any) {
          return {
            layout: 'noBorders',
            margin: [45, 50, 45, 90],
            table: {
              widths: ["*", "*"],
              alignment: "center",
              body: [
                [
                    {
                        text: [
                            { text: `Ordre de paiement N° : `, bold: true, fontSize: "10" },
                            { text: sinistre?.idSinistreOp, fontSize: "10" },
                        ],
                        alignment: 'left'
                    },
                    {
                        text: [
                            { text: `Page : `, bold: true, fontSize: "10" },
                            { text: currentPage, fontSize: "10" },
                        ],
                        alignment: 'right'
                    }
                ],
                [
                    {
                        text: [
                            { text: `Assuré(e) :`, bold: true, fontSize: "10" },
                            { text: assure?.raisonSocial !== undefined ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "10" },
                        ],
                        alignment: 'left'
                    },
                    {} // Empty cell to maintain row structure
                ],
                [
                  {
                      text: [
                          { text: `Crédit preneur:`, bold: true, fontSize: "10" },
                          { text: '', fontSize: "10" },
                      ],
                      alignment: 'left'
                  },
                  {} // Empty cell to maintain row structure
              ],
              
            ],
            },
          }
        },
        content: [
          {
            style: 'table',
            table: {
              widths: ["15%", "16.66%", "18.98%", "16.66%", "16.66%", "16%"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `N° Sinistre`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Date sinistre`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `N° Police`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Date d'effet`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Date d'échéance`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Garantie affectée`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                ],
                [
                  {
                    text: sinistre?.sinistreReserve?.sinistre.codeSinistre,
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.sinistreReserve?.sinistre.dateSurvenance?.split('T')[0],
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: contrat?.idContrat?.idContrat,
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: contrat?.dateEffet?.split('T')[0],
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: contrat?.dateExpiration?.split('T')[0],
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: garantie,
                    fontSize: "10",
                    alignment: 'center'
                  },
                ],
              ],
            },
          },
          {
            style: 'table',
            text: `Details du risqueM :`,
            fontSize: 10,
            color: 'black'
          },
          {
            table: {
              widths: ["50%", "50%"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Adresse`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                 
                  {
                    text: [
                      { text: `Agence de souscription`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                 
                  },
                ],
                [
                  {
                    text: vehicule?.find((v: any) => v.paramRisque?.codeParam == "P106")?.valeur,
                    fontSize: "10",
                    alignment: 'center'
                   
                  },
                  {
                    text: sinistre?.sinistreReserve.sinistre.agence.idPersonneMorale.raisonSocial,
                    fontSize: "10",
                    alignment: 'center' 
                  },
                ],
              ],
            },
          },
      
          {
            style: 'table',
            text: `Bénéficiaire / Details paiement :`,
            fontSize: 10,
            color: 'black'
          },
          {
            table: {
              widths: ["*", "*", "*"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Identification`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Type de bénéficiaire`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Mode de paiement`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                ],
                [
                  {
                    text:infoOP?.nom+ " " + infoOP?.prenom+ ""+assure?.raisonSocial != undefined ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1,
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: "Assuré",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: beneficiaire?.mode,
                    fontSize: "10",
                    alignment: 'center'
                  },
                ],
              ],
            },
          },
          {
            style: 'table',
            text: ``,
            fontSize: 10,
            color: 'black'
          },    
          {
            table: {
              widths: ["33%", "33%", "33%"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Détail Règlement :`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'left',
                    colSpan: 2 
                  },
                  {
                    text: ``,
                    fontSize: "10",
                    alignment: 'center'
                  },
                 
               
                ],
                [
                  {
                    text: `Référence:`,
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text:sinistre?.decompteOp?.referenceDocument,
                    fontSize: "10",
                    alignment: 'center'
                  },
                  
                ],
              ],
           
            },
          },
          {
            style: 'table',
            text: ``,
            fontSize: 10,
            color: 'black'
          },
          {
            table: {
              widths: ['*', '*', '*'],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Observation du Bureau régleur:`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'left',
                    colSpan: 3 
                  },
                 
                  {}, // Cellules vides pour compléter la ligne
                  {}
                ],
                [
               
                  {
                    text: "                                               ",
                    fontSize: "10",
                    alignment: 'center',
                    colSpan: 3 ,margin: [0, 10]
                  },
                  {
                    text: "                                               ",
                    fontSize: "10",
                    alignment: 'center', margin: [0, 20] 
                  },
                  
                  {
                    text: "                                               ",
                    fontSize: "10",
                    alignment: 'center', 
                    margin: [0, 10]
                  },
                
                  
                  
                ],
              ],
           
            },
          },
          sinistre?.decompteOp?.decomptePv != null ?
            {
              style: 'table',
              table: {
                widths: ["16%", "16%"],
                alignment: "left",
                body: [
                  [
                    {
                      text: [
                        { text: `Détail Règlement :`, bold: true, fontSize: "10" },
                      ],
                      style: "headerTable",
                      colSpan: 2,
                      alignment: 'center'
                    },
                    {}
                  ],
                  [
                    {
                      text: [
                        { text: `Visite de risque :`, bold: true, fontSize: "10" },
                      ],
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.visiteRisque?.description,
                      fontSize: "10",
                      alignment: 'center'
                    },
                  ],
                  [
                    {
                      text: [
                        { text: `Base calcul :`, bold: true, fontSize: "10" },
                      ],
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.calculHtTtc?.description,
                      fontSize: "10",
                      alignment: 'center'
                    },
                  ],
                ],
              },
            } : {},
          sinistre?.decompteOp?.decomptePv != null ?
            {
              style: 'table',
              pageBreak: 'before',
              table: {
                widths: ["25%", "25%", "25%", "25%"],
                alignment: "center",
                body: [
                  [
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      text: [
                        { text: `Brut`, bold: true, fontSize: "10" },
                      ],
                      style: "headerTable",
                      alignment: 'center'
                    },
                    {
                      text: [
                        { text: `Retenue`, bold: true, fontSize: "10" },
                      ],
                      style: "headerTable",
                      alignment: 'center'
                    },
                    {
                      text: [
                        { text: `Brut	Retenue	Observation du Bureau régleur`, bold: true, fontSize: "10" },
                      ],
                      style: "headerTable",
                      alignment: 'center'
                    },
                  ],
                  [
                    {
                      text: "Main d'œuvre :",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP460")?.brut != undefined ? sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP460")?.brut + " DZD": "",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP460")?.motif?.description,
                      fontSize: "10",
                      rowSpan: 14,
                      alignment: 'center'
                    },
                  ],
                  [
                    {
                      text: "Peinture",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP461")?.brut != undefined ? sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP461")?.brut + " DZD":"",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      text: "Fourniture",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP462")?.brut != undefined ? sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP462")?.brut + " DZD":"",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP462")?.retenue != undefined ? sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP462")?.retenue + " DZD":"",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {},
                  ],
                  [
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      text: "Dommage brut",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.dommageBrut + " DZD",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      text: "Vétusté",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.vetuste + " DZD",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      text: "Dommage net de vétusté",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.dommageNetVetuste + " DZD",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      text: "Règle proportionnel",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.reglePropotionnel + " DZD",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.reglePropotionnel + " DZD",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {},
                  ],
                  [
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      text: "Dommage net règle proportionnel",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.dommageNetRp + " DZD",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      text: "Immobilisation",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.immobilisation + " DZD",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ],
                  [
                    {
                      text: "Franchise",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      text: sinistre?.decompteOp?.decomptePv?.franchise != null ? sinistre?.decompteOp?.decomptePv?.franchise + " DZD":"",
                      fontSize: "10",
                      alignment: 'center'
                    },
                    {
                      border: [false, false, false, false],
                      text: ""
                    },
                    {},
                  ]
                ],
              },
            } : {},
            {
              text: '', // Empty text to add extra space
              margin: [0, 0, 0, 20] // Add space after the table
            },
          {
            style: 'table',
            table: {
              widths: ["25%", "25%", "25%", "25%"],
              alignment: "center",
              
              body: [
                [
                  {
                    text: [
                      { text: `Total a réglé:`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center',
                   
                  },
                  {
                    text: sinistre?.decompteOp != null ? 
                     sinistre?.decompteOp?.decomptePv == null ? Number(sinistre?.decompteOp?.montantTTC).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" :
                      Number(sinistre?.decompteOp?.decomptePv?.totalRegle).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" :
                       Number(sinistre?.montant).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                ]
              ],
            },
          },
          {
            text: '', // Empty text to add extra space
            margin: [0, 0, 0, 20] // Add space after the table
          },
          {
            style: 'table',
            table: {
              widths: ["50%", "50%"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Fait le :`, bold: true, fontSize: "10" },
                      { text: sinistre?.auditDate?.split("T")[0], bold: true, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Ordonné le :`, bold: true, fontSize: "10" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Signature gestionnaire :\n`, bold: true, fontSize: "10" },
                      { text: infoOP?.userCreation?.nom + " " + infoOP?.userCreation?.prenom, bold: true, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Signature de l'ordonnateur :\n`, bold: true, fontSize: "10" },
                      { text: infoOP?.userValidation?.nom + " " + infoOP?.userValidation?.prenom, bold: true, fontSize: "10" },
                    ],
                    alignment: 'left'
                  }
                ]
              ],
            },
          },
        ],
        styles: {
          sectionHeader: {
            bold: true,
            color: "#d14723",
            fontSize: 10,
            alignment: "right"
          },
          BG: {
            fontSize: 8
          },
          table: {
            margin: [0, 20, 0, 0]
          },
          headerTable: {
            alignment: "left",
            bold: true,
            fontSize: 10,
            color: "#00008F",
            
          }
        }
      }
      pdfMake.createPdf(docDefinitionClassement1).download("OP_" + sinistre?.codeOp)
    }else{
       switch (sinistre?.typeOp?.code) {
      case 'OPA':
        sinistre?.decompteOp?.benificiaire != null ?
        beneficiaire = {         
          nom: sinistre?.decompteOp?.nom + " " + sinistre?.decompteOp?.prenom,
          type: sinistre?.decompteOp?.benificiaire?.description,
          mode: sinistre?.modeRecouvrement?.description
        }
        :
        beneficiaire = {         
          nom: assure?.raisonSocial != undefined ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1,
          type: "Assuré",
          mode: sinistre?.modeRecouvrement?.description
        }
        break;
      case 'OPP':
        if(sinistre?.decompteOp?.expert != null ){
          beneficiaire = {
            nom: sinistre?.decompteOp?.expert?.idPersonneMorale?.raisonSocial ,
            type: "Prestataire",
            mode: sinistre?.modeRecouvrement?.description
          }
        }else{
          beneficiaire = {
            nom: sinistre?.decompteOp?.nom + " " + sinistre?.decompteOp?.prenom,
            type: "Prestataire",
            mode: sinistre?.modeRecouvrement?.description
          }
        }
       
        break;
      case 'OPT':
        if( sinistre?.decompteOp.benificiaire!= null){
          beneficiaire = {
            nom: sinistre?.decompteOp?.nom + " " + sinistre?.decompteOp?.prenom,
            type: "Tiers",
            mode: sinistre?.modeRecouvrement?.description
          }
        }else{
          if(sinistre?.decompteOp?.sinistrePersonne?.compagnyAdverse?.code=='CP405' || sinistre?.decompteOp?.sinistrePersonne?.compagnyAdverse==null){
            beneficiaire = {
            //  nom: sinistre?.decompteOp?.sinistrePersonne?.prenom !=null ? sinistre?.decompteOp?.sinistrePersonne?.nom  + " " + sinistre?.decompteOp?.sinistrePersonne?.prenom : sinistre?.decompteOp?.sinistrePersonne?.nom,
            nom: sinistre?.decompteOp?.sinistrePersonne?.nom  + " " + sinistre?.decompteOp?.sinistrePersonne?.prenom ,

              type: "Tiers",
              mode: sinistre?.modeRecouvrement?.description
            }
          }else{
            beneficiaire = {
              nom: sinistre?.decompteOp?.sinistrePersonne?.compagnyAdverse?.description ,
              type: "Tiers",
              mode: sinistre?.modeRecouvrement?.description
            }
          }
         
        }
       
       
        break;
      case 'OPE':
        beneficiaire = {
          nom: sinistre?.decompteOp?.expert?.nom + " " + sinistre?.decompteOp?.expert?.prenom,
          type: "Expert",
          mode: sinistre?.modeRecouvrement?.description
        }
        break;
      case 'ROR':
  
        beneficiaire = {
          
          nom:infoOP?.nom+ " " + infoOP?.prenom,
          type: infoOP?.typeBeneficiaire?.description,
          mode: sinistre?.modeRecouvrement?.description
        }
        break;
      default:
        break;
    }





    let docDefinitionClassement: any = {
      watermark: { text: '', color: 'blue', opacity: 0.1 },
      pageMargins: [45, 130, 45, 90],
      border: [false, false, false, false],
      header: function(currentPage: any, pageCount: any) {
        return {
          layout: 'noBorders',
          margin: [45, 90, 45, 90],
          table: {
            widths: ["*", "*"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `Ordre de paiement N° : `, bold: true, fontSize: "10" },
                    { text: sinistre?.idSinistreOp, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Page : `, bold: true, fontSize: "10" },
                    { text: currentPage, fontSize: "10" },
                  ],
                  alignment: 'right'
                }
              ],
              [
                {
                  text: [
                    { text: `Assuré(e) : `, bold: true, fontSize: "10" },
                    { text: assure?.raisonSocial != undefined ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {}
              ],
            ],
          },
        }
      },
      content: [
        {
          style: 'table',
          table: {
            widths: ["15%", "16.66%", "18.98%", "16.66%", "16.66%", "16%"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `N° Sinistre`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `Date sinistre`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `N° Police`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `Date d'effet`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `Date d'échéance`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `Garantie affectée`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
              ],
              [
                {
                  text: sinistre?.sinistreReserve?.sinistre?.codeSinistre,
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  text: sinistre?.sinistreReserve?.sinistre?.dateSurvenance?.split('T')[0],
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  text: contrat?.idContrat?.idContrat,
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  text: contrat?.dateEffet?.split('T')[0],
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  text: contrat?.dateExpiration?.split('T')[0],
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  text: garantie,
                  fontSize: "10",
                  alignment: 'center'
                },
              ],
            ],
          },
        },
        {
          style: 'table',
          text: `Details du risqueA :`,
          fontSize: 10,
          color: 'black'
        },
        {
          table: {
            widths: ["33%", "33%", "33%"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `Immatriculation`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `N° Châssis`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `Agence de souscription`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
              ],
              [
                {
                  text: vehicule?.find((v: any) => v?.paramRisque?.codeParam == "P38" && sinistre?.sinistre?.codeRisque == v.risque)?.valeur,
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  text: vehicule?.find((v: any) => v?.paramRisque?.codeParam == "P30"  && sinistre?.sinistre?.codeRisque == v.risque)?.valeur,
                  fontSize: "10",
                  alignment: 'center'
                },
                {//sinistre?.sinistreReserve?.sinistre?.agence?.idPersonneMorale?.raisonSocial
                  text: contrat?.agence?.idPersonneMorale?.raisonSocial,
                  fontSize: "10",
                  alignment: 'center'
                },
              ],
            ],
          },
        },
        {
          style: 'table',
          text: `Historique souscription et sinistre :`,
          fontSize: 10,
          color: 'black'
        },
    
        this.table(historique, ["Type mouvement", "Date d'effet", "Formule", "Date sinistre", "Cause", "Statut"]),
        {
          table: {
            widths: ["16.66%", "16.66%", "16.66%", "16.66%", "16.66%", "16.66%"],
            alignment: "center",
            body: [
              [
                {
                  border: [true, false, true, true],
                  text: ''
                },
                {
                  border: [true, false, true, true],
                  text: ''
                },
                {
                  border: [true, false, true, true],
                  text: ''
                },
                {
                  border: [true, false, true, true],
                  text: sinistre?.sinistreReserve?.sinistre?.dateSurvenance?.split("T")[0],
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  border: [true, false, true, true],
                  text: sinistre?.sinistreReserve?.sinistre?.causeSinistre?.description,
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  border: [true, false, true, true],
                  text: sinistre?.statut?.description,
                  fontSize: "10",
                  alignment: 'center'
                }
              ]
            ],
          },
        },
        {
          style: 'table',
          text: `Bénéficiaire / Details paiement :`,
          fontSize: 10,
          color: 'black'
        },
        {
          table: {
            widths: ["*", "*", "*"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `Identification`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `Type de bénéficiaire`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `Mode de paiement`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
              ],
              [
                {
                 // text:  beneficiaire?.nom,
               text:(beneficiaire?.nom === undefined || beneficiaire?.nom === null) 
                 ? (sinistre?.decompteOp?.sinistrePersonne?.nom + " " + sinistre?.decompteOp?.sinistrePersonne?.prenom)
                 : beneficiaire?.nom,
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  text:beneficiaire?.type,
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  text: beneficiaire?.mode,
                  fontSize: "10",
                  alignment: 'center'
                },
              ],
            ],
          },
        },
        sinistre?.decompteOp?.decomptePv != null ?
          {
            style: 'table',
            table: {
              widths: ["16%", "16%"],
              alignment: "left",
              body: [
                [
                  {
                    text: [
                      { text: `Détail Règlement :`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    colSpan: 2,
                    alignment: 'center'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Visite de risque :`, bold: true, fontSize: "10" },
                    ],
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.visiteRisque?.description,
                    fontSize: "10",
                    alignment: 'center'
                  },
                ],
                [
                  {
                    text: [
                      { text: `Base calcul :`, bold: true, fontSize: "10" },
                    ],
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.calculHtTtc?.description,
                    fontSize: "10",
                    alignment: 'center'
                  },
                ],
              ],
            },
          } : {},
        sinistre?.decompteOp?.decomptePv != null ?
          {
            style: 'table',
            pageBreak: 'before',
            table: {
              widths: ["25%", "25%", "25%", "25%"],
              alignment: "center",
              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    text: [
                      { text: `Brut`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Retenue`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Brut	Retenue	Observation du Bureau régleur`, bold: true, fontSize: "10" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                ],
                [
                  {
                    text: "Main d'œuvre :",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP460")?.brut != undefined ? sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP460")?.brut + " DZD": "",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP460")?.motif?.description,
                    fontSize: "10",
                    rowSpan: 14,
                    alignment: 'center'
                  },
                ],
                [
                  {
                    text: "Peinture",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP461")?.brut != undefined ? sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP461")?.brut + " DZD":"",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    text: "Fourniture",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP462")?.brut != undefined ? sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP462")?.brut + " DZD":"",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP462")?.retenue != undefined ? sinistre?.decompteOp?.decomptePv?.sinistreDecompteInfos?.find((pv: any) => pv?.typeInfoDecompte?.code == "CP462")?.retenue + " DZD":"",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {},
                ],
                [
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    text: "Dommage brut",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.dommageBrut + " DZD",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    text: "Vétusté",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.vetuste + " DZD",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    text: "Dommage net de vétusté",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.dommageNetVetuste + " DZD",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    text: "Règle proportionnel",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.reglePropotionnel + " DZD",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.reglePropotionnel + " DZD",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {},
                ],
                [
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    text: "Dommage net règle proportionnel",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.dommageNetRp + " DZD",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    text: "Immobilisation",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.immobilisation + " DZD",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ],
                [
                  {
                    text: "Franchise",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    text: sinistre?.decompteOp?.decomptePv?.franchise != null ? sinistre?.decompteOp?.decomptePv?.franchise + " DZD":"",
                    fontSize: "10",
                    alignment: 'center'
                  },
                  {
                    border: [false, false, false, false],
                    text: ""
                  },
                  {},
                ]
              ],
            },
          } : {},
        {
          style: 'table',
          table: {
            widths: ["25%", "25%", "25%", "25%"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `Total a réglé :`, bold: true, fontSize: "10" },
                  ],
                  style: "headerTable",
                  alignment: 'center'
                },
                {
                  text: sinistre?.decompteOp != null ?  sinistre?.decompteOp?.decomptePv == null ? Number(sinistre?.decompteOp?.montantTTC).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" : Number(sinistre?.decompteOp?.decomptePv?.totalRegle).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" : Number(infoOP?.montant).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                  fontSize: "10",
                  alignment: 'center'
                },
                {
                  border: [false, false, false, false],
                  text: ""
                },
                {
                  border: [false, false, false, false],
                  text: ""
                },
              ]
            ],
          },
        },
        {
          style: 'table',
          table: {
            widths: ["50%", "50%"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `Fait le :`, bold: true, fontSize: "10" },
                    { text: sinistre?.auditDate?.split("T")[0], bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Ordonné le :`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                }
              ],
              [
                {
                  text: [
                    { text: `Signature gestionnaire :\n`, bold: true, fontSize: "10" },
                    { text: infoOP?.userCreation?.nom + " " + infoOP?.userCreation?.prenom, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Signature de l'ordonnateur :\n`, bold: true, fontSize: "10" },
                    { text: infoOP?.userValidation?.nom + " " + infoOP?.userValidation?.prenom, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                }
              ]
            ],
          },
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          color: "#d14723",
          fontSize: 10,
          alignment: "right"
        },
        BG: {
          fontSize: 8
        },
        table: {
          margin: [0, 20, 0, 0]
        },
        headerTable: {
          alignment: "left",
          bold: true,
          fontSize: 10,
          color: "#00008F",
          
        }
      }
    }
    pdfMake.createPdf(docDefinitionClassement).download("OP_" + sinistre?.codeOp)
  }
  
  }

  outputIndemnisation(sinistre: any) {
   // let contrat = sinistre?.sinistreReserve?.sinistre.contratHistorique;
  
    let contrat = sinistre?.sinistre?.contratHistorique;
    let assure = contrat?.contratPersonneRoleList?.find((p: any) => p?.role?.idParam == 235 || p?.role?.idParam == 236 || p?.role?.idParam == 238 || p?.role?.idParam == 280)?.personne
   

    let garantie = contrat?.paramContratList?.find((g: any) => g?.idPackComplet?.garantie?.codeGarantie == sinistre?.sinistreReserve?.codeGarantie)?.idPackComplet?.garantie?.description
    let beneficiaire: any = {}

    switch (sinistre?.typeOp?.code) {
      case 'OPA':
        sinistre?.decompteOp?.benificiaire != null ?
        beneficiaire = {         
          nom: sinistre?.decompteOp?.nom + " " + sinistre?.decompteOp?.prenom,
          type: sinistre?.decompteOp?.benificiaire?.description,
          mode: sinistre?.modeRecouvrement?.description
        }
        :
        beneficiaire = {         
          nom: assure?.raisonSocial != undefined ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1,
          type: "Assuré",
          mode: sinistre?.modeRecouvrement?.description
        }     
        break;
      case 'OPP':
        beneficiaire = {
          nom: sinistre?.nom + " " + sinistre?.prenom,
          type: "Prestataire",
          mode: sinistre?.modeRecouvrement?.description
        }
        break;
      case 'OPT':
        beneficiaire = {
          nom: sinistre?.decompteOp?.nom + " " + sinistre?.decompteOp?.prenom,
          type: "Tiers",
          mode: sinistre?.modeRecouvrement?.description
        }
        break;
      case 'OPE':
        beneficiaire = {
          nom: sinistre?.decompteOp?.expert?.nom + " " + sinistre?.decompteOp?.expert?.prenom,
          type: "Expert",
          mode: sinistre?.modeRecouvrement?.description
        }
        break;

      default:
        break;
    }

    
    const docDefinitionClassement: any = {
      watermark: { text: '', color: 'blue', opacity: 0.1 },
      pageMargins: [45, 90, 45, 90],
      border: [false, false, false, false],
      content: [
        {
          style: 'table',
          table: {
            widths: ["50%", "50%"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `Police d'assurance N° : `, bold: true, fontSize: "10" },
                    { text: contrat?.idContrat?.idContrat, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Assuré(e) : `, bold: true, fontSize: "10" },
                    { text: assure?.raisonSocial != undefined ? assure?.raisonSocial : assure?.nom+" "+assure?.prenom1, fontSize: "10" },
                  ],
                  alignment: 'left'
                }
              ],
              [
                {
                  text: [
                    { text: `Dossier sinistre N° : `, bold: true, fontSize: "10" },
                    { text: sinistre?.sinistreReserve?.sinistre?.codeSinistre, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Adresse assuré(e) : `, bold: true, fontSize: "10" },
                    { text: assure?.adressesList[assure?.adressesList.length-1]?.description, fontSize: "10" },
                  ],
                  rowSpan: 3,
                  alignment: 'left'
                }
              ],
              [
                {
                  text: [
                    { text: `Quittance N° : `, bold: true, fontSize: "10" },
                    { text: sinistre?.idSinistreOp, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {}
              ],
              [
                {
                  text: [
                    { text: `Garantie affectée : `, bold: true, fontSize: "10" },
                    { text: garantie, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {}
              ],
            ],
          },
        },
        {
          style: 'table',
          text: `Je soussigné `+ beneficiaire?.nom,
          fontSize: 10,
          color: 'black'
        },
        {
          style: 'table',
          text: "Déclare et reconnais avoir reçu de la part d'AXA ASSURANCES ALGERIE, la somme de " + (sinistre?.decompteOp?.decomptePv == null ? sinistre?.decompteOp?.montantHTC != null ? sinistre?.decompteOp?.montantHTC : Number(sinistre?.decompteOp?.montantTTC).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Number(sinistre?.decompteOp?.decomptePv?.totalRegle).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + " DZD au titre de règlement de mon sinistre N° " + sinistre?.sinistreReserve?.sinistre?.codeSinistre + " survenu en date du " + sinistre?.sinistreReserve?.sinistre?.dateSurvenance?.split("T")[0] + " et déclaré le " + sinistre?.sinistreReserve?.sinistre?.dateDeclaration?.split("T")[0] + ", et ce conformément aux conditions générales et particulières de mon contrat d'assurance automobile.",
          fontSize: 10,
          color: 'black'
        },
        {
          style: 'table',
          text: `Je reconnais également que la compagnie AXA ASSURANCES ALGERIE a respecté l'ensemble de ses engagements conformément au contrat d'assurance sus-indiqué et à cet effet, la compagnie est subrogée dans mes droits et actions à l'encontre des tiers responsable au titre de cette affaire.`,
          fontSize: 10,
          color: 'black'
        },
        sinistre?.decompteOp?.decomptePv != null ?
        {
          style: 'table',
          table: {
            widths: ["25%", "25%", "50%"],
            alignment: "center",
            body: [
              [
                {
                  text: `Détail du règlement`,
                  style: 'headerTable',
                  colSpan: 3,
                  alignment: 'center'
                },
                {},
                {}
              ],
              [
                {
                  text: `Dommages brute`,
                  style: 'headerTable',
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Montant brute`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: sinistre?.decompteOp?.decomptePv?.dommageBrut+" DZD", bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
              ],
              [
                {
                  text: `Déductions`,
                  style: 'headerTable',
                  rowSpan: 3,
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Vétusté`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: sinistre?.decompteOp?.decomptePv?.vetuste+" DZD", bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                }
              ],
              [
                {},
                {
                  text: [
                    { text: `Règle proportionnelle`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: sinistre?.decompteOp?.decomptePv?.reglePropotionnel+" DZD", bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                }
              ],
              [
                {},
                {
                  text: [
                    { text: `Franchise`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: sinistre?.decompteOp?.decomptePv?.franchise+" DZD", bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                }
              ],
              [
                {
                  text: `Addition`,
                  style: 'headerTable',
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Immobilisation`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: sinistre?.decompteOp?.decomptePv?.immobilisation+" DZD", bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                }
              ],
              [
                {
                  text: `Montant total de l'indemnité réglé :`,
                  style: 'headerTable',
                  colSpan: 2,
                  alignment: 'center'
                },
                {},
                {
                  text: [
                    { text: sinistre?.decompteOp?.decomptePv?.totalRegle+" DZD", bold: true, fontSize: "10" },
                  ],
                  alignment: 'center'
                }
              ],
            ],
          },
        }:{},
        {
          layout: 'noBorders',
          style: 'table',
          table: {
            widths: ["50%", "50%"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `Fait à : `, bold: true, fontSize: "10" },
                    { text: sinistre?.agence?.idPersonneMorale?.adressesList[sinistre?.agence?.idPersonneMorale?.adressesList.length-1]?.wilaya?.description, fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {
                  text: [
                    { text: `Reçu le : …. / …. / ……`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'left'
                }
              ],
              [
                {
                  text: [
                    { text: `Le : `, bold: true, fontSize: "10" },
                    { text: sinistre?.auditDate?.split("T")[0], fontSize: "10" },
                  ],
                  alignment: 'left'
                },
                {}
              ],
            ],
          },
        },
        {
          layout: 'noBorders',
          style: 'table',
          table: {
            widths: ["50%", "50%"],
            alignment: "center",
            body: [
              [
                {
                  text: [
                    { text: `Pour la compagnie`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'center'
                },
                {
                  text: [
                    { text: `Signature du bénéficiaire précédée de la mention 
                              « Lu et approuvé » :`, bold: true, fontSize: "10" },
                  ],
                  alignment: 'center'
                }
              ]
            ],
          },
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          color: "#d14723",
          fontSize: 10,
          alignment: "right"
        },
        BG: {
          fontSize: 8
        },
        table: {
          margin: [0, 20, 0, 0]
        },
        headerTable: {
          alignment: "left",
          bold: true,
          fontSize: 10,
          color: "#00008F",
          
        }
      }
    }

    pdfMake.createPdf(docDefinitionClassement).download("Quittance_indemnisation_" + sinistre?.codeOp)
  }

  //******************OP */
  calculateur(
    body: any,
    codeSinistre: any,
    codeGarantie: any,
    codeReserve: any
  ) {


    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_CALCULATEUR}/${codeSinistre}/${codeGarantie}/${codeReserve}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  saveCalculateur(body: any) {


    return this.http.post<any>(`${Constants.API_ENDPOINT_TEST_SINISTRE_RESERVE_CALCULATEUR_SAVE}`, body, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  //*******************INSTANCE **************/

  addInstance(body: any, codeSinistre: any, codeGarantie: any, codeReserve: any) {

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_CREATE_INSTANCE}/${codeSinistre}/${codeGarantie}/${codeReserve}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getAllInstance(codeSinistre: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_GET_ALL_INSTANCE}/${codeSinistre}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getInstanceById(id: any) {


    return this.http
      .get<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_GET_INSTANCE_ID}/${id}`,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  addDocument(idInstance: any, body: any) {

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_ADD_DOCUMENT}/${idInstance}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  editDocument(idInstanceDoc: any, body: any) {

    return this.http.put<any>(
      `${Constants.API_ENDPOINT_TEST_SINISTRE_EDIT_DOCUMENT}/${idInstanceDoc}`, body, httpOption
    ).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    );
  }
  checkPaiement(codeSinistre: any, body: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      }),
      responseType: 'text',
    };

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_CHECK_PAIEMENT}/${codeSinistre}`,
        body,
        httpOptions
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  paiement(codeGarantie: any, codeReserve: any, body: any) {

    return this.http
      .post<any>(
        `${Constants.API_ENDPOINT_TEST_SINISTRE_PAIEMENT}/${codeGarantie}/${codeReserve}`,
        body,
        httpOption
      )
      .pipe(
        tap((response) => response),
        catchError((error) => throwError(error.error))
      );
  }
  getReglement(idReglement: any) {
    let httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

      })
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_SINISTRE_PAIEMENT}/${idReglement}`, httpOptions).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }

  historiqueAvenant(body: any) {

    return this.http.post<any>(`${Constants.API_ENDPOINT_avenants}/op`, body, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }

  buildTableBody(data: any, columns: any) {
    var body = [];

    let column: any = [];
    columns.map((col: any) => {
      let column1 = {
        text: '',
        style: '',
        alignment: "center"
      }
      column1.text = col
      column1.style = "headerTable"


      column.push(column1);
    })

    body.push(column);

    data.forEach(function (row: any) {
      const dataRow: any = [];

      columns.forEach(function (column: any) {
        switch (column) {
          case "Type mouvement":
            dataRow.push({
              text: row?.avenant,
              fontSize: "10",
              alignment: 'center'
            })
            break;
          case "Date d'effet":
            dataRow.push({
              text: row?.dateEffet?.split("T")[0],
              fontSize: "10",
              alignment: 'center'
            })
            break;
          case "Formule":
            dataRow.push({
              text: row?.pack,
              fontSize: "10",
              alignment: 'center'
            })
            break;

          default:
            dataRow.push({})
            break;
        }
      })

      body.push(dataRow);
    });

    return body;
  }

  table(data: any, columns: any) {
  
    let pourcentage = 100 / columns?.length;
    let width: any = []
    columns.map((col: any) => {
      -
      width.push(pourcentage + "%")
    })

    return [{
      layout: '',
      table: {
        headerRows: 1,
        widths: width,
        body: this.buildTableBody(data, columns)
      }
    }];
  }
}
