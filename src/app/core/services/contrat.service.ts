import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError, map } from 'rxjs';
import { Constants } from '../config/constants';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as moment from 'moment';
import getBase64ImageFromURL from '../utils/imageHandling';

@Injectable({
    providedIn: 'root'
})
export class ContratService {
    valas: any;
    valtot: any;
    souscripteur01: any;
    sousExit: boolean=false;
    constructor(private http: HttpClient) { }


    getByLien(idDictionnaire: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
    
        return this.http
          .get<any>(
            `${Constants.API_ENDPOINT_TEST_GET_BY_LIEN}/${idDictionnaire}`, httpOption).pipe(
            tap((response) => response),
            catchError((error) => throwError(error.error))
          );
      
    
       
    
    
    
    }

    getAllContrat() {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getRisquesByContrat(idContact: any, codeProduit: any) {
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/${idContact}/produit/${codeProduit}/risques`).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getContratByProduit(codeProduit: any,size:any,index:any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT_BY_PRODUIT}/${codeProduit}?pageNumber=${index}&pageSize=${size}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getQuittanceById(idQuittance: any) {
        // console.log('jesuis le idQuittance',idQuittance)
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_QUITTANCE}/${idQuittance}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    getContratById(idContrat: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/${idContrat}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    getFichierExcel(idContrat: any, codeProduit: any): Observable<Blob> {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }),
          responseType: 'blob' as 'json' 
        };
    
        return this.http.get<Blob>(`${Constants.API_ENDPOINT_Extraire_Excel}/${idContrat}/codeProduit/${codeProduit}`, httpOptions).pipe(
          tap((response) => {
            console.log('Réponse du fichier Excel', response);
          })
        );
      }

    addGroupe(description: any) {
        let body = {
            "description": description
        }
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT_ADD_GROUPE}`, body, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getContratHistoriqueById(idHisContrat: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/historique/${idHisContrat}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getParamHistoByIdRisque(idHistorique: any, idGroupe: any, idRisque: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT_HISTORIQUE}/${idHistorique}/groupe/${idGroupe}/risque/${idRisque}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    getHistoriqueStatus(requestBody: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/historique/status`, requestBody, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    Migration(id_contrat: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any>(`${Constants.API_ENDPOINT_CONTRAT}/migration/${id_contrat}`, {}, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }


    filtresContrat(filterObject: any,index:number,size:number) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT_FILTRE}?pageNumber=${index}&pageSize=${size}`, filterObject, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    createSiteComercial(body:any){
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT_COMEMRCIAL_LINE_SITE}`, body, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    createContrat(contrat: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT}`, contrat, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    //check if policy exist
    getPolicyExist(numPolice: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/${numPolice}/exist`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    //check if policy exist
    getMatricule(requestBody: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/historique/matricule`, requestBody, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    outputQuittance(contrat: any, quittance: any, avenant: any) {
        // console.log('contrat quittance avenant ', contrat , quittance , avenant)
        let assure: any = {};
        let conducteur: any = {};
        let souscripteur: any = {};
       //console.log("je suis le contrat au niveau de quittace ",contrat)
        contrat?.personnesList?.forEach((element: any) => {
            switch (element?.role?.idParam) {
                case 233:
                    conducteur = element?.personne
                    break;
                case 234:
                    souscripteur = element?.personne
                    break;
                case 235:
                    assure = element?.personne
                    break;
                case 236:
                    souscripteur = element?.personne
                    assure = element?.personne
                    break;
                case 237:
                    souscripteur = element?.personne
                    conducteur = element?.personne
                    break;
                case 280:
                    assure = element?.personne
                    conducteur = element?.personne
                    break;
                case 238:
                    souscripteur = element?.personne
                    assure = element?.personne
                    conducteur = element?.personne
                    break;

                default:
                    break;
            }
        });
        let dateDebut =moment( contrat?.dateEffet).format('DD-MM-YYYY');
        let qr = "";
        switch (contrat?.produit.codeProduit) {
            case "45A":
                qr = "https://www.axa.dz/wp-content/uploads/2023/10/Conditions-generales-Assurance-Automobile.pdf"
                break;
            case "96":
                qr = "https://www.axa.dz/wp-content/uploads/2023/10/Conditions-Generales-Habitation.pdf"
                break;
            case "95":
                qr = "https://www.axa.dz/wp-content/uploads/2023/11/Conditions-Generales-Multirisque-professionnelle.pdf"
                break;
            case '20A':
                qr="https://www.axa.dz/wp-content/uploads/2023/10/Conditions-Generales-Assurance-Voyage.pdf"
                break;
        
            default:

                break;
        } 

        const docDefinitionQuittance: any = {
            watermark: { text: '', color: 'blue', opacity: 0.1 },
            pageMargins: [35, 110, 35, 90],
            border: [false, false, false, false],
            header: function (currentPage: any, pageCount: any, pageSize: any) {
                if (currentPage == 1) {
                    return {
                        stack: [
                            {
                                text: quittance?.auditDate?.split("T")[0],
                                style: 'sectionHeader',
                                color: 'black'
                            },
                            {
                                text: `\nQuittance de prime\n\n`,
                                style: 'sectionHeader',
                                color: 'black'
                            }
                            // {
                            //     qr: qr,
                            //     fit: '70',
                            //     alignment: "right",
                            //     style: 'sectionHeader'
                            // }
                        ],
                        margin: [35, 30, 35, 0]
                    }
                }
            },
            content: [
                qr != '' ? {
                    columns: [
                        {},
                        {
                            qr: qr,
                            fit: '70',
                            alignment: "right",
                            style: 'sectionHeader'
                        }
                    ]
                } : {},
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `Agence`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: `Reference`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Nom et code agence : `, bold: true, fontSize: "10" },
                                                { text: contrat?.agence?.codeAgence + " " + contrat?.agence?.raisonSocial, fontSize: "10" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `N° Police: `, bold: true, fontSize: "10" },
                                                { text: contrat?.idContrat, fontSize: "10" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Adresse agence : `, bold: true, fontSize: "10" },
                                                { text: contrat?.agence?.adresse, fontSize: "10" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Date effet : `, bold: true, fontSize: "10" },
                                                { text: avenant != null ? dateDebut : contrat?.dateEffet?.split("T")[0], fontSize: "10" },

                                            ],//avenant?.dateAvenant.split("T")[0]
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Téléphone agence : `, bold: true, fontSize: "10" },
                                                { text: contrat?.agence?.telephone, fontSize: "10" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Date expiration contrat : `, bold: true, fontSize: "10" },
                                                { text: contrat?.dateExpiration?.split("T")[0], fontSize: "10" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `E-mail agence : `, bold: true, fontSize: "10" },
                                                { text: contrat?.agence?.email, fontSize: "10" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `N° Quittance : `, bold: true, fontSize: "10" },
                                                { text: contrat?.idQuittance == undefined ? contrat?.quittanceList[contrat?.quittanceList.length - 1] : contrat?.idQuittance, fontSize: "10" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },

                contrat?.produit?.codeProduit == "45A" || contrat?.produit?.codeProduit == "45F" || contrat?.produit?.codeProduit == "45L" ?
                    {
                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*", "*", "*", "*", "*", "*"],
                                    body: [
                                        [
                                            {
                                                text: `Prime nette`,
                                                style: "headerTable"
                                            },
                                            contrat?.idHistorique == undefined || avenant?.typeAvenant?.code == 'A12' || avenant?.typeAvenant?.code == 'A13' || avenant?.typeAvenant?.code == 'A18' ?
                                                {
                                                    text: `Coût de police`,
                                                    style: "headerTable"
                                                }
                                                : {
                                                    text: `Frais de gestion`,
                                                    style: "headerTable"
                                                },
                                            {
                                                text: `T.V.A`,
                                                style: "headerTable"
                                            },

                                            {
                                                text: `F.G.A`,
                                                style: "headerTable"
                                            },
                                            {
                                                text: `Timbre de dimension`,
                                                style: "headerTable"
                                            },
                                            {
                                                text: `Timbre gradué`,
                                                style: "headerTable"
                                            },
                                        ],
                                        [
                                            {
                                                text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },

                                            /*  {
                                                  text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                  fontSize: 10
                                              },
                                              */
                                            contrat?.idHistorique == undefined || avenant?.typeAvenant?.code == 'A12' || avenant?.typeAvenant?.code == 'A13' || avenant?.typeAvenant?.code == 'A18' ?
                                                {
                                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                }
                                                : {
                                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                },
                                            {
                                                text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            {
                                                text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            {
                                                text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            {
                                                text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                        ],
                                        [
                                            { text: '', colSpan: 4 },
                                            {},
                                            {},
                                            {},
                                            {
                                                text: `Prime Totale`,
                                                style: "headerTable",
                                            },
                                            {
                                                text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                        ],
                                    ],
                                }
                            }
                        ],
                    } : contrat?.produit?.codeProduit==="20A" || contrat.produit.codeProduit=="20G" ?{
                        columns: [

                            {
                                style: "table",
                                table: {

                                    widths: ["*", "*", "*", "*"],
                                    body: [
                                        [
                                            {
                                                text: `Prime nette`,
                                                style: "headerTable"
                                            },
                                            contrat?.idHistorique == undefined || avenant?.typeAvenant?.code == 'A12' || avenant?.typeAvenant?.code == 'A13' || avenant?.typeAvenant?.code == 'A18' ?
                                                {
                                                    text: `Coût de police`,
                                                    style: "headerTable"
                                                }
                                                : {
                                                    text: `Frais de gestion`,
                                                    style: "headerTable"
                                                },
                                           

                                            {
                                                text: `Timbre de dimension`,
                                                style: "headerTable"
                                            },
                                            {
                                                text: `Prime Totale`,
                                                style: "headerTable",
                                            },

                                        ],
                                        [
                                            {
                                                text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10,
                                                alignment: "center"
                                            },
                                            /* {
                                                 text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                 fontSize: 10,
                                                 alignment: "center"
                                             },
                                             */
                                            contrat?.idHistorique == undefined || avenant?.typeAvenant?.code == 'A12' || avenant?.typeAvenant?.code == 'A13' || avenant?.typeAvenant?.code == 'A18' ?
                                                {
                                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                }
                                                : {
                                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                },
                                           

                                            {
                                                text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10,
                                                alignment: "center"
                                            },
                                            {
                                                text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10,
                                                alignment: "center"
                                            },



                                        ],

                                    ],
                                }
                            },

                        ],
                    }:{



                        columns: [

                            {
                                style: "table",
                                table: {

                                    widths: ["*", "*", "*", "*", "*"],
                                    body: [
                                        [
                                            {
                                                text: `Prime nette`,
                                                style: "headerTable"
                                            },
                                            contrat?.idHistorique == undefined || avenant?.typeAvenant?.code == 'A12' || avenant?.typeAvenant?.code == 'A13' || avenant?.typeAvenant?.code == 'A18' ?
                                                {
                                                    text: `Coût de police`,
                                                    style: "headerTable"
                                                }
                                                : {
                                                    text: `Frais de gestion`,
                                                    style: "headerTable"
                                                },
                                            {
                                                text: `T.V.A`,
                                                style: "headerTable"
                                            },

                                            {
                                                text: `Timbre de dimension`,
                                                style: "headerTable"
                                            },
                                            {
                                                text: `Prime Totale`,
                                                style: "headerTable",
                                            },

                                        ],
                                        [
                                            {
                                                text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10,
                                                alignment: "center"
                                            },
                                            /* {
                                                 text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                 fontSize: 10,
                                                 alignment: "center"
                                             },
                                             */
                                            contrat?.idHistorique == undefined || avenant?.typeAvenant?.code == 'A12' || avenant?.typeAvenant?.code == 'A13' || avenant?.typeAvenant?.code == 'A18' ?
                                                {
                                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10,
                                                    alignment: "center"
                                                }
                                                : {
                                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10,
                                                    alignment: "center"
                                                },

                                                contrat.produit.codeProduit=="97"?
                                                { text: "  0.00 DZD" ,
                                                fontSize: 10,
                                                    
                                                       alignment: "center"}:
                               
                                            {
                                                text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10,
                                                alignment: "center"
                                            },

                                            {
                                                text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10,
                                                alignment: "center"
                                            },
                                            {
                                                text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10,
                                                alignment: "center"
                                            },



                                        ],

                                    ],
                                }
                            },

                        ],
                    },
                /*   contrat?.produit?.codeProduit == "45F"?
                   {
 
 
                   
                     columns: [
                        
                         {
                             style: "table",
                             table: {
                                 
                                 widths:  ["*","*","*","*","*"] ,
                                 body: [
                                     [
                                         {
                                             text: `Prime nette`,
                                             style: "headerTable"
                                         },
                                         {
                                             text: `Frais de gestion`,
                                             style: "headerTable"
                                         },
                                         {
                                             text: `T.V.A`,
                                             style: "headerTable"
                                         },
                                         
                                         {
                                             text: `Timbre de dimension`,
                                             style: "headerTable"
                                         },
                                         {
                                             text: `Prime Totale`,
                                             style: "headerTable",
                                         },
                                        
                                     ],
                                     [
                                         {
                                             text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                             fontSize: 10,
                                             alignment: "center"
                                         },
                                         {
                                             text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                             fontSize: 10,
                                             alignment: "center"
                                         },
                                         {
                                             text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                             fontSize: 10,
                                             alignment: "center"
                                         },
                                      
                                         {
                                             text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                             fontSize: 10,
                                             alignment: "center"
                                         },
                                         {
                                             text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                             fontSize: 10,
                                             alignment: "center"
                                         },
 
                                        
                                         
                                     ],
                                   
                                 ],
                             }
                         },
                         
                     ],
                   }:{},
                   */
                {
                    margin: [0, 50, 0, 0],
                    table: {
                        widths: ['*'],
                        body: [[" "], [" "]]
                    },
                    layout: {
                        hLineWidth: function (i: any, node: any) {
                            return (i === 0 || i === node.table.body.length) ? 0 : 2;
                        },
                        vLineWidth: function (i: any, node: any) {
                            return 0;
                        },
                        hLineStyle: function (i: any, node: any) {
                            if (i === 0 || i === node.table.body.length) {
                                return null;
                            }
                            return { dash: { length: 4, space: 2 } };
                        },
                        vLineStyle: function (i: any, node: any) {
                            return 0;
                        },
                    }
                },
                {
                    style: "table",
                    table: {
                        widths: ["*"],
                        alignment: "right",
                        body: [
                            [
                                {
                                    text: `SOUCHE DE QUITTANCE DE PRIME`,
                                    style: "headerTable"
                                },
                            ],
                        ],
                    },
                },
                contrat?.produit?.codeProduit==="20A" || contrat.produit.codeProduit=="20G"?
                {
                    table: {
                        widths: ["*", "*", "*", "*"],
                        alignment: "right",
                        body: [
                            [
                                {
                                    text: [
                                        { text: `Assuré(e) :`, bold: true, fontSize: "10" },
                                        { text: contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial != null ) ? contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial)?.personne?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "10" },
                                    ],
                                    colSpan: 4,
                                    alignment: "left"
                                },
                                {},
                                {},
                                {},
                            ],
                            [
                                {
                                    text: [
                                        { text: `Nº Quittance :`, bold: true, fontSize: "10" },
                                        { text:  quittance.idQuittance, fontSize: "10" },
                                    ],
                                    colSpan: 2,
                                    alignment: "left"
                                },
                                {
                                    text: [
                                        { text: `Nº de Police :`, bold: true, fontSize: "10" },
                                        { text: contrat?.idContrat, fontSize: "10" },
                                    ],
                                    alignment: "left"
                                },
                                {},
                                {
                                    text: [
                                        { text: `Produit :`, bold: true, fontSize: "10" },
                                        { text: contrat?.produit?.description, fontSize: "10" },
                                    ],
                                    alignment: "left"
                                },
                            ],
                            [
                                {
                                    text: `Echéance`,
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: `Commissions`,
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: `Prime Nette`,
                                    bold: true,
                                    alignment: "center",
                                },
                                {
                                    text: `Prime Totale`,
                                    bold: true,
                                    alignment: "center"
                                },
                            ],
                            [
                                {
                                    text: [
                                        { text: `Du :`, bold: true, fontSize: "10" },
                                        { text: avenant != null ? avenant.dateAvenant?.split("T")[0] : contrat?.dateEffet?.split("T")[0], fontSize: "10" },
                                        { text: `\nAu :`, bold: true, fontSize: "10" },
                                        { text: contrat?.dateExpiration?.split("T")[0], fontSize: "10" }
                                    ],
                                    alignment: "left"
                                },
                                {
                                    text: `0,00`,
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                    bold: true,
                                    alignment: "center"
                                },
                            ],
                        ],
                    },
                }
                :
                {
                    table: {
                        widths: ["*", "*", "*", "*", "*"],
                        alignment: "right",
                        body: [
                            [
                                {
                                    text: [
                                        { text: `Assuré(e) :`, bold: true, fontSize: "10" },
                                        { text: contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial != null ) ? contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial)?.personne?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "10" },
                                    ],
                                    colSpan: 5,
                                    alignment: "left"
                                },
                                {},
                                {},
                                {},
                                {},
                            ],
                            [
                                {
                                    text: [
                                        { text: `Nº Quittance :`, bold: true, fontSize: "10" },
                                        { text:  quittance?.idQuittance, fontSize: "10" },
                                    ],
                                    colSpan: 2,
                                    alignment: "left"
                                },
                                {},
                                {
                                    text: [
                                        { text: `Nº de Police :`, bold: true, fontSize: "10" },
                                        { text: contrat?.idContrat, fontSize: "10" },
                                    ],
                                    colSpan: 2,
                                    alignment: "left"
                                },
                                {},
                                {
                                    text: [
                                        { text: `Produit :`, bold: true, fontSize: "10" },
                                        { text: contrat?.produit?.description, fontSize: "10" },
                                    ],
                                    alignment: "left"
                                },
                            ],
                            [
                                {
                                    text: `Echéance`,
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: `Commissions`,
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: `T.V.A`,
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: `Prime Nette`,
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: `Prime Totale`,
                                    bold: true,
                                    alignment: "center"
                                },
                            ],
                            [
                                {
                                    text: [
                                        { text: `Du :`, bold: true, fontSize: "10" },
                                        { text: avenant != null ? avenant.dateAvenant?.split("T")[0] : contrat?.dateEffet?.split("T")[0], fontSize: "10" },
                                        { text: `\nAu :`, bold: true, fontSize: "10" },
                                        { text: contrat?.dateExpiration?.split("T")[0], fontSize: "10" }
                                    ],
                                    alignment: "left"
                                },
                                {
                                    text: `0,00`,
                                    bold: true,
                                    alignment: "center"
                                },
                                contrat.produit.codeProduit=="97"?
                                                { text: "  0.00 DZD",
                                    bold: true,
                                    alignment: "center"}:
                                {
                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                    bold: true,
                                    alignment: "center"
                                },
                                {
                                    text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                    bold: true,
                                    alignment: "center"
                                },
                            ],
                        ],
                    },
                },

                {
                    layout: 'noBorders',
                    style: 'table',
                    table: {
                        widths: ["*", "*"],
                        alignment: "center",
                        body: [
                            [
                                {
                                    text: [
                                        { text: `DATE RETOUR :\n\n`, bold: true, fontSize: "10" },
                                        { text: `Nº BORDEREAU : \n`, bold: true, fontSize: "10" },
                                    ],
                                    alignment: 'left'
                                },
                                {
                                    text: [
                                        { text: `DATE ENCAISSEMENT :\n\n`, bold: true, fontSize: "10" },
                                        { text: `MOTIF DE RETOUR : \n`, bold: true, fontSize: "10" },
                                    ],
                                    alignment: 'left'
                                }
                            ]
                        ],
                    },
                }
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
                    margin: [0, 10, 0, 0]
                },
                headerTable: {
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    color: "#00008F",
                   
                }
            }
        }

        pdfMake.createPdf(docDefinitionQuittance).download(contrat?.idQuittance == undefined ? "Quittance_" + contrat?.quittanceList[contrat?.quittanceList.length - 1] : "Quittance_" + contrat?.idQuittance);
    }

    outputAttestation(contrat: any, quittance: any, avenant: any) {
       
        let assure: any = {};
        let conducteur: any = {};
        let souscripteur: any = {};
        let adresseAgence = contrat?.agence?.commune || contrat?.agence?.commune != null ? contrat?.agence?.commune  + ` - `: '' + contrat?.agence?.wilaya
        

        contrat?.personnesList?.forEach((element: any) => {
            switch (element?.role?.idParam) {
                case 233:
                    conducteur = element?.personne
                    break;
                case 234:
                    souscripteur = element?.personne
                    break;
                case 235:
                    assure = element?.personne
                    break;
                case 236:
                    souscripteur = element?.personne
                    assure = element?.personne
                    break;
                case 237:
                    souscripteur = element?.personne
                    conducteur = element?.personne
                    break;
                case 280:
                    assure = element?.personne
                    conducteur = element?.personne
                    break;
                case 238:
                    souscripteur = element?.personne
                    assure = element?.personne
                    conducteur = element?.personne
                    break;

                default:
                    break;
            }
        });


        const docDefinitionAttestation: any = {
            pageMargins: [10, 5, 10, 50],
            border: [false, false, false, false],
            content: [
                {
                    text: [
                        // { text: `Nº de Police :`, bold: true, fontSize: "8" },
                        { text: contrat?.idContrat, fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 5, y: 11 }
                },
                {
                    text: [
                        // { text: `Nº Immatriculation :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList.filter((risque: any) => risque.paramRisque?.categorieParamRisque?.description == "vehicule").find((risque: any) => risque.paramRisque.codeParam == "P38")?.valeur, fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 5, y: 41 }
                },
                {
                    text: [
                        // { text: `Validité :`, bold: true, fontSize: "8" },
                        { text: `Ce présent contrat est valide ${contrat?.duree?.duree} ${contrat?.duree?.type_duree}`, fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 5, y: 71 }
                },
                {
                    text: [
                        // { text: `Assuré :`, bold: true, fontSize: "8" },
                        { text: contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial != null )? contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial)?.personne?.raisonSocial: assure?.nom + " " + assure?.prenom1, fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 373, y: 70 }
                },
                {
                    text: [
                        // { text: `Echéance :`, bold: true, fontSize: "8" },
                        { text: contrat?.dateExpiration?.split("T")[0], fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 373, y: 92 }
                },
                {
                    text: [
                        // { text: `N° Quittance :`, bold: true, fontSize: "8" },
                        { text: contrat?.quittanceList.length != 0 ? contrat?.quittanceList[contrat?.quittanceList.length - 1] : '', fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 383, y: 113 }
                },
                {
                    text: [
                        // { text: `Timbre :`, bold: true, fontSize: "8" },
                        { text: Number(quittance?.taxeList?.find((taxe: any) => taxe.taxe.code == "T02")?.primeProrata).toFixed(2), fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 320, y: 160 }
                },
                {
                    text: [
                        // { text: `Timbre Dim :`, bold: true, fontSize: "8" },
                        { text: Number(quittance?.taxeList?.find((taxe: any) => taxe.taxe.code == "T03")?.primeProrata).toFixed(2), fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 370, y: 160 }
                },
                {
                    text: [
                        // { text: `F gestion :`, bold: true, fontSize: "8" },
                        { text: Number(quittance?.taxeList?.find((taxe: any) => taxe.taxe.code == "T01" || taxe?.taxe?.code == 'T08')?.primeProrata).toFixed(2), fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 415, y: 160 }
                },
                {
                    text: [
                        // { text: `F fract :`, bold: true, fontSize: "8" },
                        { text: `0.00`, fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 467, y: 160 }
                },
                {
                    text: [
                        // { text: `TVA :`, bold: true, fontSize: "8" },
                        { text: Number(quittance?.taxeList?.find((taxe: any) => taxe.taxe.code == "T04")?.primeProrata).toFixed(2), fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 522, y: 160 }
                },
                {
                    text: [
                        // { text: `FGA :`, bold: true, fontSize: "8" },
                        { text: Number(quittance?.taxeList?.find((taxe: any) => taxe.taxe.code == "T07")?.primeProrata).toFixed(2), fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 567, y: 160 }
                },
                {
                    text: [
                        // { text: `Prime nette :`, bold: true, fontSize: "8" },
                        { text: Number(quittance?.primeList?.find((prime: any) => prime.typePrime.code == "CP101")?.primeProrata).toFixed(2), fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 325, y: 225 }
                },
                {
                    text: [
                        // { text: `Prime totale :`, bold: true, fontSize: "8" },
                        { text: Number(quittance?.primeList?.find((prime: any) => prime.typePrime.code == "CP186")?.primeProrata).toFixed(2), fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 390, y: 225 }
                },
                {
                    text: [
                        // { text: `wilaya :`, bold: true, fontSize: "8" },
                        { text: contrat?.agence?.wilaya, fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 352, y: 262 }
                },
                {
                    text: [
                        // { text: `date effet :`, bold: true, fontSize: "8" },
                        { text: quittance?.auditDate?.split("T")[0], fontSize: "8" }
                    ], fontSize: "8", absolutePosition: { x: 342, y: 287 }
                },
                 {
                    table: {
                        widths: ["20%"],
                        body: [
                            [
                                // { text: `assuré :`, bold: true, fontSize: "8" },
                                // { text: contrat?.typeClient?.description == "personne morale" ? assure?.raisonSocial + `\n` : assure?.nom + " " + assure?.prenom1 + `\n`, fontSize: "8" },
                                { text: contrat?.agence?.raisonSocial + "\n" +
                                        contrat?.agence?.adresse + "\n" +
                                        adresseAgence
                                , fontSize: "8" },
                            ]
                        ],
                    },
                    absolutePosition: { x: 15, y: 489 },
                    layout: 'noBorders'
                },
                {
                    text: [
                        // { text: `N° attestation :`, bold: true, fontSize: "8" },
                        { text: avenant?.numAttestation, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 147, y: 489 }
                },
                {
                    text: [
                        // { text: `assuré :`, bold: true, fontSize: "8" },
                       // { text: contrat?.typeClient?.description == "personne morale" ? assure?.raisonSocial + `\n` : assure?.nom + " " + assure?.prenom1 + `\n`, fontSize: "8" },
                        { text: contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial != null )? contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial)?.personne?.raisonSocial+ `\n`: assure?.nom + " " + assure?.prenom1 + `\n`, fontSize: "8" },
                        { text: assure?.adressesList[0].description + `\n`, fontSize: "8" },
                        { text: assure?.adressesList[0].commune?.description + ` - ` + assure?.adressesList[0].wilaya?.description, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 15, y: 559 }
                },
                {
                    text: [
                        // { text: `N° police :`, bold: true, fontSize: "8" },
                        { text: contrat?.idContrat, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 78, y: 615 }
                },
                {
                    text: [
                        // { text: `date effet et echéance :`, bold: true, fontSize: "8" },
                        { text: avenant != null ? avenant.dateAvenant?.split("T")[0]+ ` au ` + contrat?.dateExpiration?.split("T")[0] : contrat?.dateEffet?.split("T")[0] + ` au ` + contrat?.dateExpiration?.split("T")[0], fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 78, y: 625 }
                },
                {
                    text: [
                        // { text: `Immatriculation vehicule :`, bold: true, fontSize: "8" },
                        //avant multiRisque
                        // { text: contrat?.risqueList?.find((risque: any) => risque.paramRisque.codeParam == "P38")?.valeur, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P38")?.reponse?.valeur, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 20, y: 683 }
                },
                {
                    text: [
                        // { text: `Marque vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P25")?.reponse?.idParamReponse?.description, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 130, y: 683 }
                },
                // {
                //     text: [
                //         // { text: `Genre vehicule :`, bold: true, fontSize: "8" },
                //         { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P50")?.reponse?.idParamReponse?.description, fontSize: "8" },
                //     ], fontSize: "8", absolutePosition: { x: 192, y: 683 }
                // },
                {
                    table: {
                        widths: ["20%"],
                        body: [
                            [
                                // { text: `Genre vehicule :`, bold: true, fontSize: "8" },
                                { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P50")?.reponse?.idParamReponse?.description, fontSize: "8" },
                            ]
                        ],
                    },
                    absolutePosition: { x: 192, y: 683 },
                    layout: 'noBorders'
                },
                contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P31")?.reponse?.idParamReponse?.code != "R184" ?
                {
                    text: [
                        // { text: `Immatriculation vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P38")?.reponse?.valeur, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 20, y: 748 }
                } : {},
                contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P31")?.reponse?.idParamReponse?.code != "R184" ?
                {
                    text: [
                        // { text: `Marque vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P25")?.reponse?.idParamReponse?.description, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 130, y: 748 }
                } : {},
                contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P31")?.reponse?.idParamReponse?.code != "R184" ?
                {
                    table: {
                        widths: ["20%"],
                        body: [
                            [
                                // { text: `Genre vehicule :`, bold: true, fontSize: "8" },
                                { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P50")?.reponse?.idParamReponse?.description, fontSize: "8" },
                            ]
                        ],
                    },
                    absolutePosition: { x: 192, y: 748 },
                    layout: 'noBorders'
                }:{},              
                
                {
                    text: [
                        { text: contrat?.agence?.raisonSocial + `\n`, fontSize: "8" },
                        { text: contrat?.agence?.adresse + `\n`, fontSize: "8" },
                        { text: contrat?.agence?.commune || contrat?.agence?.commune != null ? contrat?.agence?.commune  + ` - `: '' + contrat?.agence?.wilaya, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 338, y: 490 }
                },
                {
                    text: [ // non pris en charge en saga (technisys carte verte)
                        // { text: `N° attestation :`, bold: true, fontSize: "8" },
                        { text: ``, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 470, y: 490 }
                },
                {
                    text: [
                        // { text: `assuré :`, bold: true, fontSize: "8" },
                       // { text: contrat?.typeClient?.description == "personne morale" ? assure?.raisonSocial + `\n` : assure?.nom + " " + assure?.prenom1 + `\n`, fontSize: "8" },
                        { text:contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial != null )? contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial)?.personne?.raisonSocial + `\n`: assure?.nom + " " + assure?.prenom1 + `\n`, fontSize: "8" },
                        { text: assure?.adressesList[0]?.description + `\n`, fontSize: "8" },
                        { text: assure?.adressesList[0]?.commune?.description + ` - ` + assure?.adressesList[0]?.wilaya?.description, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 338, y: 560 }
                },
                {
                    text: [
                        // { text: `N° police :`, bold: true, fontSize: "8" },
                        { text: contrat?.idContrat, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 403, y: 615 }
                },
                {
                    text: [
                        // { text: `date effet et echéance :`, bold: true, fontSize: "8" },
                        { text: avenant != null ? avenant.dateAvenant?.split("T")[0]+ ` au ` + contrat?.dateExpiration?.split("T")[0] : contrat?.dateEffet?.split("T")[0] + ` au ` + contrat?.dateExpiration?.split("T")[0], fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 403, y: 625 }
                },
                {
                    text: [
                        // { text: `Immatriculation vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P38")?.reponse?.valeur, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 340, y: 685 }
                },
                {
                    text: [
                        // { text: `Marque vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P25")?.reponse?.idParamReponse?.description, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 450, y: 685 }
                },
                {
                    text: [
                        // { text: `Genre vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P50")?.reponse?.idParamReponse?.description, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 515, y: 685 }
                },
                contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P31")?.reponse?.idParamReponse?.code != "R184" ?
                {
                    text: [
                        // { text: `Immatriculation vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P38")?.reponse?.valeur, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 340, y: 748 }
                }:{},
                contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P31")?.reponse?.idParamReponse?.code != "R184" ?
                {
                    text: [
                        // { text: `Marque vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P25")?.reponse?.idParamReponse?.description, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 450, y: 748 }
                } : {},
                contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P31")?.reponse?.idParamReponse?.code != "R184" ?
                {
                    text: [
                        // { text: `Genre vehicule :`, bold: true, fontSize: "8" },
                        { text: contrat?.risqueList?.find((risque: any) => risque.codeRisque == "P50")?.reponse?.idParamReponse?.description, fontSize: "8" },
                    ], fontSize: "8", absolutePosition: { x: 515, y: 748 }
                } : {},
            ]
        }

        pdfMake.createPdf(docDefinitionAttestation).download("Attestation_" + contrat?.idContrat);
    }

    getPaysList(){
        const httpOption = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
            })
        };


        

        return this.http.get<any[]>(`${Constants.API_ENDPOINT_pays}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
  
    outputAttestationFlotte(contrat: any, avenant: any) {

        if(contrat.produit.codeProduit=='45L'&& avenant?.typeAvenant.code=='A27'){
            let risqlist :any []
            risqlist=avenant.risqueList
            // console.log('kkkk',risqlist)
        
            contrat.risqueList=risqlist
            // console.log('je suis contrt 45l',contrat,avenant)
        }

        //////console.log("contrat ==>")
        //////console.log(contrat)
        //////console.log("avenant ==>")
        //////console.log(avenant)
        // console.log('bonjour lattestaion', contrat  , avenant)

        avenant
        let assure: any = {};
        let conducteur: any = {};
        let souscripteur: any = {};
        let risqueListVehicule: any = []
        let risques: any = []
        let adresseAgence = contrat?.agence?.commune || contrat?.agence?.commune != null ? contrat?.agence?.commune  + ` - `: '' + contrat?.agence?.wilaya
        
        
        contrat?.personnesList?.forEach((element: any) => {
            switch (element?.role?.idParam) {
                case 233:
                    conducteur = element?.personne
                    break;
                case 234:
                    souscripteur = element?.personne
                    break;
                case 235:
                    assure = element?.personne
                    break;
                case 236:
                    souscripteur = element?.personne
                    assure = element?.personne
                    break;
                case 237:
                    souscripteur = element?.personne
                    conducteur = element?.personne
                    break;
                case 280:
                    assure = element?.personne
                    conducteur = element?.personne
                    break;
                case 238:
                    souscripteur = element?.personne
                    assure = element?.personne
                    conducteur = element?.personne
                    break;

                default:
                    break;
            }
        });

        

        //Get info riques 
        // avenant?.typeAvenant?.code == "A19" || avenant?.typeAvenant?.code == "A20" || avenant?.typeAvenant?.code == "A03"|| avenant?.typeAvenant?.code == "A06" || avenant?.typeAvenant?.code == "A08"?
        if (avenant?.typeAvenant !== undefined && avenant?.risqueList.length != 0) {


                           
 // if (avenant?.typeAvenant?.code == "A20" ||avenant?.typeAvenant?.code == "A168" || avenant?.typeAvenant?.code == "A08" || avenant?.typeAvenant?.code == "A11" || avenant?.typeAvenant?.code == "A26" || avenant.typeAvenant.code == "A18") {
    if (avenant?.typeAvenant?.code == "A20"||avenant?.typeAvenant?.code == "A27" ||avenant?.typeAvenant?.code == "A168" || avenant?.typeAvenant?.code == "A08" || avenant?.typeAvenant?.code == "A11" || avenant?.typeAvenant?.code == "A26" || avenant.typeAvenant.code == "A18") {

            avenant?.risqueList.map((risque: any) => {
                    risques.push(risque);
                })
               
            }

        } else {
           
                     // if (contrat && contrat.groupeList !== undefined && contrat.groupeList !== null) {
            //     risqueListVehicule = contrat?.groupeList.filter((groupe: any) => groupe?.risques)
            console.log('333333')
            if (contrat && contrat.groupesList !== undefined && contrat.groupesList !== null) {
                risqueListVehicule = contrat.groupesList.filter((groupe: any) => groupe?.risques)

            } else {
                    // risqueListVehicule = contrat?.groupesList.filter((groupe: any) => groupe?.risques)
                    risqueListVehicule = contrat.groupesList.filter((groupe: any) => groupe?.risques)

            }
            risqueListVehicule?.forEach((groupe: any) => {
                if (groupe?.risques) {
                    groupe.risques.map((risque: any) => {
                        risques.push(risque);
                    });
                }
            });
        }
      
        const docDefinitionAttestation: any = {
            pageMargins: [10, 5, 10, 50],
            border: [false, false, false, false],


            content: risques.map((risq: any) => ({
                stack: [
                    {
                        text: [
                            { text: contrat.produit.codeProduit=='45L' ? contrat?.idContrat +' / '+risq?.risque.find((risque: any) => risque.colonne == "Numero de contrat")?.valeur : contrat?.idContrat, fontSize: "8" }
                        ], fontSize: "8", absolutePosition: { x: 5, y: 11 }
                    },
                    {
                        text: [
                            { text: risq?.risque.find((risque: any) => risque.colonne == "N° d'Immatriculation")?.valeur, bold: true, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 5, y: 41 }
                    },
                    {
                        text: [
                            { text: `Ce présent contrat est valide ${contrat?.duree?.duree} ${contrat?.duree?.type_duree}`, fontSize: "8" }
                        ], fontSize: "8", absolutePosition: { x: 5, y: 71 }
                    },
                    {
                        table: {
                            widths: ["20%"],
                            body: [
                                [
                                    // { text: `assuré :`, bold: true, fontSize: "8" },
                                    // { text: contrat?.typeClient?.description == "personne morale" ? assure?.raisonSocial + `\n` : assure?.nom + " " + assure?.prenom1 + `\n`, fontSize: "8" },
                                    { text: contrat?.agence?.raisonSocial + "\n" +
                                            contrat?.agence?.adresse + "\n" +                                          
                                            adresseAgence
                                    , fontSize: "8" },
                                ]
                            ],
                        },
                        absolutePosition: { x: 15, y: 489 },
                        layout: 'noBorders'
                    },                   

                   
                    {
                        text: [
                            { text: ``, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 147, y: 489 }
                    },
                    {
                        text: [
                            { text: contrat?.personnesList[0].personne?.raisonSocial ? contrat.produit.codeProduit=='45L' ? contrat?.personnesList[0].personne.raisonSocial + " LOC " + risq?.risque.find((risque: any) => risque.colonne == "Nom & Prénom Crédit Preneur/Raison Social")?.valeur : contrat?.personnesList[0].personne.raisonSocial : contrat?.personnesList[0].personne.nom + `\n`, fontSize: "8" },
                            { text:"\n", fontSize: "8" },
                            { text: contrat?.personnesList[0].personne?.adressesList[0].description + `\n`, fontSize: "8" },
                          
                            { text: contrat?.personnesList[0].personne?.adressesList[0]?.commune?.description + ` - ` + contrat?.personnesList[0].personne?.adressesList[0]?.wilaya?.description + `\n`, width: '40%', fontSize: "8" }

                        ], fontSize: "8", absolutePosition: { x: 15, y: 559 }
                    },
                    
                    {
                        text: [
                            { text: contrat.produit.codeProduit=='45L' ? contrat?.idContrat +' / '+risq?.risque.find((risque: any) => risque.colonne == "Numero de contrat")?.valeur : contrat?.idContrat , fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 78, y: 615 }
                    },
                    {
                        text: [
                            { text: (avenant.typeAvenant.code=="A168" || avenant.typeAvenant.code=="A27" || avenant.typeAvenant.code=="A20"? avenant?.dateAvenant?.split("T")[0] : contrat?.dateEffet?.split("T")[0])  + ` au ` + contrat?.dateExpiration?.split("T")[0], fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 78, y: 625 }
                    },
                    {
                        text: [
                            { text: risq?.risque.find((risque: any) => risque.colonne == "N° d'Immatriculation")?.valeur, bold: true, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 20, y: 683 }
                    },
                    {
                        text: [

                            { text: risq?.risque.find((risque: any) => risque.colonne == "Marque")?.valeur, bold: true, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 130, y: 683 }
                    },
                    {
                        text: [
                            { text: risq?.risque.find((risque: any) => risque.colonne == "classe de vehicule")?.valeur, bold: true, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 192, y: 683 }
                    },
                    // {
                    //     text: [

                    //         { text: risq?.risque.find((risque: any) => risque.colonne == "N° d'Immatriculation")?.valeur, bold: true, fontSize: "8" },
                    //     ], fontSize: "8", absolutePosition: { x: 20, y: 748 }
                    // },
                    // {
                    //     text: [
                    //         { text: risq?.risque.find((risque: any) => risque.colonne == "Marque")?.valeur, bold: true, fontSize: "8" },
                    //     ], fontSize: "8", absolutePosition: { x: 130, y: 748 }
                    // },
                    // {
                    //     text: [
                    //         { text: risq?.risque.find((risque: any) => risque.colonne == "classe de vehicule")?.valeur, bold: true, fontSize: "8" },
                    //     ], fontSize: "8", absolutePosition: { x: 192, y: 748 }
                    // },
                  
                    {
                        text: [
                            { text: contrat?.agence?.raisonSocial + "\n", fontSize: "8" },
                            { text: contrat?.agence?.adresse + "\n", fontSize: "8" },
                            { text: contrat?.agence?.commune || contrat?.agence?.commune != null ? contrat?.agence?.commune  + ` - `: '' + contrat?.agence?.wilaya, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 338, y: 490 }
                    },
                    {
                        text: [
                            { text: ``, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 470, y: 490 }
                    },
                    {
                        text: [
                            { text: contrat?.personnesList[0].personne.raisonSocial ? contrat.produit.codeProduit=='45L' ? contrat?.personnesList[0].personne.raisonSocial + " LOC " + risq?.risque.find((risque: any) => risque.colonne == "Nom & Prénom Crédit Preneur/Raison Social")?.valeur : contrat?.personnesList[0].personne.raisonSocial: contrat?.personnesList[0].personne.nom  + `\n`, fontSize: "8" },
                            { text:"\n", fontSize: "8" },
                            { text: assure?.adressesList[0].description + `\n`, fontSize: "8" },                           
                            { text: assure?.adressesList[0].commune?.description + ` - ` + assure?.adressesList[0].wilaya?.description, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 338, y: 560 }
                    },
                    // {
                    //     text: [
                    //         { text: contrat?.idContrat, fontSize: "8" },
                    //     ], fontSize: "8", absolutePosition: { x: 403, y: 615 }
                    // },
                    {
                        text: [
                            { text: contrat.produit.codeProduit=='45L' ? contrat?.idContrat +' / '+risq?.risque.find((risque: any) => risque.colonne == "Numero de contrat")?.valeur : contrat?.idContrat , fontSize: "8" }
                        ], fontSize: "8", absolutePosition: { x: 403, y: 615 }
                    },
                    {
                        text: [
                            { text:  (avenant.typeAvenant.code=="A168" || avenant.typeAvenant.code=="A27" || avenant.typeAvenant.code=="A20" ? avenant?.dateAvenant?.split("T")[0] : contrat?.dateEffet?.split("T")[0])+ ` au ` + contrat?.dateExpiration?.split("T")[0], fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 403, y: 625 }
                    },
                   
                    {
                        text: [
                            { text: risq?.risque.find((risque: any) => risque.colonne == "N° d'Immatriculation")?.valeur, bold: true, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 340, y: 683 }
                    },
                    {
                        text: [
                            { text: risq?.risque.find((risque: any) => risque.colonne == "Marque")?.valeur, bold: true, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 450, y: 683 },

                    },
                    {
                        text: [
                            { text: risq?.risque.find((risque: any) => risque.colonne == "classe de vehicule")?.valeur, bold: true, fontSize: "8" },
                        ], fontSize: "8", absolutePosition: { x: 515, y: 683 },
                        pageBreak: risq.idRisque != risques[risques.length - 1].idRisque ? 'after' : null,
                    },
                    // {
                    //     text: [
                    //         { text: risq?.risque.find((risque: any) => risque.colonne == "N° d'Immatriculation")?.valeur, bold: true, fontSize: "8" },
                    //     ], fontSize: "8", absolutePosition: { x: 340, y: 748 }
                    // },
                    // {
                    //     text: [
                    //         { text: risq?.risque.find((risque: any) => risque.colonne == "Marque")?.valeur, bold: true, fontSize: "8" },
                    //     ], fontSize: "8", absolutePosition: { x: 450, y: 748 },

                    // },
                    // {
                    //     text: [
                    //         { text: risq?.risque.find((risque: any) => risque.colonne == "classe de vehicule")?.valeur, bold: true, fontSize: "8" },
                    //     ], fontSize: "8", absolutePosition: { x: 515, y: 748 },
                    //     pageBreak: risq.idRisque != risques[risques.length - 1].idRisque ? 'after' : null,
                    // },
                ]
            }))
        }

        pdfMake.createPdf(docDefinitionAttestation).download("Attestation_" + contrat?.idContrat);
    }
    // generatePdf(contrat: any) {
    //     this.outputContrat(contrat);
    //     this.outputAttestation(contrat);
    // }

    getPackIdRisque(idContrat: any, idRisque: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/${idContrat}/pack/risque/${idRisque}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getPackIdRisqueHistorique(idContrat: any, idRisque: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT_HISTORIQUE}/${idContrat}/pack/risque/${idRisque}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getPackIdRisques(idContrat: any, risques: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'skip': ''
            }),
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/${idContrat}/pack`, risques, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    getParamContratByIdRisque(idContrat: any, idGroupe: any, idRisque: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/${idContrat}/groupe/${idGroupe}/risque/${idRisque}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    getParamContratByIdRisqueHisto(idContrat: any, idGroupe: any, idRisque: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT_HISTORIQUE}/${idContrat}/groupe/${idGroupe}/risque/${idRisque}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    getParamContratFlotteByIdRisque(idContrat: any, idRisques: any[]) {

        const httpOption = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
                'skip': ''
            })
        };



        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/${idContrat}/pack`, idRisques, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getAllContratsCommercialLine(index:number,size:number) {
        const httpOption = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
            })
        };



        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT_COMEMRCIAL_LINE}?pageNumber=${index}&pageSize=${size}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getContratCommercialLine(numContrat: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT_COMEMRCIAL_LINE}/${numContrat}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    addContratCommercialLine(body: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTRAT_COMEMRCIAL_LINE}`, body, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    //generate contrat pdf
    async outputContrat(contrat: any) {   
//         console.log('contrat depuis output contrat',contrat)    
//         console.log('garantieliste',)
// console.log('contrat',contrat ,  
//     contrat?.idHistorique == undefined ,contrat?.avenantName=="Affaire nouvelle ")


const hisIsUndef=contrat?.idHistorique == undefined
const isAffNouv=contrat?.avenantName=="Affaire nouvelle "

        let index = 0;
        let garanties: any = [];
        let champs: any = ["Garanties"];
        let widthChamp: any = [];
        let assure: any = {};
        let conducteur: any = {};
        let souscripteur: any = {};
        let risqueListVehicule: any = [];
        let valeurVenale: any = 0
        let risque: any = [];
        let risqueList: any = [];
        let zone = '';
        let dateDebut =moment(contrat?.risqueList?.find((el:any)=>el?.codeRisque==="P211")?.reponse?.valeur).format('DD/MM/YYYY');
        let dateRetour = moment( contrat?.dateExpiration).format('DD/MM/YYYY');
        let destination = contrat?.risqueList?.find((el:any)=>el?.codeRisque==="P182")?.reponse?.description;
        let duree=0;
        let garantieDomicile: any = [];
        let listGarantie: any = [];
        let headers: any = []
        let widthsHeaders:any[]=[80, 215, 125, 75];
        let widthTableAssures=contrat.produit.codeProduit ==="20G"?["*","*","*","*","*"]:["*","*","*","*"]
        let bodyTableAssure :any[]=[]
        let garantis=[];
        let packRowsGav= [{text:"Garanties", style: 'headerTable'}]
        let widthspackRowsGav=["*"]
        let gavGarantieTable :any[]=[]
        let isScolaire:boolean=false
        let risquesRows


       //console.log("je suis le contrat au niveau de contrat ",contrat)



// console.log("je suis le contrat au niveau de contrat ",contrat)
        
const cout_police= (contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == "T01")?.primeProrata)
// console.log('je suis coutt de police dans outputcontrat', cout_police , contrat?.idHistorique )

               const data=contrat.personnesList
               if(data.find((item: { role: { code: string; }; }) => (item.role.code === "CP234" || item.role.code === "CP236"))){

                this.souscripteur01 = data.find((item: { role: { code: string; }; }) => (item.role.code === "CP234" || item.role.code === "CP236"));
                this.sousExit=true
               }else{
                this.souscripteur01=null
                this.sousExit=false
               }

               
//console.log('taaaddda',this.souscripteur01?.perosnne);   



        const isContratVoyage = contrat?.produit?.codeProduit==="20A";
        if(contrat.produit.codeProduit ==="20G"){
            bodyTableAssure= [
                { text: 'Numéro d’assuré ', style: 'headerTable' },
                { text: 'Nom et Prénom', style: 'headerTable' },
                { text: 'Date de naissance', style: 'headerTable' },
                { text: 'Pack', style: 'headerTable' },
                { text: 'Prime nette', style: 'headerTable' }
              ]
        }else{
            bodyTableAssure= [
                { text: 'Numéro d’assuré ', style: 'headerTable' },
                { text: 'Nom et Prénom', style: 'headerTable' },
                { text: 'Date de naissance', style: 'headerTable' },     
                { text: 'Prime nette', style: 'headerTable' }
              ]

        }

        console.log("contrat.gavGarantieTable", contrat.gavGarantieTable)

        if(contrat.produit.codeProduit ==="20G"){
            contrat?.groupeList.forEach((el:any) => {
                packRowsGav.push({text:el.pack.description, style: 'headerTable'})
                widthspackRowsGav.push("*")
                if(el.pack.codePack=="G03"){
                    isScolaire=true               
                } else {
                    contrat.gavGarantieTable = contrat.gavGarantieTable.filter((item: any) => 
                        item[0].text !== "Bris de lunettes en cas d’accident" && 
                        item[0].text !== "Prothèse dentaire en cas d’accident"
                    );
                }
            });
            contrat.gavGarantieTable.unshift(packRowsGav)
            risquesRows = contrat?.groupeList?.flatMap((groupe: any) =>
                groupe?.risques?.map((risque: any) => [
                  { text: risque?.idRisque, fontSize: "8", alignment: "center" },
                  { 
                    text: (risque?.risque.find((cln:any)=>cln.colonne=="Nom")?.valeur || '') + " " + (risque?.risque.find((cln:any)=>cln.colonne=="Prénom")?.valeur || ''), 
                    fontSize: "8", 
                    alignment: "center" 
                  },
                  { 
                    text: moment(risque?.risque.find((cln:any)=>cln.colonne=="DateDeNaissance")?.valeur).format('DD/MM/YYYY') || '', 
                    fontSize: "8", 
                    alignment: "center" 
                  },
                  { 
                    text: groupe.pack.description, 
                    fontSize: "8", 
                    alignment: "center" 
                  },
                  { 
                    text: contrat?.primeListRisques?.find((rsq: any) => rsq.id === risque?.idRisque)?.prime || '', 
                    fontSize: "8", 
                    alignment: "center" 
                  }
                ])
              ) || [];
              //////console.log("risqrow",risquesRows)

        }else{
            //////console.log("qsdqsd",contrat?.groupeList?.[0]?.risques)
            risquesRows = contrat?.groupeList?.[0]?.risques?.map((risque: any) => [
                // console.log ("datte naiss",risque?.risque.find((cln:any)=>cln.colonne=="DateDeNaissance")),
                { text: risque?.idRisque, fontSize: "8",alignment:"center" },
                { text:(risque?.risque.find((cln:any)=>cln.colonne=="Nom")?.valeur || '') + " " + (risque?.risque.find((cln:any)=>cln.colonne=="Prénom")?.valeur || ''), fontSize: "8",alignment:"center" },
                { text:  moment(risque?.risque.find((cln:any)=>cln.colonne=="DateDeNaissance")?.valeur).format('DD/MM/YYYY') || '', fontSize: "8",alignment:"center" },
                { text: contrat?.primeListRisques?.find((rsq:any)=>rsq.id ===risque?.idRisque)?.prime, fontSize: "8",alignment:"center" }
            ]) || [];
             garantis = contrat?.paramContratList?.map((garantie:any,idx:number)=>[
                {text:garantie?.description,fontSize:"8"},
                {text:idx!==1?"-":"15%",alignment:"center",fontSize:"8"},
                {text:idx===2?"Voir conditions au verso":`${contrat?.garantiePlafond?.[garantie?.description]} DZD`,alignment:"center",fontSize:"8"}
            ])||[];
        }
       
    
        switch (contrat?.pack?.codePack) {
            case "V01":
                zone="Monde entier sauf USA, Canada, Japon, Singapour"
                break;
            case "V02":
                zone="Monde entier"
                break;
            case "V04" :
                zone="Tunisie"
                break;
            case "V03" :
                zone="Turquie"
                break;
            default:
                break;
        }

        
        if (dateDebut && dateRetour) {
            const startDate = moment(dateDebut, 'DD/MM/YYYY');
            const endDate = moment(dateRetour, 'DD/MM/YYYY').add(1,"day");
            duree = endDate.diff(startDate, 'days');
        }
        if(isContratVoyage){
            widthsHeaders=["60%", "25%", "15%"]
        }
        contrat?.produit.codeProduit == "95" ?
            headers = [{
                text: `Garanties `,
                fontSize: 8,
                style: "headerTable"
            },
            {
                text: `Sous Garanties`,
                fontSize: 8,
                style: "headerTable"
            },
            {
                text: `Plafonds `,
                fontSize: 8,
                style: "headerTable"
            },
            {
                text: `Franchise `,
                fontSize: 8,
                style: "headerTable"
            },
            {
                text: `Primes `,
                fontSize: 8,
                style: "headerTable"
            },
            ] : isContratVoyage?
            headers = [{
                text: `Garanties `,
                style: "headerTable"
            },
            {
                text: `Limites & plafonds `,
                style: "headerTable"
            },
            {
                text: `Franchise `,
                style: "headerTable"
            },
            ]
            :
            headers = [{
                text: `Garanties `,
                style: "headerTable"
            },
            {
                text: `Sous Garanties`,
                style: "headerTable"
            },
            {
                text: `Plafonds `,
                style: "headerTable"
            },
            {
                text: `Franchise `,
                style: "headerTable"
            },

            ];
        let headers2 = [{
            text: `Garanties `,
            style: "headerTable",

        },
        {
            text: `Sous Garanties`,
            style: "headerTable"
        },
        {
            text: `Limites de garanties `,
            style: "headerTable"
        },
        {
            text: `Limite par an `,
            style: "headerTable"
        },
        {
            text: `Franchises `,
            style: "headerTable"
        }
        ];

        risqueListVehicule = contrat?.risqueList.filter((risque: any) => risque?.categorieParamRisque == "vehicule")
        valeurVenale = contrat?.risqueList.find((risque: any) => risque.codeRisque == "P40")?.reponse?.valeur
        risqueList = contrat?.risqueList.filter((risque: any) => risque.categorieParamRisque != "vehicule")
        
        index = 0;
        // function reorderRisqueList(risqueList:any, codesRisqueRecherche:any) {
                
        //     const matchingItems = risqueList
        //       .filter((item:any) => codesRisqueRecherche.includes(item.codeRisque))
        //       .sort((a:any, b:any) => codesRisqueRecherche.indexOf(a.codeRisque) - codesRisqueRecherche.indexOf(b.codeRisque));
          
              
        //     const remainingItems = risqueList.filter((item:any) => !codesRisqueRecherche.includes(item.codeRisque));
          
            
        //     return [...matchingItems, ...remainingItems];
        // }
        
        function reorderRisqueList(risqueList:any, codesRisqueRecherche:any) {
                
            const matchingItems = risqueList
              .filter((item:any) => codesRisqueRecherche.includes(item.codeRisque))
              .sort((a:any, b:any) => codesRisqueRecherche.indexOf(a.codeRisque) - codesRisqueRecherche.indexOf(b.codeRisque));
          
              
            const remainingItems = risqueList.filter((item:any) => !codesRisqueRecherche.includes(item.codeRisque));
          
            
            return [...matchingItems, ...remainingItems];
        }
          

        switch (contrat.produit.codeProduit) {
            case "97" :{

                const indexSMPToRemove = risqueList?.findIndex((risque:any) => risque?.codeRisque === "P245");

                if (indexSMPToRemove !== -1) {
                // Remove the found object at the found index
                risqueList.splice(indexSMPToRemove, 1);
                ////console.log('new rsiquelist',risqueList)
                }

                  const codesRisqueRecherche = ["P222", "P264", "P263", "P223", "P224", "P318"];
                  risqueList = reorderRisqueList(risqueList, codesRisqueRecherche);

                  break;
            }

            default:
                break;

        }
        console.log("risqueList ", risqueList);
        while (index < risqueList?.length) {
            risque.push({
                text1: [

                    { text: risqueList[index].libelle + ": ", bold: true, fontSize: "8" },
                    { text: risqueList[index].typeChamp == "Liste of values" ? risqueList[index].reponse?.idParamReponse?.description : risqueList[index].typeChamp == "From Table" ? risqueList[index].reponse?.description : risqueList[index].typeChamp == "Number" ? Number(risqueList[index].reponse?.valeur).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : risqueList[index].reponse?.valeur, fontSize: "8" },
                ],
                text2: [
                    { text: risqueList[index + 1] ? risqueList[index + 1].libelle + ": " : "", bold: true, fontSize: "8" },
                    { text: risqueList[index + 1] ? risqueList[index + 1].typeChamp == "Liste of values" ? risqueList[index + 1].reponse?.idParamReponse?.description : risqueList[index + 1].typeChamp == "From Table" ? risqueList[index + 1].reponse?.description : risqueList[index+1].typeChamp == "Number" ? Number(risqueList[index+1].reponse?.valeur).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : risqueList[index + 1].reponse?.valeur : "", fontSize: "8" },
                ]

            })
            index = index + 2;
        }

        contrat?.personnesList?.forEach((element: any) => {
            ////console.log("jesuis le contrat",contrat)
            ////console.log("jesuis le element perosnne",element)
            ////console.log("jesuis formsous",souscripteur)


            switch (element?.role?.idParam) {
                case 233:
                    conducteur = element?.personne
                    break;
                case 234:
                    souscripteur = element?.personne
                    break;
                case 235:
                    assure = element?.personne
                    break;
                case 236:
                    souscripteur = element?.personne
                    assure = element?.personne
                    break;
                case 237:
                    souscripteur = element?.personne
                    conducteur = element?.personne
                    break;
                case 280:
                    assure = element?.personne
                    conducteur = element?.personne
                    break;
                case 238:
                    souscripteur = element?.personne
                    assure = element?.personne
                    conducteur = element?.personne
                    break;

                default:
                    break;
            }
        });
        index = 0;
        while (index < contrat?.paramContratList?.length) {
            if ((contrat?.paramContratList[index].prime && contrat?.paramContratList[index].prime != "0") || contrat?.produit?.codeProduit != "95") {
                contrat?.paramContratList[index].categorieList?.map((element: any) => {
                    champs.push(element?.description)
                });
            }

            index++;
        }
        champs = champs.filter((x: any, i: any) => champs.indexOf(x) === i);
        champs.push("Primes nettes")

        champs.map((champ: string) => {
            widthChamp.push("*")
        })
    
        if (contrat?.produit.codeProduit == "96" || contrat?.produit.codeProduit == "95") {

            let garantie: any = []
            garantie = contrat?.paramContratList?.find((item: any) => item.codeGarantie === "J01") ;
            garantieDomicile.push(garantie)
            listGarantie = contrat?.paramContratList?.filter((item: any) => item.codeGarantie != "J01") || [];
            // console.log("je suis la liste de garanti",garantie,listGarantie,)

        }
        if(isContratVoyage){
            listGarantie= [
                {
                    description: "Décès",
                    franchise:"",
                    plafond:contrat.paramContratList?.find((param:any)=>param?.codeGarantie==="G42")?.categorieList?.[0]?.valeur + ' DZD',
                   
                },
                {
                    description: "Incapacité Permanente Totale / Partielle",
                    franchise:"15%",
                    plafond:contrat.paramContratList?.find((param:any)=>param?.codeGarantie==="G43")?.categorieList?.[0]?.valeur + ' DZD',
                },
                {
                    description: "Rapatriement de corps en cas de décès",
                    franchise:"",
                    plafond:"Frais réels",
                    plafondInfo:"(2)"
                },
                {
                    description: "Rapatriement des autres bénéficiaires",
                    franchise:"",
                    plafond:"Frais réels",
                    plafondInfo:"(4)"
                },
                {
                    description: "Assistance : Prise en charge des frais médicaux",
                    franchise:"40€",
                    plafond:contrat?.pack?.codePack==="V01"? "30 000 €"
                    : contrat?.pack?.codePack==="V02"? "50 000 €":contrat?.pack?.codePack==="V03"?"10 000 €":"5 000 €",
                },
                {
                    description: "Transport Sanitaire",
                    franchise:"",
                    plafond:"Frais réels",
                    plafondInfo:"(1)"
                   
                },
                {
                    description: "Visite d’un proche parent si l’hospitalisation du bénéficiaire est supérieure à 10 jours",
                    franchise:"",
                    plafond:"Frais réels" ,
                    plafondInfo:"(3)"
        
                },
                {
                    description: "Prolongation de séjour",
                    franchise:"",
                    plafond:"80 Euros/ nuit, Max 7 nuitées",
                },
                {
                    description: "Prise en charge des soins dentaires d’urgence",
                    franchise:"25€",
                    plafond:"160 Euros",
                },
                {
                    description: "Retour prématuré du Bénéficiaire",
                    franchise:"",
                    plafond:"Frais réels",
                    plafondInfo:"(5)"
        
                },
                {
                    description: "Frais de secours et sauvetage",
                    franchise:"",
                    plafond:"2 500 Euros",
                },
                {
                    description: "Assistance juridique",
                    franchise:"",
                    plafond:"4 000 Euros",
                },
                {
                    description: "Avance de caution pénale",
                    franchise:"",
                    plafond:"10 000 Euros",
                },
                {
                    description: "Perte de bagage, max = 40 kg",
                    franchise:"",
                    plafond:"20 Euros /kg",
                },
                {
                    description: "Retard de vol de plus de 12 heures",
                    franchise:"",
                    plafond:"150 Euros",
                },
                {
                    description: "Retard de livraison bagages de plus 48 heures",
                    franchise:"",
                    plafond:"300 Euros",
                },
                {
                    description: "Transmission de message urgent",
                    franchise:"",
                    plafond:"Illimité",
                },
                ]
        }

        if(contrat?.produit?.codeProduit=='97'){
            if(contrat.sousProduit.code=="CTH"){
        
            const    valas= contrat?.risqueList.find((risque: { codeRisque: string; }) => risque.codeRisque === "P152");
            this.valas= valas.reponse.valeur*0.8
        //////console.log('je suis la valeur assure', this.valas)
    }
        if(contrat.sousProduit.code =="CTI"){
            const    valas= contrat?.risqueList.find((risque: { codeRisque: string; }) => risque.codeRisque === "P270");
        this.valtot= valas.reponse.valeur*0.5

}}
      

        index = 0;
        while (index < contrat?.paramContratList?.length) {
            if ((contrat?.paramContratList[index].prime && contrat?.paramContratList[index].prime != "0") || contrat?.produit?.codeProduit != "95") {
                let tmp = {
                    Garanties: [
                        { text: contrat?.paramContratList[index].description, fontSize: "8" },
                    ],
                    plafond: [
                        { text: '', fontSize: "8" },
                    ],
                    formule: [
                        { text: '', fontSize: "8" },
                    ],
                    franchise: [
                        { text: '', fontSize: "8" },
                    ],
                    "Primes nettes": [
                        { text: Number(contrat?.paramContratList[index].prime).toFixed(2), fontSize: "8" },
                    ],
                };

                contrat?.paramContratList[index].categorieList?.map((cat: any) => {
                    switch (cat.description) {
                        case "plafond":
                        console.log("cat descr",cat.description)

                            if (cat.valeur == '0') { cat.valeur = valeurVenale }
                            tmp.plafond[0].text = cat.valeur
                            console.log('catval',tmp.plafond)
                            break;

                        case "formule":
                        console.log("cat descr",cat.description)

                            tmp.formule[0].text = cat.valeur
                        console.log("tempformule",tmp.formule)

                            break;

                        case "franchise":
                        console.log("cat descr",cat.description)

                            tmp.franchise[0].text = cat.valeur
                        console.log(" tmp.franchise",tmp.franchise[0].text)

                            break;

                        default:
                            break;
                    }
                })
                garanties.push(tmp);
            }

            index++;
        }

        let qr = "";
        let SignatureCourtier:string=""
        let widthSignature:number=0;
        let heightSignature:number=0;

        switch (contrat?.produit.codeProduit) {
            case "45A":
                SignatureCourtier= await getBase64ImageFromURL(this.http,'assets/signature-auto.png');
                widthSignature= 222
                heightSignature= 124
                qr = "https://www.axa.dz/wp-content/uploads/2023/10/Conditions-generales-Assurance-Automobile.pdf"
                break;
            case "96":
                SignatureCourtier= await getBase64ImageFromURL(this.http,'assets/signature-mrp-mrh.png');
                widthSignature= 336
                heightSignature= 143
                qr = "https://www.axa.dz/wp-content/uploads/2023/10/Conditions-Generales-Habitation.pdf"
                break;
            case "95":
                SignatureCourtier= await getBase64ImageFromURL(this.http,'assets/signature-mrp-mrh.png');
                widthSignature= 336
                heightSignature= 143
                qr = "https://www.axa.dz/wp-content/uploads/2023/11/Conditions-Generales-Multirisque-professionnelle.pdf"
                break;
            case '20A':
                SignatureCourtier= await getBase64ImageFromURL(this.http,'assets/signature-voyage-gav.png');
                widthSignature= 336
                heightSignature= 143
                qr="https://www.axa.dz/wp-content/uploads/2023/10/Conditions-Generales-Assurance-Voyage.pdf"
                break;
            case '20G':
                SignatureCourtier= await getBase64ImageFromURL(this.http,'assets/signature-voyage-gav.png');
                widthSignature= 336
                heightSignature= 143
                break;
    
        
            default:
                SignatureCourtier= ""
                break;
        } 


        const docDefinitionContrat: any = {
            watermark: { text: '', color: 'blue', opacity: 0.1 },
            pageMargins: isContratVoyage ?[44, 40, 40, 40]:[35, 10, 35, 30],
            border: [false, false, false, false],
            // header: function(currentPage: any, pageCount: any, pageSize: any) {         
            //     if(currentPage == 1) {
            //         return {
            //             stack: [

            //             ],
            //             margin: [35, 30, 35, 0]
            //         }
            //     }   
            // },
            content: [
                {
                    columns: [
                        { width: 120, text: '' }, // First empty column with a width of 120 units
                        qr !== "" ? { qr: qr, fit: '70', width: 'auto', margin: [0, 0, 20, 0] } : {}, // QR code column
                        {
                            width: '*', // Third column taking the remaining space
                            stack: [
                                contrat?.produit.codeProduit == "96" ?
                                {
                                    text: 'AXA  MultiRisque Habitation',
                                    style: 'sectionHeader'
                                }
                                :
                                {
                                    text: 'AXA ' + contrat?.produit?.description.toUpperCase(),
                                    style: 'sectionHeader'
                                },
                                {
                                    text: 'Conditions Particulières',
                                    style: 'sectionHeader',
                                    color: 'black'
                                },
                                // {
                                //     text: contrat?.pack?.description,
                                //     style: 'sectionHeader',
                                //     color: 'black'
                                // },
                                contrat.isAvenant?{
                                    text: contrat?.avenantName,
                                    style: 'sectionHeader',
                                    color: 'black'
                                }:{},
                                {
                                    text: (contrat.produit.codeProduit == '97' && contrat.sousProduit.code == "CTI") 
                                        ? "Bien industriel et commercial" 
                                        : (contrat.produit.codeProduit == '97' && contrat.sousProduit.code == "CTH") 
                                            ? "Bien immobilier" 
                                            : contrat?.pack?.description,
                                    style: 'sectionHeader',
                                    color: 'black'
                                },
                                
                                contrat?.convention != null ?
                                {
                                    text: 'Convention: ' +  contrat?.descriptionConvention ==undefined  ? contrat?.convention : contrat?.descriptionConvention,
                                  
                                    style: 'sectionHeader',
                                    color: 'black'
                                } : {},
                                contrat?.reduction != null  ?
                                {
                                    // text: 'Réduction: ' + contrat?.descriptionReduction,
                                    text: 'Réduction: ' + contrat?.descriptionReduction ==undefined  ? contrat?.reduction :contrat?.descriptionReduction,

                                    style: 'sectionHeader',
                                    color: 'black'
                                } : 
                               
                                {}
                            ]
                        }
                    ]
                },
                    {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `Agence`,
                                            style: "headerTable",
                                        }
                                    ],
                                ],
                            }
                        },
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: `Référence du contrat`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Nom et code agence : `, bold: true, fontSize: "8" },
                                                { text: contrat?.agence?.codeAgence + " " + contrat?.agence?.raisonSocial, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `N° Police: `, bold: true, fontSize: "8" },
                                                { text: contrat?.idContrat, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Adresse agence : `, bold: true, fontSize: "8" },
                                                { text: contrat?.agence?.adresse, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        isContratVoyage?{
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Durée : `, bold: true, fontSize: "8" },
                                                { text: `${duree}`, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }:{
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Type de contrat : `, bold: true, fontSize: "8" },
                                                { text: `Durée Ferme`, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Téléphone agence : `, bold: true, fontSize: "8" },
                                                { text: contrat?.agence?.telephone, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Date effet : `, bold: true, fontSize: "8" },
                                                { text: contrat?.dateEffet?.split("T")[0], fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `E-mail agence : `, bold: true, fontSize: "8" },
                                                { text: contrat?.agence?.email, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Date d'échéance contrat : `, bold: true, fontSize: "8" },
                                                { text: contrat?.dateExpiration?.split("T")[0], fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                isContratVoyage || contrat.produit.codeProduit=="20G" ?[
                    {
                        style: "table",
                        table: {
                            widths: ["*"],
                            alignment: "left",
                            body: [
                                [
                                    {
                                        text: `Souscripteur`,
                                        style: "headerTable",
                                        alignment: "left",

                                    },
                                ],
                            ],
                        }
                    },
                    {
                        table: {
                            widths: ["*"],
                            alignment: "left",
                            body: [
                                [
                                    {
                                        text: [
                                            { text: contrat?.typeClient?.description == "personne morale" ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                            { text: contrat?.canal?.code == "DV" ? contrat?.userResponse?.nom + " " + contrat?.userResponse?.prenom : contrat?.canal?.code != "DS" ? souscripteur?.nom + " " + souscripteur?.prenom1 : contrat?.typeClient?.description == "personne morale" ? souscripteur?.raisonSocial : souscripteur?.nom + " " + souscripteur?.prenom1, fontSize: "8" },
                                        ],
                                    },
                                ],
                            ],
                        }
                    },
                    {
                        table: {
                            widths: ["*"],
                            alignment: "left",
                            body: [
                                [
                                    {
                                        text: [
                                            { text: `Téléphone : `, bold: true, fontSize: "8" },
                                            { text: contrat?.canal?.code == "DV" ? contrat?.userResponse?.telephone : souscripteur?.contactList?.find((contact: any) => contact?.typeContact?.code == "CNT1")?.description, fontSize: "8" },
                                        ],
                                    },
                                ],
                            ],
                        }
                    },
                    {
                        table: {
                            widths: ["*"],
                            alignment: "left",
                            body: [
                                [
                                    {
                                        text: [
                                            { text: `E-mail : `, bold: true, fontSize: "8" },
                                            { text: contrat?.canal?.code == "DV" ? contrat?.userResponse?.email : souscripteur?.contactList?.find((contact: any) => contact?.typeContact?.code == "CNT2")?.description, fontSize: "8" },
                                        ],
                                    },
                                ],
                            ],
                        }
                    },
                ]
                :[
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `Souscripteur`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                       {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: `Assuré(e)`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            // text: [
                                            //     { text: `Nom & Prénom : `, bold: true, fontSize: "8" },
                                            //     { text: souscripteur?.nom + " " + souscripteur?.prenom1, fontSize: "8" },
                                            // ], 
                                            
                                            text: [
                                                { text: this.sousExit && souscripteur.raisonSocial != undefined ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                { text: this.sousExit && souscripteur.raisonSocial != undefined ?  souscripteur?.raisonSocial : souscripteur?.nom + " " + souscripteur?.prenom1 , fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: assure.raisonSocial != undefined ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                { text: assure.raisonSocial != undefined ?   assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "8" },
                                                // { text: contrat?.typeClient?.description == "personne morale" ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                // { text: contrat?.typeClient?.description == "personne morale" ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Né(e) le : `, bold: true, fontSize: "8" },
                                                { text: souscripteur?.dateNaissance?.split("T")[0], fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Né(e) le : `, bold: true, fontSize: "8" },
                                                { text: assure?.dateNaissance?.split("T")[0], fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `E-mail : `, bold: true, fontSize: "8" },
                                                { text: souscripteur?.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `E-mail : `, bold: true, fontSize: "8" },
                                                { text: assure?.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns: [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Téléphone : `, bold: true, fontSize: "8" },
                                                { text: souscripteur?.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                         {
                            table: {
                                widths: ["*"],
                                alignment: "right",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Téléphone : `, bold: true, fontSize: "8" },
                                                { text: assure?.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                }],
                risqueListVehicule?.length != 0 ?
                    {
                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: `Conducteur principal`,
                                                style: "headerTable"
                                            },
                                        ],
                                    ],
                                }
                            },

                            {
                                style: "table",
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: `Véhicule`,
                                                style: "headerTable"
                                            },
                                        ],
                                    ],
                                },
                            },
                        ],
                    } : {},
                risqueListVehicule?.length != 0 ?
                    {
                        columns: [
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                    { text: conducteur?.nom + ' ' + conducteur?.prenom1, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                }
                            },
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                columns: [
                                                    {
                                                        text: [
                                                            { text: `Marque : `, bold: true, fontSize: "8" },
                                                            { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P25')?.reponse?.idParamReponse?.description, fontSize: "8" },
                                                        ],

                                                    },
                                                    {
                                                        border: [false, true, true, true],
                                                        text: [
                                                            { text: `Modèle : `, bold: true, fontSize: "8" },
                                                            { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P26')?.reponse?.idParamReponse?.description, fontSize: "8" },
                                                        ],

                                                    }
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            }
                        ],
                    } : {},
                risqueListVehicule?.length != 0 ?
                    {
                        columns: [
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `E-mail : `, bold: true, fontSize: "8" },
                                                    { text: conducteur?.contactList?.find((c: any) => c.typeContact?.idParam == 8)?.description, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                }
                            },
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `N° de Châssis :  `, bold: true, fontSize: "8" },
                                                    { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P30')?.reponse?.valeur, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            }
                        ],
                    } : {},
                risqueListVehicule?.length != 0 ?
                    {
                        columns: [
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Téléphone : `, bold: true, fontSize: "8" },
                                                    { text: conducteur?.contactList?.find((c: any) => c.typeContact?.idParam == 7)?.description, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                }
                            },
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Immatriculation :  `, bold: true, fontSize: "8" },
                                                    { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P38')?.reponse?.valeur, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            }
                        ],
                    } : {},
                risqueListVehicule?.length != 0 ?
                    {
                        columns: [
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Né(e) le : `, bold: true, fontSize: "8" },
                                                    { text: conducteur?.dateNaissance?.split("T")[0], fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                }
                            },
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Date de mise en circulation : `, bold: true, fontSize: "8" },
                                                    // { text: risqueListVehicule.find((risque: any) => risque.paramRisque?.codeParam == 'P28')?.valeur?.split("T")[0], fontSize: "8" },
                                                    { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P28')?.reponse?.valeur, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            }
                        ],
                    } : {},
                risqueListVehicule?.length != 0 ?
                    {
                        columns: [
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Catégorie de permis : `, bold: true, fontSize: "8" },
                                                    { text: conducteur?.documentList?.find((d: any) => d.typeDocument?.idParam == 5)?.sousCategorie, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                }
                            },
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Valeur Vénale : `, bold: true, fontSize: "8" },
                                                    { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P40')?.reponse?.valeur + " DZD", fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            }
                        ],
                    } : {},
                risqueListVehicule?.length != 0 ?
                    {
                        columns: [
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Obtenu le : `, bold: true, fontSize: "8" },
                                                    { text: conducteur?.documentList?.find((d: any) => d.typeDocument?.idParam == 5)?.dateDelivrance?.split("T")[0], fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                }
                            },
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                columns: [
                                                    {

                                                        text: [
                                                            { text: `Genre : `, bold: true, fontSize: "8" },
                                                            { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P31')?.reponse?.idParamReponse?.description, fontSize: "8" },
                                                        ]
                                                    },
                                                    {

                                                        text: [
                                                            { text: `Usage : `, bold: true, fontSize: "8" },
                                                            { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P52')?.reponse?.idParamReponse?.description, fontSize: "8" },
                                                        ]
                                                    }
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            }
                        ],
                    } : {},
                    
                    isContratVoyage || contrat.produit.codeProduit=="20G" ? [
                    {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `Assure(es)`,
                                            style: "headerTable",
                                            alignment: "left",

                                        },
                                    ],
                                ],
                            }
                        },
                       
                    ],
                },
                
                {
                    table: {
                      widths: widthTableAssures, 
                      body: [
                        bodyTableAssure,
                         ...risquesRows, 

                      ]
                    }
                  },
                  {text:`\n`}, contrat.produit.codeProduit=="20G"?
                  [{
                      table: {
                          headerRows: 1,
                          widths: widthspackRowsGav,
                          body: isScolaire? contrat.gavGarantieTable.slice(0,6) : contrat.gavGarantieTable
                      },
                  },
                 { text: `(*) : Décès accidentel 4 – 13 ans Pas de capital décès                 (*) : Décès accidentel 13 – 18 ans`, fontSize: 6 }

              ]:
                [{
                  table: {
                      widths: ['*', '*'], 
                      body: [
                        [
                          { text: 'Informations du voyage', style: 'headerTable', colSpan: 2, alignment: 'center' },
                          ''
                        ], // Header row
                        [
                          { text: `Formule : ${contrat?.pack?.description}`,fontSize:"8"  },
                          { text: `Durée : ${duree} Jour(s)`,fontSize:"8" }
                        ], // Row 1
                        [
                          { text: `Zone : ${zone}`,fontSize:"8"  },
                          { text: `Date d’effet : ${dateDebut}`,fontSize:"8" }
                        ], // Row 2
                        [
                          { text: `Pays destination : ${contrat.isShengen ? destination+" (Schengen)" :destination}`,fontSize:"8"},
                          { text: `Date d’échéance : ${dateRetour}`,fontSize:"8" }
                        ], // Row 3
                      ]
                    }
              },
              {text:`\n`},
              {
                  table: {
                    widths: ['55%', '15%', '*'], // Define three columns with the first column auto-sized and the second column smaller
                    body: [
                      [
                        { text: 'Garanties', style: 'headerTable', colSpan: 3, alignment: 'center' },
                        '',
                        ''
                      ], // Header row
                      [
                        { text: 'Garanties accordées', style: 'headerTable' },
                        { text: 'Franchise', style: 'headerTable' },
                        { text: 'Capitaux', style: 'headerTable' }
                      ], // Row 1
                     ...garantis
                    ]
                  }

                }],
                ]:[
                risqueListVehicule?.length != 0 ? {} :
                    {
                        style: "table",
                        table: {
                            widths: ["*"],
                            alignment: "right",
                            body: [
                                [
                                    {
                                        //text: risqueList[0].paramRisque.categorieParamRisque.description,
                                        text: 'Caracteristique du risque assuré',
                                        style: "headerTable"
                                    },
                                ],
                            ],
                        },
                    },

                risqueListVehicule?.length != 0 ? {} : this.table(risque, ['text1', 'text2']),],




                { text: "\n" },


                 // Added table with two columns
                 (contrat?.produit?.codeProduit=='97' && contrat.sousProduit.code=="CTH")?[
                    {
                        style: "table",
                        table: {
                          widths: ["50%", "50%"],
                          body: [
                            [
                              {
                                text: "Limite de garantie 80%",
                                style: "headerTable",
                              },
                              {
                                text: `${this.valas}`,
                                fontSize: 8,
                              },
                            ],
                            [
                              {
                                text: "Franchise",
                                style: "headerTable",
                              },
                              {
                                text: "2 % des dommages, Minimum 30.000 DZD",
                                fontSize: 8,
                              },
                            ],
                          ],
                        },
                      },
                      
                  ]:
                  (contrat?.produit?.codeProduit=='97' && contrat.sousProduit.code=="CTI")?[
                    {
                        style: "table",
                        table: {
                          widths: ["50%", "50%"],
                          body: [
                            [
                              {
                                text: "Limite de garantie 50%",
                                style: "headerTable",
                              },
                              {
                                text: `${this.valtot} DZD`,
                                fontSize: 8,
                              },
                            ],
                            [
                              {
                                text: "Franchise",
                                style: "headerTable",
                              },
                              {
                                text: "10 % des dommages",
                                fontSize: 8,
                              },
                            ],
                          ],
                        },
                      },
                      
                  ]:

                { text: "\n" },

                //Debut Garanties et sous-garanties
                risqueListVehicule?.length != 0 ? garanties.length != 0 ? this.table(garanties, champs) : {} : {},
                //fin Garanties et sous garanties

                //debut Prime
                risqueListVehicule?.length != 0 ?
                    {
                        columns: [

                            {
                                style: "table",
                                table: {

                                    widths: ["*", "*", "*", "*", "*", "*"],
                                    body: [
                                        [
                                            {
                                                text: `Prime nette`,
                                                style: "headerTable"
                                            },
                                            contrat?.idHistorique == undefined || contrat?.nmouvement==0 ?
                                                {
                                                    text: `Coût de police `,
                                                    style: "headerTable"
                                                }
                                                : {
                                                    text: `Frais de gestion`,
                                                    style: "headerTable"
                                                },
                                            {
                                                text: `T.V.A`,
                                                style: "headerTable"
                                            },
                                            risqueListVehicule?.length != 0 ?
                                                {
                                                    text: `F.G.A`,
                                                    style: "headerTable"
                                                } : {},
                                            {
                                                text: `Timbre de dimension`,
                                                style: "headerTable"
                                            },
                                            risqueListVehicule?.length != 0 ?
                                                {
                                                    text: `Timbre gradué`,
                                                    style: "headerTable"
                                                } : {},
                                        ],
                                        [
                                            {
                                                text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            // contrat?.idHistorique == undefined ?
                                            contrat?.idHistorique == undefined || contrat?.nmouvement==0 ?
                                
                                             
                                            {
                                                    text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                }
                                                : {
                                                    text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                },
                                            /* {
                                                 text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
                                                 fontSize: 10
                                             },
                                             */
                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            risqueListVehicule?.length != 0 ?
                                                {
                                                    text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                } : {},
                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            risqueListVehicule?.length != 0 ?
                                                {
                                                    text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                } : {},
                                        ],
                                        [
                                            { text: '', colSpan: 4 },
                                            {},
                                            {},
                                            {},
                                            {
                                                text: `Prime Totale`,
                                                style: "headerTable",
                                            },
                                            {
                                                text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                        ],
                                    ],
                                }
                            }
                        ],
                    } : isContratVoyage || contrat.produit.codeProduit=="20G"?
                    {
                        table: {
                            widths: ['*', '*', '*', '*'], // Define five columns with equal width
                            body: [
                              [
                                { text: 'Prime nette', style: 'headerTable' },
                              
                                { text: 'Frais de gestion', style: 'headerTable' },
                                { text: 'Droit de timbres', style: 'headerTable' },
                                { text: 'Prime TTC', style: 'headerTable' }
                              ], // Header row
                              [
                                {text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",bold:true,alignment:"center",fontSize:"8"},
                                
                                {text:Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD" ,bold:true,alignment:"center",fontSize:"8"},
                                {text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",bold:true,alignment:"center",fontSize:"8"},
                                {text:Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",bold:true,alignment:"center",fontSize:"8"}
                              ] // Row 2
                            ]
                          }
                    }
                    :
                    {
                        columns: [

                            {
                                style: "table",
                                table: {

                                    widths: ["*", "*", "*", "*", "*", "*"],
                                    body: [
                                        [
                                            {
                                                text: `Prime nette`,
                                                style: "headerTable"
                                            },
                                            {
                                                text: `Prime sans réduction`,
                                                style: "headerTable"
                                            },
                                            contrat?.idHistorique == undefined || contrat?.nmouvement==0 ?
                                                {
                                                    text: `Coût de police`,
                                                    style: "headerTable"
                                                }
                                                : {
                                                    text: `Frais de gestion`,
                                                    style: "headerTable"
                                                },
                                            {
                                                text: `T.V.A`,
                                                style: "headerTable"
                                            },

                                            {
                                                text: `Timbre de dimension`,
                                                style: "headerTable"
                                            },
                                            {
                                                text: `Prime Totale`,
                                                style: "headerTable",
                                            },

                                        ],
                                        [
                                            {
                                                text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            {
                                                text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP264')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            // contrat?.idHistorique == undefined ?
                                            contrat?.idHistorique == undefined  || contrat?.nmouvement == 0 ?
                                            
                                                {
                                                    text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == "T01")?.primeProrata) + " DZD",
                                                    fontSize: 10
                                                }
                                                : {
                                                    text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD",
                                                    fontSize: 10
                                                },
                                                contrat.produit.codeProduit=="97"?
                                                { text: "  0.00 DZD",
                                                fontSize: 10}:
                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },

                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            {
                                                text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },

                                        ],
                                    ],
                                }
                            },

                        ],

                    },
                { text: "\n" },
                
                isContratVoyage?[
                    {
                        text: 'NB :',
                        bold: true,
                        margin: [0, 0, 0, 7],
                        fontSize:8
                      },
                      {
                        ul: [
                        'Toute modification de dates devra être demandée à l’assureur par le souscripteur, au moins 72 heures avant la prise d’effet du contrat.',
                        'La résiliation d’un contrat groupe ne peut se faire que pour la totalité des assurés mentionnés dans ce dernier.',
                        'En cas d’accident, de maladie inopinée ou afin d’invoquer les autres garanties d’assistance, vous devez contacter l’assisteur dans un délai maximum de 48h avant d’engager toute dépense.',
                        ],fontSize:8,bold:true
                    } ,
                    {
                        text: '\n',
                    
                      },
                
                
                ]:{},
                { 
                    text:"Le présent contrat est régi par le Code Civil, l'ordonnance n°95/07 du 25 Janvier 1995 modifiée par la loi n°06/04 du 20 Février 2006, relative aux Assurances , l'ordonnance n°74/15 du 30 Janvier 1974 modifiée et complétée par la loi n°88/31 du 19/07/1988 et les décrets n°80/34 - n°80/35 - n°80/36 et n°80/37 du 16 Février 1980.",
                    fontSize: "8",
                    color: 'black',
                    pageBreak: 'after'
                },



                contrat?.produit.codeProduit == "96" || contrat?.produit.codeProduit == "95" || isContratVoyage ?
                    {
                        style: 'table',
                        
                        text: isContratVoyage ? 'Tableau des garanties'+ ` - Formule : ${contrat?.pack?.description}`:"Tableau des garanties",
                        fontSize: 14,
                        color: 'black',
                        bold: true,
                        alignment: "center"

                    }
                    :{},

                contrat?.produit.codeProduit == "96"||isContratVoyage ? contrat?.paramContratList?.filter((item: any) => item.codeGarantie != "J01")||isContratVoyage ?
                    {
                        style: "table",
                        table: {
                            // widths: [95,245,90,50],   
                            widths:  widthsHeaders,
                            headerRows: 1,
                            body: [headers].concat(
                               
                                listGarantie.map((g: any) => {
                                    
                                    let garantie: any;
                                    let sGarantie: any = [];
                                    let plafond: any = [];
                                    let franchise: any = [];
                                    const priceA = 10000;
                                    
                                    if (g.codeGarantie != "J01") {
                                        let i = 0;
                                        garantie = g.description
                                        g?.sousGarantieList?.map((sg: any) => {
                                            sGarantie.push({ text: sg.description, fontSize: 10, lineHeight: 1.25 });
                                            plafond[i] = sg.codeSousGarantie != "SG23" ?
                                                sg.codeSousGarantie != "SG20" ?
                                                    sg.codeSousGarantie != "SG07" && sg.codeSousGarantie != "SG08" && sg.codeSousGarantie != "SG108" && sg.codeSousGarantie != "SG109" ?
                                                        sg.codeSousGarantie != "SG12" && sg.codeSousGarantie != "SG35" && sg.codeSousGarantie != "SG22" && sg.codeSousGarantie != "SG44" && sg.codeSousGarantie != "SG37" && sg.codeSousGarantie != "SG39" ?
                                                            sg.categorieList?.find((cat: any) => cat?.description == "plafond")?.valeur != 0 ?
                                                            sg.categorieList?.find((cat: any) => cat?.description == "plafond") ?
                                                                
                                                                    { text: Number(sg.categorieList?.find((cat: any) => cat?.description == "plafond").valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD", fontSize: "10", lineHeight: 1.25, alignment: "center" }
                                                                    : { text: "A concurrence des frais engagés", fontSize: "8", lineHeight: 1.25, alignment: "center" }
                                                                : { text: "/", fontSize: "10", alignment: "center" }
                                                            : { text: "5% de l'indemnité", fontSize: "10", lineHeight: 1.25, alignment: "center" }
                                                        : { text: " Valeur locative annuelle de 'l'habitation avec un maximum de 1 000 000 DZD", fontSize: "6", lineHeight: 1, alignment: "center" }
                                                    : { text: "250 000 DZD par sinistre par année d’assurance", fontSize: "6", lineHeight: 1, alignment: "center" }
                                                : { text: "15 000 DZD par année d’assurance", fontSize: "7", lineHeight: 1.25, alignment: "center" }

                                            franchise = g.codeGarantie != "D04" && g.codeGarantie != "D05" ?
                                                { text: "5% des dommages avec un minimum de 5000 DZD ", fontSize: "9", valign: 'middle' }

                                                : { text: "5% des dommages avec un minimum de 5000 DZD et un délai de carrance d’un mois à compter de la date d’effet", fontSize: "8", valign: 'middle' }

                                            // franchise = { text: "5% des dommages avec un minimum de 5000 DZD ", fontSize: "9",valign: 'middle'}     

                                            /*  sg.categorieList?.find((cat: any) => cat?.description == "franchise") ? sg.categorieList?.find((cat: any) => cat?.description == "franchise").valeur ?
                                              { text: "5% des dommages avec un minimum de 5000 DZD", fontSize: "9",valign: 'middle'}: " " 
                                              */
                                            i++;

                                        })
                                        if (g?.sousGarantieList?.length == 0 && g?.categorieList?.length != 0) {
                                            plafond[i] = { text: g.categorieList?.find((cat: any) => cat?.description == "plafond") ? Number(g.categorieList?.find((cat: any) => cat?.description == "plafond")?.valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD" : "", fontSize: "10", lineHeight: 1.25, alignment: "center" }
                                            franchise = { text: g.categorieList?.find((cat: any) => cat?.description == "franchise") ? "5% des dommages avec un minimum de 5000 DZD" : "", fontSize: "9", valign: 'middle' }
                                        }

                                    }
                                    if(isContratVoyage){
                                        garantie=g.description
                                        const textplfnd = g.plafondInfo?
                                         {text:[
                                             g.plafond + ' ',
                                             { text:g.plafondInfo , sup: true },
                                           ],
                                           fontSize: 8,
                                           alignment: 'center'
                                        }
                                        :
                                        {text:g.plafond,fontSize: "8", alignment: 'center'}
                                        plafond=[textplfnd]
                                        franchise={ text: g.franchise, fontSize: "8", alignment: 'center' }
                                    
                                        return [
                                            [{ text: garantie, fontSize: "8", verticalAlignment: 'middle', colSpan: 4 }],
                                            [plafond ? plafond : null],
                                            franchise
                                        ]
                                    }
                                    return [
                                        [{ text: garantie, fontSize: "10", verticalAlignment: 'middle', colSpan: 4 }],
                                        isContratVoyage?null:[sGarantie ? sGarantie : null],
                                        [plafond ? plafond : null],
                                        franchise
                                    ]


                                }),
                               
                            )
                        }
                    }
                    : {} : contrat?.produit.codeProduit == "95" ?
                    
                    {
                        style: "table",
                        table: {
                            // widths: [95,245,90,50],   
                            widths: [95, 175, 120, 45, 60],
                            headerRows: 1,
                            body: [headers].concat(


                                listGarantie.map((g: any) => {

                                    let garantie: any;
                                    let sGarantie: any = [];
                                    let plafond: any = [];
                                    let franchise: any = [];
                                    let prime: any = [];
                                    const priceA = 10000;
                                    let i = 0;

                                    garantie = g.description
                                    g?.sousGarantieList?.map((sg: any) => {
                                        sGarantie.push({ text: sg.description, fontSize: 8, lineHeight: 1.25 });
                                        plafond[i] = sg.codeSousGarantie != "SG98" ?
                                            sg.codeSousGarantie != "SG87" && sg.codeSousGarantie != "SG89" ?
                                                sg.codeSousGarantie != "SG84" && sg.codeSousGarantie != "SG85" && sg.codeSousGarantie != "SG86" ?
                                                    sg.codeSousGarantie != "SG82" ?
                                                        sg.codeSousGarantie != "SG81" ?
                                                            sg.codeSousGarantie != "SG68" ?
                                                                sg.codeSousGarantie != "SG64" && sg.codeSousGarantie != "SG65" ?
                                                                    sg.codeSousGarantie != "SG79" ?
                                                                        sg.codeSousGarantie != "SG52" && sg.codeSousGarantie != "SG53" && sg.codeSousGarantie != "SG70" && sg.codeSousGarantie != "SG71" ?
                                                                            sg.codeSousGarantie != "SG50" ?
                                                                                sg.codeSousGarantie != "SG72" && sg.codeSousGarantie != "SG12" && sg.codeSousGarantie != "SG35" && sg.codeSousGarantie != "SG22" && sg.codeSousGarantie != "SG44" &&
                                                                                    sg.codeSousGarantie != "SG37" && sg.codeSousGarantie != "SG39" && sg.codeSousGarantie != "SG54" && sg.codeSousGarantie != "SG55" && sg.codeSousGarantie != "SG72" ?
                                                                                    sg.categorieList?.find((cat: any) => cat?.description == "plafond") ?
                                                                                        sg.categorieList?.find((cat: any) => cat?.description == "plafond").valeur != 0 ?
                                                                                            { text: Number(sg.categorieList?.find((cat: any) => cat?.description == "plafond").valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD", fontSize: "8", lineHeight: 1.25, alignment: "center" }
                                                                                            : { text: "A concurrence des frais engagés", fontSize: "8", lineHeight: 1.5, alignment: "center" } : " "
                                                                                    : { text: "5% de l'indemnité avec un max de 1 000 000 DZD", fontSize: "5", lineHeight: 2, alignment: "center" }
                                                                                : { text: Number(sg.categorieList?.find((cat: any) => cat?.description == "plafond").valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD  /sinistre ", fontSize: "8", lineHeight: 1.25, alignment: "center" }
                                                                            : { text: "Valeur locative annuelle des locaux avec un maximum de 1 000 000 DZD", fontSize: "5", lineHeight: 1, alignment: "center" }
                                                                        : { text: "Frais engagés max à 50 000 DZD", fontSize: "8", lineHeight: 1.25, alignment: "center" }
                                                                    : { text: "2 500 000 DZD/ Année d'assurance", fontSize: "7", lineHeight: 1.25, alignment: "center" }
                                                                : { text: "1 000 000 DZD/ Année d'assurance", fontSize: "7", lineHeight: 1.25, alignment: "center" }
                                                            : { text: "Limité à 50 000 DZD", fontSize: "8", lineHeight: 1.25, alignment: "center" }
                                                        : { text: "50 000 DZD / sinistre", fontSize: "8", lineHeight: 1.25, alignment: "center" }
                                                    : { text: Number(sg.categorieList?.find((cat: any) => cat?.description == "plafond").valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD/ Année d'assurance ", fontSize: "8", lineHeight: 2, alignment: "center" }
                                                : { text: Number(sg.categorieList?.find((cat: any) => cat?.description == "plafond").valeur / 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD/  /sinistre ", fontSize: "8", lineHeight: 1.25, alignment: "center" }
                                            : { text: "Limité à 1 000 000 DZD", fontSize: "8", lineHeight: 1.25, alignment: "center" }


                                        sg.description == "Honoraires d’experts" ? plafond[i] = { text: "Selon barème UAR", fontSize: "8", lineHeight: 1.5, alignment: "center" } : " "

                                        prime[i] = { text: sg.prime != null && sg.prime != '0' ? Number(sg.prime).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD" : " ", lineHeight: 1.25, fontSize: "8" }
                                        i++;

                                    })

                                    // console.log("listGarantie",g.codeGarantie)

                                    switch (g.codeGarantie) {
                                        case "G47":
                                        case "G52":
                                            franchise = { text: g.categorieList?.find((cat: any) => cat?.description == "franchise") ? "5% des dommages nets" : '', fontSize: "8", valign: 'middle' }
                                            break;
                                        case "G45":
                                        case "G53":
                                            franchise = { text: "20 000 DZD sur dommages matériels uniquement", fontSize: "8", valign: 'middle' }
                                            break;
                                            case "G46":
                                            franchise = { text: "10% des dommages avec un minimum de 20000 DZD", fontSize: "8", valign: 'middle' }
                                            break;
                                        case "G51":
                                            franchise = { text: "7 Jours", fontSize: "8", valign: 'middle' }
                                            break;

                                        default:
                                            franchise = { text: g.categorieList?.find((cat: any) => cat?.description == "franchise") ? "10% des dommages avec un minimum de " + Number(g.categorieList?.find((cat: any) => cat?.description == "franchise")?.valeur) + " DZD" : "", fontSize: "8", valign: 'middle' }
                                            break;
                                    }

                                    if (g?.sousGarantieList?.length == 0 && g?.categorieList?.length != 0) {
                                        plafond[i] = { text: g.categorieList?.find((cat: any) => cat?.description == "plafond") ? Number(g.categorieList?.find((cat: any) => cat?.description == "plafond")?.valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD" : "", fontSize: "8", lineHeight: 1.25, alignment: "center" }
                                        prime[i] = { text: g.prime != null && g.prime != '0' ? Number(g.prime).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD" : " ", lineHeight: 1.25, fontSize: "8" }
                                    }


                                    return [
                                        [{ text: garantie, fontSize: "8", verticalAlignment: 'middle', colSpan: 4 }],
                                        [sGarantie ? sGarantie : null],
                                        [plafond ? plafond : null],
                                        [franchise],
                                        [prime ? prime : null]
                                    ]


                                }),
                            )
                        }
                    } : {},
                    isContratVoyage?{
                        table:  {
                            widths: ['60%', '*'], 
                            body: [
                                [
                                    { text: '(1) : Couts réels, avion sanitaire sur vols intracontinentaux uniquement.', fontSize: 7 },
                                    { text: '(2) : Cercueil minimum + frais d\'inhumation', fontSize: 7 }
                                ],
                                [
                                    { text: '(3) : Billet aller/retour classe économique.', fontSize: 7 },
                                    { text: '(4) : Billet aller/retour classe économique.', fontSize: 7 }
                                ],
                                [
                                    { text: '(5) : Billet retour classe économique.', fontSize: 7, colSpan: 2 }, 
                                    {}
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: function(i:any, node:any) {
                                return (i === node.table.body.length) ? 1 : 0;
                            },
                            vLineWidth: function(i:any, node:any) {
                                return (i === 0 || i === node.table.widths.length) ? 1 : 0;
                            },
                            hLineColor:"black",
                            vLineColor:"black", 
                    },
                }:{},
                { text: "\n", },
                
             //   contrat?.produit.codeProduit == "96" ? contrat?.paramContratList?.filter((item: any) => item.codeGarantie === "J01") ?
                contrat?.produit.codeProduit == "96" ? garantieDomicile !=undefined ?
                
                    {
                        style: "table",
                        table: {
                            widths: [80, 165, 70, 90, 80],
                            headerRows: 1,
                            body: [headers2].concat(

                                garantieDomicile.map((g: any) => {                                  
                                    let garantie: any;
                                    let sGarantie: any = [];
                                    let plafond: any = [];
                                    let franchise: any = [];

                                    if (g !=undefined  && g.codeGarantie == "J01") {
                                        let i = 0;
                                        garantie = g.description
                                        g?.sousGarantieList?.map((sg: any) => {
                                            sGarantie[i] = { text: sg.description, fontSize: "10", lineHeight: 1.25 }
                                            plafond[i] = sg.categorieList?.find((cat: any) => cat?.description == "plafond") ?
                                                { text: sg.categorieList?.find((cat: any) => cat?.description == "plafond").valeur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD", fontSize: "10", lineHeight: 1.25 } : " "
                                            franchise = {
                                                text: sg.categorieList?.find((cat: any) => cat?.description == "franchise").valeur ?
                                                    sg.categorieList?.find((cat: any) => cat?.description == "franchise").valeur + " DZD" : " "
                                            }

                                            i++;

                                        })
                                    }
                                    return [
                                        [{ text: garantie, fontSize: "10", colSpan: 4 }],
                                        [sGarantie ? sGarantie : null],
                                        [plafond ? plafond : null],
                                        [{ text: "03 interventions / garantie / An", fontSize: "10" }],
                                        [{ text: "Un délai de carence d\'un mois à compter de la date d\'effet du contrat", fontSize: "10" }],

                                    ]


                                }),
                            )
                        }

                    } : {} : {},

                /*    contrat?.produit.codeProduit == "96" ?
                   {
                    style: 'table',
                    //text: 'Clauses Assurance '+contrat?.produit?.description.toUpperCase()+' AXA Algérie',
                    fontSize: 14,
                    color: 'black',
                    bold: true,
                    alignment: "center"
                    }:{},
                    */
                risqueListVehicule?.length != 0 ?
                    {
                        style: "table",
                        table: {
                            widths: ["*", "*"],
                            body: [
                                [
                                    {
                                        stack: [
                                            { text: `Etendue géographique \n \n`, bold: true, fontSize: "8" },
                                            { text: `L'assurance du présent contrat produit ses effets exclusivement sur le territoire Algérien. \n \n`, fontSize: "6", alignment: 'justify' },

                                            { text: `Usages \n \n`, bold: true, fontSize: "8" },

                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '100' || contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '101' ? `Clauses U1 - Usage «affaire - fonctionnaire» \n` : "", bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '100' || contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '101' ? `Le souscripteur déclare expressément que le véhicule, objet de l'assurance n'est pas utilisé commercialement, même à titre exceptionnel pour le transport ou la livraison de produits ou de marchandises ou pour le transport onéreux de personnes. \n \n` : "", fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '107' ? `Clause U2 - Usage «transport public de marchandises» \n` : "", bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '107' ? `Le souscripteur déclare expressément que le véhicule, objet de l'assurance, sert au transport de produits ou de marchandises. \n \n` : '', fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '108' ? `Clause U3 - Usage «transport public de voyageurs» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '108' ? `Le souscripteur déclare expressément utiliser le véhicule, objet de l'assurance pour le transport de voyageurs et que ce véhicule est équipé de places régulièrement aménagées pour le transport des voyageurs, le nombre de places figurant sur la carte grise du véhicule. \n \n` : '', fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '105' ? `Clause U4 - Usage «location-auto» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '105' ? `Le souscripteur déclare expressément que le véhicule objet de l'assurance est loué, avec ou sans chauffeur, qu'il sert à la promenade, au tourisme ou à l'exercice d'une profession. \n \n` : '', fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '103' ? `Clause U5 - Usage «auto-école» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '103' ? `Le souscripteur déclare expressément que le véhicule désigné au contrat sert à donner des leçons de conduite et qu'il est muni d'une double commande. \n \n` : '', fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '104' ? `Clause U6 - Usage «taxi» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '104' ? `Le souscripteur déclare expressément que le véhicule est utilisé pour des besoins de transport de personnes à titre onéreux. \n \n` : '', fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '102' ? `Clause U7 - Usage «commerce & commerce-cbis» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '102' ? `Le souscripteur déclare expressément que le véhicule est utilisé pour les besoins d'une activité commerciale. \n \n` : '', fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '109' ? `Clause U9 - Usage «véhicules spéciaux» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P52')?.reponse?.idParamReponse?.code == '109' ? `Le souscripteur déclare expressément que le véhicule, objet de l'assurance, est utilisé pour des besoins privés ou pour les besoins d'une profession ou d'une activité, à l'exclusion du transport de personnes à titre onéreux. \n \n` : '', fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.pack?.codePack != 'B2' ? `Franchises \n \n` : '', bold: true, fontSize: "8" },
                                            { text: contrat?.pack?.codePack != 'B2' ? `Est le montant qui reste à la charge de l'assuré en cas de sinistre. \n \n` : '', fontSize: "6" },

                                            { text: contrat?.pack?.codePack == 'S2' || contrat?.pack?.codePack == 'SV' ? `Clause F1 - Franchises sur le risque «dommages collision» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                text: contrat?.pack?.codePack == 'S2' || contrat?.pack?.codePack == 'SV' ? `Cette garantie comporte une franchise mentionnée dans le tableau des garanties. L'indemnité, franchise déduite, ne peut être supérieure à la valeur assurée qui constitue l'engagement maximum de la Compagnie.
                                En cas de règlement de sinistre, cette franchise reste obligatoirement à la charge de l'assuré(e) et sera déduite de l'indemnité définitive. \n\n`: '', fontSize: "6", alignment: 'justify'
                                            },

                                            { text: contrat?.pack?.codePack == 'F2' ? `Clause F2- Franchises sur le risque «dommages tous accidents » \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                text: contrat?.pack?.codePack == 'F2' ? `La garantie « Dommages Tous Accidents » comporte une franchise mentionnée dans le tableau des garanties L'indemnité, franchise déduite, ne peut être supérieure à la valeur assurée qui constitue l'engagement maximum de la Compagnie.
                                En cas de règlement de sinistre, cette franchise reste obligatoirement à la charge de l'assuré(e) et sera déduite de l'indemnité définitive.
                                Il est entendu que l'assuré est redevable de la moitié du montant de la franchise convenue au tableau des garanties au cas où il communique, sur le constat amiable, toutes les informations du (des) tiers associé (s) à son accident. \n\n`: '', fontSize: "6", alignment: 'justify'
                                            },

                                            { text: contrat?.pack?.codePack == 'FL' ? `Clause F3- Franchises sur le risque « Dommages Tous Accidents Limitée » \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                text: contrat?.pack?.codePack == 'FL' ? `La garantie « Dommages Tous Accidents Limitée » comporte une franchise mentionnée dans le tableau des garanties L'indemnité, franchise déduite, ne peut être supérieure à la valeur assurée qui constitue l'engagement maximum de la Compagnie.
                                En cas de règlement de sinistre, cette franchise reste obligatoirement à la charge de l'assuré(e) et sera déduite de l'indemnité définitive.
                                Il est entendu que l'assuré est redevable de la moitié du montant de la franchise convenue au tableau des garanties au cas où il communique, sur le constat amiable, toutes les informations du (des) tiers associé (s) à son accident. \n\n`: '', fontSize: "6", alignment: 'justify'
                                            },

                                            { text: `Divers \n \n`, bold: true, fontSize: "8" },

                                            //   { text: `Clause D1 - Paiement fractionné \n`, bold: true, fontSize: "6" },
                                            //   { text: `En cas de fractionnement de la prime pour les polices renouvelables par tacite reconduction, le souscripteur ne pourra pas résilier le contrat à une échéance autre que l'échéance anniversaire du contrat, exception faite des cas de cession ou de perte totale du véhicule.
                                            //   Il est entendu que l'échéance anniversaire ouvrant droit pour les parties à la faculté de résiliation prévue aux conditions générales est celle indiquée au recto des présentes conditions particulières, dans le champ « références du contrat ».\n\n`, fontSize: "6", alignment: 'justify' },

                                            { text: `Clause D2- Délégation \n`, bold: true, fontSize: "6" },
                                            {
                                                text: `En cas de perte totale du véhicule assuré ayant été acheté à crédit, l'indemnité ne saurait être effectué qu'entre les mains d'un représentant de l'organisme de crédit hors de la présence et sans le concours de l'assuré(e).
                                Le droit pour la compagnie d'assurance de résilier le contrat lors de toute infraction constatée demeure entier, mais en ce qui concerne l'assuré (créancier susnommé), cette résiliation ne prendra effet qu'un mois après la notification qui lui sera destinée par lettre recommandée à son domicile désigné dans le contrat \n\n`, fontSize: "6"
                                            },

                                            { text: `Clause D3 -Durée ferme \n`, bold: true, fontSize: "6" },
                                            { text: `Le présent contrat est souscrit pour la durée ferme indiquée aux conditions particulières. Il expire de plein droit et sans autre avis à la date mentionnée dans la rubrique « d'expiration » à minuit. \n\n`, fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G05') ? `Clause D4 - Vol d'autoradio \n` : "", bold: true, fontSize: "6" },
                                            {
                                                text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G05') ? `Moyennant une prime additionnelle, la garantie s'exerce en cas de vol d'autoradio à concurrence de sa valeur déclarée. La garantie ne pourra s'appliquer qu'à condition qu'il y ait effraction du véhicule.
                                La valeur de l'autoradio du véhicule est égale à la valeur déclarative à la souscription avec un montant maximum mentionnée dans le tableau des garanties. \n\n`: "", fontSize: "6", alignment: 'justify'
                                            },

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G10') ? `Clause D5 - Protection Financière \n` : "", bold: true, fontSize: "6" },
                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G10') ? `Cette garantie couvre le préjudice subi en pertes directes et indirectes, dépassant la valeur vénale en cas de perte totale ou véhicule irréparable. Cette indemnité est plafonnée à hauteur du capital mentionné. \n\n` : "", fontSize: "6", alignment: 'justify' },

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G09') ? `Clause D6 - Protection Juridique \n` : "", bold: true, fontSize: "6" },
                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G09') ? `En cas de conflit engageant le véhicule assuré, l'assuré(e) dispose de l'assistance d'un avocat ou d'un cabinet agréé par la Compagnie afin de le conseiller et essayer de résoudre à l'amiable ou judiciairement tout conflit lié aux transactions commerciales de son véhicule. Les frais des honoraires du cabinet agréé seront pris en charge par la Compagnie à hauteur la limité mentionnée dans le tableau des garanties. \n\n` : "", fontSize: "6", alignment: 'justify' },

                                            { text: `Clause D9 - Défense et Recours \n`, bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: `Au titre de la garantie défense et recours , l'assureur n'engage aucun recours auprès du tiers responsable dans le cas où les dommages ne dépassent pas le montant de 5000 DA. \n\n`, fontSize: "6", alignment: 'justify' },

                                            { text: `Clause D10 - Limite annuelle d'indemnisation \n`, bold: true, fontSize: "6", alignment: 'justify' },
                                            { text: `Au titre des garanties suivantes : Bris de glaces, Protection du conducteur & des passagers, le total annuel des indemnisations ne peut excéder 1,5 fois la limite maximum par sinistre.
                                                Au titre de la garantie Dommages Collision, le total annuel des indemnisations ne peut excéder le plafond mentionné dans le tableau des garanties\n\n`, fontSize: "6", alignment: 'justify' },

                                            { text: `Clause D11 - bonus malus : \n`, bold: true, fontSize: "6" },
                                            {
                                                text: `Conformément aux dispositions de l'article 25 des conditions générales, la clause de bonus-malus dite aussi réduction- majoration, consiste à appliquer un coefficient sur la prime de référence en fonction des accidents que vous occasionnez et/ou déclarez.
                                Quand et comment évolue votre coefficient de bonus-malus ?
                                - Il évolue chaque année, à l'échéance anniversaire de votre contrat ; 
                                - C'est un coefficient appliqué sur plusieurs garanties (hors garantie responsabilité civile ou garanties dont la prime est réglementée)
                                - Il est initialement égal à (01) pour un conducteur qui n'a jamais été assuré ou dont l'historique de sinistralité est inconnu
                                - Il est inférieur à (01) si vous avez du bonus et supérieur à (01) si vous avez du malus
                                Vous avez été responsable d'un accident ou avez déclaré plusieurs sinistres ?
                                - Un malus (majoration) qui ne peut dépasser 200% s'applique sur le tarif en vigueur.
                                Une année sans accident responsable et sous réserve des dispositions régissant le malus ?
                                - Vous bénéficiez d'un bonus qui ne peut dépasser 10% du tarif en vigueur.\n\n`, fontSize: "6", alignment: 'justify'
                                            },

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G17') ? `Règles d'indemnisation \n \n` : '', bold: true, fontSize: "8" },
                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G17') ? `Clause R1 -Indemnisations au titre de la garantie «Protection du Conducteur & des Passagers» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G17') ? `En cas d'Incapacité Permanente Partielle (IPP) du conducteur et/ou des passagers du véhicule assuré, un capital est versé à chacun des blessés proportionnellement à son taux d'IPP arrêté par le médecin conseil avec un plafond maximum mentionnée dans le tableau des garanties par victime et sinistre.
                                Si le total des indemnités calculées est supérieur à la précédente limite, une règle proportionnelle est applicable pour chacune des victimes dans la limite mentionnée dans le tableau des garanties.
                                Une franchise de 15% est déduite du taux d'incapacité arrêté avant calcul de l'indemnité.
                                Les frais médicaux et d'hospitalisation sont limités selon la limité mentionnée dans le tableau des garanties par sinistre.`: '', fontSize: "6"
                                            },
                                        ]
                                    },
                                    {
                                        stack: [
                                            { text: !contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G17') ? `Règles d'indemnisation \n \n` : '', bold: true, fontSize: "8" },
                                            {
                                                text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G17') ? `Le nombre de personnes transportées dans le véhicule assuré ne doit pas excéder le nombre de places prévues par le constructeur. Dans le cas contraire, la Compagnie prendra en charge, en cas d'accident, toutes les victimes transportées par le véhicule assuré, proportionnellement au nombre de places autorisées.
                                Les indemnités versées au titre de la garantie « Responsabilité Civile » par la Compagnie ou par les Compagnies adverses seront déduites des indemnités dues au titre des frais médicaux et d'hospitalisation.
                                En cas de Décès ou d'Invalidité Absolue ou Définitive (IAD) de l'assuré(e) et/ou des passagers du véhicule assuré à la suite d'un accident, un capital mentionné dans le tableau des garanties est versé dans la limité mentionnée dans le tableau des garanties aux ayants droits prévus par la Frédha ou au(x) bénéficiaire(s), à parts égales, désigné(s) par le souscripteur. \n\n`: '', fontSize: "6"
                                            },

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G15') ? `Clause R2 -Indemnisations au titre de la garantie « Protection Famille » \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G15') ? `En cas de Décès ou d'IAD à la suite d'un accident, la Compagnie indemnise l'assuré au titre de la garantie « Protection Famille » d'un capital mentionné dans le tableau des garanties, sera réparti à parts égales au(x) bénéficiaire(s) désigné(s) par l'assuré(e) lors de la souscription du contrat ou à ses ayants droits prévus par la Frédha. Ce capital est cumulable à tout autre capital ayant été versé au titre du présent contrat
                                Cas ou l'assuré serait une personne morale
                                Dans le cas où l'assuré est une personne morale, les indemnisations relatives à la garantie « Protection famille », s'appliquent aux ayants droit du conducteur principal mentionné dans le contrat d'assurance. \n\n`: '', fontSize: "6"
                                            },

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G07') || contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G13') ? `Conditions de prise en charge dans le cadre de la garantie «Dommages Collision» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G07') || contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G13') ? `Les parties conviennent que la prise en charge du sinistre ne peut se faire qu'à condition de l'identification du tiers comme le prévoit les conditions générales. Nonobstant toute disposition contraire, les parties conviennent aussi que le remboursement du montant du dommage s'effectue selon les conditions suivantes :
                                (i) à hauteur de la limite de garantie fixée aux présentes conditions particulières dans les délais fixés dans les conditions générales et (ii) au-delà de ce montant, le complément sera versé après réception de ce dit complément du montant du sinistre de la société d'assurance adverse suite à la procédure de recours en vigueur au niveau du secteur des assurances. \n\n`: '', fontSize: "6"
                                            },

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11') ? `Assistance \n \n` : '', bold: true, fontSize: "8" },
                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11') ? `Clause A1 - Etendue géographique et véhicule garanti \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11') ? `Etendue géographique : Les garanties Assistance aux véhicules et Assistance aux personnes du présent contrat produisent leurs effets exclusivement sur le territoire Algérien.
                                Véhicule Garanti : Le véhicule destiné au transport de personnes et de marchandises dont le poids total autorisé en charge est inférieur à 3,5 tonnes, âgé de moins de 12 ans pour les cas de panne et sans limite d'âge pour les accidents, vols et incendies, 
                                Définition de la franchise Kilométrique :
                                Distance mentionnée aux Conditions Particulières corres¬pondant à un rayon à partir du périmètre urbain de la ville de résidence de l4assuré, sur laquelle la garantie remor¬quage ou dépannage sur place ne s4applique pas. \n\n`: '', fontSize: "6"
                                            },

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '25' ? `Clause A2 - Limites de garanties : \n\n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                fontSize: "6",
                                                ul: [
                                                    { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '25' ? `Formule Assistance Basic` : '', bold: true, fontSize: "6" },
                                                ]
                                            },
                                            contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '25' ?
                                                {

                                                    style: "table",
                                                    table: {
                                                        widths: ["*", "*"],
                                                        alignment: "left",
                                                        body: [
                                                            [
                                                                {
                                                                    text: `Assistance aux véhicules`,
                                                                    colSpan: 2,
                                                                    fontSize: "6",
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise kilométrique en cas de panne (en km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `25`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Dépannage/remorquage en cas de panne ou d'accident (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `7 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Extraction du véhicule assuré à l'aide d'une grue (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `7 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Retour des bénéficiaires/poursuite de voyage`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Prise en charge des frais d'hébergement à l'hôtel (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `5 000/nuitée`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Séjour et déplacement des bénéficiaires par suite du vol du véhicule (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `5 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Gardiennage et récupération du véhicule après réparation (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `3 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `7. Service d'un chauffeur professionnel`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `8. Perte ou Vol des clés`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `9. Remplacement de roue en cas de crevaison`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `Assistance aux Personnes`,
                                                                    fontSize: "6",
                                                                    colSpan: 2,
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise Kilométrique (en Km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Transport sanitaire`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Transport des bénéficiaires accompagnateurs`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Rapatriement de corps`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Interruption de voyage à la suite du décès d'un proche parent en Algérie`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Transmission de messages urgents`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                        ],
                                                    }
                                                } : {},

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '15' ? `Clause A2 - Limites de garanties : \n\n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                fontSize: "6",
                                                ul: [
                                                    { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '15' ? `Formule Assistance Classic` : '', bold: true, fontSize: "6" },
                                                ]
                                            },
                                            contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '15' ?
                                                {

                                                    style: "table",
                                                    table: {
                                                        widths: ["*", "*"],
                                                        alignment: "left",
                                                        body: [
                                                            [
                                                                {
                                                                    text: `Assistance aux véhicules`,
                                                                    colSpan: 2,
                                                                    fontSize: "6",
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise kilométrique en cas de panne (en km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `15`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Dépannage/remorquage en cas de panne ou d'accident (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `10 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Extraction du véhicule assuré à l'aide d'une grue (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `7 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Retour des bénéficiaires/poursuite de voyage`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Prise en charge des frais d'hébergement à l'hôtel (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `5 000/nuitée`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Séjour et déplacement des bénéficiaires par suite du vol du véhicule (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `5 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Gardiennage et récupération du véhicule après réparation (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `3 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `7. Service d'un chauffeur professionnel`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `8. Perte ou Vol des clés`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `9. Remplacement de roue en cas de crevaison`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `Assistance aux Personnes`,
                                                                    fontSize: "6",
                                                                    colSpan: 2,
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise Kilométrique (en Km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Transport sanitaire`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Transport des bénéficiaires accompagnateurs`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Rapatriement de corps`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Interruption de voyage à la suite du décès d'un proche parent en Algérie`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Transmission de messages urgents`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                        ],
                                                    }
                                                } : {},

                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '5' ? `Clause A2 - Limites de garanties : \n\n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                fontSize: "6",
                                                ul: [
                                                    { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '5' ? `Formule Assistance Essentiel` : '', bold: true, fontSize: "6" },
                                                ]
                                            },
                                            contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '5' ?
                                                {

                                                    style: "table",
                                                    table: {
                                                        widths: ["*", "*"],
                                                        alignment: "left",
                                                        body: [
                                                            [
                                                                {
                                                                    text: `Assistance aux véhicules`,
                                                                    colSpan: 2,
                                                                    fontSize: "6",
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise kilométrique en cas de panne (en km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `5`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Dépannage/remorquage en cas de panne ou d'accident (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `15 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Extraction du véhicule assuré à l'aide d'une grue (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `7 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Retour des bénéficiaires/poursuite de voyage`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Prise en charge des frais d'hébergement à l'hôtel (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `10 000/nuitée`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Séjour et déplacement des bénéficiaires par suite du vol du véhicule (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `10 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Gardiennage et récupération du véhicule après réparation (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `3 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `7. Service d'un chauffeur professionnel`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `8. Perte ou Vol des clés`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `9. Remplacement de roue en cas de crevaison`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `Assistance aux Personnes`,
                                                                    fontSize: "6",
                                                                    colSpan: 2,
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise Kilométrique (en Km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `50`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Transport sanitaire`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Transport des bénéficiaires accompagnateurs`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Rapatriement de corps`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `40 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `10 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Interruption de voyage à la suite du décès d'un proche parent en Algérie`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Transmission de messages urgents`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                        ],
                                                    }
                                                } : {},
                                            { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '0' ? `Clause A2 - Limites de garanties : \n\n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                            {
                                                fontSize: "6",
                                                ul: [
                                                    { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '0' && contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P24')?.reponse?.idParamReponse?.code != 'R17' ? `Formule Assistance Plus` : '', bold: true, fontSize: "6" },
                                                ]
                                            },
                                            contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '0' && contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P24')?.reponse?.idParamReponse?.code != 'R17' ?
                                                {

                                                    style: "table",
                                                    table: {
                                                        widths: ["*", "*"],
                                                        alignment: "left",
                                                        body: [
                                                            [
                                                                {
                                                                    text: `Assistance aux véhicules`,
                                                                    colSpan: 2,
                                                                    fontSize: "6",
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise kilométrique en cas de panne (en km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `0`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Dépannage/remorquage en cas de panne ou d'accident (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `15 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Extraction du véhicule assuré à l'aide d'une grue (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `7 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Retour des bénéficiaires/poursuite de voyage`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Prise en charge des frais d'hébergement à l'hôtel (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `10 000/nuitée`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Séjour et déplacement des bénéficiaires par suite du vol du véhicule (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `10 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Gardiennage et récupération du véhicule après réparation (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `3 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `7. Service d'un chauffeur professionnel`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `8. Perte ou Vol des clés`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `9. Remplacement de roue en cas de crevaison`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Non Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `Assistance aux Personnes`,
                                                                    fontSize: "6",
                                                                    colSpan: 2,
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise Kilométrique (en Km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `50`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Transport sanitaire`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Transport des bénéficiaires accompagnateurs`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Rapatriement de corps`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `60 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `20 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Interruption de voyage à la suite du décès d'un proche parent en Algérie`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Transmission de messages urgents`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                        ],
                                                    }
                                                } : {},

                                            {
                                                fontSize: "6",
                                                ul: [
                                                    { text: contrat?.pack?.codePack == 'F2' && contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P24')?.reponse?.idParamReponse?.code == 'R17' && contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '0' ? `Formule Assistance Assur'ELLE` : '', bold: true, fontSize: "6" },
                                                ]
                                            },
                                            contrat?.pack?.codePack == 'F2' && contrat?.risqueList?.find((risque: any) => risque?.codeRisque == 'P24')?.reponse?.idParamReponse?.code == 'R17' && contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '0' ?
                                                {

                                                    style: "table",
                                                    table: {
                                                        widths: ["*", "*"],
                                                        alignment: "left",
                                                        body: [
                                                            [
                                                                {
                                                                    text: `Assistance aux véhicules`,
                                                                    colSpan: 2,
                                                                    fontSize: "6",
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise kilométrique en cas de panne (en km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `0`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Dépannage/remorquage en cas de panne ou d'accident (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `15 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Extraction du véhicule assuré à l'aide d'une grue (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `7 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Retour des bénéficiaires/poursuite de voyage`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Prise en charge des frais d'hébergement à l'hôtel (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `10 000/nuitée`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Séjour et déplacement des bénéficiaires par suite du vol du véhicule (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `10 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Gardiennage et récupération du véhicule après réparation (en dinars)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `3 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `7. Service d'un chauffeur professionnel`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `8. Perte ou Vol des clés`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `9. Remplacement de roue en cas de crevaison`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `Assistance aux Personnes`,
                                                                    fontSize: "6",
                                                                    colSpan: 2,
                                                                    style: "headerTable"
                                                                },
                                                                {}
                                                            ],
                                                            [
                                                                {
                                                                    text: `Franchise Kilométrique (en Km)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `50`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `1. Transport sanitaire`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `2. Transport des bénéficiaires accompagnateurs`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `3. Rapatriement de corps`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `60 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne)`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `20 000`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `5. Interruption de voyage à la suite du décès d'un proche parent en Algérie`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                            [
                                                                {
                                                                    text: `6. Transmission de messages urgents`,
                                                                    fontSize: "6",
                                                                },
                                                                {
                                                                    text: `Inclus`,
                                                                    fontSize: "6",
                                                                    alignment: "center"
                                                                },
                                                            ],
                                                        ],
                                                    }
                                                } : {},

                                            { text: `\n\n Les clauses prévues dans le présent contrat et qui ne sont pas mentionnées dans le champ « clauses particulières » ne s'appliquent pas au présent contrat et ne peuvent en aucun cas être invoquées par le souscripteur et/ou l'assuré`, bold: true, fontSize: "6", alignment: 'justify' },
                                        ]
                                    },
                                ],
                            ],
                        },
                        layout: 'noBorders'
                    } : {},

                { text: `\n\nDÉCLARATION DU SOUSCRIPTEUR \n`, bold: true, fontSize: "8", alignment: 'justify', pageBreak: isContratVoyage || contrat.produit.codeProduit ? '':'before'  },
                contrat?.produit.codeProduit == "95" ?
                    {
                        text: `Je reconnais avoir reçu un exemplaire des Conditions Générales et des présentes Conditions Particulières et déclare avoir pris connaissance des textes y figurant.
                Je reconnais que les présentes Conditions Particulières ont été établies conformément aux réponses que j’ai données aux questions posées par la Compagnie lors de la souscription du contrat.
                Je reconnais avoir été préalablement informé(e) du montant de la prime et des garanties du présent contrat.
                Je reconnais avoir été informé(e), au moment de la collecte d’informations que les conséquences qui pourraient résulter d’une omission ou d’une déclaration inexacte sont celles prévues par l’article 19 de l’ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006.
                Je reconnais également avoir été informé(e), que les informations saisies dans ce document soient, utilisées, exploitées, traitées par AXA Assurances Algérie Dommage, transférées à l’étranger et à ses sous-traitants, dans le cadre de l'exécution des finalités de la relation commerciale, conformément à la Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.
                J’autorise, également AXA Assurances Algérie de m’envoyer des messages et des appels de prospections commerciales quel qu’en soit le support ou la nature.
                Pour toute demande concernant le traitement et vos droits relatifs à vos données à caractère personnel, merci de nous contacter sur l’adresse : dpo@axa.dz \n\n` , fontSize: "8", alignment: 'justify'
            } :contrat?.produit.codeProduit == "97" ?
            {
                text: `Je reconnais que les présentes Conditions Particulières ont été établies conformément aux réponses que j’ai données aux questions posées par
                 la Compagnie lors de la souscription du contrat.\n 
                   Je reconnais également avoir été préalablement informé(e) du montant de la prime et des garanties du présent contrat.
                 J’autorise AXA Assurances Algérie Dommage à communiquer ces informations à ses mandataires, réassureurs, organismes professionnels 
                 habilités et sous-traitants missionnés.\n
                  Je reconnais avoir été informé(e), au moment de la collecte d’informations, des conséquences qui pourraient résulter d’une omission 
                  ou d’une déclaration inexacte. Application de l’article 19 de l’ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi 
                  n°06/04 du 20 février 2006. \n
                 En signant ce document, j’accepte que les informations saisies dans ce document soient, utilisée, exploitées, traitées par AXA Assurances Algérie Dommage, transférées à l’étranger et à ses sous-traitants, dans le cadre de l’exécution des finalités de la relation commerciale, conformément à la Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel. J’autorise, également AXA Assurances Algérie Dommage de m’envoyer des messages et des appels de prospections commerciales quel qu’en soit le support ou la nature. Pour toute demande concernant le traitement de vos données à caractère personnel, merci de nous contacter sur l’adresse : 
                   : dpo@axa.dz \n\n` , fontSize: "8", alignment: 'justify'
            } 

                    :isContratVoyage?[{
                        text:`Je reconnais avoir reçu un exemplaire des Conditions Générales et des présentes Conditions Particulières.
                        Je reconnais que les présentes Conditions Particulières ont été établies conformément aux réponses que j’ai données aux questions posées par la Compagnie lors de la souscription du contrat.
                        Je reconnais également avoir été préalablement informé(e) du montant de la prime et des garanties du présent contrat.
                        J’autorise AXA Assurances Algérie Vie à communiquer ces informations à ses mandataires, réassureurs, organismes professionnels habilités et sous-traitants missionnés.
                        Je reconnais enfin avoir été informé(e), au moment de la collecte d’informations, que les conséquences qui pourraient résulter d’une omission ou d’une déclaration inexacte sont celles prévues par l’article 19 de l’ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006. 
                        
                        En signant ce document, j’accepte que les informations saisies dans ce document soient, utilisée, exploitées, traitées par AXA Assurances Algérie, transférées à l’étranger et à ses sous-traitants, dans le cadre de l'exécution des finalités de la relation commerciale, conformément à la Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel. J’autorise, également AXA Assurances Algérie de m’envoyer des messages et des appels de prospections commerciales quel qu’en soit le support ou la nature. Pour toute demande concernant le traitement de vos données à caractère personnel, merci de nous contacter sur l’adresse : dpo@axa.dz.
                         \n`,fontSize:8, alignment: 'justify'
                    },
            
                contrat?.produit.codeProduit == "97" ?
                {
                    text:`CLAUSE SANCTION  : `,style:'axaBold'
                }:

                    {
                        text:`Dispositif des Sanction : `,style:'axaBold'
                    },
                       contrat?.produit.codeProduit == "97" ?
                    {
                        text: `Les garanties définies dans le présent contrat sont réputées sans effet et l’assureur n’est pas tenu de fournir une couverture ou de verser une 
                        indemnité ou d’exécuter une prestation en vertu des présentes dans la mesure où la fourniture d'une telle couverture, le paiement d’une telle indemnité
                         ou l’exécution de telles prestations exposerait l’assureur à toute sanction, interdiction ou restriction en vertu des résolutions des Nations Unies ou
                          des sanctions commerciales ou économiques, des lois et/ou des règlements applicables en Algérie et à l’international notamment les lois/règlements de
                           l'Union européenne, Royaume-Uni ou États-Unis d'Amérique en la matière ou toute loi applicable. \n\n` , fontSize: "8", alignment: 'justify'
                    } :

                    {
                        text:`Les garanties définies dans le présent contrat sont réputées sans effet et l’assureur n’est pas tenu de fournir une couverture ou de verser une indemnité ou d’exécuter une prestation en vertu des présentes dans la mesure où la fourniture d'une telle couverture, le paiement d’une telle indemnité ou l’exécution de telles prestations exposerait l’assureur à toute sanction, interdiction ou restriction en vertu des résolutions des Nations Unies ou des sanctions commerciales ou économiques, des lois et/ou des règlements applicables en Algérie et à l’international notamment les lois/règlements de l'Union européenne, Royaume-Uni ou États-Unis d'Amérique en la matière ou toute loi applicable\n`,
                        alignment:'justify',fontSize:8
                    },
                    {text:`IMPORTANT :\n`,bold:true,fontSize:8,decoration: 'underline',},
                    {text:`LE BENEFICIAIRE EST COUVERT DANS LES MEMES CONDITIONS ET LIMITES, EN CAS DE MALADIE D’ORIGINE INFECTIEUSE, DONT LA COVID 19, SOUS RESERVE DES EXCLUSIONS SPECIFIQUES PREVUES DANS LES CONDITIONS GENERALES. \n`,fontSize:8},
                    {text:`LE BÉNÉFICIARE NE POURRA PRÉTENDRE À AUCUN REMBOURSEMENT DE FRAIS S'IL N'A PAS, AU PRÉALABLE, REÇU L'ACCORD EXPRESS DE L'ASSISTEUR (COMMUNICATION D'UN NUMÉRO DE DOSSIER). 
                    TOUTE ANNULATION DANS UN DELAI INFERIEUR A 72 HEURES AVANT LA PRISE D’EFFET DU CONTRAT ENGENDRERA UNE PENALITE EQUIVALENTE A 25% DU MONTANT DE LA PRIME NETTE.
                    \n`,bold:true,fontSize:8},


                ]: {
                        text: `Je reconnais avoir reçu un exemplaire des Conditions Générales et des présentes Conditions Particulières et déclare avoir pris connaissance des textes y figurant.
                Je reconnais que les présentes Conditions Particulières ont été établies conformément aux réponses que j'ai données aux questions posées par la Compagnie lors de la souscription du contrat.
                Je reconnais avoir été informé(e), au moment de la collecte d'informations que les conséquences qui pourraient résulter d'une omission ou d'une déclaration inexacte sont celles prévues par l'article 19 de l'ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006.
                Je reconnais également avoir été informé(e), que les informations saisies dans ce document soient, utilisées, exploitées, traitées par AXA Assurances Algérie Dommage, transférées à l'étranger et à ses sous-traitants, dans le cadre de l'exécution des finalités de la relation commerciale, conformément à la Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.
                En signant ce document, j'accepte que les informations saisies dans ce document soient, utilisée, exploitées, traitées par AXA Assurances Algérie, transférées à l'étranger et à ses sous-traitants, dans le cadre de l'exécution des finalités de la relation commerciale, conformément à la Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel. 
                J'autorise, également AXA Assurances Algérie de m'envoyer des messages et des appels de prospections commerciales quel qu'en soit le support ou la nature.
                Pour toute demande concernant le traitement et vos droits relatifs à vos données à caractère personnel, merci de nous contacter sur l'adresse : dpo@axa.dz \n\n`, fontSize: "8", alignment: 'justify'
                    },
                    sessionStorage.getItem("roles")?.includes("COURTIER") ? 
                    {
                        text: [
                          'Je donne par le présent mandat à ',
                          { text: `${contrat.agence.raisonSocial}`, bold: true },
                          ' En tant que Société de Courtage en assurances, à l’effet de négocier et gérer pour mon compte auprès des compagnies d’assurances aux meilleures conditions de garanties et de tarifs, en veillant à la défense de mes intérêts pendant toute la durée de l’assurance depuis la confection du contrat, qu’à l’occasion des règlements des sinistres. Le présent mandat prend effet à la date de signature du présent, et demeure valable tant qu’il n’a pas été dénoncé expressément par mes soins conformément à la législation en vigueur \n\n'
                        ],
                        fontSize: 8,
                        alignment: 'justify'
                      }:{},
                risqueListVehicule?.length != 0 ?
                    { text: `BÉNÉFICIAIRES DESIGNES EN CAS DE DÉCÈS \n\n`, bold: true, fontSize: "8", alignment: 'justify' } : {},
                    isContratVoyage || contrat.produit.codeProduit == "20G"?{}:risqueListVehicule?.length != 0 ?
                    { text: `Noms et Prénoms des bénéficiaires`, bold: true, fontSize: "8", alignment: 'justify' } : {
                        text: `Etant assuré(e) je déclare ce qui suit :`, bold: true, fontSize: "8", alignment: 'justify'
                    },
                    isContratVoyage || contrat.produit.codeProduit == "20G"?{}: risqueListVehicule?.length != 0 ?
                    {
                        style: "table",
                        table: {
                            widths: ["*", "*"],
                            body: [
                                [
                                    {
                                        text: [
                                            { text: `Bénéficiaire A :  ________________________\n`, fontSize: "8" },
                                            { text: `Bénéficiaire B :  ________________________\n`, fontSize: "8" },
                                            { text: `Bénéficiaire C :  ________________________\n`, fontSize: "8" },
                                            { text: `Bénéficiaire D :  ________________________`, fontSize: "8" },
                                        ]
                                    },
                                    {
                                        text: [
                                            { text: `Bénéficiaire E :   ________________________\n`, fontSize: "8" },
                                            { text: `Bénéficiaire F :   ________________________\n`, fontSize: "8" },
                                            { text: `Bénéficiaire G :   ________________________\n`, fontSize: "8" },
                                            { text: `Bénéficiaire H :   ________________________`, fontSize: "8" },
                                        ]
                                    }
                                ],
                            ],
                        },
                        layout: 'noBorders'
                    } : contrat?.produit.codeProduit == "95" ?
                        {
                            text: `• Les locaux assurés sont exclusivement à usage d’activité.
                    • La durée d’inoccupation des locaux durant l’année est inférieure à 45 jours (en une ou plusieurs périodes).
                    • Les locaux sont construits et couverts pour plus de 75% en matériaux durs.
                    • La superficie des locaux assurés n’excède pas 2500 m².
                    • Dans les locaux assurés, il n’est pas entreposé plus de 500 litres de liquides inflammables ou de gaz combustibles.
                    • Le nombre d’employés ne dépasse pas quarante-neuf (49) personnes, y compris le chef d’entreprise.
                    • Les marchandises entreposées ne sont pas constituées de produits dangereux ou hautement inflammables.
                    NB : Tout sinistre jugé antérieur à la souscription à dire de notre expert, sera soit exclu de l’indemnité, soit réglé proportionnellement aux
                    dommages causés ultérieurement à la date d’effet du contrat.`,
                            fontSize: "8",
                            color: 'black',
                        }
                        : contrat?.produit.codeProduit != "97" ?{
                            text: "• Les locaux assurés sont exclusivement à usage d'habitation.\n • La durée d'inoccupation des locaux durant l'année est inférieure à 90 jours (en une ou plusieurs périodes).\n  • Les locaux sont construits et couverts pour plus de 85% en matériaux durs.\n NB : Tout sinistre jugé antérieur à la souscription à la suite d'une expertise établie par un expert mandaté par la compagnie , sera soit exclu de l'indemnité, soit réglé proportionnellement aux dommages causés ultérieurement à la date d'effet du contrat.",
                            fontSize: "8",
                            color: 'black',
                        }:{},
                        {
                            text: contrat?.produit.codeProduit == "97" ? 
                                `CLAUSE SANCTION :\n
                                Les garanties définies dans le présent contrat sont réputées sans effet et l’assureur n’est pas tenu de fournir une couverture ou de
                                verser une indemnité ou d’exécuter une prestation en vertu des présentes dans la mesure où la fourniture d'une telle couverture, le
                                paiement d’une telle indemnité ou l’exécution de telles prestations exposerait l’assureur à toute sanction, interdiction ou restriction
                                en vertu des résolutions des Nations Unies ou des sanctions commerciales ou économiques, des lois et/ou des règlements
                                applicables en Algérie et à l’international notamment les lois/règlements de l'Union européenne, Royaume-Uni ou États-Unis
                                d'Amérique en la matière ou toute loi applicable.\n\n` :
                                '',
                            fontSize: "8",
                            color: 'black'
                        },


                { text: `\n\nFait à ${contrat?.agence?.wilaya} Le ${moment(contrat?.auditDate)?.format('DD/MM/YYYY')}\n\n`, bold: true, fontSize: "8" },
                {
                    layout: 'noBorders',
                    table: {
                        widths: ["*", "*"],
                        alignment: "center",
                        body: [
                            [
                                contrat?.produit.codeProduit == "97" ?
                                {
                                    text: [
                                        { text:isContratVoyage?`Signature du souscripteur(trice) : \n`: `\n`, bold: true, fontSize: "8" },
                                        { text: `Précédée de la mention « Lu et approuvé »\n`, fontSize: "8" },
                                    ],
                                    alignment: 'left'
                                }:

                                {
                                    text: [
                                        { text:isContratVoyage?`Signature du souscripteur(trice) : \n`: `Signature de l'assuré(e)\n`, bold: true, fontSize: "8" },
                                        { text: `Précédée de la mention « Lu et approuvé »\n`, fontSize: "8" },
                                    ],
                                    alignment: 'left'
                                },
                                contrat?.produit.codeProduit == "97" ?

                                {
                                    text: `Pour l'agence:`, bold: true, fontSize: "8",
                                    alignment: 'right'
                                }:
                                {
                                    text: `Pour la Compagnie:`, bold: true, fontSize: "8",
                                    alignment: 'right'
                                }
                            ]
                        ],
                    },
                }
, sessionStorage.getItem("roles")?.includes("COURTIER")?{
    image: SignatureCourtier,
    alignment:'right',
    width: widthSignature,
    height: heightSignature
  }:{}
            
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
                    margin: [0, 10, 0, 0]
                },
                axaBold:{
                    alignment: "left",
                    bold: true,
                    fontSize: 10,
                    color: "#00008F", 
                },
                headerTable: {
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    color: "#00008F",
                  
                }
            }
        }
        pdfMake.createPdf(docDefinitionContrat).download("CP_" + contrat?.idContrat);
    }

    outputContratFlotte(contrat: any, dataParam: any) {

        let risqueListVehicule: any = [];
        let risques: any = [];
        let vehicules: any = [];
        let risquegarantiesList: any = [];
        let groupeGarantiesList: any = [];
        let groupeGarantiesList2: any = [];
        let groupeGarantiesList3: any = [];
        let garantiesList: any = [];
        let garanties: any = [];
        let garantiesPrime: any = [];
        let headersRisque = ["Nº ORDRE", "MARQUE", "IMMATRICULATION", "CHASSIS", "VALEUR_VENALE"]
        let headersGarantieList = ["Nº ORDRE", "Prime_RC", "Prime_DR", "Prime_DTA", "Prime_DCVV", "Prime_DC", "Prime_Vol", "Prime_Vol_Auo_radio", "Prime_Incendie",
            "Prime_BDG", "Prime_Assistance", "Prime_PCP", "Prime_Nette"]

        let valeur0: any = false
        let valeur5: any = false
        let valeur15: any = false
        let valeur25: any = false
        let valeur100: any = false
        let valeur200: any = false
        let valeur300: any = false

        const dateEffet = contrat?.dateEffet;
        const dateTimeEffet = new Date(dateEffet);

        // Extracting time components
        const hoursEffet = dateTimeEffet.getUTCHours();
        const minutesEffet = dateTimeEffet.getUTCMinutes();

        const dateExpire = contrat?.dateEffet;
        const dateTimeExpire = new Date(dateExpire);

        // Extracting time components
        const hoursExpire = dateTimeExpire.getUTCHours();
        const minutesExpire = dateTimeExpire.getUTCMinutes();

        if (contrat && contrat.groupeList !== undefined && contrat.groupeList !== null) {
            risquegarantiesList = contrat?.groupeList.filter((groupe: any) => groupe?.garantieList)
        } else {
            risquegarantiesList = contrat?.groupesList.filter((groupe: any) => groupe?.garantieList)
        }
        risquegarantiesList.forEach((element: any) => {
            garantiesList.push(element.garantieList)
        })


        let index = 0;
        while (index < garantiesList?.length - 1) {
            garantiesList?.forEach((element: any) => {
                garanties.push(element[index])

            })
            index++;
        }

        index = 0;
        while (index < dataParam?.length) {

            let tmp = {
                "Nº ORDRE": [
                    { text: dataParam[index].risque + '/' + dataParam?.length, fontSize: "8" },
                ],
                Prime_RC: [
                    { text: '', fontSize: "8" },
                ],
                Prime_DR: [
                    { text: '', fontSize: "8" },
                ],
                Prime_DTA: [
                    { text: '', fontSize: "8" },
                ],
                Prime_DCVV: [
                    { text: '', fontSize: "8" },
                ],
                Prime_DC: [
                    { text: '', fontSize: "8" },
                ],
                Prime_Vol: [
                    { text: '', fontSize: "8" },
                ],
                Prime_Vol_Auo_radio: [
                    { text: '', fontSize: "8" },
                ],
                Prime_Incendie: [
                    { text: '', fontSize: "8" },
                ],

                Prime_BDG: [
                    { text: '', fontSize: "8" },
                ],
                Prime_Assistance: [
                    { text: '', fontSize: "8" },
                ],
                Prime_PCP: [
                    { text: '', fontSize: "8" },
                ],

                Prime_Nette: [
                    { text: dataParam[index].primeList.find((element: any) => element.risque == dataParam[index].risque)?.prime.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD", fontSize: "8" },

                ],

            };
            dataParam[index].garantieList?.map((ele: any) => {
                switch (ele.codeGarantie) {
                    case "G00":
                        tmp.Prime_RC[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;
                    case "G08":
                        tmp.Prime_DR[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;
                    case "G02":
                        tmp.Prime_DTA[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;
                    case "G13":
                        tmp.Prime_DCVV[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;
                    case "G07":
                        tmp.Prime_DC[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;
                    case "G03":
                        tmp.Prime_Vol[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;
                    case "G05":
                        tmp.Prime_Vol_Auo_radio[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;

                    case "G04":
                        tmp.Prime_Incendie[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;

                    case "G06":
                        tmp.Prime_BDG[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;

                    case "G11":
                        tmp.Prime_Assistance[0].text = Number(ele.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;

                    case "G18":

                        let pr1 = dataParam[index].garantieList?.find((element: any) => element.codeGarantie == "G17")?.prime
                        let pr2 = dataParam[index].garantieList?.find((element: any) => element.codeGarantie == "G16")?.prime
                        let pr3 = dataParam[index].garantieList?.find((element: any) => element.codeGarantie == "G18")?.prime
                        tmp.Prime_PCP[0].text = (Number(pr1) + Number(pr2) + Number(pr3)).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;

                    default:
                        break;
                }



            })
            garantiesPrime.push(tmp);
            index = index + 1;
        }

        if (contrat && contrat.groupeList !== undefined && contrat.groupeList !== null) {
            risqueListVehicule = contrat?.groupeList.filter((groupe: any) => groupe?.risques)
        } else {
            risqueListVehicule = contrat?.groupesList.filter((groupe: any) => groupe?.risques)
        }
        risqueListVehicule?.forEach((groupe: any) => {
            if (groupe?.risques) {
                groupe.risques.forEach((risque: any) => {
                    risques.push(risque);
                });
            }
        });



        index = 0;
        while (index < risques?.length) {

            let tmp = {
                "Nº ORDRE": [
                    { text: risques[index].idRisque + '/' + risques?.length, fontSize: "8" },
                ],
                MARQUE: [
                    { text: '', fontSize: "8" },
                ],
                IMMATRICULATION: [
                    { text: '', fontSize: "8" },
                ],
                CHASSIS: [
                    { text: '', fontSize: "8" },
                ],

                VALEUR_VENALE: [
                    { text: '', fontSize: "8" },
                ],

            };

            risques[index].risque?.map((ele: any) => {
                switch (ele.colonne) {
                    case "Marque":
                        tmp.MARQUE[0].text = ele.valeur
                        break;
                    case "N° d'Immatriculation":
                        tmp.IMMATRICULATION[0].text = ele.valeur
                        break;
                    case "Châssis ":
                        tmp.CHASSIS[0].text = ele.valeur
                        break;

                    case "Valeur Assuré":
                        
                        tmp.VALEUR_VENALE[0].text =  isNaN(Number(ele.valeur)) ? ele.valeur + " DZD" : Number(ele.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                        break;

                    default:
                        break;
                }

            })
            vehicules.push(tmp);
            index = index + 1;

        }


        dataParam.map((garantie: any) => garantie.garantieList?.some((param: any) => param?.codeGarantie == "G02"))[0] ?
            groupeGarantiesList = dataParam.find((garantie: any) => garantie.garantieList?.find((param: any) => param?.codeGarantie == "G02")).garantieList : groupeGarantiesList = []


        dataParam.map((garantie: any) => garantie.garantieList?.some((param: any) => param?.codeGarantie == "G13"))[0] ?
            groupeGarantiesList2 = dataParam.find((garantie: any) => garantie.garantieList?.find((param: any) => param?.codeGarantie == "G13")).garantieList : groupeGarantiesList2 = []

        dataParam.map((garantie: any) => garantie.garantieList?.some((param: any) => param?.codeGarantie == "G07"))[0] ?
            groupeGarantiesList3 = dataParam.find((garantie: any) => garantie.garantieList?.find((param: any) => param?.codeGarantie == "G07")).garantieList : groupeGarantiesList2 = []



        let assistance = dataParam.map((garantie: any) => garantie.garantieList?.find((param: any) => param?.codeGarantie == "G11"))


        //////console.log("assistance -----------", assistance);
        /////////////
        assistance.filter((param: any) => param?.codeGarantie == "G11")?.map((garantie: any) => {

            if (garantie.categorieList?.some((cat: any) => cat?.valeur == "0")) {
                valeur0 = true
            }
            if (garantie.categorieList?.some((cat: any) => cat?.valeur == "5")) {
                valeur5 = true
            }
            if (garantie.categorieList?.some((cat: any) => cat?.valeur == "15")) {
                valeur15 = true
            }
            if (garantie.categorieList?.some((cat: any) => cat?.valeur == "25")) {
                valeur25 = true
            }
            if (garantie.categorieList?.some((cat: any) => cat?.valeur == "100")) {
                valeur100 = true
            }
            if (garantie.categorieList?.some((cat: any) => cat?.valeur == "200")) {
                valeur200 = true
            }
            if (garantie.categorieList?.some((cat: any) => cat?.valeur == "300")) {
                valeur300 = true
            }


        })
        const docDefinitionContrat: any = {
            watermark: { text: '', color: 'blue', opacity: 0.1 },
            pageMargins: [35, 110, 35, 90],
            border: [false, false, false, false],
            header: function (currentPage: any, pageCount: any) {
                // Common header for all pages
                const commonHeader = {
                    text: 'Police N° : ' + contrat?.idContrat,
                    style: 'sectionHeader',
                    margin: [0, 30],
                    color: 'black'
                };
                if (currentPage == 1) {
                    return {
                        stack: [

                            {
                                text: 'AXA ' + contrat?.produit?.description.toUpperCase(),
                                style: 'sectionHeader'
                            },

                            {
                                text: 'Police N° : ' + contrat?.idContrat,
                                style: 'sectionHeader',
                                color: 'black'
                            },
                            contrat?.convention != null && contrat.produit.codeProduit != '45F' ?
                                {
                                    text: 'Convention: ' + contrat?.convention,
                                    style: 'sectionHeader',
                                    color: 'black'
                                } : contrat?.reduction != null && contrat.produit.codeProduit != '45F' ?
                                    {
                                        text: 'Réduction: ' + contrat?.reduction,
                                        style: 'sectionHeader',
                                        color: 'black'
                                    } : {},
                            { qr: 'https://www.axa.dz/wp-content/uploads/2023/10/Conditions-generales-Assurance-Automobile.pdf', alignment: "right", fit: '65' },
                        ],
                        margin: [35, 30, 35, 0]
                    }
                } else {
                    // Header for subsequent pages
                    return {
                        stack: [commonHeader],
                        margin: [35, 10, 35, 0]
                    };
                }
            },
            content: [
                {

                    text: 'Contrat FLOTTE AUTOMOBILE',
                    bold: true,
                    color: "#00008F",
                    fontSize: 60,
                    alignment: "center",
                    margin: [0, 150]

                },
                {
                    text: contrat?.personnesList.map((peronne: any) => peronne?.personne.raisonSocial)[0],
                    bold: true,
                    color: "#00008F",
                    fontSize: 30,
                    alignment: "center",

                    pageBreak: 'after'
                },
                {

                    text: `\n\nCONDITIONS PARTICULIERES\n`,
                    bold: true,
                    color: "#00008F",
                    fontSize: 12,
                    alignment: 'justify'

                },
                {
                    text: 'Le présent contrat est conclu entre :',
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: 'AXA Assurances Algérie Dommage SPA, société de droit algérien inscrite au registre de commerce d’Alger sous le numéro 16/00- 1005172 B 11 au capital de 3.150.000.000,00 de Dinars Algériens, dont le siège social est sis au lotissement 11 décembre 1960 lots 08 et 12, 16030 El Biar Alger',
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: '\nReprésentée par son directeur général, ayant tous pouvoirs à l’effet des présentes.',
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: 'Ci-après dénommée « L’Assureur »\n\t\tD’une part, ',
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: '\nEt\n ',
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: 'La société :  ' + contrat?.personnesList.map((peronne: any) => peronne?.personne.raisonSocial)[0] + ', dont le siège est situé à: ' + contrat?.personnesList.map((peronne: any) => peronne?.personne.adressesList[0].description),
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: '\nReprésentée par son gérant, ayant tous pouvoirs à l’effet des présentes. ',
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: '\nCi-après dénommée « L’assuré ». ',
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: '\nD’autre part, ',
                    color: "black",
                    fontSize: 10,
                    alignment: "right",

                },
                {
                    text: '\nIl est convenu ce qui suit : ',
                    color: "black",
                    fontSize: 10,
                    pageBreak: 'after'

                },

                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `PRÉAMBULE`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: 'Le présent contrat d’assurance est régi par le Code Civil, l’ordonnance n°95/07 du 25 Janvier 1995 modifiée par la loi n°06/04 du 20 Février 2006, relative aux Assurances, l’ordonnance n°74/15 du 30 Janvier 1974 modifiée et complétée par la loi n°88/31 du 19/07/1988 et les décrets n°80/34 - n°80/35 - n°80/36 et n°80/37 du 16 Février 1980. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\nLe présent contrat qui matérialise les engagements respectifs des parties intervenantes, se compose des éléments suivants : ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\n1.	- Les Conditions générales du contrat d\'assurance, qui définissent les droits et obligations réciproques des parties. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '- Les présentes Conditions particulières décrivant les règles de fonctionnement du contrat ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '– Les annexes : ANNEXE A – Détail des garanties ; ANNEXE B – Détail des primes et garanties ; ANNEXE C – Détail des véhicules assurés ; ANNEXE D – Notice d’information. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: 'Aux conditions générales qui précédent et à celles particulières qui suivent l’Assureur garantit l’Assuré contre les risques définis ci-après :  ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 1 : OBJECT DU CONTRAT`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: '\nLe présent contrat d’assurance est régi par le Code Civil, l’ordonnance n°95/07 du 25 Janvier 1995 modifiée par la loi n°06/04 du 20 Février 2006, relative aux Assurances, l’ordonnance n°74/15 du 30 Janvier 1974 modifiée et complétée par la loi n°88/31 du 19/07/1988 et les décrets n°80/34 - n°80/35 - n°80/36 et n°80/37 du 16 Février 1980. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\nToute modification des risques couverts à l’ANNEXE « A – Détail des garanties » doit faire l’objet d’un avenant signé par les deux parties. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\nToute modification de la liste des véhicules désignés dans l’ANNEXE « C – Détail des véhicules assurés » doit faire l’objet d’un avenant signé par les deux parties.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 2 : RISQUES ASSURES`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: '\nSont assurées, par le présent contrat d’assurance, les véhicules identifiés dans le tableau intitulé « ANNEXE C – Détail des véhicules assurés». joint aux présentes conditions particulières. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 3 : LIEU DU RISQUE (TERRITORIALITE)`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: 'L\'assurance du présent contrat produit ses effets exclusivement en Algérie.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 4 : USAGE VEHICULE`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: 'Le souscripteur déclare que les véhicules, objets de l\'assurance sont utilisés à titre commercial.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 5 : MONTANTS DES GARANTIES`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: 'Les garanties sont accordées pour les véhicules assurés dans les limites des sommes fixées dans le tableau intitulé : « ANNEXE A – Détail des garanties » ainsi que dans le tableau intitule : « ANNEXE B – Détail des primes et garanties » joint aux présentes conditions particulières. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 6 : FRANCHISE`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: 'Par dérogation à toute disposition contraire, l\'Assuré conserve à sa charge une partie de l’indemnité due après sinistre, telle qu’elle est fixée par garantie dans le tableau intitulé « ANNEXE A – Détail des garanties» joint aux présentes conditions particulières.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 7 : PRIME D'ASSURANCE`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: '\n7.1 Décompte de la Prime.\n',
                    color: "black",
                    fontSize: 10,

                },
                {
                    columns: [

                        {
                            style: "table",
                            table: {

                                widths: ["*", "*", "*", "*", "*", "*"],
                                body: [
                                    [
                                        {
                                            text: `Prime nette`,
                                            style: "headerTable"
                                        },
                                        contrat?.idHistorique == undefined ?
                                            {
                                                text: `Coût de police`,
                                                style: "headerTable"
                                            }
                                            : {
                                                text: `Frais de gestion`,
                                                style: "headerTable"
                                            },
                                        {
                                            text: `T.V.A`,
                                            style: "headerTable"
                                        },

                                        {
                                            text: `F.G.A`,
                                            style: "headerTable"
                                        },
                                        {
                                            text: `Timbre de dimension`,
                                            style: "headerTable"
                                        },

                                        {
                                            text: `Timbre gradué`,
                                            style: "headerTable"
                                        },
                                    ],
                                    [
                                        {
                                            text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" + " DZD",
                                            fontSize: 8
                                        },
                                        contrat?.idHistorique == undefined ?
                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" + " DZD",
                                                fontSize: 8
                                            }
                                            : {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" + " DZD",
                                                fontSize: 8
                                            },
                                        {
                                            text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" + " DZD",
                                            fontSize: 8
                                        },
                                        {
                                            text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" + " DZD",
                                            fontSize: 8
                                        },
                                        {
                                            text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" + " DZD",
                                            fontSize: 8
                                        },

                                        {
                                            text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" + " DZD",
                                            fontSize: 8
                                        },
                                    ],
                                    [
                                        { text: '', colSpan: 4 },
                                        {},
                                        {},
                                        {},
                                        {
                                            text: `Prime Totale`,
                                            style: "headerTable",
                                        },
                                        {
                                            text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" ,
                                            fontSize: 8
                                        },
                                    ],
                                ],
                            }
                        }
                    ],
                },
                {
                    text: '\n7.2 Paiement de la Prime\n',
                    color: "black",
                    fontSize: 10,

                },
                {
                    text: 'La prime totale (toutes taxes comprises) du présent contrat est de ' + Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".DZD" + '. Elle est payable à la date de souscription du contrat.',
                    color: "black",
                    fontSize: "8",
                    pageBreak: 'after'

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 8 : DUREE DU CONTRAT`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: 'Le contrat est souscrit pour une durée ferme allant du ' + contrat?.dateEffet?.split("T")[0] + ' à ' + hoursEffet + 'H' + minutesEffet + ' au ' + contrat?.dateExpiration?.split("T")[0],
                    color: "black",
                    fontSize: "8",

                },

                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 9 : DISPOSITIONS RELATIVES A L’INDEMNISATION DES SINISTRES`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: '\nEn cas de sinistres l’assuré devra se conformer aux obligations décrites en «ANNEXE D – Notice d’information »  des présentes conditions particulières.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 10 : DISPOSITIONS DIVERSES`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: '\n•	Fiscalité : Il sera fait application de la législation fiscale en la matière en vigueur en Algérie.\n•	Modifications du contrat : Toutes modifications dans les termes et conditions de la présente assurance seront constatées par avenant signé par les deux parties annexées au présent contrat pour en faire partie intégrante.\n•	Le présent contrat est conclu entre les parties pour être exécuté de bonne foi\n•	Limite annuelle d’indemnisation : Au titre des garanties suivantes : Bris de glaces, Vol, Incendie, Dommages tous accidents, Dommages collision, Protection du conducteur & des passagers, le total annuel des indemnisations ne peut excéder 1,5 fois la limite maximum par sinistre.',
                    color: "black",
                    fontSize: "8",
                    alignment: 'justify'

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ARTICLE 11 : DÉCLARATION DE L’ASSURE`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {
                    text: '\n•	L’assuré reconnait avoir reçu un exemplaire des Conditions Générales et des présentes Conditions Particulières et déclare avoir pris connaissance des textes y figurant.\n•	L’assuré reconnait que les présentes Conditions Particulières ont été établies conformément aux réponses données de l’assuré aux questions posées par la Compagnie lors de la souscription du contrat.\n•	L’assuré reconnais également avoir été préalablement informé(e) du montant de la prime et des garanties du présent contrat.\n•	L’assuré reconnais avoir été informé(e), au moment de la collecte d’informations que les conséquences qui pourraient résulter d’une omission ou d’une déclaration inexacte sont celles prévues par l’article 19 de l’ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006.\n•	En signant ce document, l’assuré accepte que les informations saisies dans ce document soient, utilisée, exploitées, traitées par AXA Assurances Algérie Dommage spa, transférées à l’étranger et à ses sous-traitants, dans le cadre de l\'exécution des finalités de la relation commerciale, conformément à la Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.\n•	L’assuré autorise également AXA Assurances Algérie Dommage d’envoyer des messages et des appels de prospections commerciales quel qu’en soit le support ou la nature.\n•	Pour toute demande concernant le traitement de vos données à caractère personnel, merci de nous contacter sur l’adresse : dpo@axa.dz.',
                    color: "black",
                    fontSize: "8",
                    alignment: 'justify'

                },
                { text: `\n\nFait à ${contrat?.agence?.commune} - ${contrat?.agence?.wilaya} Le ${contrat?.auditDate?.split("T")[0]}\n\n`, bold: true, fontSize: "8" },
                {
                    layout: 'noBorders',
                    table: {
                        widths: ["*", "*"],
                        alignment: "center",
                        body: [
                            [
                                {
                                    text: [
                                        { text: `Signature de l'assuré(e)\n`, bold: true, fontSize: "8" },
                                        { text: `Précédée de la mention « Lu et approuvé »\n`, fontSize: "8" },
                                    ],
                                    alignment: 'left'
                                },
                                {
                                    text: `Pour la Compagnie:`, bold: true, fontSize: "8",
                                    alignment: 'right',
                                   
                                }
                            ]
                        ],
                    },
                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            pageBreak: 'before',
                                            text: `ANNEXE A – Détail des garanties`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {

                    text: `\nGaranties Souscrites\n`,
                    bold: true,
                    color: "#00008F",
                    fontSize: 12,
                    alignment: 'justify',

                },
                {
                    columns: [

                        {
                            style: "table",
                            table: {

                                widths: ["*", "*", "*", "*"],
                                body: [
                                    [
                                        {
                                            text: `Garanties Souscrites`,
                                            fontSize: 8,
                                            style: "headerTable"
                                        },
                                        {
                                            text: `Limites des Garanties par Sinistre / DA`,
                                            fontSize: 8,
                                            style: "headerTable"
                                        },
                                        {
                                            text: `Franchise `,
                                            fontSize: 8,
                                            style: "headerTable"
                                        },
                                        {
                                            text: `Règle Proportionnelle `,
                                            fontSize: 8,
                                            style: "headerTable"
                                        },

                                    ],
                                    [
                                        {
                                            text: "Responsabilité Civile en et hors circulation (article 4 des conditions générales)",
                                            fontSize: "8",
                                        },

                                        {
                                            text: "Illimités",
                                            fontSize: "8",
                                        },
                                        {
                                            text: "Sans Franchise",
                                            fontSize: "8",
                                        },
                                        {
                                            text: "Non applicable",
                                            fontSize: "8",
                                        },

                                    ],
                                    //  dataParam.find((garantie:any)=>garantie.garantieList?.find((param: any) => param?.codeGarantie == "G02"))?
                                    [
                                        {
                                            text: "Dommages Tous Accident (DTA) (article 13 des conditions générales)",
                                            alignment: 'justify',
                                            fontSize: "8",
                                        },

                                        {
                                            text: "En cas de perte totale : Valeur de remplacement estimée par l'expert sans excéder la valeur vénale du véhicule déclarée par l'assuré figurant dans l'ANNEXE C.\nEn cas de dommages partiels : Coût des réparations ou de remplacement des pièces détériorées dans la limite de la valeur de remplacement estimée par l'expert en application du barème de l'UAR pour le cout de la main d'œuvre.",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },

                                        {

                                            text: groupeGarantiesList.find((param: any) => param?.codeGarantie == "G02")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur ?
                                                Number(groupeGarantiesList.find((param: any) => param?.codeGarantie == "G02")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                                                : "/",
                                            fontSize: "8",
                                        }
                                        ,

                                        {
                                            text: "",
                                            fontSize: "8",
                                        },

                                    ],
                                    // dataParam.find((garantie:any)=>garantie.garantieList?.find((param: any) => param?.codeGarantie == "G13"))?
                                    [
                                        {
                                            text: "Dommages Collision a valeur vénale (article 15 des conditions générales)",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },

                                        {
                                            text: "En cas de dommages partiels : Coût des réparations ou de remplacement des pièces détériorées dans la limite de la valeur de remplacement estimée par l’expert en application du barème de l'UAR pour le cout de la main d'œuvre.\n\nLa DC VV est accordée pour les véhicules âgés de 9 à 10 ans.",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },
                                        {

                                            text: groupeGarantiesList2.find((param: any) => param?.codeGarantie == "G13")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur ?
                                                Number(groupeGarantiesList2.find((param: any) => param?.codeGarantie == "G13")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                                                : "/",
                                            fontSize: "8",

                                        },
                                        {
                                            text: "Applicable",
                                            fontSize: "8",
                                        },

                                    ],
                                    [
                                        {
                                            text: "Dommages Collision à hauteur de 100 000.00 DA",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },

                                        {
                                            text: "En cas de perte totale ou de dommages partiels : la valeur de remplacement estimée par l’expert est plafonnée à 100 000.00 DA.\n\nLa DC 100 000 DA est accordée pour les véhicules âgés de 11 à 14 ans.",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },
                                        {
                                            text: groupeGarantiesList3.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur ?
                                                Number(groupeGarantiesList3.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                                                : "/",
                                            fontSize: "8",
                                        },
                                        {
                                            text: "Applicable",
                                            fontSize: "8",
                                        },

                                    ],
                                    [
                                        {
                                            text: "Bris de Glaces (article 21 des conditions générales)",
                                            fontSize: "8",
                                        },

                                        {
                                            text: "Coût des réparations ou de remplacement des glaces sans toutefois dépasser le plafond de 70 000.00 DA",
                                            alignment: 'justify',
                                            fontSize: "8",
                                        },
                                        {
                                            text: groupeGarantiesList.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur ?
                                                Number(groupeGarantiesList.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD"
                                                : "/",
                                        },
                                        {
                                            text: "",
                                            fontSize: "8",
                                        },

                                    ],
                                    [
                                        {
                                            text: "Vol de véhicules (article 19 des conditions générales)",
                                            alignment: 'justify',
                                            fontSize: "8",
                                        },

                                        {
                                            text: "En cas de perte totale : Valeur de remplacement estimée par l'expert sans excéder la valeur vénale du véhicule déclarée par l'assuré figurant dans l'ANNEXE C. En cas de dommages partiels : Coût des réparations ou de remplacement des pièces détériorées dans la limite de la valeur de remplacement estimée par l'expert en application du barème de l'UAR pour le cout de la main d'œuvre.",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },

                                        {
                                            /* text: groupeGarantiesList.find((param: any) => param?.codeGarantie == "G03").categorieList?.find((cat: any) => cat?.code == "C15").valeur?
                                             Number(groupeGarantiesList.find((param: any) => param?.codeGarantie == "G03").categorieList?.find((cat: any) => cat?.code == "C15").valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" : " makach",
                                             fontSize: "8",
                                             */
                                            text: "Sans Franchise",
                                            fontSize: "8",
                                        },

                                        {
                                            text: "Applicable",
                                            fontSize: "8",
                                        },

                                    ],
                                    [
                                        {
                                            text: "Incendie (article 17 des conditions générales)",
                                            fontSize: "8",
                                        },

                                        {
                                            text: "En cas de perte totale : Valeur de remplacement estimée par l'expert sans excéder la valeur vénale du véhicule déclarée par l'assuré figurant dans l'ANNEXE C.\nEn cas de dommages partiels : Coût des réparations ou de remplacement des pièces détériorées dans la limite de la valeur de remplacement estimée par l'expert en application du barème de l'UAR pour le cout de la main d'œuvre.",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },
                                        {
                                            /* text: groupeGarantiesList.find((param: any) => param?.codeGarantie == "G04").categorieList?.find((cat: any) => cat?.code == "C15").valeur?
                                             Number(groupeGarantiesList.find((param: any) => param?.codeGarantie == "G04").categorieList?.find((cat: any) => cat?.code == "C15").valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" : " makach",
                                             fontSize: "8",
                                             */
                                            text: "Sans Franchise",
                                            fontSize: "8",
                                        },
                                        {
                                            text: "Applicable",
                                            fontSize: "8",
                                        },

                                    ],
                                    [
                                        {
                                            text: "Vol Auto Radio",
                                            fontSize: "8",
                                        },

                                        {
                                            text: "",
                                            fontSize: "8",
                                        },
                                        {
                                            text: "Sans Franchise",
                                            fontSize: "8",
                                        },
                                        {
                                            text: "Non applicable",
                                            fontSize: "8",
                                        },

                                    ],


                                    [
                                        {
                                            text: "Protection du conducteur et des passagers",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },

                                        {
                                            text: "Décès- invalidité absolue et définitive / Limite :\n\n2 000 000 DA \n\nI.P.P (Incapacité Permanente partielle) / Limite :\n\n2 000 000 DA\n\nFrais médicaux et d’hospitalisation / Limite : \n\n300 000 DA",
                                            fontSize: "8",
                                            alignment: 'justify',
                                        },
                                        {
                                            text: "Sans Franchise",
                                            fontSize: "8",
                                        },
                                        {
                                            text: "Non applicable",
                                            fontSize: "8",
                                        },

                                    ],

                                ],
                            },
                        },

                    ],
                },
                valeur0 ?
                    {
                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*", "*", "*", "*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: "Assistance automobile – Plus Auto",
                                                fontSize: "8",
                                                border: [true, true, false, true],
                                            },
                                            {
                                                text: "Assistance aux véhicules\n1. Dépannage / Remorquage en cas de panne ou d'accident dans la limite de 15 000.00 DZD. \n2. Extraction du véhicule assuré à l'aide d'une grue dans la limite de 7 000.00 DZD. \n3. Retour des bénéficiaires / Poursuite du voyage : inclus. \n4. Prise en charge des frais d'hébergement à l'hôtel (par nuitée et par personne) dans la limite de 10 000.00 DZD/nuitée, sans dépasser 02 nuitées par personne. \n5. Séjour et déplacement des bénéficiaires suite au vol du véhicule assuré dans la limite de 10 000.00 DZD/nuitée sans dépasser 02 nuitées par personne. \n6. Gardiennage et récupération du véhicule après réparation dans la limite de 3 000.00 DZD. \n7. Service d'un chauffeur professionnel : Inclus\nAssistance aux Personnes\nFranchise Kilométrique : 50 Kilomètres\n1. Transport sanitaire : Inclus\n2. Transport des bénéficiaires accompagnateurs: Inclus\n3. Rapatriement de corps : 60 000 DZD\n4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne) : 20 000 DZD\n5. Interruption de voyage à la suite du décès d'un proche parent en Algérie : Inclus\n6. Transmission de messages urgents : Inclus",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "25 Kilomètres",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Non applicable",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                        ],
                                    ],
                                }
                            },

                        ]


                    } : {},

                valeur5 ?
                    {

                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*", "*", "*", "*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: "Assistance automobile – Essentiel Auto",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Assistance aux véhicules\n1. Dépannage / Remorquage en cas de panne ou d'accident dans la limite de 15 000.00 DZD. \n2. Extraction du véhicule assuré à l'aide d'une grue dans la limite de 7 000.00 DZD. \n3. Retour des bénéficiaires / Poursuite du voyage : inclus. \n4. Prise en charge des frais d'hébergement à l'hôtel (par nuitée et par personne) dans la limite de 10 000.00 DZD/nuitée, sans dépasser 02 nuitées par personne. \n5. Séjour et déplacement des bénéficiaires suite au vol du véhicule assuré dans la limite de 10 000.00 DZD/nuitée sans dépasser 02 nuitées par personne. \n6. Gardiennage et récupération du véhicule après réparation dans la limite de 3 000.00 DZD. \n7. Service d'un chauffeur professionnel : Inclus\nAssistance aux Personnes\nFranchise Kilométrique : 50 Kilomètres\n1. Transport sanitaire : Inclus\n2. Transport des bénéficiaires accompagnateurs: Inclus\n3. Rapatriement de corps : 40 000 DZD\n4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne) : 10 000 DZD",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "5 Kilomètres",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Non applicable",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                        ],
                                    ],
                                }
                            },
                        ]


                    } : {},
                valeur15 ?
                    {

                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*", "*", "*", "*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: "Assistance automobile - Classic Auto",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Assistance aux véhicules1. Dépannage / Remorquage en cas de panne ou d'accident dans la limite de 10 000.00 DZD. 2. Extraction du véhicule assuré à l'aide d'une grue dans la limite de 7 000.00 DZD. 3. Retour des bénéficiaires / Poursuite du voyage : inclus. 4. Prise en charge des frais d'hébergement à l'hôtel (par nuitée et par personne) dans la limite de 5 000.00 DZD/nuitée, sans dépasser 02 nuitées par personne. 5. Séjour et déplacement des bénéficiaires suite au vol du véhicule assuré dans la limite de 5 000.00 DZD/nuitée sans dépasser 02 nuitées par personne. 6. Gardiennage et récupération du véhicule après réparation dans la limite de 3 000.00 DZD. 7. Service d'un chauffeur professionnel : Inclus",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "15 Kilomètres",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Non applicable",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                        ],
                                    ],
                                }
                            },

                        ]


                    } : {},
                valeur25 ?
                    {

                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*", "*", "*", "*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: "Assistance automobile - Basic Auto",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Assistance aux véhicules1. Dépannage / Remorquage en cas de panne ou d'accident dans la limite de 7 000.00 DZD. 2. Extraction du véhicule assuré à l'aide d'une grue dans la limite de 7 000.00 DZD. 3. Retour des bénéficiaires / Poursuite du voyage : inclus. 4. Prise en charge des frais d'hébergement à l'hôtel (par nuitée et par personne) dans la limite de 5 000.00 DZD/nuitée, sans dépasser 02 nuitées par personne. 5. Séjour et déplacement des bénéficiaires suite au vol du véhicule assuré dans la limite de 5 000.00 DZD/nuitée sans dépasser 02 nuitées par personne. 6. Gardiennage et récupération du véhicule après réparation dans la limite de 3 000.00 DZD 7. Service d'un chauffeur professionnel : Inclus",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },


                                            {
                                                text: "25 Kilomètres",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Non applicable",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                        ],
                                    ],
                                }
                            },

                        ]



                    } : {},
                valeur100 ?
                    {

                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*", "*", "*", "*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: "Formule Poids Lourd - 100Km",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Assistance aux véhicules. 1. Franchise kilométrique en cas de panne (en km) : 0. 2. Dépannage/remorquage en cas de panne : Au garage le plus proche. 3. Dépannage/remorquage en cas d’accident : 100 Km. 4. Retour des bénéficiaires/ Poursuite du voyage/ Frais d’hôtel : 6 000 DZD/nuit/personne (02 nuits maximum).",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },


                                            {
                                                text: "100 Kilomètres",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Non applicable",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                        ],
                                    ],
                                }
                            },

                        ]



                    } : {},
                valeur200 ?
                    {

                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*", "*", "*", "*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: "Formule Poids Lourd - 200Km",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Assistance aux véhicules. 1. Franchise kilométrique en cas de panne (en km) : 0. 2. Dépannage/remorquage en cas de panne : Au garage le plus proche. 3. Dépannage/remorquage en cas d’accident : 200 Km. 4. Retour des bénéficiaires/ Poursuite du voyage/ Frais d’hôtel : 6 000 DZD/nuit/personne (02 nuits maximum).",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },


                                            {
                                                text: "200 Kilomètres",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Non applicable",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                        ],
                                    ],
                                }
                            },

                        ]



                    } : {},
                valeur300 ?
                    {

                        columns: [
                            {
                                style: "table",
                                table: {
                                    widths: ["*", "*", "*", "*"],
                                    alignment: "left",
                                    body: [
                                        [
                                            {
                                                text: "Formule Poids Lourd - 300Km",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Assistance aux véhicules. 1. Franchise kilométrique en cas de panne (en km) : 0. 2. Dépannage/remorquage en cas de panne : Au garage le plus proche. 3. Dépannage/remorquage en cas d’accident : 300 Km. 4. Retour des bénéficiaires/ Poursuite du voyage/ Frais d’hôtel : 6 000 DZD/nuit/personne (02 nuits maximum).",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },


                                            {
                                                text: "300 Kilomètres",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                            {
                                                text: "Non applicable",
                                                fontSize: "8",
                                                border: [true, true, true, true],
                                            },
                                        ],
                                    ],
                                }
                            },

                        ]



                    } : {},
                {
                    text: '\n',
                    pageBreak: 'after'

                },
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ANNEXE C – Détail des véhicules assurés`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                { text: '\n' },
                vehicules.length != 0 ? this.table(vehicules, headersRisque) : {},
              
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            pageBreak: 'before',
                                            text: `ANNEXE D – Notice d’information `,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                {

                    text: `\nNotice d’Information à l’usage des assurés en assurance automobile\n`,

                    fontSize: "8",
                    alignment: 'justify',

                },
                {

                    text: `\nAfin de vous faciliter la procédure de déclaration d’un sinistre et permettre à nos gestionnaires des sinistres de répondre  dans les meilleurs délais à vos demandes d’indemnisation, nous vous conseillons de suivre les recommandations suivantes :`,

                    fontSize: "8",
                    alignment: 'justify',

                },
                {

                    text: `\nCette présente notice est dédiée au cas des sinistres de la branche automobile, notamment la gestion des risques flottes. Les garanties concernées sont les RC, Dommages tout accident ou dommages collision, incendie, vol et BDG. Les cas de dommages corporels seront pris au cas par cas du fait de sa sensibilité.`,

                    fontSize: "8",
                    alignment: 'justify',

                },
                {
                    text: '\n1.	Déclaration du sinistre\n',
                    color: "black",
                    fontSize: "8",

                },
                {

                    text: `\nAprès la réalisation d’un risque, l’assuré est tenu de déclarer le sinistre dans les délais prescrits par le contrat notamment aux conditions générales des polices d’assurances.`,
                    bold: true,
                    color: "#00008F",
                    fontSize: "8",
                    alignment: 'justify',

                },
                {
                    text: '\nLes délais sont de sept (07) jours ouvrables ou de trois (03) jours en cas de vol, sauf cas de force majeur. Le délai coure à partir du moment où l’assuré a eu connaissance de l’événement.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\nCette déclaration de sinistre doit comporter les informations suivantes :',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\nCette déclaration de sinistre doit comporter les informations suivantes :\n•	Le numéro de police et/ou de l’avenant en court de validité. \n•	Marque et type du véhicule ainsi que son immatriculation. \n•	Date et lieu de survenance du sinistre avec précision sur l’heure pour les accidents de circulation. \n•	Toute information ayant trait à d’autres intervenants (tiers.)\n•	Nature du sinistre ou des dommages. \n•	Causes et circonstances. \n•	Enumération approximative des dommages et des éléments endommagés. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: 'il est indispensable de vous rappeler que la déclaration doit obligatoirement se faire sur le formulaire du constat amiable de déclaration d’accident adopté par les compagnies d’assurance. ',
                    color: "black",
                    fontSize: "8",
                    bold: true,

                },
                {
                    text: '\nLes coordonnées du tiers à recueillir sont :',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\n•	Nom, prénom et adresse du tiers. \n•	N° de police, sa validité et la domiciliation de son assurance (compagnie et agence). \n•	Marque et type du véhicule ainsi que son immatriculation. \n•	Nom, prénom et N° de permis du conducteur et validité de son permis. ',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\n2.	Documents à remettre en cas de sinistre :\n',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\nAfin d’appuyer les véracités des informations fournies à l’assureur et dans la mesure du possible, il est recommandé de fournir les documents justificatifs suivants :',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\n•	Carte grise du véhicule\n•	Permis de conduire du conducteur au moment du sinistre.\n•	Attestation de l‘assurance en cours de validité.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\nLes copies des mêmes documents concernant le tiers sont souhaitables en cas de sinistre ayant celui- ci comme partie.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\n3.	Cas particulier du Vol :\n',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: 'Comme précédemment mentionné le Délai de déclaration en cas de vol, qu’il soit partiel ou total, est de 3 jours ouvrable avec la mention sur l’obligation de déposer plainte auprès des autorités territorialement compétente (police ou gendarmerie) dans les 24 heures suivant la constations du vol.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\n•	Certificat de dépôts de plainte.\n•	Carte grise du véhicule.\n•	Double du jeu de clefs.\n•	Déclaration formelle de vol signée par l’assuré.',
                    color: "black",
                    fontSize: "8",

                },
                {
                    text: '\nAprès instruction du dossier : \n',
                    color: "black",
                    bold: true,
                    fontSize: "8",

                },
                {
                    text: '\n•	Formule d’opposition aux autorités et à la direction de wilaya des services des cartes grises et ré immatriculation. \n•	Acte de cession de véhicule au profil d’AXA assurances. ',
                    color: "black",
                    fontSize: "8",

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
                    margin: [0, 10, 0, 0]
                },
                headerTable: {
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    color: "#00008F",
                  
                }
            }
        }


        const docDefinitionPrimesGaranties: any = {
            watermark: { text: '', color: 'blue', opacity: 0.1 },
            pageMargins: [35, 110, 35, 90],
            border: [false, false, false, false],
            pageOrientation: 'landscape',
            header: function (currentPage: any, pageCount: any) {
                // Common header for all pages
                const commonHeader = {
                    text: 'Police N° : ' + contrat?.idContrat,
                    style: 'sectionHeader',
                    margin: [0, 30],
                    color: 'black'
                };
                if (currentPage == 1) {

                    // Header for subsequent pages
                    return {
                        stack: [commonHeader],
                        margin: [35, 10, 35, 0]
                    };
                }
            },
            content: [
                {
                    columns: [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `ANNEXE B – Détail des primes et garanties`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                },
                { text: '\n' },
                garantiesPrime.length != 0 ? this.table(garantiesPrime, headersGarantieList) : {},
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
                    margin: [0, 2, 0, 0]
                },
                headerTable: {
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    color: "#00008F",
                    
                }
            }
        }

        pdfMake.createPdf(docDefinitionContrat).download("CP_" + contrat?.idContrat);
        pdfMake.createPdf(docDefinitionPrimesGaranties).download("CP_Garanties" + contrat?.idContrat);
    }

    outputLeasing(contrat: any, quittance: any, dataParam: any) {

        let risqueListVehicule: any = []
        let risques: any = []
        let headersGarantie = ["Garantie(s)", "Primes"]


        if (contrat && contrat.groupeList !== undefined && contrat.groupeList !== null) {
            risqueListVehicule = contrat?.groupeList.filter((groupe: any) => groupe?.garantieList)
        } else {
            risqueListVehicule = contrat?.groupesList.filter((groupe: any) => groupe?.garantieList)
        }
        risqueListVehicule?.forEach((groupe: any) => {
            if (groupe?.risques) {
                groupe.risques.forEach((risque: any) => {
                    risques.push(risque);
                });
            }
        });


        const docDefinitionContrat: any = {
            watermark: { text: '', color: 'blue', opacity: 0.1 },
            pageMargins: [35, 110, 35, 90],
            border: [false, false, false, false],
            header: function (currentPage: any, pageCount: any) {
                // Common header for all pages
                const commonHeader = {
                    text: 'Police N° : ' + contrat?.idContrat,
                    style: 'sectionHeader',
                    margin: [0, 30],
                    color: 'black'
                };
                if (currentPage == 1) {
                    return {
                        stack: [

                            {
                                text: 'AXA ' + contrat?.produit?.description.toUpperCase(),
                                style: 'sectionHeader'
                            },

                            {
                                text: 'Police N° : ' + contrat?.idContrat,
                                style: 'sectionHeader',
                                color: 'black'
                            },
                            { qr: 'https://www.axa.dz/wp-content/uploads/2023/10/Conditions-generales-Assurance-Automobile.pdf', alignment: "right", fit: '65' },
                        ],
                        margin: [35, 30, 35, 0]
                    }
                } else {
                    // Header for subsequent pages
                    return {
                        stack: [commonHeader],
                        margin: [35, 10, 35, 0]
                    };
                }
            },
            content: risques.map((risq: any) => ({
                stack: [
                    {
                        style: "table",
                        table: {
                            widths: ["*"],
                            alignment: "left",
                            body: [
                                [
                                    {
                                       
                                        text: `Décompte de Prime Flotte Automobile`,
                                        style: "headerTable"
                                    },
                                ],
                            ],
                        }
                    },

                    {
                        style: "table",
                        table: {
                            widths: ["*"],
                            alignment: "left",
                            body: [
                                [
                                    {
                                        text: `Référence du contrat`,
                                        style: "headerTable"
                                    },
                                ],
                            ],
                        }
                    },
                    {
                        style: "table",
                        table: {
                            widths: ["*", "*"],
                            alignment: "left",
                            body: [


                                [
                                    {
                                        text: `Client : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: contrat?.personnesList.map((peronne: any) => peronne?.personne.raisonSocial)[0],
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                ],
                                [
                                    {
                                        text: `Crédit Preneur :`,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque: any) => risque.colonne == "Nom & Prénom Crédit Preneur/Raison Social").valeur,
                                        fontSize: "8",
                                        color: 'black',

                                    },
                                ],
                                [
                                    {
                                        text: `Adresse du Crédit Preneur : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque: any) => risque.colonne == "Adresse Crédit Preneur").valeur,
                                        fontSize: "8",
                                        color: 'black',

                                    },
                                ],

                                [
                                    {
                                        text: `Date d'effet  `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: contrat?.dateEffet?.split("T")[0],
                                        fontSize: "8",
                                        color: 'black',

                                    },
                                ],
                                [
                                    {
                                        text: `Date d’échéance  `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: contrat?.dateExpiration?.split("T")[0],
                                        fontSize: "8",
                                        color: 'black',

                                    },
                                ],
                                [
                                    {
                                        text: `Agence : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: contrat?.agence?.codeAgence + " " + contrat?.agence?.raisonSocial,
                                        fontSize: "8",
                                        color: 'black',

                                    },
                                ],
                                [
                                    {
                                        text: `Contrat N° : : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque: any) => risque.colonne == "Numero de contrat").valeur,
                                        fontSize: "8",
                                        color: 'black',

                                    },
                                ],
                                [
                                    {
                                        text: `Matériel N° : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque: any) => risque.colonne == "Numéro de Matériel").valeur,
                                        fontSize: "8",
                                        color: 'black',

                                    },
                                ],
                            ],

                        }
                    },

                    {
                        style: "table",
                        table: {
                            widths: ["*"],
                            alignment: "left",
                            body: [
                                [
                                    {
                                        text: `Véhicule`,
                                        style: "headerTable"
                                    },
                                ],
                            ],
                        }
                    },

                    {
                        style: "table",
                        table: {
                            widths: ["*", "*"],
                            alignment: "left",
                            body: [


                                [
                                    {
                                        text: `Marque  : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque: any) => risque.colonne == "Marque").valeur,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                ],
                                [
                                    {
                                        text: `modèle  : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque: any) => risque.colonne == "Modèle").valeur,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                ],
                                [
                                    {
                                        text: `Genre  : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque: any) => risque.colonne == "classe de vehicule").valeur,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                ],
                                [
                                    {
                                        text: `Immatriculation  : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque: any) => risque.colonne == "N° d'Immatriculation").valeur,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                ],
                            ],
                        }
                    },
                    {
                        style: "table",
                        table: {
                            widths: ["*"],
                            alignment: "left",
                            body: [
                                [
                                    {
                                        text: `Primes nettes`,
                                        style: "headerTable"
                                    },
                                ],
                            ],
                        }
                    },

                    {
                        style: "table",
                        table: {
                            widths: ["*", "*"],

                            body: [headersGarantie].concat(
                                dataParam?.find((element: any) => element.risque == risq?.idRisque).garantieList.map((item: any) => {

                                    let garantie: any;
                                    let prime: any = [];

                                    garantie = item.description
                                    // prime = item.prime
                                    prime = item.primeProrata

                                    return [
                                        [{ text: garantie, fontSize: "8" }],
                                        [{ text: Number(prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD", fontSize: "8" }],
                                    ]
                                }),
                            )
                        }
                    },


                    {
                        columns: [

                            {
                                style: "table",
                                table: {

                                    widths: ["*", "*", "*", "*", "*", "*"],
                                    body: [
                                        [
                                            {
                                               
                                                text: `Prime nette`,
                                                style: "headerTable"
                                            },
                                            contrat?.idHistorique == undefined ?
                                                {
                                                    text: `Coût de police`,
                                                    style: "headerTable"
                                                }
                                                : {
                                                    text: `Frais de gestion`,
                                                    style: "headerTable"
                                                },
                                            {
                                                text: `T.V.A`,
                                                style: "headerTable"
                                            },

                                            {
                                                text: `F.G.A`,
                                                style: "headerTable"
                                            },
                                            {
                                                text: `Timbre de dimension`,
                                                style: "headerTable"
                                            },

                                            {
                                                text: `Timbre gradué`,
                                                style: "headerTable"
                                            },
                                        ],
                                        [
                                            {
                                                text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            contrat?.idHistorique == undefined ?
                                                {
                                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.prime ?
                                                        quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.prime
                                                        : quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.taxe.valeur).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                }
                                                : {
                                                    text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                    fontSize: 10
                                                },
                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },

                                            {
                                                text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10
                                            },
                                        ],
                                        [
                                            { text: '', colSpan: 4 },
                                            {},
                                            {},
                                            {},
                                            {
                                                text: `Prime Totale`,
                                                style: "headerTable",
                                            },
                                            {
                                                text: Number(contrat?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                                fontSize: 10,
                                             
                                            },   
                                           
                                            
                                        ],
                                        
                                    ],
                                }
                            }
                        ],
                    },
                    {
                        text:'',
                         pageBreak: risq.idRisque != risques[risques.length - 1].idRisque ? 'after' : null,
                       
                  
                    }

                ],

            })),











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
                    margin: [0, 10, 0, 0]
                },
                headerTable: {
                    alignment: "center",
                    bold: true,
                    fontSize: 10,
                    color: "#00008F",
                    
                }
            }
        }
        pdfMake.createPdf(docDefinitionContrat).download("CP_" + contrat?.idContrat);
    }

    buildTableBody(data: any, columns: any) {
        var body = [];

        if (columns.includes("text1"))
            body.push()
        else {
            if (columns.includes("prime")) {
                columns = columns.map((col: any) => {
                    col.text = col
                    col.style = "headerTable"
                })
                body.push(columns);
            }
            else {
                let column: any = [];
                columns.map((col: any) => {
                    let column1 = {
                        text: '',
                        style: ''
                    }
                    column1.text = col.replace(/_/g, ' ');
                    column1.style = "headerTable"


                    column.push(column1);
                })

                body.push(column);
            }
        }

        data.forEach(function (row: any) {
            const dataRow: any = [];

            columns.forEach(function (column: any) {
                dataRow.push(row[column]);
            })

            body.push(dataRow);
        });

        return body;
    }

    table(data: any, columns: any) {
        let pourcentage = 100 / columns?.length;
        let width: any = []
        columns.map((col: any) => {
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

    private logs(response: any) {
    }
}
