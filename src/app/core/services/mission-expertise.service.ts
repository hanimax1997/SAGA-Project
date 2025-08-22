import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Constants } from '../config/constants';
import * as pdfMake from 'pdfmake/build/pdfmake';

@Injectable({
  providedIn: 'root'
})
export class MissionExpertiseService {

  constructor(private http: HttpClient) { }
  getCapitaleBDG(idSinistre: any) {
    const httpOption: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_CAPITAL_BDG}/${idSinistre}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  addMissionExpertise(bodyMissionExpertise: any) {
    const httpOption: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post<any>(`${Constants.API_ENDPOINT_TEST_EXPERTISE}`, bodyMissionExpertise, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  getExpertsAll() {
    const httpOption: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_EXPERTS_ALL}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  getMissionsExpertisesById(idMission: any) {
    const httpOption: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_EXPERTISE}/${idMission}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  getAllMissionsExpertisesBySinistre(idSinistre: any) {
    const httpOption: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_MISSIONS_EXPERTISES_ALL}/${idSinistre}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  getAllMissionsExpertisesByCode(codeSinistre: any) {
    const httpOption: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.get<any>(`${Constants.API_ENDPOINT_TEST_MISSIONS_EXPERTISES_ALL_BY_CODE}/${codeSinistre}`, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  missionOpertion(body: any) {
    const httpOption: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post<any>(`${Constants.API_ENDPOINT_TEST_MISSIONS_EXPERTISES_OPERATION}`, body, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  outputMission(mission: any, sinistre: any) {
    let contrat = sinistre?.contratHistorique;
 
    let assure = contrat?.contratPersonneRoleList?.find((p: any) => p.role.idParam == 235 || p.role.idParam == 236 || p.role.idParam == 238 || p.role.idParam == 280)?.personne
   
    let vehicule = contrat?.risqueList
    if(contrat.produit.codeProduit=='96'|| contrat.produit.codeProduit=='95'){
      
      const docDefinitionMission: any = {
        watermark: { text: '', color: 'blue', opacity: 0.1 },
        pageMargins: [35, 30, 35, 90],
        border: [false, false, false, false],
        content: [
          {
            text: `ODS Expertise\n\n`,
            style: 'sectionHeader',
            color: 'black'
          },
          {
            style: "table",
            table: {
              widths: ["*"],
              alignment: "right",
              body: [
                [
                  {
                    text: `Objet : Etablissement d'un PV d'expertise`,
                    style: "headerTable",
                    bold:true
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
                      { text: `Assuré(e)  : `, bold: true, fontSize: "10" },
                      { text: assure?.raisonSocial != undefined ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Expert : `, bold: true, fontSize: "10" },
                      { text: mission?.jsonExpert?.raisonSocial, fontSize: "10" },
                    ],
                    alignment: 'left'
                  }
                ],
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
                      { text: `Adresse : `, bold: true, fontSize: "10" },
                      { text: mission?.jsonExpert?.adresse, fontSize: "10" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Dossier sinistre N° : `, bold: true, fontSize: "10" },
                      { text: sinistre?.codeSinistre, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Date de survenance : `, bold: true, fontSize: "10" },
                      { text: sinistre?.dateSurvenance.split("T")[0], fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Type d'expertise : `, bold: true, fontSize: "10" },
                      { text: mission?.typeExpertise?.description, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Téléphone N°:`, bold: true, fontSize: "10" },
                      { text:  mission?.jsonExpert?.tel, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
              
              ],
            },
          },
          {
            text: `\nMadame, Monsieur,
            \nEn  vertu  du  présent  ordre  de  service,  nous  vous  prions  de  bien  vouloir  procéder à l’expertise des dommages du bien assuré objet du dossier sinistre susmentionné suivant :`,
            fontSize: 10,
            color: 'black',
            margin: [0, 20, 0, 20] 
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
                      { text: `Localisé à l'adresse suivante : `, bold: true, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: contrat.risqueList[0].valeur, fontSize: "10" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Cause du sinistre: `, bold: true, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: sinistre?.causeSinistre?.description, fontSize: "10" },
                        
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Circonstances du sinistre : `, bold: true, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: sinistre?.description, fontSize: "10" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Commentaire : `, bold: true, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: mission?.commentaire, fontSize: "10" },
                    ],
                    alignment: 'left'
                  }
                ],
              ]
            }
          },
          {
            text: `\n Veuillez-vous rendre sur les lieux du sinistre afin de :
\n•	Faire connaître les éléments permettant de déterminer les responsabilités et le cas échéant, convoquer les responsables et leur éventuel assureur ;
\n•	Rendre compte du déroulement de vos opérations et des éventuelles difficultés rencontrées au cours de la mission ;
\n•	En cas de besoin, saisir notre compagnie, pour la désignation d’un spécialiste compétent dans un domaine particulier ;
 \n\n`,
            fontSize: 10,
            color: 'black',
            margin: [0, 20, 0,0] 

          },
          {
            text: `\n Dans l'attente de recevoir votre procès-verbal d'expertise, veuillez agréer, Madame, Monsieur, nos salutations les meilleures. \n\n`,
            fontSize: 10,
            color: 'black',
            margin: [0,0,0,20] 
          },
          {
            layout: 'noBorders',
            table: {
              widths: ["*", "*"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Fait à : `, bold: true, fontSize: "10" },
                      { text: `Alger`, fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: `Signature :`, bold: true, fontSize: "10",
                    alignment: 'center'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Le : `, bold: true, fontSize: "10" },
                      { text: sinistre.auditDate.split("T")[0], fontSize: "10" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: ``, bold: true, fontSize: "10",
                    alignment: 'left'
                  }
                ],
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
            alignment: "left",
            bold: true,
            fontSize: 10,
            color: "white",
            fillColor: "#00008F"
          }
        }
      }

      pdfMake.createPdf(docDefinitionMission).download("ODS_" + mission.numMission)
    }else

    if (mission?.typeExpertise?.code == 'T04' && (contrat.produit.codeProduit=='96'|| contrat.produit.codeProduit=='95')) {

      const docDefinitionMission: any = {
        watermark: { text: '', color: 'blue', opacity: 0.1 },
        pageMargins: [45, 35, 45, 90],
        border: [false, false, false, false],
        content: [
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
                      { text: `ODR / Dossier sinistre N° : `, bold: true, fontSize: "12" },
                      { text: sinistre?.codeSinistre, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Nature des dommages : `, bold: true, fontSize: "12" },
                      { text: 'BDG', fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Date sinistre : `, bold: true, fontSize: "12" },
                      { text: sinistre?.dateSurvenance.split("T")[0], fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Date de déclaration : `, bold: true, fontSize: "12" },
                      { text: sinistre?.dateDeclaration.split("T")[0], fontSize: "12" },
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
              widths: ["*"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `ORDRE DE REPARATION\n`, bold: true, fontSize: "14", color: "blue", decoration: "underline" },
                      { text: `Sinistre automobile\n`, bold: true, fontSize: "14", color: "blue", decoration: "underline" },
                      { text: `Garantie : « Bris de Glace »`, bold: true, fontSize: "14", color: "blue", decoration: "underline" },
                    ],
                    alignment: 'center'
                  }
                ]
              ]
            }
          },
          {
            text: `Ordre de réparation est transmis à Inter Partner Assistance Algérie « IPA » par le workflow JIRA afin de procéder aux réparations des glaces du véhicule dont les cordonnées sont indiquées ci-dessous :`,
            fontSize: 12,
            color: 'black'
          },
          {
            style: 'table',
            table: {
              widths: ["*", "*", "*"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Assuré(e)`, bold: true, fontSize: "12" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Véhicule`, bold: true, fontSize: "12" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Police`, bold: true, fontSize: "12" },
                    ],
                    style: "headerTable",
                    alignment: 'center'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Nom et prénom : \n`, bold: true, fontSize: "12" },
                      { text: assure?.raisonSocial != undefined ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Marque : \n`, bold: true, fontSize: "12" },
                      { text: vehicule?.find((v: any) => v.paramRisque?.codeParam == "P25" && sinistre?.codeRisque == v.risque)?.idParamReponse?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Police d'assurance N° : \n`, bold: true, fontSize: "12" },
                      { text: contrat?.idContrat?.idContrat, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Téléphone : \n`, bold: true, fontSize: "12" },
                      { text: assure?.contactList.find((contact: any) => contact.typeContact.code == "CNT1")?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Modèle : \n`, bold: true, fontSize: "12" },
                      { text: vehicule?.find((v: any) => v.paramRisque?.codeParam == "P26" && sinistre?.codeRisque == v.risque)?.idParamReponse?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Date d'effet : \n`, bold: true, fontSize: "12" },
                      { text: contrat?.idContrat?.dateEffet, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `E-mail : \n`, bold: true, fontSize: "12" },
                      { text: assure?.contactList.find((contact: any) => contact.typeContact.code == "CNT2")?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Immatriculation : \n`, bold: true, fontSize: "12" },
                      { text: vehicule?.find((v: any) => v.paramRisque?.codeParam == "P38"&& sinistre?.codeRisque == v.risque)?.valeur, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Date d'échéance : \n`, bold: true, fontSize: "12" },
                      { text: contrat?.idContrat?.dateExpiration, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
              ],
            },
          },
          {
            table: {
              widths: [10, "*", 10, "*"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Identification du Bris de Glace`, bold: true, fontSize: "12" },
                    ],
                    colSpan: 4,
                    style: "headerTable",
                    alignment: 'center'
                  },
                  {},
                  {},
                  {}
                ],
                [
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP359" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Pare - Brise`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP360" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Lunette Arrière`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP363" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Glace Avant Gauche`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP361" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Glace Avant Droite`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP364" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Glace Arrière Gauche`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP362" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Glace Arrière Droite`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP366" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Déflecteur Gauche`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP365" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Déflecteur Droit`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP368" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Custode Gauche`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: sinistre?.zoneAffecte?.code == "CP367" ? `X` : ` `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'center'
                  },
                  {
                    text: [
                      { text: `Custode Droit`, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
              ]
            }
          },
          {
            text: `\n\nNB : Mettre (X) sur la case /Croquis choisi. `,
            fontSize: 12,
            color: 'black'
          },
          {
            layout: 'noBorders',
            style: "table",
            table: {
              widths: ["*", "*"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Etablie le : `, bold: true, fontSize: "12" },
                      { text: sinistre.auditDate.split("T")[0], fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: `Signature :`, bold: true, fontSize: "12",
                    alignment: 'center'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Par : `, bold: true, fontSize: "12" },
                      { text: sinistre.auditUser, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: ``, bold: true, fontSize: "12",
                    alignment: 'left'
                  }
                ],
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
            margin: [0, 20, 0, 20]
          },
          headerTable: {
            alignment: "left",
            bold: true,
            fontSize: 12,
            color: "white",
            fillColor: "#00008F"
          }
        }
      }

      pdfMake.createPdf(docDefinitionMission).download("ODR_" + mission.numMission)
    }
    else {
      const docDefinitionMission: any = {
        watermark: { text: '', color: 'blue', opacity: 0.1 },
        pageMargins: [35, 30, 35, 90],
        border: [false, false, false, false],
        content: [
          {
            text: `ODS Expertise\n\n`,
            style: 'sectionHeader',
            color: 'black'
          },
          {
            style: "table",
            table: {
              widths: ["*"],
              alignment: "right",
              body: [
                [
                  {
                    text: `Objet : Etablissement d'un PV d'expertise`,
                    style: "headerTable"
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
                      { text: `Assuré(e)  : `, bold: true, fontSize: "12" },
                      { text: assure?.raisonSocial != undefined ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Expert : `, bold: true, fontSize: "12" },
                      { text: mission?.jsonExpert?.raisonSocial, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Police d'assurance N° : `, bold: true, fontSize: "12" },
                      { text: contrat?.idContrat?.idContrat, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Adresse : `, bold: true, fontSize: "12" },
                      { text: mission?.jsonExpert?.adresse, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Dossier sinistre N° : `, bold: true, fontSize: "12" },
                      { text: sinistre?.codeSinistre, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Date de survenance : `, bold: true, fontSize: "12" },
                      { text: sinistre?.dateSurvenance.split("T")[0], fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Type d'expertise : `, bold: true, fontSize: "12" },
                      { text: mission?.typeExpertise?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Mode d'expertise : `, bold: true, fontSize: "12" },
                      { text: mission?.modeExpertise?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
                [
                  {
                    text: [
                      { text: `Contact : `, bold: true, fontSize: "12" },
                      { text: sinistre?.contactOrigine, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {}
                ],
              ],
            },
          },
          {
            text: `\nMadame, Monsieur,
            \nEn  vertu  du  présent  ordre  de  service,  nous  vous  prions  de  bien  vouloir  procéder  à  l'expertise  du véhicule objet du dossier sinistre susmentionné suivant :`,
            fontSize: 12,
            color: 'black'
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
                      { text: `Marque : `, bold: true, fontSize: "12" },
                      { text: vehicule?.find((v: any) => v.paramRisque?.codeParam == "P25"  && sinistre?.codeRisque == v.risque)?.idParamReponse?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Modèle : `, bold: true, fontSize: "12" },
                      { text: vehicule?.find((v: any) => v.paramRisque?.codeParam == "P26" && sinistre?.codeRisque == v.risque)?.idParamReponse?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Immatriculation : `, bold: true, fontSize: "12" },
                      { text: vehicule?.find((v: any) => v.paramRisque?.codeParam == "P38" && sinistre?.codeRisque == v.risque)?.valeur, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: `Numéro de châssis : `, bold: true, fontSize: "12" },
                      { text: vehicule?.find((v: any) => v.paramRisque?.codeParam == "P30"  && sinistre?.codeRisque == v.risque)?.valeur, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Localisé à l'adresse suivante : `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: mission?.lieuVehicule?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Commentaires : `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: mission?.commentaire, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Circonstances du sinistre : `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: sinistre?.description, fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
              ]
            }
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
                      { text: `Taux Honoraire (Main d'œuvre) : `, bold: true, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: [
                      { text: mission?.mntMaindOeuvre + " DZD", fontSize: "12" },
                    ],
                    alignment: 'left'
                  }
                ],
              ]
            }
          },
          {
            text: `\n Dans l'attente de recevoir votre procès-verbal d'expertise, veuillez agréer, Madame, Monsieur, nos salutations les meilleures. \n\n`,
            fontSize: 12,
            color: 'black'
          },
          {
            layout: 'noBorders',
            table: {
              widths: ["*", "*"],
              alignment: "center",
              body: [
                [
                  {
                    text: [
                      { text: `Fait à : `, bold: true, fontSize: "12" },
                      { text: `Alger`, fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: `Signature :`, bold: true, fontSize: "12",
                    alignment: 'center'
                  }
                ],
                [
                  {
                    text: [
                      { text: `Le : `, bold: true, fontSize: "12" },
                      { text: sinistre.auditDate.split("T")[0], fontSize: "12" },
                    ],
                    alignment: 'left'
                  },
                  {
                    text: ``, bold: true, fontSize: "12",
                    alignment: 'left'
                  }
                ],
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
            alignment: "left",
            bold: true,
            fontSize: 12,
            color: "white",
            fillColor: "#00008F"
          }
        }
      }

      pdfMake.createPdf(docDefinitionMission).download("ODS_" + mission.numMission)
    }
  }
}
