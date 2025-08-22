import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Constants } from '../config/constants';
import { Avenant } from '../models/avenant';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as moment from 'moment';
import { TDocumentDefinitions, Content, ContentText } from 'pdfmake/interfaces';
import getBase64ImageFromURL from '../utils/imageHandling'
@Injectable({
    providedIn: 'root'
})
export class AvenantService {
    sousExit: boolean=false;
    souscripteur01: any;
    constructor(private http: HttpClient) { }
    getTypeAvenant(): Observable<Avenant[]> {
        return this.http.get<Avenant[]>(`${Constants.API_ENDPOINT_TYPE_AVENANT}`).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => this.handleEroor(error, error.error))
        );
    }

    getTypeAvenantbyAvenantPrecedent(typeAvenant: any): Observable<any[]> {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.http.post<any[]>(`${Constants.API_ENDPOINT_TYPE_AVENANT}/all`, typeAvenant, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getContratPrev( idHistorique : any, nMouvement:any){
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTRAT}/historique/${idHistorique}/mouvement/${nMouvement}`).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => this.handleEroor(error, error.error))
        );
    }
    getAttributsAvenant(idContratAvenant: any): Observable<any> {
        return this.http.get<any>(`${Constants.API_ENDPOINT_avenants}/${idContratAvenant}`).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => this.handleEroor(error, error.error))
        );
    }

    getAvenantById(idTypeAvenant: any): Observable<Avenant[]> {
        return this.http.get<Avenant[]>(`${Constants.API_ENDPOINT_TYPE_AVENANT}/${idTypeAvenant}`).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => this.handleEroor(error, error.error))
        );
    }

    getAvenantByContrat(idContact: any): Observable<Avenant[]> {
        return this.http.get<Avenant[]>(`${Constants.API_ENDPOINT_avenants}/all/${idContact}`).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => this.handleEroor(error, error.error))
        );
    }

    submitAvenant(avenant: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_avenants}`, avenant, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getDateExpiration(body: any) {
      
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_AVENANT_EXPIRATIONDATE}`, body, httpOption).pipe(
            tap((response) => response),
            catchError((error) => throwError(error.error))
        );
    }
    calculAvenant(avenant: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_avenant_tarification}`, avenant, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    approbationAvenant(validation: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_avenants}/approbation`, validation, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

      controleDevisMulti(formData: any, codeDevis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'skip': ''
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTROLE_FILE}/${codeDevis}`, formData, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }


    generateTarif(devis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_TARIF_RENOUVELLEMENT}`, devis, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    generateTarifProprietaire(devis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_TARIF_PROPRIETAIRE}`, devis, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }


    async outputAvenant(contrat: any, avenant: any, quittance: any,indexTable?:number) {      
        ////console.log('je suis le contrat depuis outputavenant',contrat)
        let index = 0;
        let garanties: any = [];
        let champs: any = ["Garanties"];
        let widthChamp: any = [];
        let assure: any = {};
        let conducteur: any = {};
        let souscripteur: any = {};
        let risqueListVehicule: any = [];
        let valeurVenale: any = 0
        let paramContratList: any;
//  ////console.log('test',contrat ,avenant ,quittance)
        let dateDebut =moment( contrat?.dateEffet).format('DD-MM-YYYY');
        let dateRetour =moment( contrat?.dateExpiration).format('DD-MM-YYYY');
       // let dateRetour = moment( contrat?.risqueList?.find((el:any)=>el.codeRisque==='P212')?.reponse?.valeur).format('DD-MM-YYYY');
        let destination = contrat?.risqueList?.find((el:any)=>el?.codeRisque==="P182")?.reponse?.description;
        let duree=0;
        let zone = '';
        const widthsPrimeTable =contrat.produit.codeProduit==="20A"?["*","*","*","*"]:["*","*","*","*","*","*"]

        avenant?.typeAvenant.code != "A22" ? paramContratList = contrat?.paramContratList : paramContratList = quittance?.risqueList[0]?.garantieListco
        ////console.log('je suus paramContratList',paramContratList)
        let risque: any = [];
        let risqueList: any = [];


        const data=contrat.personnesList
        if(data.find((item: { role: { code: string; }; }) => (item.role.code === "CP234" || item.role.code === "CP236"))){

         this.souscripteur01 = data.find((item: { role: { code: string; }; }) => (item.role.code === "CP234" || item.role.code === "CP236"));
         this.sousExit=true
        }else{
         this.souscripteur01=null
         this.sousExit=false
        }


        let garantieDomicile: any = [];
        let listGarantie: any = [];


        let codeValVenale = contrat.risqueList.find( (cd: { codeRisque: string; }) => cd.codeRisque == "P40");
        let valVenale = codeValVenale?.reponse?.valeur;
        // console.log(valVenale)


        let assurePerson = contrat.personnesList.find((personne: { role: { code: string; }; }) => personne?.role?.code === 'CP235');
        let assureNom = contrat.personnesList.find(((pers: { personne: { nom: any; }; }) => pers?.personne?.nom))?.personne?.nom
        // //console.log("assurenom",assureNom)
        let assurePrenom = contrat.personnesList.find(((pers: { personne: { prenom1: any; }; }) => pers?.personne?.prenom1))?.personne?.prenom1

        if (avenant.typeAvenant.code == 'A172') {


            // Filter and sort perteItems based on classementOrganisme
            const perteItems = avenant.avenantOrganismeList
            .filter((item: { typePerte: { description: any; }; }) => item.typePerte.description)
            .sort((a: { classementOrganisme: string; }, b: { classementOrganisme: string; }) => {
                const classementA = parseInt(a.classementOrganisme, 10);
                const classementB = parseInt(b.classementOrganisme, 10);
                return classementA - classementB; // Sort in ascending order
            });
    
              const typePerteDescriptions = [...new Set(avenant.avenantOrganismeList.map((item: { typePerte: { description: any; }; }) => item.typePerte.description))];
    
              if (typePerteDescriptions.length === 1 && typePerteDescriptions[0] === 'Perte totale') {
    
                generatePDF('Perte totale', perteItems);
              } else if (typePerteDescriptions.length === 1 && typePerteDescriptions[0] === 'Perte totale et partielle') {
    
                generatePDF('Perte totale et partielle', perteItems);
              } else if (typePerteDescriptions.length === 2 && typePerteDescriptions.includes('Perte totale') && typePerteDescriptions.includes('Perte totale et partielle')) {
    
    
    
    
    
            // console.log(perteItems)
            // Now generate the PDFs with the sorted list
            generatePDF('Perte totale', perteItems);
            generatePDF('Perte totale et partielle', perteItems);
    
              }
    
              return;
    
            }

            
            function generatePDF(typePerteDescription: string, organismeList: any[]) {
                const dateEffet = contrat.dateEffet;
                const dateExpiration = contrat.dateExpiration;
      
                // ////console.log('opla',contrat?.typeClient)
      
                const docDefinition: TDocumentDefinitions = {
                  content: [
                    // Header
                    {
                      columns: [
                        {
                          stack: [{ text: '\n \n', alignment: 'right' }] as Content[],
                        },
                      ],
                      margin: [0, 0, 0, 10],
                    },
                    {
                      columns: [
                        {
                          stack: [
                            { text: 'Notice de Subrogation', alignment: 'right' },
                            { text: 'Assurance Automobile \n\n\n', alignment: 'right' },
                          ] as Content[],
                        },
                      ],
                      margin: [0, 0, 0, 10],
                    },
                    {
                      columns: [
                        {
                          text: 'ASSURÉ(E)',
                          bold: true,
                          margin: [10, 0, 0, 0],
                        } as ContentText,
                        {
                          text: 'REFERENCES DU CONTRAT',
                          bold: true,
                          margin: [65, 0, 0, 0],
                        } as ContentText,
                      ],
                      columnGap: 10,
                      margin: [0, 0, 0, 10],
                    },
                    {
                      columns: [
                        {
                          width: 'auto',
                          margin: [10, 0, 0, 0],
                          stack: [
                            {
                              text:
                                assurePerson
                                  ? `Raison Sociale : ${assurePerson.personne.raisonSocial}`
                                  : `Nom : ${assureNom}`,
                            },
                            {
                              text:
                              assurePerson
                                  ? " "
                                  : `Prénom: ${assurePrenom}`,
                            },
                            {
                              text:
                                `Adresse : ${contrat.personnesList[0].personne.adressesList[0].commune.description} ` +
                                `${contrat.personnesList[0].personne.adressesList[0].wilaya.description}`,
                            },
                            { text: `Valeur vénale : ${valVenale} DA` },
                          ] as Content[],
      
      
                        },
                        {
                          width: 'auto',
                          margin: [168.5, 0, 0, 0],
                          stack: [
                            { text: `N° de police : ${contrat.idContrat}` },
                            {
                              text: `Date d’effet : ${moment(dateEffet).format('DD-MM-YYYY')}`,
                            },
                            {
                              text: `Date d’échéance : ${moment(dateExpiration).format(
                                'DD-MM-YYYY'
                              )}`,
                            },
                            { text: `Formule : ${contrat.pack.description}` },
                          ] as Content[],
                        },
                      ],
                      margin: [0, 0, 0, 10],
                    },
                    {
                      table: {
                        widths: ['*', '*', '*'],
                        body: [
                          [
                            { text: 'Organisme de crédit' },
                            { text: 'Montant du crédit' },
                            { text: 'Type de perte' },
                          ],
                          ...organismeList.map((item) => [
                            { text: item.organisme || '' },
                            { text: item.montant || '' },
                            { text: item.typePerte?.description || '' },
                          ]),
                        ],
                      },
                      margin: [0, 10, 0, 10],
                    },
                    {
                      text:
                        "Le présent contrat est régi par le Code Civil, l'ordonnance n°95/07 du 25 Janvier 1995 modifiée par la loi n°06/04 du 20 Février 2006, relative aux Assurances.",
                      fontSize: 10,
                      margin: [0, 10, 0, 10],
                    },
                    {
                      text: [
                        { text: 'Monsieur,\n\n', bold: true },
                        `En cas de ${typePerteDescription.toLowerCase()} du bien assuré ayant été acheté à crédit, l’indemnité ne saurait être effectuée qu’entre les mains d’un représentant de l’organisme de crédit hors de la présence et sans le concours de l’assuré(e).\n\n`,
                        "Le droit pour la compagnie d’assurance de résilier le contrat lors de toute infraction constatée demeure entier, mais en ce qui concerne l’assuré (créancier susnommé), cette résiliation ne prendra effet qu’un mois après la notification qui lui sera destinée par lettre recommandée à son domicile désigné dans le contrat.",
                      ],
                      fontSize: 10,
                      margin: [0, 10, 0, 10],
                    },
                    {
                      text: 'DECLARATION DU SOUSCRIPTEUR',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 10, 0, 5],
                    },
                    {
                      text:
                        "Je reconnais avoir été informé(e), au moment de la collecte d'informations que les conséquences qui pourraient résulter d’une omission ou d’une déclaration inexacte sont celles prévues par l'article 19 de l'ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006.",
                      fontSize: 10,
                      alignment: 'justify',
                    },
                    {
                      columns: [
                        {
                          text:
                            ` \n \nFait à :                              Le : ${moment(avenant.dateAvenant).format('DD-MM-YYYY')                      }     \n\nEn trois exemplaires \n\n\n`,
                          fontSize: 10,
                          bold: true,
                        },
                        {
                          text: '',
                          width: 'auto',
                        },
                      ],
                      columnGap: 15,
                      margin: [0, 30, 0, 0],
                    },
                    {
                      columns: [
                        {
                          text: 'Signature de l’assuré(e) :',
                          fontSize: 10,
                          decoration: 'underline',
                          bold: true,
                        },
                        {
                          text: 'Signature de l’assureur:',
                          alignment: 'center',
                          fontSize: 10,
                          decoration: 'underline',
                          bold: true,
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: ' Précédée de la mention « Lu et approuvé »',
                          fontSize: 8,
                        },
                      ],
                    },
                    {
                      stack: [
                        {
                          text: ' \n \n \n \n \n',
                        },
                      ],
                    },
                    {
                      text: 'Signature de l’organisme de crédit:',
                      alignment: 'center',
                      fontSize: 10,
                      decoration: 'underline',
                      bold: true,
                    },
                  ],
                  styles: {
                    header: {
                      fontSize: 14,
                      bold: true,
                    },
                    tableHeader: {
                      bold: true,
                      fontSize: 10,
                      color: 'black',
                    },
                  },
                };
      
                const pdfFileName = `Avenant_${contrat?.idContrat}_${typePerteDescription.replace(
                  /\s+/g,
                  '_'
                )}.pdf`;
      
                pdfMake.createPdf(docDefinition).download(pdfFileName);
              }



        let headers = [{
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
                        text: `Franchises `,
                        style: "headerTable"
                        }
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
          

        risqueListVehicule = contrat?.risqueList.filter((risque: any) => risque.categorieParamRisque == "vehicule")
        valeurVenale = contrat?.risqueList.find((risque: any) => risque.paramRisque?.codeParam == "P40")?.valeur
        risqueList = contrat?.risqueList.filter((risque: any) => risque.categorieParamRisque != "vehicule")   


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

        const risquesRows = contrat?.groupesList?.[0]?.risques?.map((risque: any) => [

            { text: risque?.idRisque, fontSize: "8",alignment:"center" },
            { text: (risque?.risque.find((cln:any)=>cln.colonne=="Nom")?.valeur || '') + " " + (risque?.risque.find((cln:any)=>cln.colonne=="Prénom")?.valeur || ''), fontSize: "8",alignment:"center" },
            { text: moment(risque?.risque.find((cln:any)=>cln.colonne=="DateDeNaissance")?.valeur).format('DD/MM/YYYY') || '', fontSize: "8",alignment:"center" },
            { text: quittance?.risqueList?.find((rsq:any)=>rsq.risque ===risque?.idRisque)?.primeList?.find((el:any)=>el.typePrime.code==="CP101").primeProrata?? 0, fontSize: "8",alignment:"center" }
        ]) || [];
      
        index = 0;
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
        while (index < paramContratList?.length) {
            paramContratList[index].categorieList?.map((element: any) => {
                champs.push(element?.description.charAt(0).toUpperCase() + element?.description.slice(1))
            });

            index++;
        }
        champs = champs.filter((x: any, i: any) => champs.indexOf(x) === i);
        champs.push("Primes nettes")

        champs.map((champ: string) => {
            widthChamp.push("*")
        })

        if(contrat?.produit.codeProduit == "96") {
       
            let garantie: any=[]  

            garantie= contrat?.paramContratList?.filter((item:any) => item.codeGarantie === "J01") || [];           
            garantieDomicile.push(garantie[0])           
            listGarantie = contrat?.paramContratList?.filter((item:any) => item.codeGarantie != "J01") || [];  
          
        }       

        index = 0;
        while (index < paramContratList?.length) {
            let tmp = {
                Garanties: [
                    { text: paramContratList[index].description, fontSize: "8" },
                ],
                Plafond: [
                    { text: '', fontSize: "8", alignment: "center" },
                ],
                Formule: [
                    { text: '', fontSize: "8", alignment: "center" },
                ],
                Franchise: [
                    { text: '', fontSize: "8", alignment: "center" },
                ],
                "Primes nettes": [
                    { text: Number(paramContratList[index].primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+ " DZD", fontSize: "8", alignment: "center" },
                ],
            };

            paramContratList[index].categorieList?.map((cat: any) => {
            
                switch (cat.description) {
                    case "plafond":
                        
                        tmp.Plafond[0].text = Number(cat.valeur).toLocaleString('en-US').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        break;

                    case "formule":
                        tmp.Formule[0].text = Number(cat.valeur).toLocaleString('en-US').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        break;

                    case "franchise":
                        tmp.Franchise[0].text = Number(cat.valeur).toLocaleString('en-US').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        break;

                    default:
                        break;
                }
            })

            garanties.push(tmp);

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
        const axaLogo= await getBase64ImageFromURL(this.http,'assets/axalogo.png');
        const docDefinitionContrat: any = {
            watermark: { text: '', color: 'blue', opacity: 0.1 },
            // pageMargins: [35, 10, 35, 95],
            pageMargins: sessionStorage.getItem("roles")?.includes("COURTIER")? [35, 10, 120, 95]:[35, 10, 35, 95],
            border: [false, false, false, false],
            footer: function (currentPage:any, pageCount:any) {
                return sessionStorage.getItem("roles")?.includes("COURTIER")?[{
                  text:`AXA Assurances Algérie Vie - Lotissement 11 décembre 1960 lots 08 et 12, 16030 El Biar Alger
                  Telephone: + +213 21 37 01 78 – www.axa.dz`,
                  fontSize: 8,
                  color: "#00008F",
                  margin: [20, 50, 10, 0] // Adjust margin as needed [left, top, right, bottom]
              },
              {
                  text:`\n`
              },
          {
              text:`AXA Assurances Algérie Vie, Société Par Actions au capital de 2.250.000.000,00 DZD. Entreprise régie par la Loi n°06/04 du 20 Février 2006 modifiant et complétant l’ordonnance n°95/07 du 25 Janvier 1995, relative aux Assurances. 
                  Siège social : Lotissement 11 décembre 1960 lots 08 et 12, 16030 El Biar Alger. Registre de Commerce N°16/00 - 1005275 B 11. Agrément N°79 du 02 novembre 2011.
                  `,
                  fontSize: 6,
                  color: "#00008F",
                  margin: [20, 0, 10, 20]
          }
          ]:{};
          },

            content: [
                 // contrat?.produit.codeProduit == "96"?
                // {                            
                //     text: 'AXA  MultiRisque Habitation' ,
                //     style: 'sectionHeader'
                // }
                //  :
                // {                            
                //     text: 'AXA ' +contrat?.produit?.description.toUpperCase(),
                //     style: 'sectionHeader'
                // },
                // {
                //     text: 'Conditions Particulières',
                //     style: 'sectionHeader',
                //     color: 'black'
                // },
                // {
                //     text: avenant?.typeAvenant?.libelle,
                //     style: 'sectionHeader',
                //     color: 'black'
                // },
             {

                //     text: contrat?.pack?.description,
                //     style: 'sectionHeader',
                //     color: 'black'

                columns: [
                    sessionStorage.getItem("roles")?.includes("COURTIER")?   {
                        image: axaLogo,
                        width:60,
                        height:60,
                        alignment:'left',
                        
                      }
                      :{ width: 120, text: '' }, // First empty column with a width of 120 units
                  
                    qr !== "" ? { qr: qr, fit: '70', width: 'auto', margin: sessionStorage.getItem("roles")?.includes("COURTIER")? [10, 20, 20, 0]:[0, 0, 20, 0], alignment: 'bottom'  } : {}, // QR code column
                    {
                        width: '*',
                        alignment: 'bottom' , // Third column taking the remaining space
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
                            {
                                text: contrat?.pack?.description,
                                style: 'sectionHeader',
                                color: 'black'
                            },
                            contrat?.convention != null ?
                            {
                                text: 'Convention: ' + contrat?.descriptionConvention,
                                style: 'sectionHeader',
                                color: 'black'
                            } : {},
                            contrat?.reduction != null ?
                            {
                                text: 'Réduction: ' + contrat?.descriptionReduction,
                                style: 'sectionHeader',
                                color: 'black'
                            } : {}
                        ]
                    }
                ]


                },

                  // contrat?.convention != null ?
                // {
                //     text: 'Convention: ' + contrat?.descriptionConvention,
                //     style: 'sectionHeader',
                //     color: 'black'
                // } : contrat?.reduction!= null ?
                // {
                //     text: 'Réduction: ' + contrat?.descriptionReduction,
                //     style: 'sectionHeader',
                //     color: 'black'
                // } : {},
                // qr===""?{}:{ qr: qr, alignment: "right", fit: '65' },

                    
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
                                                { text: avenant?.agence?.codeAgence + " " + avenant?.agence?.raisonSocial, fontSize: "8" },
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
                        {
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
                                                { text: contrat.produit.codeProduit==="20A"  ?`Date effet contrat :` :`Date effet : `, bold: true, fontSize: "8" },
                                                { text: contrat.produit.codeProduit==="20A"  ? dateDebut  : avenant?.dateAvenant.split("T")[0], fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },//avenant?.dateAvenant.split("T")[0]
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
                                            text: avenant?.typeAvenant.code != "A22" ? [
                                                { text: `Date expiration contrat : `, bold: true, fontSize: "8" },
                                                { text:  contrat.produit.codeProduit==="20A"? dateRetour : moment(contrat?.dateExpiration).format("DD-MM-YYYY") , fontSize: "8" },
                                            ]: 
                                            [
                                                { text: `Date expiration carte orange : `, bold: true, fontSize: "8" },
                                                { text: avenant?.dateExpirationAvenant?.split("T")[0], fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                contrat.produit.codeProduit==="20A" ?
                [
                    {text:'\n'},
                    {
                        table: {
                            widths: ['*', '*'], // Defines two columns with equal width
                            body: [
                                [
                                    { text: 'Avenant', colSpan: 2, alignment: 'center', style:"headerTable" },
                                    {} // Empty cell to make sure the colSpan works correctly
                                ],
                                [
                                    { text: `Avenant N° : ${indexTable}`, fontSize: 8 },
                                    { text: 'Date d’édition : '+ moment(avenant.dateAvenant).format("DD-MM-YYYY"), fontSize: 8 }
                                ]
                            ]
                        },
                    },
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
                                            { text: souscripteur.raisonSocial != undefined ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                         { text: souscripteur.raisonSocial != undefined ?   souscripteur?.raisonSocial : souscripteur?.nom + " " + souscripteur?.prenom1, fontSize: "8" },

                                            // { text: contrat?.typeClient?.description == "personne morale" ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                            // { text: contrat?.typeClient?.description == "personne morale" ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "8" },
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
                ]
                :[{
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

                                                { text:contrat?.personnesList?.find((person: any) => person?.raisonSocial != null ) ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                { text:contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial != null )? contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial)?.personne?.raisonSocial: assure?.nom + " " + assure?.prenom1, fontSize: "8" },
                                              //  { text:contrat?.personnesList?.find((person: any) => person?.personne?.raisonSocial != null )? contrat?.personnesList?.find((person: any) => person?.personne.raisonSocial).personne.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "8" },
                                            /*
                                                { text: contrat?.typeClient?.description == "personne morale" ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                { text: contrat?.typeClient?.description == "personne morale" ? assure?.raisonSocial : assure?.nom + " " + assure?.prenom1, fontSize: "8" },
                                            */
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
                contrat.produit.codeProduit==="20A" ? [
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
                      widths: ['*', '*', '*', '*'], 
                      body: [
                        [
                            { text: 'Numéro d’assuré ', style: 'headerTable' },
                            { text: 'Nom et Prénom', style: 'headerTable' },
                            { text: 'Date de naissance', style: 'headerTable' },
                            { text: 'Prime nette', style: 'headerTable' }
                          ],
                         ...risquesRows, 

                      ]
                    }
                  },
                  {text:`\n`},
                  {
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
                            { text: `Date depart : ${dateDebut}`,fontSize:"8" }
                          ], // Row 2
                          [
                            { text: `Pays destination : ${contrat.isShengen ? destination+" (Schengen)" :destination}`,fontSize:"8"},
                            { text: `Date retour : ${dateRetour}`,fontSize:"8" }
                          ], // Row 3
                        ]
                      }
                },
                {text:`\n`},
                ]:
                [risqueListVehicule?.length != 0 ?
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
                }:{},
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
                }:{},
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
                }:{},
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
                }:{},
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
                                               // { text: risqueListVehicule.find((risque: any) => risque.paramRisque?.codeParam == 'P28')?.valeur?.split?.valeur?.split("T")[0], fontSize: "8" },
                                                { text: risqueListVehicule.find((risque: any) => risque.codeRisque == 'P28')?.reponse?.valeur?.split("T")[0], fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                }:{},
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
                }:{},
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
                }:{},
                risqueListVehicule?.length != 0 ? {}:
                {
                    style: "table",
                    table: {
                        widths: ["*"],
                        alignment: "right",
                        body: [
                            [
                                {
                                    text:'Caractéristiques du risque assuré',
                                    style: "headerTable"
                                },
                            ],
                        ],
                    },
                },
                risqueListVehicule?.length != 0 ? {}: this.table(risque, ['text1','text2'])],  
                { text: "\n" },
                //Debut Garanties et sous-garanties
                risqueListVehicule?.length != 0 ?garanties.length != 0 ? this.table(garanties, champs) : {}:{},
                //fin Garanties et sous garanties
                  //debut Prime
                  risqueListVehicule?.length != 0 ?
                  {
                      columns: [
                         
                          {
                              style: "table",
                              table: {
                                  
                                  widths:  ["*","*","*","*","*","*"] ,
                                  body: [
                                      [
                                          {
                                              text: `Prime nette`,
                                              style: "headerTable"
                                          },
                                          avenant?.typeAvenant.code == 'A12' || avenant?.typeAvenant.code == 'A13' || avenant?.typeAvenant.code == 'A18'?
                                        {
                                            text: `Coût de police`,
                                            style: "headerTable"
                                        }
                                        :{
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
                                          }:{},
                                          {
                                              text: `Timbre de dimension`,
                                              style: "headerTable"
                                          },
                                          risqueListVehicule?.length != 0 ?
                                          {
                                              text: `Timbre gradué`,
                                              style: "headerTable"
                                          }:{},
                                      ],
                                      [
                                          {
                                              text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
                                              fontSize: 10
                                          },
                                          avenant?.typeAvenant.code == 'A12' || avenant?.typeAvenant.code == 'A13' || avenant?.typeAvenant.code == 'A18'?
                                        {
                                            text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01') ? Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' )?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD" : "/", alignment: "center",
                                            fontSize: 10
                                        }
                                        :{
                                            text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08') ? Number(quittance?.taxeList?.find((taxe: any) =>  taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD" : "/", alignment: "center",
                                            fontSize: 10
                                        },
                                        /*  {
                                              text: Number(contrat?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
                                              fontSize: 10
                                          },
                                        */  
                                          {
                                              text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
                                              fontSize: 10
                                          },
                                          risqueListVehicule?.length != 0 ?
                                          {
                                              text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
                                              fontSize: 10
                                          }:{},
                                          {
                                              text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
                                              fontSize: 10
                                          },
                                          risqueListVehicule?.length != 0 ?
                                          {
                                              text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+".DZD",
                                              fontSize: 10
                                          }:{},
                                      ],
                                      [
                                          {text: '',colSpan: 4},
                                          {},
                                          {},
                                          {},
                                          {
                                              text: `Prime Totale`,
                                              style: "headerTable",
                                          },
                                          {
                                              text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
                                              fontSize: 10
                                          },
                                      ],
                                  ],
                              }
                          }
                      ],
                  }:
                  {
                      columns: [
                         
                          {
                              style: "table",
                              table: {
                                  
                                  widths:  widthsPrimeTable ,
                                  body: [
                                    contrat.produit.codeProduit==="20A" ? [
                                        {
                                            text: `Prime nette`,
                                            style: "headerTable"
                                        },
                            
                                      {
                                            text: `Frais de gestion`,
                                            style: "headerTable"
                                      },
                                                  
                                      {
                                          text: `Droit de timbre`,
                                          style: "headerTable"
                                      },
                                      {
                                          text: `Prime TTC`,
                                          style: "headerTable",
                                      },
                                    ]:[
                                          {
                                              text: `Prime nette`,
                                              style: "headerTable"
                                          },
                                          {
                                            text: `Prime sans réduction`,
                                            style: "headerTable"
                                        },
                                        avenant?.typeAvenant.code == 'A12' || avenant?.typeAvenant.code=='A18'?
                                        {
                                            text: `Coût de police`,
                                            style: "headerTable"
                                        }
                                        :{
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
                                      contrat.produit.codeProduit==="20A" ?[
                                        {
                                            text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            fontSize: 10, alignment: "center"
                                        },
                                        {
                                            text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08') ? Number(quittance?.taxeList?.find((taxe: any) =>  taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD" : "/", alignment: "center",
                                            fontSize: 10
                                        },
                                        {
                                            text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03') ? Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD": "/", alignment: "center",
                                            fontSize: 10
                                        },
                                        {
                                            text: quittance.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?  Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD": "/", alignment: "center",
                                            fontSize: 10
                                        },
                                      ]: [

                                        {
                                            text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            fontSize: 10
                                        },
                                        {
                                            text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP264')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            fontSize: 10
                                        },
                                        avenant?.typeAvenant.code == 'A12' || avenant?.typeAvenant.code=='A18'  ?
                                        {
                                            text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01') ? Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' )?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD" : "/", alignment: "center",
                                            fontSize: 10
                                        }
                                        :{
                                            text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08') ? Number(quittance?.taxeList?.find((taxe: any) =>  taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD" : "/", alignment: "center",
                                            fontSize: 10
                                        },
                                        {
                                            text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04') ? Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD": "/", alignment: "center",
                                            fontSize: 10
                                        },
                                       
                                        {
                                            text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03') ?  Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD": "/", alignment: "center",
                                            fontSize: 10
                                        },
                                        {
                                            text: quittance.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?  Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD": "/", alignment: "center",
                                            fontSize: 10
                                        },
                                          
                                      ],                                 
                                  ],
                              }
                          },
                          
                      ],
                  
                  },
                  { text: "\n" },
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

        if (avenant?.typeAvenant.code == 'A21' || avenant?.typeAvenant.code == 'A12' ||avenant?.typeAvenant.code == 'A10' || avenant?.typeAvenant.code == 'A06'|| avenant?.typeAvenant.code == 'A03' || avenant?.typeAvenant.code == 'A11' || avenant?.typeAvenant.code == 'A17' || avenant?.typeAvenant.code == 'A13') {
            docDefinitionContrat.content.push(
                contrat.produit.codeProduit==="20A" ?{}:  {
                    text: "Le présent contrat est régi par le Code Civil, l'ordonnance n°95/07 du 25 Janvier 1995 modifiée par la loi n°06/04 du 20 Février 2006, relative aux Assurances, l'ordonnance n°74/15 du 30 Janvier 1974 modifiée et complétée par la loi n°88/31 du 19/07/1988 et les décrets n°80/34 - n°80/35 - n°80/36 et n°80/37 du 16 Février 1980.",
                    fontSize: "8",
                    color: 'black',
                    pageBreak: 'after'
                },


                //begin adding 

                contrat?.produit.codeProduit == "95" ?
                {
                    style: 'table',
                    
                    text:  "Tableau des garanties",
                    fontSize: 14,
                    color: 'black',
                    bold: true,
                    alignment: "center"

                }
                :{},


                contrat?.produit.codeProduit == "95" ?
                {
                    style: "table",
                    table: {
                        // widths: [95,245,90,50],   
                        widths: [95, 175, 120, 45, 60],
                        headerRows: 1,
                        body: [headers].concat(

                            listGarantie.map((g: any) => {

                                ////console.log('je suis la lisy des garantie',listGarantie,g)
                                let garantie: any;
                                let sGarantie: any = [];
                                let plafond: any = [];
                                let franchise: any = [];
                                let prime: any = [];
                                const priceA = 10000;
                                let i = 0;
                                garantie = g.description
                                //console.log('je su garantie',garantie)

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

                                //console.log('jhhjhjh',g.codeGarantie)

                                switch (g.codeGarantie) {
                                    case "G47":
                                    case "null":
                                        franchise = { text: g.categorieList?.find((cat: any) => cat?.description == "franchise") ? "5% des dommages nets" : '', fontSize: "8", valign: 'middle' }
                                        break;
                                    case "G45":
                                    case "G53":
                                        franchise = { text: "20 000 DZD sur dommages matériels uniquement", fontSize: "8", valign: 'middle' }
                                        break;
                                    case "G51":
                                        franchise = { text: "7 Jours", fontSize: "8", valign: 'middle' }
                                        break;

                                        case "G46":
                                            franchise = { text: "10% des dommages avec un minimum de 20000 DZD", fontSize: "8", valign: 'middle' }
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
                ///fin adding


                
                risqueListVehicule?.length != 0 ?
                {
                    style: 'table',
                    text: '\n \nClauses Assurance Automobile AXA Algérie',
                    fontSize: 14,
                    color: 'black',
                    bold: true,
                    alignment: "center"
                }:{},
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
                                       
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '100' || contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '101' ? `Clauses U1 - Usage «affaire - fonctionnaire» \n` : "", bold: true, fontSize: "6", alignment: 'justify' },
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '100' || contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.idParamReponse?.code == '101' ? `Le souscripteur déclare expressément que le véhicule, objet de l'assurance n'est pas utilisé commercialement, même à titre exceptionnel pour le transport ou la livraison de produits ou de marchandises ou pour le transport onéreux de personnes. \n \n` : "", fontSize: "6", alignment: 'justify' },
                                                                                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '107' ? `Clause U2 - Usage «transport public de marchandises» \n` : "", bold: true, fontSize: "6", alignment: 'justify' },
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '107' ? `Le souscripteur déclare expressément que le véhicule, objet de l'assurance, sert au transport de produits ou de marchandises. \n \n` : '', fontSize: "6", alignment: 'justify' },
                                                                                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '108' ? `Clause U3 - Usage «transport public de voyageurs» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '108' ? `Le souscripteur déclare expressément utiliser le véhicule, objet de l'assurance pour le transport de voyageurs et que ce véhicule est équipé de places régulièrement aménagées pour le transport des voyageurs, le nombre de places figurant sur la carte grise du véhicule. \n \n` : '', fontSize: "6", alignment: 'justify' },
                                                                                                        { text: contrat?.reponse?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '105' ? `Clause U4 - Usage «location-auto» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '105' ? `Le souscripteur déclare expressément que le véhicule objet de l'assurance est loué, avec ou sans chauffeur, qu'il sert à la promenade, au tourisme ou à l'exercice d'une profession. \n \n` : '', fontSize: "6", alignment: 'justify' },
                                                                                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '103' ? `Clause U5 - Usage «auto-école» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '103' ? `Le souscripteur déclare expressément que le véhicule désigné au contrat sert à donner des leçons de conduite et qu'il est muni d'une double commande. \n \n` : '', fontSize: "6", alignment: 'justify' },
                                                                                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '104' ? `Clause U6 - Usage «taxi» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '104' ? `Le souscripteur déclare expressément que le véhicule est utilisé pour des besoins de transport de personnes à titre onéreux. \n \n` : '', fontSize: "6", alignment: 'justify' },
                                                                                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '102' ? `Clause U7 - Usage «commerce & commerce-cbis» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '102' ? `Le souscripteur déclare expressément que le véhicule est utilisé pour les besoins d'une activité commerciale. \n \n` : '', fontSize: "6", alignment: 'justify' },
                                                                                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '109' ? `Clause U9 - Usage «véhicules spéciaux» \n` : '', bold: true, fontSize: "6", alignment: 'justify' },
                                        { text: contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P52')?.reponse?.idParamReponse?.code == '109' ? `Le souscripteur déclare expressément que le véhicule, objet de l'assurance, est utilisé pour des besoins privés ou pour les besoins d'une profession ou d'une activité, à l'exclusion du transport de personnes à titre onéreux. \n \n` : '', fontSize: "6", alignment: 'justify' },

                                        
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
                                                { text: contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '0' &&  
                                                contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P24')?.reponse?.idParamReponse.code !="R17" ? `Formule Assistance Plus` : '', bold: true, fontSize: "6" },
                                            ]
                                        },
                                        contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '0' &&  
                                                contrat?.risqueList?.find((risque: any) => risque?.codeParam == 'P24')?.reponse?.idParamReponse.code !="R17" ? 
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
                                                { text: contrat?.pack?.codePack == 'F2' && contrat?.risqueList?.find((risque: any) => risque?.paramRisque?.codeParam == 'P24')?.idParamReponse?.code == 'R17' && contrat?.paramContratList?.find((param: any) => param?.codeGarantie == 'G11')?.categorieList[0]?.valeur == '0' ? `Formule Assistance Assur'ELLE` : '', bold: true, fontSize: "6" },
                                            ]
                                        },
                                        contrat?.pack?.codePack == 'F2' && contrat?.risqueList?.find((risque: any) => risque?.paramRisque?.codeParam == 'P24')?.idParamReponse?.code == 'R17' ?
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
                }:{},

                contrat.produit.codeProduit==="20A" ?{}:[{ text: `\nDÉCLARATION DU SOUSCRIPTEUR \n`, bold: true, fontSize: "8", alignment: 'justify', pageBreak: 'before' },
                {
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
                      { text: `${contrat?.agence?.raisonSocial}`, bold: true },
                      ' En tant que Société de Courtage en assurances, à l’effet de négocier et gérer pour mon compte auprès des compagnies d’assurances aux meilleures conditions de garanties et de tarifs, en veillant à la défense de mes intérêts pendant toute la durée de l’assurance depuis la confection du contrat, qu’à l’occasion des règlements des sinistres. Le présent mandat prend effet à la date de signature du présent, et demeure valable tant qu’il n’a pas été dénoncé expressément par mes soins conformément à la législation en vigueur \n\n'
                    ],
                    fontSize: 8,
                    alignment: 'justify'
                  }:{},
                risqueListVehicule?.length != 0 ?
                { text: `BÉNÉFICIAIRES DESIGNES EN CAS DE DÉCÈS \n\n`, bold: true, fontSize: "8", alignment: 'justify' }:{},
                risqueListVehicule?.length != 0 ?
                { text: `Noms et Prénoms des bénéficiaires`, bold: true, fontSize: "8", alignment: 'justify' }
                :{text: `Etant assuré(e) je déclare ce qui suit :`, bold: true, fontSize: "8", alignment: 'justify'},
                risqueListVehicule?.length != 0 ?
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
                }:contrat?.produit.codeProduit == "95" ?
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
                :contrat?.produit.codeProduit != "97" ?{
                    text: "\n• Les locaux assurés sont exclusivement à usage d'habitation.\n • La durée d'inoccupation des locaux durant l'année est inférieure à 90 jours (en une ou plusieurs périodes).\n  • Les locaux sont construits et couverts pour plus de 85% en matériaux durs.\n NB : Tout sinistre jugé antérieur à la souscription à la suite d'une expertise établie par un expert mandaté par la compagnie , sera soit exclu de l'indemnité, soit réglé proportionnellement aux dommages causés ultérieurement à la date d'effet du contrat.",                 
                    fontSize: "8",
                    color: 'black',  
                }:{}],

                { text: `\n\n\nFait à ${contrat?.agence?.wilaya} Le ${moment(avenant?.auditDate).format("DD-MM-YYYY")}\n\n`, bold: true, fontSize: "8" },
                {
                    layout: 'noBorders',
                    table: {
                        widths: ["*", "*"],
                        alignment: "center",
                        body: [
                            [
                                {
                                    text: [
                                        { text: contrat.produit.codeProduit==="20A" && avenant.typeAvenant.code==="A03"?`Signature du souscripteur(trice)\n`:`Signature de l'assuré(e)\n`, bold: true, fontSize: "8" },
                                        { text: `Précédée de la mention « Lu et approuvé »\n`, fontSize: "8" },
                                    ],
                                    alignment: 'left'
                                },
                                {
                                    text: `Pour la Compagnie:`, bold: true, fontSize: "8",
                                    alignment: 'right'
                                }
                            ]
                        ],
                    },
                },
                sessionStorage.getItem("roles")?.includes("COURTIER")?{
                    image: SignatureCourtier,
                    alignment:'right',
                    width: widthSignature,
                    height: heightSignature
                  }:{}
            )          
        }
        else 
        if (avenant?.typeAvenant.code == 'A07' ||avenant?.typeAvenant.code == 'A18' ||avenant?.typeAvenant.code == 'A12'){
            docDefinitionContrat.content.push(
                {
                    text: "Le présent contrat est régi par le Code Civil, l'ordonnance n°95/07 du 25 Janvier 1995 modifiée par la loi n°06/04 du 20 Février 2006, relative aux Assurances, l'ordonnance n°74/15 du 30 Janvier 1974 modifiée et complétée par la loi n°88/31 du 19/07/1988 et les décrets n°80/34 - n°80/35 - n°80/36 et n°80/37 du 16 Février 1980.",
                    fontSize: "8",
                    color: 'black',
                    pageBreak: 'after'
                },
                contrat?.produit.codeProduit == "96" ?
                {                  
                    style: 'table',
                    text: 'Tableau des garanties',
                    fontSize: 14,
                    color: 'black',
                    bold: true,
                    alignment: "center"                    
                               
                }            
                :{},              
                { text: "\n" },
               
                contrat?.produit.codeProduit == "96" ?  contrat?.paramContratList?.filter((item:any) => item.codeGarantie != "J01")? 
               {
                    style: "table",
                    table: {
                       // widths: [95,245,90,50],   
                        widths: [95,215,120,60],   
                        headerRows: 1,                  
                        body:     [headers].concat(
                                           
                         
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
                                    if (g?.sousGarantieList.length == 0 && g?.categorieList.length != 0) {
                                        plafond[i] = { text: g.categorieList?.find((cat: any) => cat?.description == "plafond") ? Number(g.categorieList?.find((cat: any) => cat?.description == "plafond")?.valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD" : "", fontSize: "10", lineHeight: 1.25, alignment: "center" }
                                        franchise = { text: g.categorieList?.find((cat: any) => cat?.description == "franchise") ? "5% des dommages avec un minimum de 5000 DZD" : "", fontSize: "9", valign: 'middle' }
                                    }

                                }

                                return [
                                    [{ text: garantie, fontSize: "10", verticalAlignment: 'middle', colSpan: 4 }],
                                    [sGarantie ? sGarantie : null],
                                    [plafond ? plafond : null],
                                    [franchise]
                                ]


                            }),  
                   )}
                  
                }
                :{}:{}, 
                { text: "\n" },        
              contrat?.produit.codeProduit == "96" ?  contrat?.paramContratList?.filter((item:any) => item.codeGarantie === "J01")? 
                {
                 style: "table",
                    table: {
                        widths: [80,185,50,90,80],   
                        headerRows: 1,                  
                        body:     [headers2].concat(
                                           
                            garantieDomicile.map((g: any) => { 
                            
                               let garantie :any;
                               let sGarantie :any=[];
                               let plafond: any=[];
                               let franchise: any=[];
                             
                               if(g.codeGarantie =="J01" ){     
                                let i=0;                      
                                    g?.sousGarantieList?.map((sg:any) =>{
                                        garantie=   g.description    
                                        sGarantie[i]=  {text: sg.description,  fontSize: "10",lineHeight: 1.25}
                                        plafond[i] =   sg.categorieList?.find((cat: any) => cat?.description == "plafond") ?
                                                     { text: sg.categorieList?.find((cat: any) => cat?.description == "plafond").valeur +" DZD", fontSize: "10",lineHeight: 1.25}: " " 
                                        franchise =  {text: sg.categorieList?.find((cat: any) => cat?.description == "franchise").valeur?
                                                        sg.categorieList?.find((cat: any) => cat?.description == "franchise").valeur +" DZD":  " " }
                                  
                                        i++;     
                                     
                                    })
                                } 
                             
                                    return[                              
                                        [{text:garantie ,  fontSize: "10" ,colSpan: 4}] ,
                                        [sGarantie],
                                        [plafond],
                                        [{text:"03 interventions / garantie / An", fontSize: "10"}],                                        
                                        [{text:"Un délai de carence d’un mois à compter de la date d’effet du contrat",  fontSize: "10"}],                                        
                                       
                                        ]   
                                                                 
                               
                            }),  
                   )}
                   
                }:{}:{},
                { text: `\n\n\n\nDÉCLARATION DU SOUSCRIPTEUR \n`, bold: true, fontSize: "8", alignment: 'justify' },
                {
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
                      { text: `${contrat?.agence?.raisonSocial}`, bold: true },
                      ' En tant que Société de Courtage en assurances, à l’effet de négocier et gérer pour mon compte auprès des compagnies d’assurances aux meilleures conditions de garanties et de tarifs, en veillant à la défense de mes intérêts pendant toute la durée de l’assurance depuis la confection du contrat, qu’à l’occasion des règlements des sinistres. Le présent mandat prend effet à la date de signature du présent, et demeure valable tant qu’il n’a pas été dénoncé expressément par mes soins conformément à la législation en vigueur \n\n'
                    ],
                    fontSize: 8,
                    alignment: 'justify'
                  }:{},
                risqueListVehicule?.length != 0 ?
                { text: `BÉNÉFICIAIRES DESIGNES EN CAS DE DÉCÈS \n\n`, bold: true, fontSize: "8", alignment: 'justify' }:{},
                risqueListVehicule?.length != 0 ?
                { text: `Noms et Prénoms des bénéficiaires`, bold: true, fontSize: "8", alignment: 'justify' }
                :{text: `Etant assuré(e) je déclare ce qui suit :`, bold: true, fontSize: "8", alignment: 'justify'},
                risqueListVehicule?.length != 0 ?
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
                }:contrat?.produit.codeProduit == "95" ?
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
                :{
                    text: "\n• Les locaux assurés sont exclusivement à usage d'habitation.\n • La durée d'inoccupation des locaux durant l'année est inférieure à 90 jours (en une ou plusieurs périodes).\n  • Les locaux sont construits et couverts pour plus de 85% en matériaux durs.\n NB : Tout sinistre jugé antérieur à la souscription à la suite d'une expertise établie par un expert mandaté par la compagnie , sera soit exclu de l'indemnité, soit réglé proportionnellement aux dommages causés ultérieurement à la date d'effet du contrat.",                 
                    fontSize: "8",
                    color: 'black',  
                },
                

                { text: `\n\n\nFait à ${contrat?.agence?.wilaya} Le ${ moment(avenant?.auditDate).format("DD-MM-YYYY")}\n\n`, bold: true, fontSize: "8" },
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
                                    alignment: 'right'
                                }
                            ]
                        ],
                    },
                },
                sessionStorage.getItem("roles")?.includes("COURTIER")?{
                    image: SignatureCourtier,
                    alignment:'right',
                    width: widthSignature,
                    height: heightSignature
                  }:{}
    
               
            )    
        }else
        {
            contrat.produit.codeProduit==="20A" ?  
            docDefinitionContrat.content.push(
                avenant.typeAvenant.code !== "A03" || avenant.typeAvenant.code !== "A04"?[
                    {
                        text: 'NB :',
                        bold: true,
                        margin: [0, 0, 0, 7],
                        fontSize:8
                      },
                      {
                        ul: [
                          'En cas d’accident, de maladie inopinée ou afin d’invoquer les autres garanties d’assistance, vous devez contacter l’assiteur dans un délai maximum de 48h avant d’engager toute dépense.',
                          'Toute modification de dates devra être demandée à l’assureur par le souscripteur, au moins 72 heures avant la prise d’effet du contrat.'
                        ],fontSize:8,bold:true
                    } ,
                    {
                        text: '\n',
                        
                      },
                ]:{},
                {text:`Clause Sanction :\n`,bold: true,fontSize: 10,color: "#00008F"},
                {text:`Les garanties définies dans le présent contrat sont réputées sans effet et l’assureur n’est pas tenu de fournir une couverture ou de verser une
                indemnité ou d’exécuter une prestation en vertu des présentes dans la mesure où la fourniture d'une telle couverture, le paiement d’une telle
                indemnité ou l’exécution de telles prestations exposerait l’assureur à toute sanction, interdiction ou restriction en vertu des résolutions des Nations
                Unies ou des sanctions commerciales ou économiques, des lois et/ou des règlements applicables en Algérie et à l’international notamment les
                lois/règlements de l'Union européenne, Royaume-Uni ou États-Unis d'Amérique en la matière ou toute loi applicable.`,alignment:"justify",fontSize:"8"},
                { text: `\n\n\nFait à ${contrat?.agence?.wilaya} Le ${moment(avenant?.auditDate).format("DD-MM-YYYY")}\n\n`, bold: true, fontSize: "8" },
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
                                    alignment: 'right'
                                }
                            ]
                        ],
                    },
                },
                sessionStorage.getItem("roles")?.includes("COURTIER")?{
                    image: SignatureCourtier,
                    alignment:'right',
                    width: widthSignature,
                    height: heightSignature
                  }:{}    
            )
            :docDefinitionContrat.content.push(
                { text: `\n\nDÉCLARATION DU SOUSCRIPTEUR \n`, bold: true, fontSize: "8", alignment: 'justify', pageBreak: 'before' },
                {
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
                      { text: `${contrat?.agence?.raisonSocial}`, bold: true },
                      ' En tant que Société de Courtage en assurances, à l’effet de négocier et gérer pour mon compte auprès des compagnies d’assurances aux meilleures conditions de garanties et de tarifs, en veillant à la défense de mes intérêts pendant toute la durée de l’assurance depuis la confection du contrat, qu’à l’occasion des règlements des sinistres. Le présent mandat prend effet à la date de signature du présent, et demeure valable tant qu’il n’a pas été dénoncé expressément par mes soins conformément à la législation en vigueur \n\n'
                    ],
                    fontSize: 8,
                    alignment: 'justify'
                  }:{},

                { text: `BÉNÉFICIAIRES DESIGNES EN CAS DE DÉCÈS \n\n`, bold: true, fontSize: "8", alignment: 'justify' },
                { text: `Noms et Prénoms des bénéficiaires`, bold: true, fontSize: "8", alignment: 'justify' },

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
                },
                sessionStorage.getItem("roles")?.includes("COURTIER") && 
                {
                    text: [
                      'Je donne par le présent mandat à ',
                      { text: `${contrat?.agence?.raisonSocial}`, bold: true },
                      ' En tant que Société de Courtage en assurances, à l’effet de négocier et gérer pour mon compte auprès des compagnies d’assurances aux meilleures conditions de garanties et de tarifs, en veillant à la défense de mes intérêts pendant toute la durée de l’assurance depuis la confection du contrat, qu’à l’occasion des règlements des sinistres. Le présent mandat prend effet à la date de signature du présent, et demeure valable tant qu’il n’a pas été dénoncé expressément par mes soins conformément à la législation en vigueur \n\n'
                    ],
                    fontSize: 8,
                    alignment: 'justify'
                  },

                
                { text: `\n\n\nFait à ${contrat?.agence?.wilaya} Le ${moment(avenant?.auditDate).format("DD-MM-YYYY")}\n\n`, bold: true, fontSize: "8" },
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
                                    alignment: 'right'
                                }
                            ]
                        ],
                    },
                },
                sessionStorage.getItem("roles")?.includes("COURTIER")?{
                    image: SignatureCourtier,
                    alignment:'right',
                    width: widthSignature,
                    height: heightSignature
                  }:{}

            )
        }

        pdfMake.createPdf(docDefinitionContrat).download("Avenant_" + contrat?.idContrat);
    }

//     outputAvenantFlotte(contrat: any, avenant: any, quittance: any, dataParam:any, hisContratPrev:any){
// //console.log('avenant',avenant)
//         let risqueListVehicule: any = [];
//         let risques: any = [];
//         let vehicules: any = [];
//         let headersRisque: any = [];
//         let risquegarantiesList: any = [];
//         let garantiesList: any = [];      
//         let garanties: any = [];  
//         let garantiesPrime: any = [];         
//         let groupeGarantiesList: any = [];  
//         let groupeGarantiesList2: any = [];  
//         let groupeGarantiesList3: any = [];  
//         let valeur0:any;
//         let valeur5:any;
//         let valeur15:any;
//         let valeur25:any;
        
//         let risqueAvenant:any = [];
       
//         let headersGarantieList = ["Nº ORDRE","Prime_RC", "Prime_DR", "Prime_DTA",  "Prime_DCVV", "Prime_DC","Prime_Vol", "Prime_Vol_Auo_radio","Prime_Incendie",
//         "Prime_BDG", "Prime_Assistance", "Prime_PCP", "Prime_Nette"]   
    
//         avenant?.typeAvenant.code == "A19"?  headersRisque = [ "MARQUE", "IMMATRICULATION", "CHASSIS", "VALEUR_VENALE"]:
//         headersRisque = ["Nº ORDRE", "MARQUE", "IMMATRICULATION", "CHASSIS", "VALEUR_VENALE"]

//         //info risque avenant de retrait
//         if(avenant?.typeAvenant?.code == "A19" ){
//             avenant?.risqueList?.map((risque: any) => {          
//                 risqueAvenant.push(risque?.idRisque);
//             })            
//             risqueListVehicule = hisContratPrev?.groupesList?.filter((groupe:any) => groupe?.risques)

         
//             hisContratPrev?.groupesList?.filter((groupe:any) => {           
//                 groupe?.risques?.map((risque: any) =>{       
//                     //console.log("risques",risque)         
//                     if (risqueAvenant.includes(risque?.idRisque)){
//                     //console.log("pushed pushed risque",risque)         

//                         risques.push(risque)
//                     }
                    
//                 })
//             })   
            

    
//         }else{
//             //Get info riques 
//             avenant?.typeAvenant?.code == "A20"||  avenant?.typeAvenant?.code == "A03"|| avenant?.typeAvenant?.code == "A06" || avenant?.typeAvenant?.code == "A08"?
//             avenant?.risqueList?.map((risque: any) => {             
//                     contrat?.groupesList?.map((gr: any) => {          
//                       gr?.risques?.map((rs: any) => {  
//                         if (risque?.idRisque == rs?.idRisque) {                       
//                           risques.push(rs);
//                         }
//                       })
//                     })   
//             })          
//             :risqueListVehicule = contrat?.groupesList?.filter((groupe:any) => groupe?.risques)  
//             risqueListVehicule?.forEach((groupe: any) => {               
//                 if (groupe?.risques) {                   
//                     groupe?.risques?.forEach((risque: any) => {                       
//                         risques.push(risque);
//                     });
//                 }
//             });
//         }
     
//         let index = 0;
//         while (index < risques?.length) {
        
//             let tmp = {
//                "Nº ORDRE": [
//                     { text: risques[index].idRisque+'/'+risques?.length, fontSize: "8" },
//                 ], 
//                 MARQUE: [
//                     { text: '', fontSize: "8" },
//                 ],
//                 IMMATRICULATION: [
//                     { text: '', fontSize: "8" },
//                 ],
//                 CHASSIS : [
//                     { text: '', fontSize: "8" },
//                 ],

//                 VALEUR_VENALE : [
//                     { text: '', fontSize: "8" },
//                 ],                       
            
//             };
           
//             risques[index].risque?.map((ele: any) => {
//                 switch (ele.colonne) {
//                     case "Marque":                             
//                         tmp.MARQUE[0].text = ele.valeur
//                         break;                            
//                     case "N° d'Immatriculation":                             
//                         tmp.IMMATRICULATION[0].text = ele.valeur
//                         break; 
//                     case "Châssis ":                             
//                         tmp.CHASSIS[0].text = ele.valeur
//                     break;
                    
//                     case "Valeur Assuré":                             
//                         tmp.VALEUR_VENALE[0].text = Number(ele.valeur).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")!="NaN"?Number(ele.valeur).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +" DZD": ele.valeur +" DZD"
//                     break;  
//                     default:
//                     break;
//                 }
            
//             })                    
//             vehicules.push(tmp);                    
//             index = index + 1;    
//         }     
       
        
//         //Get primes/garantie
//           //Get info riques           
//             if(avenant?.typeAvenant?.code == "A19"){
//                 risquegarantiesList =  hisContratPrev?.groupesList?.filter((groupe:any) => groupe?.garantieList)           
//                 risquegarantiesList?.forEach((element: any) => {
//                 garantiesList.push(element.garantieList)

//                 index = 0;
//             while (index < garantiesList?.length-1) {
//                 garantiesList?.forEach((element: any) => {
//                     element.forEach((ele: any) => {
//                 garanties.push(ele[index])  
//                     })
//                 })             
//                 index++;
//             }
//             })    
//             }else{
//                 risquegarantiesList = contrat?.groupesList?.filter((groupe:any) => groupe?.garantieList)           
//                 risquegarantiesList?.forEach((element: any) => {
//                     garantiesList.push(element.garantieList)
//                 })      
//             }
                 
    
//             index = 0;
//             while (index < garantiesList?.length-1) {
//                 garantiesList?.forEach((element: any) => {
//                 garanties.push(element[index])  
              
//                 })             
//                 index++;
//             }
        
           
//             index = 0;
//             while (index < dataParam?.length) {
            
//                 let tmp = {
//                    "Nº ORDRE": [
//                         { text: dataParam[index].risque+'/'+dataParam?.length, fontSize: "8" },
//                     ], 
//                     Prime_RC: [
//                         { text: '', fontSize: "8" },
//                     ],
//                     Prime_DR: [
//                         { text: '', fontSize: "8" },
//                     ],
//                     Prime_DTA : [
//                         { text: '', fontSize: "8" },
//                     ],    
//                     Prime_DCVV : [
//                         { text: '', fontSize: "8" },
//                     ],    
//                     Prime_DC : [
//                         { text: '', fontSize: "8" },
//                     ],    
//                     Prime_Vol  : [
//                         { text: '', fontSize: "8" },
//                     ],    
//                     Prime_Vol_Auo_radio  : [
//                         { text: '', fontSize: "8" },
//                     ],    
//                     Prime_Incendie : [
//                         { text: '', fontSize: "8" },
//                     ],      
//                     Prime_BDG : [
//                         { text: '', fontSize: "8" },
//                     ],    
//                     Prime_Assistance: [
//                         { text: '', fontSize: "8" },
//                     ],   
//                     Prime_PCP: [
//                         { text: '', fontSize: "8" },
//                     ],   
                   
//                     Prime_Nette: [
//                         { text: dataParam[index].primeList.find((element:any)=>element.risque== dataParam[index].risque)?.primeProrata?.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), fontSize: "8" },

//                     ], 
                    
                  
//                 };
//                 dataParam[index].garantieList?.map((ele: any) => {
//                         switch (ele.codeGarantie) {
//                             case "G00":                             
//                                 tmp.Prime_RC[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                                 break;                            
//                             case "G08":                             
//                                 tmp.Prime_DR[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                                 break; 
//                             case "G02":                             
//                                 tmp.Prime_DTA[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             break;
//                             case "G13":                             
//                                 tmp.Prime_DCVV[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                                 break;     
//                             case "G07":                             
//                                 tmp.Prime_DC[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             break;  
//                             case "G03":                             
//                                 tmp.Prime_Vol[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             break;     
//                             case "G05":                             
//                                 tmp.Prime_Vol_Auo_radio[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             break; 
    
//                             case  "G04":                             
//                                 tmp.Prime_Incendie[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             break;     
    
//                             case "G06":                             
//                                 tmp.Prime_BDG[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             break;     
    
//                             case  "G11":                             
//                                 tmp.Prime_Assistance[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             break;     
    
//                             case "G18" :  
                           
//                              let pr1 =  dataParam[index]?.garantieList?.find((element:any)=>element?.codeGarantie=="G17")?.primeProrata
//                              let pr2 =  dataParam[index]?.garantieList?.find((element:any)=>element?.codeGarantie=="G16")?.primeProrata
//                              let pr3 =  dataParam[index]?.garantieList?.find((element:any)=>element?.codeGarantie=="G18")?.primeProrata
//                              tmp.Prime_PCP[0].text =(Number(pr1)+Number(pr2)+Number(pr3)).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             break;    
    
//                             default:
//                             break;
//                         }
    
                       
                    
//                 })                    
//                 garantiesPrime.push(tmp);                    
//                 index = index + 1;       
//             }       


           
//        if(avenant?.typeAvenant?.code !=  "A06" && avenant?.typeAvenant?.code !=  "A19" )  {
       
//         dataParam?.map((garantie:any)=>garantie?.garantieList?.some((param: any) => param?.codeGarantie == "G02"))[0] ?            
//         groupeGarantiesList = dataParam?.find((garantie:any)=>garantie?.garantieList?.find((param: any) => param?.codeGarantie == "G02"))?.garantieList:groupeGarantiesList= []

    
//         dataParam?.map((garantie:any)=>garantie?.garantieList?.some((param: any) => param?.codeGarantie == "G13"))[0]?            
//         groupeGarantiesList2 = dataParam?.find((garantie:any)=>garantie?.garantieList?.find((param: any) => param?.codeGarantie == "G13"))?.garantieList:groupeGarantiesList2= []

//         dataParam?.map((garantie:any)=>garantie.garantieList?.some((param: any) => param?.codeGarantie == "G07"))[0]?            
//         groupeGarantiesList3 = dataParam?.find((garantie:any)=>garantie?.garantieList?.find((param: any) => param?.codeGarantie == "G07"))?.garantieList:groupeGarantiesList2= []



//         let assistance =  dataParam?.map((garantie:any)=>garantie.garantieList?.find((param: any) => param?.codeGarantie == "G11"))
    
       

//        /////////////
//        assistance?.filter((param: any) => param?.codeGarantie == "G11")?.map((garantie:any)=>{
        
//        if( garantie?.categorieList?.some((cat: any) => cat?.valeur == "0")){
//         valeur0 = true 
//        }
//        if(garantie?.categorieList?.some((cat: any) => cat?.valeur == "5")){
//         valeur5 = true
//        }
//        if(garantie?.categorieList?.some((cat: any) => cat?.valeur == "15")){
//         valeur15 = true
//        }
//        if(garantie?.categorieList?.some((cat: any) => cat?.valeur == "25")){
//         valeur25 = true
//        }

       
//        })         
//        } 
       
               

//         const docDefinitionContrat: any = {
//             watermark:  { text: '', color: 'blue', opacity: 0.1},
//             pageMargins: [35, 110, 35, 90],
//             border: [false, false, false, false],
//             header: function(currentPage: any, pageCount: any) {   
//                  // Common header for all pages
//                 const commonHeader = {
//                     text: 'Police N° : '+contrat?.idContrat ,
//                     style: 'sectionHeader',  
//                     margin: [0, 30]  ,         
//                     color: 'black'
//                 };
//                 if(currentPage == 1) {
//                     return { 
//                         stack: [
//                             {
//                                 columns: [
//                                     // Colonne GAUCHE - Infos agence
//                                     {
//                                         stack: [
//                                             {},
//                                             { text: 'Agence: ' + avenant?.agence.raisonSocial, alignment: 'left' ,style: 'sectionHeader',
//                                                 color: 'black' },
//                                             { text: 'Code Agence: ' + avenant?.agence.codeAgence, alignment: 'left',style: 'sectionHeader',
//                                                 color: 'black' },
//                                             { text: 'Adresse: ' + avenant?.agence.adresse, alignment: 'left' ,style: 'sectionHeader',
//                                                 color: 'black'},
//                                             { text: 'Téléphone: ' + avenant?.agence.telephone, alignment: 'left',style: 'sectionHeader',
//                                                 color: 'black' }
//                                         ],
//                                         width: '40%', // Ajustez la largeur selon besoin
//                                         margin: [0, 0, 20, 0]
//                                         // margin: [35, 30, 35, 0]
//                                     },
                                    
//                                     // Colonne DROITE - Contenu existant
//                                     {
//                                         stack: [
//                                             {
//                                                 text: 'AXA' + contrat?.produit?.description.toUpperCase(),
//                                                 style: 'sectionHeader'
//                                             },
//                                             {
//                                                 text: avenant?.typeAvenant?.libelle,
//                                                 style: 'sectionHeader',
//                                                 color: 'black'
//                                             },
//                                             {
//                                                 text: 'Police N° : ' + contrat?.idContrat,
//                                                 style: 'sectionHeader',
//                                                 color: 'black'
//                                             },
//                                             {
//                                                 text: 'Avenant N° : ' + avenant?.idContratAvenant,
//                                                 style: 'sectionHeader',
//                                                 color: 'black'
//                                             },
//                                             // contrat?.convention != null ? 
//                                             // {
//                                             //     text: 'Convention: ' + contrat?.convention,
//                                             //     style: 'sectionHeader',
//                                             //     color: 'black'
//                                             // } : contrat?.reduction != null ? 
//                                             // {
//                                             //     text: 'Réduction: ' + contrat?.reduction,
//                                             //     style: 'sectionHeader',
//                                             //     color: 'black'
//                                             // } : {},
//                                             { 
//                                                 qr: 'https://www.axa.dz/wp-content/uploads/2023/10/Conditions-generales-Assurance-Automobile.pdf', 
//                                                 alignment: "right", 
//                                                 fit: '65' 
//                                             }
//                                         ],
//                                         width: '60%' // Ajustez selon besoin
//                                     }
//                                 ]
//                             }
//                         ],
//                         margin: [35, 30, 35, 0]
//                     }
//                 } else {
//                     // Header for subsequent pages
//                     return { 
//                         stack: [commonHeader],
//                         margin: [35, 10, 35, 0]
//                     };
//                 }  
//             },
//             content: [
//                 {
//                     text: 'Le présent avenant est établi entre les contractants suivants :',  
//                     bold: true,                       
//                     color: "black", 
//                     fontSize: 10,                          
                   
//                 },
//                 {
//                     text: 'D\'une part :  AXA Assurances Algérie Dommage SPA, société de droit algérien inscrite au registre de commerce d’Alger sous le numéro 16/00- 1005172 B 11 au capital de 3.150.000.000,00 de Dinars Algériens, dont le siège social est sis au lotissement 11 décembre 1960 lots 08 et 12, 16030 El Biar Alger',                         
//                     color: "black", 
//                     fontSize: 10,                          
                   
//                 },
//                 {
//                     text: '\nReprésentée par son directeur général, ayant tous pouvoirs à l’effet des présentes.',                         
//                     color: "black", 
//                     fontSize: 10,                          
                   
//                 },
//                 {
//                     text: 'Ci-après dénommée « L’Assureur »',  
//                     color: "black", 
//                     fontSize: 10,                          
                   
//                 },
//                 {
//                     text: '\nEt\n ',  
//                     color: "black", 
//                     fontSize: 10,                          
                   
//                 },
//                 {
//                     text: 'D’autre part, La société :  '+ contrat?.personnesList?.map((peronne:any) => peronne?.personne?.raisonSocial)[0]+', dont le siège est situé à : '+ contrat?.personnesList?.map((peronne:any) => peronne?.personne?.adressesList[0]?.description),  
//                     color: "black", 
//                     fontSize: 10,                          
                   
//                 },
//                 {
//                     text: '\nReprésentée par son gérant (indiquer la qualité et nom du signataire) . Ayant tous pouvoirs à l’effet des présentes',  
//                     color: "black", 
//                     fontSize: 10,                          
                   
//                 },
//                 {
//                     text: '\nCi-après dénommée « L’assuré ». ',  
//                     color: "black", 
//                     fontSize: 10,                          
                   
//                 },
//                 {
                       
//                     text: `\nREFERENCE DU CONTRAT\n`,
//                     bold: true,
//                     color: "#00008F", 
//                     fontSize: 12,
//                     alignment: 'justify'
                               
//                 },   
//                 {
//                     text: '\nN° de Police d’Origine :  '+contrat?.idContrat,  
//                     color: "black", 
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 },
//                 {
//                     text:  'N° d’Avenant : '+avenant?.idContratAvenant,  
//                     color: "black", 
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 },
//                 // {
//                 //     text: 'Type d’Avenant : '+avenant?.typeAvenant?.libelle+' - Flotte Automobile',  
//                 //     color: "black", 
//                 //     bold: true,
//                 //     fontSize: 10,                          
                   
//                 // },   

//                 avenant?.typeAvenant?.code !="A22"?
//                 {
//                     text: 'Date d’expiration :'+avenant?.dateExpiration?.split("T")[0],
//                     color: "black",
//                     bold: true,
//                     fontSize: 10,

//                 }:{},
//                 {
//                     text: 'Date d’effet  :'+avenant?.dateAvenant?.split("T")[0],  
//                     color: "black", 
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 },   
//                 avenant?.typeAvenant?.code =="A22"?{
//                     text: 'Date d’expiration avenant:'+avenant?.dateExpirationAvenant,
//                     color: "black",
//                     bold: true,
//                     fontSize: 10,

//                 }:{},

//                 {
                       
//                     text: `\nARTICLE 1 : OBJECT DE L’AVENANT\n`,
//                     bold: true,
//                     color: "#00008F", 
//                     fontSize: 12,
//                     alignment: 'justify'
                               
//                 },   
//                 {
//                     text: "Le présent avenant a pour objet d'incorporer à la flotte automobile déclarée initialement par l'assuré, le véhicule identifié à l'annexe A.",  
//                     color: "black", 
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 },   
//                 {
                       
//                     text: `\nARTICLE 2 : MONTANT DE LA PRIME\n`,
//                     bold: true,
//                     color: "#00008F", 
//                     fontSize: 12,
//                     alignment: 'justify'
                               
//                 },  
//                 {
//                     text: "Le détail des primes par garanties en ANNEXE B – Détail des primes et garanties.",  
//                     color: "black", 
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 },  
//                 avenant?.typeAvenant?.description!=  "Chengement de formule"?
//                 {
//                     text: "",  
//                     color: "black", 
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 }:{},  
//                 {
//                     columns: [
                       
//                         {
//                             style: "table",
//                             table: {
                                
//                                 widths:  ["*","*","*","*","*","*"] ,
//                                 body: [
//                                     [
//                                         {
//                                             text: `Prime nette`,
//                                             style: "headerTable"
//                                         },
//                                         avenant?.typeAvenant?.code == 'A12'?
//                                         {
//                                             text: `Coût de police`,
//                                             style: "headerTable"
//                                         }
//                                         :{
//                                             text: `Frais de gestion`,
//                                             style: "headerTable"
//                                         },
//                                         {
//                                             text: `T.V.A`,
//                                             style: "headerTable"
//                                         },
                                      
//                                         {
//                                             text: `F.G.A`,
//                                             style: "headerTable"
//                                         },
//                                         {
//                                             text: `Timbre de dimension`,
//                                             style: "headerTable"
//                                         },
                                       
//                                         {
//                                             text: `Timbre gradué`,
//                                             style: "headerTable"
//                                         },
//                                     ],
//                                     [
//                                         {
//                                             text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
//                                             fontSize: 8
//                                         },
                                        
//                                      /*   {
//                                             text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
//                                             fontSize: 10
//                                         },
//                                         */
//                                         quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata == null ?
//                                         {
//                                             text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
//                                             fontSize: 10
//                                         }
//                                         : {
//                                             text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
//                                             fontSize: 10
//                                         },
//                                         {
//                                             text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
//                                             fontSize: 8
//                                         },                                      
//                                         {
//                                             text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
//                                             fontSize: 8
//                                         }, 
//                                         {
//                                             text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
//                                             fontSize: 8
//                                         },
                                      
//                                         {
//                                             text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD",
//                                             fontSize: 8
//                                         },
//                                     ],
//                                     [
//                                         {text: '',colSpan: 4},
//                                         {},
//                                         {},
//                                         {},
//                                         {
//                                             text: `Prime Totale`,
//                                             style: "headerTable",
//                                         },
//                                         {
//                                             text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+".DZD",
//                                             fontSize: 8
//                                         },
//                                     ],
//                                 ],
//                             }
//                         }
//                     ],
//                 },
//                 {
//                     text: `\n`,
//                     pageBreak: 'after',
//                 },
//                 {
                       
//                     text: `\nARTICLE 3 : DATE D’EFFET DE L’AVENANT\n`,
//                     bold: true,
//                     color: "#00008F", 
//                     fontSize: 12,
//                     alignment: 'justify'
                               
//                 },  
//                 {
//                     text: "Le présent avenant prend effet à compter du "+avenant?.dateAvenant?.split("T")[0],  
//                     color: "black", 
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 },   
//                 {
                       
//                     text: `\nARTICLE 4 : DIVERS\n`,
//                     bold: true,
//                     color: "#00008F", 
//                     fontSize: 12,
//                     alignment: 'justify'
                               
//                 },  
//                 {
//                     text: "Il n'est rien changé aux autres clauses et conditions de la police citée ci-dessus.",  
//                     color: "black", 
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 },   
//                 {
                       
//                     text: `\nARTICLE 5 : DÉCLARATION DE L’ASSURE\n`,
//                     bold: true,
//                     color: "#00008F", 
//                     fontSize: 12,
//                     alignment: 'justify'
                               
//                 },  
//                 {
//                     text: "L’assuré  reconnait avoir reçu un exemplaire du présente avenant  et déclare avoir pris connaissance des textes y figurant.\nL’assuré reconnais que le présente avenant a  été établie conformément aux réponses données par l’assuré aux questions posées par la Compagnie lors de la souscription du contrat.\nL’assuré reconnais également avoir été préalablement informé(e) du montant de la prime et des garanties du présent contrat.\nL’assuré reconnais avoir été informé(e), au moment de la collecte d’informations que les conséquences qui pourraient résulter d’une omission ou d’une déclaration inexacte sont celles prévues par l’article 19 de l’ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006.",  
//                     color: "black", 
//                     alignment: 'justify',
//                     bold: true,
//                     fontSize: 10,                          
                   
//                 },                  
//                 {
//                     layout: 'noBorders',
//                     table: {
//                         widths: ["*", "*"],
//                         alignment: "center",
//                         body: [
//                             [
//                                 {
//                                     text: [
//                                         { text: `\nFait en deux exemplaires`, bold: true, fontSize: "8" },                                      
//                                     ],
//                                     alignment: 'left'
//                                 },
//                                 {
//                                     text: `\nà ${contrat?.agence?.commune} - ${contrat?.agence?.wilaya} Le ${contrat?.auditDate?.split("T")[0]}\n\n`, bold: true, fontSize: "8",
//                                     alignment: 'right'
//                                 }
//                             ]
//                         ],
//                     },
//                 },
//                 {
//                     layout: 'noBorders',
//                     table: {
//                         widths: ["*", "*"],
//                         alignment: "center",
//                         body: [
//                             [
//                                 {
//                                     text: [
//                                         { text: `\nP/L’assuré \n`, bold: true, fontSize: "8" },                                      
//                                     ],
//                                     alignment: 'left'
//                                 },
//                                 {
//                                     text: `\nP/L’assureur`, bold: true, fontSize: "8",
//                                     alignment: 'right',
//                                     pageBreak: 'after'
//                                 }
//                             ]
//                         ],
//                     },
//                 },
               
                
//                 {
//                     columns: [
//                         {
//                             style: "table",
//                             table: {
//                                 widths: ["*"],
//                                 alignment: "left",
//                                 body: [
//                                     [
//                                         {
                                           
//                                             text: `ANNEXE A - Détail des véhicules assurés`,
//                                             style: "headerTable"
//                                         },
//                                     ],
//                                 ],
//                             }
//                         },                       
//                     ],
//                 },                
//             vehicules.length != 0 ? this.table(vehicules, headersRisque):{},
          
            
//             avenant?.typeAvenant?.code== "A06"?
//             {       
                            
//                 pageBreak: 'before' ,       
//                 text:'',            
//             }:{},
//             avenant?.typeAvenant?.code== "A06"?
//             {
//                 columns: [
//                     {
//                         style: "table",
//                         table: {
//                             widths: ["*"],
//                             alignment: "left",
//                             body: [
//                                 [
//                                     {                                      
//                                         text: `ANNEXE B – Détail des garanties`,
//                                         style: "headerTable"
//                                     },
//                                 ],
//                             ],
//                         }
//                     },                       
//                 ],
//             }:{},
//             avenant?.typeAvenant?.code== "A06"?
//             {
                       
               
//                 text: `\nGaranties Souscrites\n`,
//                 bold: true,
//                 color: "#00008F", 
//                 fontSize: 12,
//                 alignment: 'justify',                  
                           
//             }:{},
//             avenant?.typeAvenant?.code== "A06"? 
//             {
//                 columns: [
                   
//                     {
//                         style: "table",
//                         table: {
                            
//                            widths:  ["*","*","*","*"] ,
//                             body: [
//                                 [
//                                     {
//                                     text: `Garanties Souscrites`,
//                                     fontSize: 8,
//                                     style: "headerTable"
//                                     },  
//                                     {
//                                         text: `Limites des Garanties par Sinistre / DA`,
//                                         fontSize: 8,
//                                         style: "headerTable"
//                                         },         
//                                         {
//                                             text: `Franchise `,
//                                             fontSize: 8,
//                                             style: "headerTable"
//                                             },         
//                                             {
//                                                 text: `Règle Proportionnelle `,
//                                                 fontSize: 8,
//                                                 style: "headerTable"
//                                                 },
                                               
//                                 ],
//                                 [
//                                     {
//                                         text: "Responsabilité Civile en et hors circulation (article 4 des conditions générales)",
//                                         fontSize: "8", 
//                                     },
                                    
//                                     {
//                                         text: "Illimités",
//                                         fontSize: "8", 
//                                     },
//                                     {
//                                         text: "Sans Franchise",
//                                         fontSize: "8", 
//                                     },                                   
//                                     {
//                                         text: "Non applicable",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],                           
//                                 [
//                                     {
//                                         text: "Dommages Tous Accident (DTA) (article 13 des conditions générales)",
//                                         alignment: 'justify',
//                                         fontSize: "8", 
//                                     },
                                    
//                                     {
//                                          text: "En cas de perte totale : Valeur de remplacement estimée par l'expert sans excéder la valeur vénale du véhicule déclarée par l'assuré figurant dans l'ANNEXE C.\nEn cas de dommages partiels : Coût des réparations ou de remplacement des pièces détériorées dans la limite de la valeur de remplacement estimée par l'expert en application du barème de l'UAR pour le cout de la main d'œuvre.",
//                                         fontSize: "8",
//                                         alignment: 'justify', 
//                                     },
                                
//                                     {
                                  
//                                         text: groupeGarantiesList?.find((param: any) => param?.codeGarantie == "G02")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur?
//                                         Number(groupeGarantiesList?.find((param: any) => param?.codeGarantie == "G02")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
//                                         : "/",
//                                         fontSize: "8", 
//                                     }
//                                     ,        
                                                               
//                                     {
//                                         text: "",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],                              
//                                 [
//                                     {
//                                         text: "Dommages Collision a valeur vénale (article 15 des conditions générales)",
//                                         fontSize: "8", 
//                                         alignment: 'justify',
//                                     },
                                    
//                                     {
//                                         text: "En cas de dommages partiels : Coût des réparations ou de remplacement des pièces détériorées dans la limite de la valeur de remplacement estimée par l’expert en application du barème de l'UAR pour le cout de la main d'œuvre.\n\nLa DC VV est accordée pour les véhicules âgés de 9 à 10 ans.",
//                                         fontSize: "8",
//                                         alignment: 'justify', 
//                                     },
//                                     {
                                      
//                                         text:groupeGarantiesList2?.find((param: any) => param?.codeGarantie == "G13")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur?
//                                         Number(groupeGarantiesList2?.find((param: any) => param?.codeGarantie == "G13")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
//                                         : "/",
//                                         fontSize: "8", 
                                        
//                                     },                                   
//                                     {
//                                         text: "Applicable",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],
//                                 [
//                                     {
//                                         text: "Dommages Collision à hauteur de 100 000.00 DA",
//                                         fontSize: "8", 
//                                         alignment: 'justify',
//                                     },
                                    
//                                     {
//                                         text: "En cas de perte totale ou de dommages partiels : la valeur de remplacement estimée par l’expert est plafonnée à 100 000.00 DA.\n\nLa DC 100 000 DA est accordée pour les véhicules âgés de 11 à 14 ans.",
//                                         fontSize: "8", 
//                                         alignment: 'justify',
//                                     },
//                                     {
//                                         text: groupeGarantiesList3?.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur?
//                                         Number(groupeGarantiesList3?.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
//                                         : "/",
//                                         fontSize: "8", 
//                                     },                                   
//                                     {
//                                         text: "Applicable",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],
//                                 [
//                                     {
//                                         text: "Bris de Glaces (article 21 des conditions générales)",
//                                         fontSize: "8", 
//                                     },
                                    
//                                     {
//                                         text: "Coût des réparations ou de remplacement des glaces sans toutefois dépasser le plafond de 70 000.00 DA",
//                                         alignment: 'justify',
//                                         fontSize: "8", 
//                                     },
//                                     {
//                                         text: groupeGarantiesList?.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur?
//                                         Number(groupeGarantiesList?.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
//                                         : "/",
//                                     },                                   
//                                     {
//                                         text: "",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],
//                                 [
//                                     {
//                                         text: "Vol de véhicules (article 19 des conditions générales)",
//                                         alignment: 'justify',
//                                         fontSize: "8", 
//                                     },
                                    
//                                     {
//                                         text: "En cas de perte totale : Valeur de remplacement estimée par l'expert sans excéder la valeur vénale du véhicule déclarée par l'assuré figurant dans l'ANNEXE C. En cas de dommages partiels : Coût des réparations ou de remplacement des pièces détériorées dans la limite de la valeur de remplacement estimée par l'expert en application du barème de l'UAR pour le cout de la main d'œuvre.",
//                                         fontSize: "8", 
//                                         alignment: 'justify',
//                                     },
                                   
//                                    {
                                  
//                                     text: "Sans Franchise",
//                                         fontSize: "8", 
//                                     },  
                                                              
//                                     {
//                                         text: "Applicable",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],
//                                 [
//                                     {
//                                         text: "Incendie (article 17 des conditions générales)",
//                                         fontSize: "8", 
//                                     },
                                    
//                                     {
//                                         text: "En cas de perte totale : Valeur de remplacement estimée par l'expert sans excéder la valeur vénale du véhicule déclarée par l'assuré figurant dans l'ANNEXE C.\nEn cas de dommages partiels : Coût des réparations ou de remplacement des pièces détériorées dans la limite de la valeur de remplacement estimée par l'expert en application du barème de l'UAR pour le cout de la main d'œuvre.",
//                                         fontSize: "8", 
//                                         alignment: 'justify',
//                                     },
//                                     {                                      
//                                         text: "Sans Franchise",
//                                         fontSize: "8", 
//                                     },                                   
//                                     {
//                                         text: "Applicable",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],
//                                 [
//                                     {
//                                         text: "Vol Auto Radio",
//                                         fontSize: "8", 
//                                     },
                                    
//                                     {
//                                         text: "",
//                                         fontSize: "8", 
//                                     },
//                                     {
//                                         text: "Sans Franchise",
//                                         fontSize: "8", 
//                                     },                                   
//                                     {
//                                         text: "Non applicable",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],
                               
                              
//                                 [
//                                     {
//                                         text: "Protection du conducteur et des passagers",
//                                         fontSize: "8", 
//                                         alignment: 'justify',
//                                     },
                                    
//                                     {
//                                         text: "Décès- invalidité absolue et définitive / Limite :\n\n2 000 000 DA \n\nI.P.P (Incapacité Permanente partielle) / Limite :\n\n2 000 000 DA\n\nFrais médicaux et d’hospitalisation / Limite : \n\n300 000 DA",
//                                         fontSize: "8", 
//                                         alignment: 'justify',
//                                     },
//                                     {
//                                         text: "Sans Franchise",
//                                         fontSize: "8", 
//                                     },                                   
//                                     {
//                                         text: "Non applicable",
//                                         fontSize: "8", 
//                                     },
                                 
//                                 ],

//                             ],                          
//                         },                        
//                     },
                    
//                 ],
//             }:{},
//             avenant?.typeAvenant?.code== "A06"?
//             valeur0?
//                 {
//                         columns: [
//                             {
//                                 style: "table",
//                                 table: {
//                                     widths: ["*","*","*","*"],
//                                     alignment: "left",
//                                     body: [
//                                         [
//                                             {
//                                                 text: "Assistance automobile – Plus Auto",
//                                                 fontSize: "8", 
//                                                 border: [true, true, false, true],
//                                             },
//                                             {
//                                                 text: "Assistance aux véhicules\n1. Dépannage / Remorquage en cas de panne ou d'accident dans la limite de 15 000.00 DZD. \n2. Extraction du véhicule assuré à l'aide d'une grue dans la limite de 7 000.00 DZD. \n3. Retour des bénéficiaires / Poursuite du voyage : inclus. \n4. Prise en charge des frais d'hébergement à l'hôtel (par nuitée et par personne) dans la limite de 10 000.00 DZD/nuitée, sans dépasser 02 nuitées par personne. \n5. Séjour et déplacement des bénéficiaires suite au vol du véhicule assuré dans la limite de 10 000.00 DZD/nuitée sans dépasser 02 nuitées par personne. \n6. Gardiennage et récupération du véhicule après réparation dans la limite de 3 000.00 DZD. \n7. Service d'un chauffeur professionnel : Inclus\nAssistance aux Personnes\nFranchise Kilométrique : 50 Kilomètres\n1. Transport sanitaire : Inclus\n2. Transport des bénéficiaires accompagnateurs: Inclus\n3. Rapatriement de corps : 60 000 DZD\n4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne) : 20 000 DZD\n5. Interruption de voyage à la suite du décès d'un proche parent en Algérie : Inclus\n6. Transmission de messages urgents : Inclus",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                             {
//                                                 text: "25 Kilomètres",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },                                   
//                                             {
//                                                 text: "Non applicable",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                         ],
//                                     ],
//                                 }
//                             },
                           
//                         ]    
                               
                                
//                     }:{}:{},
//                     avenant?.typeAvenant?.code== "A06"?
//                     valeur5 ?
//                     {
                       
//                         columns: [
//                             {
//                                 style: "table",
//                                 table: {
//                                     widths: ["*","*","*","*"],
//                                     alignment: "left",
//                                     body: [
//                                         [
//                                             {
//                                                 text: "Assistance automobile – Essentiel Auto",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                             {
//                                                 text: "Assistance aux véhicules\n1. Dépannage / Remorquage en cas de panne ou d'accident dans la limite de 15 000.00 DZD. \n2. Extraction du véhicule assuré à l'aide d'une grue dans la limite de 7 000.00 DZD. \n3. Retour des bénéficiaires / Poursuite du voyage : inclus. \n4. Prise en charge des frais d'hébergement à l'hôtel (par nuitée et par personne) dans la limite de 10 000.00 DZD/nuitée, sans dépasser 02 nuitées par personne. \n5. Séjour et déplacement des bénéficiaires suite au vol du véhicule assuré dans la limite de 10 000.00 DZD/nuitée sans dépasser 02 nuitées par personne. \n6. Gardiennage et récupération du véhicule après réparation dans la limite de 3 000.00 DZD. \n7. Service d'un chauffeur professionnel : Inclus\nAssistance aux Personnes\nFranchise Kilométrique : 50 Kilomètres\n1. Transport sanitaire : Inclus\n2. Transport des bénéficiaires accompagnateurs: Inclus\n3. Rapatriement de corps : 40 000 DZD\n4. Visite d'un proche parent en cas d'hospitalisation de plus de sept jours du bénéficiaire (02 nuitées maximum/personne) : 10 000 DZD",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                             {
//                                                 text: "5 Kilomètres",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },                                   
//                                             {
//                                                 text: "Non applicable",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                         ],
//                                     ],
//                                 }
//                             },
//                         ]    

                  
//                     }:{}:{},
//                     avenant?.typeAvenant?.code== "A06"?
//                     valeur15 ?
//                     {                       
//                         columns: [
//                             {
//                                 style: "table",
//                                 table: {
//                                     widths: ["*","*","*","*"],
//                                     alignment: "left",
//                                     body: [
//                                         [
//                                             {
//                                                 text: "Assistance automobile - Classic Auto",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                             {
//                                                 text: "Assistance aux véhicules1. Dépannage / Remorquage en cas de panne ou d'accident dans la limite de 10 000.00 DZD. 2. Extraction du véhicule assuré à l'aide d'une grue dans la limite de 7 000.00 DZD. 3. Retour des bénéficiaires / Poursuite du voyage : inclus. 4. Prise en charge des frais d'hébergement à l'hôtel (par nuitée et par personne) dans la limite de 5 000.00 DZD/nuitée, sans dépasser 02 nuitées par personne. 5. Séjour et déplacement des bénéficiaires suite au vol du véhicule assuré dans la limite de 5 000.00 DZD/nuitée sans dépasser 02 nuitées par personne. 6. Gardiennage et récupération du véhicule après réparation dans la limite de 3 000.00 DZD. 7. Service d'un chauffeur professionnel : Inclus",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                             {
//                                                 text: "15 Kilomètres",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },                                   
//                                             {
//                                                 text: "Non applicable",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                         ],
//                                     ],
//                                 }
//                             },
                           
//                         ]    

                  
//                     }:{}:{},
//                     avenant?.typeAvenant?.code== "A06"?
//                     valeur25 ?
//                     {
                       
//                         columns: [
//                             {
//                                 style: "table",
//                                 table: {
//                                     widths: ["*","*","*","*"],
//                                     alignment: "left",
//                                     body: [
//                                         [
//                                             {
//                                                 text: "Assistance automobile - Basic Auto",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                             {
//                                                 text: "Assistance aux véhicules1. Dépannage / Remorquage en cas de panne ou d'accident dans la limite de 7 000.00 DZD. 2. Extraction du véhicule assuré à l'aide d'une grue dans la limite de 7 000.00 DZD. 3. Retour des bénéficiaires / Poursuite du voyage : inclus. 4. Prise en charge des frais d'hébergement à l'hôtel (par nuitée et par personne) dans la limite de 5 000.00 DZD/nuitée, sans dépasser 02 nuitées par personne. 5. Séjour et déplacement des bénéficiaires suite au vol du véhicule assuré dans la limite de 5 000.00 DZD/nuitée sans dépasser 02 nuitées par personne. 6. Gardiennage et récupération du véhicule après réparation dans la limite de 3 000.00 DZD 7. Service d'un chauffeur professionnel : Inclus",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },                                            
                                         
//                                             {
//                                                 text: "25 Kilomètres",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },                                   
//                                             {
//                                                 text: "Non applicable",
//                                                 fontSize: "8", 
//                                                 border: [true, true, true, true],
//                                             },
//                                         ],
//                                     ],
//                                 }
//                             },                            
//                         ]                        
//                     }:{}:{},
            
//             ],
//             styles: {
//                 sectionHeader: {
//                     bold: true,
//                     color: "#d14723",
//                     fontSize: 10,
//                     alignment: "right"
//                 },
//                 BG: {
//                     fontSize: 8
//                 },
//                 table: {
//                     margin: [0, 10, 0, 0]
//                 },
//                 headerTable: {
//                     alignment: "center",
//                     bold: true,
//                     fontSize: 10,
//                     color: "#00008F",
                    
//                 }
//             }
//         }        
//         if(avenant?.typeAvenant?.code != "A19" && avenant?.typeAvenant?.code!=  "A04"
//         && avenant?.typeAvenant?.code!=  "A08" && (avenant?.typeAvenant?.code!=  "A22" && contrat?.produit.codeProduit!='45L')){
//         const docDefinitionPrimesGaranties: any = {
//             watermark:  { text: '', color: 'blue', opacity: 0.1},
//             pageMargins: [35, 110, 35, 90],
//             border: [false, false, false, false],
//             pageOrientation: 'landscape',
//             header: function(currentPage: any, pageCount: any) {   
             
//                 const commonHeader =[{
//                     text: 'Police N° : '+contrat?.idContrat ,
//                     style: 'sectionHeader',
//                     color: 'black'
//                 },
//                 {
//                     text: 'Avenant N° : '+avenant?.idContratAvenant ,
//                     style: 'sectionHeader',
//                     color: 'black'
//                 },
//                 ];
                
//                 if(currentPage == 1) {
                 
//                     // Header for subsequent pages
//                     return { 
//                         stack: [commonHeader],
//                         margin: [35, 10, 35, 0]
//                     };
//                 }
//             },
//             content: [
//                 {
//                     columns: [
//                         {
//                             style: "table",
//                             table: {
//                                 widths: ["*"],
//                                 alignment: "left",
//                                 body: [
//                                     [
//                                         {
//                                             text: `ANNEXE B – Détail des primes et garanties`,
//                                             style: "headerTable"
//                                         },
//                                     ],
//                                 ],
//                             }
//                         },                       
//                     ],
//                 },
//                 {text : '\n'},
//                 garantiesPrime.length != 0 ? this.table(garantiesPrime, headersGarantieList):{},
//             ]   ,
//             styles: {
//                 sectionHeader: {
//                     bold: true,
//                     color: "#d14723",
//                     fontSize: 10,
//                     alignment: "right"
//                 },
//                 BG: {
//                     fontSize: 8
//                 },
//                 table: {
//                     margin: [0, 10, 0, 0]
//                 },
//                 headerTable: {
//                     alignment: "center",
//                     bold: true,
//                     fontSize: 10,
//                     color: "#00008F",
                    
//                 }
//             }
//         }
//         pdfMake.createPdf(docDefinitionPrimesGaranties).download("AvenantGaranties_"+contrat?.idContrat);        
//         pdfMake.createPdf(docDefinitionContrat).download("Avenant_"+contrat?.idContrat);
      
//         }else{
//             pdfMake.createPdf(docDefinitionContrat).download("Avenant_"+contrat?.idContrat);
       
//         }

//     }

outputAvenantFlotte(contrat: any, avenant: any, quittance: any, dataParam:any, hisContratPrev:any){
    //console.log('contrat avenat quittance dataparam hiscontratprev', contrat , avenant , quittance  , dataParam  ,  hisContratPrev)
            let risqueListVehicule: any = [];
            let risques: any = [];
            let vehicules: any = [];
            let headersRisque: any = [];
            let risquegarantiesList: any = [];
            let garantiesList: any = [];
            let garanties: any = [];
            let garantiesPrime: any = [];
            let groupeGarantiesList: any = [];
            let groupeGarantiesList2: any = [];
            let groupeGarantiesList3: any = [];
            let valeur0:any;
            let valeur5:any;
            let valeur15:any;
            let valeur25:any;
    
            let risqueAvenant:any = [];
    
            let headersGarantieList = ["Nº ORDRE","Prime_RC", "Prime_DR", "Prime_DTA",  "Prime_DCVV", "Prime_DC","Prime_Vol", "Prime_Vol_Auo_radio","Prime_Incendie",
            "Prime_BDG", "Prime_Assistance", "Prime_PCP", "Prime_Nette"]
    
            avenant?.typeAvenant.code == "A19"?  headersRisque = [ "MARQUE", "IMMATRICULATION", "CHASSIS", "VALEUR_VENALE"]:
            headersRisque = ["Nº ORDRE", "MARQUE", "IMMATRICULATION", "CHASSIS", "VALEUR_VENALE"]
    
    
            let codeValVenale = contrat.risqueList.find( (cd: { codeRisque: string; }) => cd.codeRisque == "P40");
            let valVenale = codeValVenale?.reponse?.valeur;
            ////console.log("je suis le contat de avanatflotte",contrat)
    
    
            let assurePerson = contrat.personnesList?.find((personne: { role: { code: string; }; }) =>
                (personne.role.code === 'CP235' || personne.role.code === 'CP238')
              );        // let assureNom = contrat.personnesList.find(((pers: { personne: { nom: any; }; }) => pers?.personne?.nom))?.personne?.nom
            // ////console.log("assurenom",assureNom)
            // let assurePrenom = contrat.personnesList.find(((pers: { personne: { prenom1: any; }; }) => pers.personne.prenom1)).personne.prenom1
    

    
            //info risque avenant de retrait
            if(avenant?.typeAvenant?.code == "A19" ||avenant?.typeAvenant?.code== "A22" ){
                //console.log('je rentre bien la ',avenant?.risqueList )
                if(contrat?.produit.codeProduit=='45L'){
                    avenant?.risqueList.map((risque: any) => {
                   
                            risqueAvenant.push(risque.idRisque);
                    
                    }); } else{

                  
                avenant?.risqueList.map((risque: any) => {
                    risqueAvenant.push(risque.idRisque);
                })  }
           
                risqueListVehicule = hisContratPrev?.groupesList?.filter((groupe:any) => groupe?.risques)
    //console.log('je susi risque avenat',risqueAvenant)
    //console.log('je susi risqueListVehicule',risqueListVehicule)

    
                hisContratPrev?.groupesList?.filter((groupe:any) => {
                    groupe?.risques?.map((risque: any) =>{
                        if (risqueAvenant.includes(risque?.idRisque)){
                            //console.log('moi jy suis',risque?.idRisque)
                            risques.push(risque)
                        }
    
                    })
                })
    //console.log('hello je suis risque au lieu de vehicule',risqueAvenant,hisContratPrev)
            }else{
                //Get info riques
                avenant?.typeAvenant?.code == "A20"||  avenant?.typeAvenant?.code == "A03"|| avenant?.typeAvenant?.code == "A06" || avenant?.typeAvenant?.code == "A08" ?
                avenant?.risqueList?.map((risque: any) => {
                        contrat?.groupesList?.map((gr: any) => {
                          gr?.risques?.map((rs: any) => {
                            if (risque.idRisque == rs.idRisque) {
                              risques.push(rs);
                            }
                          })
                        })
                })
                :risqueListVehicule = contrat?.groupesList?.filter((groupe:any) => groupe?.risques)
                risqueListVehicule?.forEach((groupe: any) => {
                    if (groupe?.risques) {
                        groupe?.risques?.forEach((risque: any) => {
                            risques.push(risque);
                        });
                    }
                });
            }
    
            let index = 0;
            while (index < risques?.length) {
    //console.log('les rique ni au lieu de vehicule', risques)
                let tmp = {
                   "Nº ORDRE": [
                        { text: risques[index].idRisque+'/'+risques?.length, fontSize: "8" },
                    ],
                    MARQUE: [
                        { text: '', fontSize: "8" },
                    ],
                    IMMATRICULATION: [
                        { text: '', fontSize: "8" },
                    ],
                    CHASSIS : [
                        { text: '', fontSize: "8" },
                    ],
    
                    VALEUR_VENALE : [
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
                            tmp.VALEUR_VENALE[0].text = Number(ele.valeur).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" DZD"
                        break;
                        default:
                        break;
                    }
    
                })
                vehicules.push(tmp);
                index = index + 1;
            }
    
    
            //Get primes/garantie
              //Get info riques
                if(avenant?.typeAvenant?.code == "A19"){
                    risquegarantiesList =  hisContratPrev?.groupesList?.filter((groupe:any) => groupe?.garantieList)
                    risquegarantiesList?.forEach((element: any) => {
                    garantiesList.push(element.garantieList)
    
                    index = 0;
                while (index < garantiesList?.length-1) {
                    garantiesList?.forEach((element: any) => {
                        element.forEach((ele: any) => {
                    garanties.push(ele[index])
                        })
                    })
                    index++;
                }
                })
                }else{
                    risquegarantiesList = contrat?.groupesList?.filter((groupe:any) => groupe?.garantieList)
                    risquegarantiesList?.forEach((element: any) => {
                        garantiesList.push(element.garantieList)
                    })
                }
    
    
                index = 0;
                while (index < garantiesList?.length-1) {
                    garantiesList?.forEach((element: any) => {
                    garanties.push(element[index])
    
                    })
                    index++;
                }
    
    
                index = 0;
                while (index < dataParam?.length) {
    
                    let tmp = {
                       "Nº ORDRE": [
                            { text: dataParam[index].risque+'/'+dataParam?.length, fontSize: "8" },
                        ],
                        Prime_RC: [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_DR: [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_DTA : [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_DCVV : [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_DC : [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_Vol  : [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_Vol_Auo_radio  : [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_Incendie : [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_BDG : [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_Assistance: [
                            { text: '', fontSize: "8" },
                        ],
                        Prime_PCP: [
                            { text: '', fontSize: "8" },
                        ],
    
                        Prime_Nette: [
                            { text: dataParam[index].primeList.find((element:any)=>element.risque== dataParam[index].risque)?.primeProrata.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), fontSize: "8" },
    
                        ],
    
    
                    };
                //console.log(' je suis data param',dataParam)
                    dataParam[index].garantieList?.map((ele: any) => {
                            switch (ele.codeGarantie) {
                                case "G00":
                                    tmp.Prime_RC[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    break;
                                case "G08":
                                    tmp.Prime_DR[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    break;
                                case "G02":
                                    tmp.Prime_DTA[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                break;
                                case "G13":
                                    tmp.Prime_DCVV[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    break;
                                case "G07":
                                    tmp.Prime_DC[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                break;
                                case "G03":
                                    tmp.Prime_Vol[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                break;
                                case "G05":
                                    tmp.Prime_Vol_Auo_radio[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                break;
    
                                case  "G04":
                                    tmp.Prime_Incendie[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                break;
    
                                case "G06":
                                    tmp.Prime_BDG[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                break;
    
                                case  "G11":
                                    tmp.Prime_Assistance[0].text = Number(ele.primeProrata).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                break;
    
                                case "G18" :
    
                                 let pr1 =  dataParam[index].garantieList?.find((element:any)=>element?.codeGarantie=="G17")?.primeProrata
                                 let pr2 =  dataParam[index].garantieList?.find((element:any)=>element?.codeGarantie=="G16")?.primeProrata
                                 let pr3 =  dataParam[index].garantieList?.find((element:any)=>element?.codeGarantie=="G18")?.primeProrata
                                 tmp.Prime_PCP[0].text =(Number(pr1)+Number(pr2)+Number(pr3)).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                break;
    
                                default:
                                break;
                            }
    
    
    
                    })
                    garantiesPrime.push(tmp);
                    index = index + 1;
                }
    
    
    
           if(avenant?.typeAvenant?.code !=  "A06" && avenant?.typeAvenant?.code !=  "A19" )  {
    
            dataParam?.map((garantie:any)=>garantie?.garantieList?.some((param: any) => param?.codeGarantie == "G02"))[0] ?
            groupeGarantiesList = dataParam?.find((garantie:any)=>garantie.garantieList?.find((param: any) => param?.codeGarantie == "G02")).garantieList:groupeGarantiesList= []
    
    
            dataParam?.map((garantie:any)=>garantie?.garantieList?.some((param: any) => param?.codeGarantie == "G13"))[0]?
            groupeGarantiesList2 = dataParam.find((garantie:any)=>garantie.garantieList?.find((param: any) => param?.codeGarantie == "G13")).garantieList:groupeGarantiesList2= []
    
            dataParam?.map((garantie:any)=>garantie?.garantieList?.some((param: any) => param?.codeGarantie == "G07"))[0]?
            groupeGarantiesList3 = dataParam?.find((garantie:any)=>garantie?.garantieList?.find((param: any) => param?.codeGarantie == "G07")).garantieList:groupeGarantiesList2= []
    
    
    
            let assistance =  dataParam?.map((garantie:any)=>garantie?.garantieList?.find((param: any) => param?.codeGarantie == "G11"))
    
    
    
           /////////////
           assistance?.filter((param: any) => param?.codeGarantie == "G11")?.map((garantie:any)=>{
    
           if( garantie?.categorieList?.some((cat: any) => cat?.valeur == "0")){
            valeur0 = true
           }
           if(garantie?.categorieList?.some((cat: any) => cat?.valeur == "5")){
            valeur5 = true
           }
           if(garantie?.categorieList?.some((cat: any) => cat?.valeur == "15")){
            valeur15 = true
           }
           if(garantie?.categorieList?.some((cat: any) => cat?.valeur == "25")){
            valeur25 = true
           }
    
    
           })
           }
    
    
           ////console.log("vehicules",vehicules)
            const docDefinitionContrat: any = {
                watermark:  { text: '', color: 'blue', opacity: 0.1},
                pageMargins: [35, 110, 35, 90],
                border: [false, false, false, false],
                header: function(currentPage: any, pageCount: any) {
                     // Common header for all pages
                    const commonHeader = {
                        text: 'Police N°000 : '+contrat?.idContrat ,
                        style: 'sectionHeader',
                        margin: [0, 30]  ,
                        color: 'black'
                    };
                    // if(currentPage == 1) {
                    //     return {
                    //         stack: [
    
                    //             {
                    //                 text: 'AXA 666' +contrat?.produit?.description.toUpperCase(),
                    //                 style: 'sectionHeader'
                    //             },
                    //             {
                    //                 text:   avenant?.typeAvenant?.libelle,
                    //                 style: 'sectionHeader',
                    //                 color: 'black'
                    //             },
    
    
                    //             {
                    //                 text: 'Police N° : '+contrat?.idContrat ,
                    //                 style: 'sectionHeader',
                    //                 color: 'black'
                    //             },
                    //             {
                    //                 text: 'Avenant N° : '+avenant?.idContratAvenant ,
                    //                 style: 'sectionHeader',
                    //                 color: 'black'
                    //             },
                    //             contrat?.convention != null ?
                    //             {
                    //                 text: 'Convention: ' + contrat?.convention,
                    //                 style: 'sectionHeader',
                    //                 color: 'black'
                    //             } : contrat?.reduction != null ?
                    //             {
                    //                 text: 'Réduction: ' + contrat?.reduction,
                    //                 style: 'sectionHeader',
                    //                 color: 'black'
                    //             } : {},
                    //             { qr: 'https://www.axa.dz/wp-content/uploads/2023/10/Conditions-generales-Assurance-Automobile.pdf', alignment: "right", fit: '65' },
                    //         ],
                    //         margin: [35, 30, 35, 0]
                    //     }
                    // }
                    
                    
                    if (currentPage == 1) {
                        return {
                            stack: [
                                {
                                    columns: [
                                        // Colonne GAUCHE - Infos agence
                                        {
                                            stack: [
                                                {},
                                                { text: 'Agence: ' + avenant?.agence.raisonSocial, alignment: 'left' ,style: 'sectionHeader',
                                                    color: 'black' },
                                                { text: 'Code Agence: ' + avenant?.agence.codeAgence, alignment: 'left',style: 'sectionHeader',
                                                    color: 'black' },
                                                { text: 'Adresse: ' + avenant?.agence.adresse, alignment: 'left' ,style: 'sectionHeader',
                                                    color: 'black'},
                                                { text: 'Téléphone: ' + avenant?.agence.telephone, alignment: 'left',style: 'sectionHeader',
                                                    color: 'black' }
                                            ],
                                            width: '40%', // Ajustez la largeur selon besoin
                                            margin: [0, 0, 20, 0]
                                            // margin: [35, 30, 35, 0]
                                        },
                                        
                                        // Colonne DROITE - Contenu existant
                                        {
                                            stack: [
                                                {
                                                    text: 'AXA ' + contrat?.produit?.description.toUpperCase(),
                                                    style: 'sectionHeader'
                                                },
                                                {
                                                    text: avenant?.typeAvenant?.libelle,
                                                    style: 'sectionHeader',
                                                    color: 'black'
                                                },
                                                {
                                                    text: 'Police N° : ' + contrat?.idContrat,
                                                    style: 'sectionHeader',
                                                    color: 'black'
                                                },
                                                {
                                                    text: 'Avenant N° : ' + avenant?.idContratAvenant,
                                                    style: 'sectionHeader',
                                                    color: 'black'
                                                },
                                                // contrat?.convention != null ? 
                                                // {
                                                //     text: 'Convention: ' + contrat?.convention,
                                                //     style: 'sectionHeader',
                                                //     color: 'black'
                                                // } : contrat?.reduction != null ? 
                                                // {
                                                //     text: 'Réduction: ' + contrat?.reduction,
                                                //     style: 'sectionHeader',
                                                //     color: 'black'
                                                // } : {},
                                                { 
                                                    qr: 'https://www.axa.dz/wp-content/uploads/2023/10/Conditions-generales-Assurance-Automobile.pdf', 
                                                    alignment: "right", 
                                                    fit: '65' 
                                                }
                                            ],
                                            width: '60%' // Ajustez selon besoin
                                        }
                                    ]
                                }
                            ],
                            margin: [35, 30, 35, 0]
                        }
                    }
                    
                    
                    
                    else {
                        // Header for subsequent pages
                        return {
                            stack: [commonHeader],
                            margin: [35, 10, 35, 0]
                        };
                    }
                },
                content: [
                    {
                        text: 'Le présent avenant est établi entre les contractants suivants :',
                        bold: true,
                        color: "black",
                        fontSize: 10,
    
                    },
                    {
                        text: 'D\'une part :  AXA Assurances Algérie Dommage SPA, société de droit algérien inscrite au registre de commerce d’Alger sous le numéro 16/00- 1005172 B 11 au capital de 3.150.000.000,00 de Dinars Algériens, dont le siège social est sis au lotissement 11 décembre 1960 lots 08 et 12, 16030 El Biar Alger',
                        color: "black",
                        fontSize: 10,
    
                    },
                    {
                        text: '\nReprésentée par son directeur général, ayant tous pouvoirs à l’effet des présentes.',
                        color: "black",
                        fontSize: 10,
    
                    },
                    {
                        text: 'Ci-après dénommée « L’Assureur »',
                        color: "black",
                        fontSize: 10,
    
                    },
                    {
                        text: '\nEt\n ',
                        color: "black",
                        fontSize: 10,
    
                    },
                    {
                        text: 'D’autre part, La société :  '+ contrat?.personnesList?.map((peronne:any) => peronne?.personne?.raisonSocial)[0]+', dont le siège est situé à : '+ contrat?.personnesList.map((peronne:any) => peronne?.personne.adressesList[0].description),
                        color: "black",
                        fontSize: 10,
    
                    },
                    {
                        text: '\nReprésentée par son gérant (indiquer la qualité et nom du signataire) . Ayant tous pouvoirs à l’effet des présentes',
                        color: "black",
                        fontSize: 10,
    
                    },
                    {
                        text: '\nCi-après dénommée « L’assuré ». ',
                        color: "black",
                        fontSize: 10,
    
                    },
                    {
    
                        text: `\nREFERENCE DU CONTRAT\n`,
                        bold: true,
                        color: "#00008F",
                        fontSize: 12,
                        alignment: 'justify'
    
                    },
                    {
                        text: '\nN° de Police d’Origine :  '+contrat?.idContrat,
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    },
                    {
                        text:  'N° d’Avenant : '+avenant?.idContratAvenant,
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    },
                    // {
                    //     text: 'Type d’Avenant : '+avenant?.typeAvenant?.libelle+' - Flotte Automobile',
                    //     color: "black",
                    //     bold: true,
                    //     fontSize: 10,
    
                    // },
                    avenant?.typeAvenant?.code !="A22"?
                    {
                        text: 'Date d’expiration :'+contrat?.dateExpiration?.split("T")[0],
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    }:{},
                    {
                        text: 'Date d’effet  :'+avenant?.dateAvenant?.split("T")[0],
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    },
                    // {
                    //     text: 'Date d’expiration  :'+contrat?.dateExpiration?.split("T")[0],
                    //     color: "black",
                    //     bold: true,
                    //     fontSize: 10,
    
                    // },
                    avenant?.typeAvenant?.code =="A22"?{
                        text: 'Date d’expiration avenant:'+avenant?.dateExpirationAvenant,
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    }:{},
    
                    {
    
                        text: `\nARTICLE 1 : OBJECT DE L’AVENANT\n`,
                        bold: true,
                        color: "#00008F",
                        fontSize: 12,
                        alignment: 'justify'
    
                    },
                    {
                        text: "Le présent avenant a pour objet d'incorporer à la flotte automobile déclarée initialement par l'assuré, le véhicule identifié à l'annexe A.",
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    },
                    {
    
                        text: `\nARTICLE 2 : MONTANT DE LA PRIME\n`,
                        bold: true,
                        color: "#00008F",
                        fontSize: 12,
                        alignment: 'justify'
    
                    },
                    {
                        text: "Le détail des primes par garanties en ANNEXE B – Détail des primes et garanties.",
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    },
                    avenant?.typeAvenant?.description!=  "Chengement de formule"?
                    {
                        text: "",
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    }:{},
                    {
                        columns: [
    
                            {
                                style: "table",
                                table: {
    
                                    widths:  ["*","*","*","*","*","*"] ,
                                 
                                    body: [
                                        [
                                            { text: `Prime nette`, style: "headerTable" },
                                            avenant?.typeAvenant?.code == 'A12' || avenant?.typeAvenant?.code=='A168'?
                                                 { text: `Coût de police`, style: "headerTable" } 
                                                : { text: `Frais de gestion`, style: "headerTable" },
                                            { text: `T.V.A`, style: "headerTable" },
                                            { text: `F.G.A`, style: "headerTable" },
                                            { text: `Timbre de dimension`, style: "headerTable" },
                                            { text: `Timbre gradué`, style: "headerTable" }
                                        ],
                                        // Boucle sur chaque risque dans risqueList
                                        ...quittance.risqueList.map((risque: any) => [
                                            { 
                                                text: Number(risque.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata || 0)
                                                    .toFixed(2)
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD", 
                                                fontSize: 8 
                                            },
                                            avenant?.typeAvenant?.code == 'A12' || avenant?.typeAvenant?.code=='A168'?
                                                 { 
                                                    text: quittance.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01') 
                                                        ? Number(quittance.taxeList.find((taxe: any) => taxe.taxe.code == 'T01').primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2 }) + " DZD"
                                                        : "/", 
                                                    alignment: "center", 
                                                    fontSize: 8 
                                                  }
                                                : { 
                                                    text: risque.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08') 
                                                        ? Number(risque.taxeList.find((taxe: any) => taxe.taxe.code == 'T08').primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2 }) + " DZD"
                                                        : "/", 
                                                    alignment: "center", 
                                                    fontSize: 8 
                                                  },
                                            { 
                                                text: Number(risque.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata || 0)
                                                    .toFixed(2)
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD", 
                                                fontSize: 8 
                                            },
                                            { 
                                                text: Number(risque.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.primeProrata || 0)
                                                    .toFixed(2)
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD", 
                                                fontSize: 8 
                                            },
                                            { 
                                                text: Number(risque.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata || 0)
                                                    .toFixed(2)
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD", 
                                                fontSize: 8 
                                            },
                                            { 
                                                text: Number(risque.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.primeProrata || 0)
                                                    .toFixed(2)
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD", 
                                                fontSize: 8 
                                            }
                                        ]),
                                        [
                                            { text: '', colSpan: 4 },
                                            {}, {}, {},
                                            { text: `Prime Totale`, style: "headerTable" },
                                            { 
                                                text: Number(quittance?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata || 0)
                                                    .toFixed(2)
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD", 
                                                fontSize: 8 
                                            }
                                        ]
                                    ],
                                }
                            }
                        ],
                    },
                    {
                        text: `\n`,
                        pageBreak: 'after',
                    },
                    {
    
                        text: `\nARTICLE 3 : DATE D’EFFET DE L’AVENANT\n`,
                        bold: true,
                        color: "#00008F",
                        fontSize: 12,
                        alignment: 'justify'
    
                    },
                    {
                        text: "Le présent avenant prend effet à compter du "+avenant?.dateAvenant?.split("T")[0],
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    },
                    {
    
                        text: `\nARTICLE 4 : DIVERS\n`,
                        bold: true,
                        color: "#00008F",
                        fontSize: 12,
                        alignment: 'justify'
    
                    },
                    {
                        text: "Il n'est rien changé aux autres clauses et conditions de la police citée ci-dessus.",
                        color: "black",
                        bold: true,
                        fontSize: 10,
    
                    },
                    {
    
                        text: `\nARTICLE 5 : DÉCLARATION DE L’ASSURE\n`,
                        bold: true,
                        color: "#00008F",
                        fontSize: 12,
                        alignment: 'justify'
    
                    },
                    {
                        text: "L’assuré  reconnait avoir reçu un exemplaire du présente avenant  et déclare avoir pris connaissance des textes y figurant.\nL’assuré reconnais que le présente avenant a  été établie conformément aux réponses données par l’assuré aux questions posées par la Compagnie lors de la souscription du contrat.\nL’assuré reconnais également avoir été préalablement informé(e) du montant de la prime et des garanties du présent contrat.\nL’assuré reconnais avoir été informé(e), au moment de la collecte d’informations que les conséquences qui pourraient résulter d’une omission ou d’une déclaration inexacte sont celles prévues par l’article 19 de l’ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006.",
                        color: "black",
                        alignment: 'justify',
                        bold: true,
                        fontSize: 10,
    
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
                                            { text: `\nFait en deux exemplaires`, bold: true, fontSize: "8" },
                                        ],
                                        alignment: 'left'
                                    },
                                    {
                                        text: `\nà ${contrat?.agence?.commune} - ${contrat?.agence?.wilaya} Le ${contrat?.auditDate?.split("T")[0]}\n\n`, bold: true, fontSize: "8",
                                        alignment: 'right'
                                    }
                                ]
                            ],
                        },
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
                                            { text: `\nP/L’assuré \n`, bold: true, fontSize: "8" },
                                        ],
                                        alignment: 'left'
                                    },
                                    {
                                        text: `\nP/L’assureur`, bold: true, fontSize: "8",
                                        alignment: 'right',
                                        pageBreak: 'after'
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
    
                                                text: `ANNEXE A - Détail des véhicules assurés`,
                                                style: "headerTable"
                                            },
                                        ],
                                    ],
                                }
                            },
                        ],
                    },
                vehicules.length != 0 ? this.table(vehicules, headersRisque):{},
    
    
                avenant?.typeAvenant?.code== "A06"?
                {
    
                    pageBreak: 'before' ,
                    text:'',
                }:{},
                avenant?.typeAvenant?.code== "A06"?
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
                                            text: `ANNEXE B – Détail des garanties`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                    ],
                }:{},
                avenant?.typeAvenant?.code== "A06"?
                {
    
    
                    text: `\nGaranties Souscrites\n`,
                    bold: true,
                    color: "#00008F",
                    fontSize: 12,
                    alignment: 'justify',
    
                }:{},
                avenant?.typeAvenant?.code== "A06"?
                {
                    columns: [
    
                        {
                            style: "table",
                            table: {
    
                               widths:  ["*","*","*","*"] ,
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
    
                                            text: groupeGarantiesList?.find((param: any) => param?.codeGarantie == "G02")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur?
                                            Number(groupeGarantiesList?.find((param: any) => param?.codeGarantie == "G02")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : "/",
                                            fontSize: "8",
                                        }
                                        ,
    
                                        {
                                            text: "",
                                            fontSize: "8",
                                        },
    
                                    ],
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
    
                                            text:groupeGarantiesList2?.find((param: any) => param?.codeGarantie == "G13")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur?
                                            Number(groupeGarantiesList2?.find((param: any) => param?.codeGarantie == "G13")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
                                            text: groupeGarantiesList3?.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur?
                                            Number(groupeGarantiesList3?.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
                                            text: groupeGarantiesList?.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur?
                                            Number(groupeGarantiesList?.find((param: any) => param?.codeGarantie == "G07")?.categorieList?.find((cat: any) => cat?.code == "C15")?.valeur).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
                }:{},
                avenant?.typeAvenant?.code== "A06"?
                valeur0?
                    {
                            columns: [
                                {
                                    style: "table",
                                    table: {
                                        widths: ["*","*","*","*"],
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
    
    
                        }:{}:{},
                        avenant?.typeAvenant?.code== "A06"?
                        valeur5 ?
                        {
    
                            columns: [
                                {
                                    style: "table",
                                    table: {
                                        widths: ["*","*","*","*"],
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
    
    
                        }:{}:{},
                        avenant?.typeAvenant?.code== "A06"?
                        valeur15 ?
                        {
                            columns: [
                                {
                                    style: "table",
                                    table: {
                                        widths: ["*","*","*","*"],
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
    
    
                        }:{}:{},
                        avenant?.typeAvenant?.code== "A06"?
                        valeur25 ?
                        {
    
                            columns: [
                                {
                                    style: "table",
                                    table: {
                                        widths: ["*","*","*","*"],
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
                        }:{}:{},
    
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
    
                    },
                }
            }
            if(avenant?.typeAvenant?.code != "A19" && avenant?.typeAvenant?.code!=  "A04"
            && avenant?.typeAvenant?.code!=  "A08"){//avenant?.typeAvenant?.code != "A19" && demande khaled
            const docDefinitionPrimesGaranties: any = {
                watermark:  { text: '', color: 'blue', opacity: 0.1},
                pageMargins: [35, 110, 35, 90],
                border: [false, false, false, false],
                pageOrientation: 'landscape',
                header: function(currentPage: any, pageCount: any) {
    
                    const commonHeader =[{
                        text: 'Police N° : '+contrat?.idContrat ,
                        style: 'sectionHeader',
                        color: 'black'
                    },
                    {
                        text: 'Avenant N° : '+avenant?.idContratAvenant ,
                        style: 'sectionHeader',
                        color: 'black'
                    },
                    ];
    
                    if(currentPage == 1) {
    
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
                    {text : '\n'},
                    garantiesPrime.length != 0 ? this.table(garantiesPrime, headersGarantieList):{},
                ]   ,
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
            avenant?.typeAvenant?.code !== "A22"? pdfMake.createPdf(docDefinitionPrimesGaranties).download("AvenantGaranties_"+contrat?.idContrat)  : true
            pdfMake.createPdf(docDefinitionContrat).download("Avenant_"+contrat?.idContrat);
    
            }else{
                pdfMake.createPdf(docDefinitionContrat).download("Avenant_"+contrat?.idContrat);
    
            }
    
        }
    outputAvenantLeasing(contrat: any,quittance: any, dataParam:any , avenant: any){   
    
        let risqueListVehicule: any = []
        let risques: any = []
        let headersGarantie = ["Garantie(s)",  "Primes"]        
        
            // if( contrat && contrat.groupeList !== undefined && contrat.groupeList !== null){
            //     risqueListVehicule = contrat?.groupeList.filter((groupe:any) => groupe?.garantieList)  
            // }else{
            //     risqueListVehicule = contrat?.groupesList.filter((groupe:any) => groupe?.garantieList) 
            // }  
            // risqueListVehicule?.forEach((groupe: any) => {               
            //     if (groupe?.risques) {                   
            //         groupe.risques.forEach((risque: any) => {                       
            //             risques.push(risque);
            //         });
            //     }
            // });          
// ////console.log('jr duid lavenant',avenant)

            if( contrat && contrat.groupeList !== undefined && contrat.groupeList !== null){
                risqueListVehicule = avenant?.risqueList.filter((rs:any) => rs?.risque)
            }else{
                risqueListVehicule = avenant?.risqueList.filter((rs:any) => rs?.risque)
            }
            risqueListVehicule?.forEach((groupe: any) => {
                risques.push(groupe);
               
            });
            
            const docDefinitionContrat: any = {
                watermark:  { text: '', color: 'blue', opacity: 0.1},
                pageMargins: [35, 110, 35, 90],
                border: [false, false, false, false],
                header: function(currentPage: any, pageCount: any) {   
                     // Common header for all pages
                    const commonHeader = {
                        text: 'Police N° : '+contrat?.idContrat ,
                        style: 'sectionHeader',  
                        margin: [0, 30]  ,         
                        color: 'black'
                    };
                    if(currentPage == 1) {
                        return { 
                            stack: [
                              
                                {                            
                                    text: 'AXA ' + contrat?.produit?.description.toUpperCase(),
                                    style: 'sectionHeader'
                                },
                               
                                {
                                    text: 'Police N° : '+contrat?.idContrat ,
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
                                widths: ["*","*"],
                                alignment: "left",
                                body: [
        
                                       
                                    [
                                        {
                                            text: `Client : `,
                                            fontSize: "8",
                                            color: 'black',
                                        },
                                        {
                                            text: contrat?.personnesList.map((peronne:any) => peronne?.personne.raisonSocial)[0],
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
                                            text: risq?.risque.find((risque:any) => risque.colonne=="Nom & Prénom Crédit Preneur/Raison Social")?.valeur ,
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
                                            text: risq?.risque.find((risque:any) => risque.colonne=="Adresse Crédit Preneur")?.valeur,
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
                                        // {
                                        //     text: avenant?.date?.split("T")[0],
                                        //     fontSize: "8",
                                        //     color: 'black',
                                           
                                        // },
                                        {
                                            text: avenant?.dateAvenant?.split("T")[0],
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
                                            text: contrat?.dateExpiration?.split("T")[0] ,
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
                                            // text: contrat?.agence?.codeAgence+" "+contrat?.agence?.raisonSocial,
                                            text:risq?.risque.find((risque:any) => risque.colonne=="Code Agence")?.valeur ,
                                            fontSize: "8",
                                            color: 'black',
                                           
                                        },
                                    ],
                                    [
                                        {
                                            text: `Contrat N° : `,
                                            fontSize: "8",
                                            color: 'black',
                                        },
                                        {
                                            text: risq?.risque.find((risque:any) => risque.colonne=="Numero de contrat")?.valeur,
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
                                            text: risq?.risque.find((risque:any) => risque.colonne=="Numéro de Matériel")?.valeur,
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
                                widths: ["*","*"],
                                alignment: "left",
                                body: [
        
                                       
                                    [
                                        {
                                            text: `Marque  : `,
                                            fontSize: "8",
                                            color: 'black',
                                        },
                                        {
                                            text: risq?.risque.find((risque:any) => risque.colonne=="Marque")?.valeur,
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
                                            text: risq?.risque.find((risque:any) => risque.colonne=="Modèle")?.valeur,
                                            fontSize: "8",
                                            color: 'black',
                                        },
                                    ],
                                    [
                                        {
                                            text: `classe de véhicule  : `,
                                            fontSize: "8",
                                            color: 'black',
                                        },
                                        {
                                            text: risq?.risque.find((risque:any) => risque.colonne=="classe de vehicule")?.valeur,
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
                                            text: risq?.risque.find((risque:any) => risque.colonne=="Genre Véhicule")?.valeur,
                                            fontSize: "8",
                                            color: 'black',
                                        },
                                    ],
                                    // [
                                    //     {
                                    //         text: `Genre  : `,
                                    //         fontSize: "8",
                                    //         color: 'black',
                                    //     },
                                    //     {
                                    //         text: risq?.risque.find((risque:any) => risque.colonne=="Genre Véhicule")?.valeur,
                                    //         fontSize: "8",
                                    //         color: 'black',
                                    //     },
                                    // ],
                                    [
                                        {
                                            text: `Immatriculation  : `,
                                            fontSize: "8",
                                            color: 'black',
                                        },
                                        {
                                            text: risq?.risque.find((risque:any) => risque.colonne=="N° d'Immatriculation")?.valeur,
                                            fontSize: "8",
                                            color: 'black',
                                        },
                                    ],
                               
                                
                                
                                
                                
                                
                                ///addd 


                                [
                                    {
                                        text: ` La valeur vénale du véhicule  : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque:any) => risque.colonne=="Valeur Assuré")?.valeur,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                ],

                                [
                                    {
                                        text: `  Le châssis du véhicule : `,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                    {
                                        text: risq?.risque.find((risque:any) => risque.colonne=="Châssis ")?.valeur,
                                        fontSize: "8",
                                        color: 'black',
                                    },
                                ],



                                ///finn add
                                
                                
                                
                                
                                
                                
                                
                                
                                
                                
                                
                                
                                
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
                                widths: ["*","*"],

                                // body: [headersGarantie].concat(
                                  

                                //     dataParam?.find((element: any)=>element.risque == risq?.idRisque)?.garantieList.map((item:any) => {
                                //         let garantie :any;
                                //        let prime :any=[];

                                 
                                //        prime=  item.primeProrata
                                //     prime=  item.prime

                                //         return [
                                //             {text:garantie , fontSize: "8"},
                                //             {text:Number(prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD"   , fontSize: "8"},
                                //         ]
                                //     }),
                                // ),

                                body: [headersGarantie].concat(
                                    //param.finde state before this
                                    quittance?.risqueList?.find((element: any)=>element.risque == risq?.idRisque)?.garantieList?.map((item:any) => {

                                        let garantie :any;
                                       let prime :any=[];

                                       garantie=  item.description
                                       prime=  item.primeProrata

                                        return [
                                            {text:garantie , fontSize: "8"},
                                            {text:Number(prime).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD"   , fontSize: "8"},
                                        ]
                                    }),
                                ),
                             
                                
                            }
                        },
                     
                         
                        {
                            columns: [
                               
                                {
                                    style: "table",
                                    table: {
                                        
                                        widths:  ["*","*","*","*","*","*"] ,
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
                                            // [
                                            //     {
                                            //         text: Number(quittance?.risqueList.find((el:any)=>el.risque==risq.idRisque).primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD555",
                                            //         fontSize: 10
                                            //     },
                                            //     contrat?.idHistorique == undefined ?
                                            //     {
                                            //         text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            //         fontSize: 10
                                            //     }
                                            //     :{
                                            //         text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            //         fontSize: 10
                                            //     },
                                            //     {
                                            //         text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            //         fontSize: 10
                                            //     },                                      
                                            //     {
                                            //         text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            //         fontSize: 10
                                            //     },
                                            //     {
                                            //         text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            //         fontSize: 10
                                            //     },
                                              
                                            //     {
                                            //         text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                            //         fontSize: 10
                                            //     },
                                            // ],
                                            [
                                                //

                                                {
                                                    text: Number(quittance?.risqueList?.find((el:any)=>el.risque==risq.idRisque)?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.primeProrata)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                                    fontSize: 10
                                                },
                                                contrat?.idHistorique == undefined ?
                                                {
                                                    text: Number(quittance?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                                    fontSize: 10
                                                }
                                                :{
                                                    text: Number(quittance?.risqueList?.find((el:any)=>el.risque==risq.idRisque)?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T08')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                                    fontSize: 10
                                                },
                                                {
                                                    text: Number(quittance?.risqueList?.find((el:any)=>el.risque==risq.idRisque)?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                                    fontSize: 10
                                                },
                                                {
                                                    text: Number(quittance?.risqueList?.find((el:any)=>el.risque==risq.idRisque)?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                                    fontSize: 10
                                                },
                                                {
                                                    text: Number(quittance?.risqueList?.find((el:any)=>el.risque==risq.idRisque)?.taxeList?.find((taxe: any) => taxe?.taxe?.code =='T03')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                                    fontSize: 10
                                                },

                                                {
                                                    text: Number(quittance?.risqueList?.find((el:any)=>el.risque==risq.idRisque)?.taxeList?.find((taxe: any) => taxe?.taxe?.code =='T02')?.primeProrata).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })+" DZD",
                                                    fontSize: 10
                                                },
                                            ],
                                            [
                                                {text: '',colSpan: 4},
                                                {},
                                                {},
                                                {},
                                                {
                                                    text: `Prime Totale`,
                                                    style: "headerTable",
                                                },
                                                {
                                                    text: Number(quittance?.risqueList?.find((el:any)=>el.risque==risq.idRisque)?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.primeProrata).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+".DZD",
                                                    fontSize: 10
                                                },
                                            ],
                                        ],
                                    }
                                }
                            ],
                        },
                        
                    ],
                    // pageBreak: risques.length != 0  ? 'before' : undefined // Plus propre pour la lisibilité

                    pageBreak: risques.length > 1 ? 'after' : undefined 
        
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
            pdfMake.createPdf(docDefinitionContrat).download("CP_"+contrat?.idContrat);
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

    private handleEroor(error: Error, errorValue: any) {
        return of(errorValue);
    }

}
