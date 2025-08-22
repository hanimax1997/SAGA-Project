import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Constants } from '../config/constants';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as moment from 'moment';
import { GenericService } from 'src/app/core/services/generic.service';

const today = moment(new Date()).format('DD-MM-YYYY')

@Injectable({
    providedIn: 'root'
})


export class DevisService {

    valas: number;
    valtot: number;

    constructor(private http: HttpClient,private genericService: GenericService) { }

    getAllDevis() {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_DEVIS_GET_ALL}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    getDevisByCodeProduit(idProduit: any,size:any,index:any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_DEVIS_BY_PRODUIT}/${idProduit}?pageNumber=${index}&pageSize=${size}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    
    getDevisById(idDevis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_DEVIS}/${idDevis}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    createDevis(devis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_DEVIS}`, devis, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    remplissageDevis(devis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_TARIF_REMPLISSAGE}`, devis, httpOption).pipe(
            tap((response) => response),
            catchError((error) => throwError(error.error))
        );
    }
    filtresDevis(filterObject: any,index:number,size:number) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.http.post<any[]>(`${Constants.API_ENDPOINT_DEVIS_FILTER}?pageNumber=${index}&pageSize=${size}`, filterObject, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    filtresDevis1(filterObject: any,index:number,size:number) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.http.post<any[]>(`${Constants.API_ENDPOINT_DEVIS_FILTER}?pageNumber=${index}&pageSize=${size}`, filterObject, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    paramFichier(codeProduit: any) {

        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'skip': ''
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_CONTROLE}/${codeProduit}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    

}


    controleDevis(paramRisque: any, codeDevis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'skip': ''
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_CONTROLE}/${codeDevis}`, paramRisque, httpOption).pipe(
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
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_TARIF}`, devis, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    generateDecote(devis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<any[]>(`${Constants.API_ENDPOINT_DECOTE}`, devis, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getParamDevisByIdRisque(idDevis: any, idGroupe: any, idRisque: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_DEVIS}/${idDevis}/groupe/${idGroupe}/risque/${idRisque}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getPackByGroupe(idGroupe: any, idDevis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_DEVIS}/${idDevis}/groupe/${idGroupe}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }
    getPackIdRisque(idDevis: any, idRisque: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_DEVIS}/${idDevis}/risque/${idRisque}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }


    gavRows(responses: any[], garantieIndex: number, title: string)  {
        return [
            { text: title, fontSize: "8" },
            ...responses.map((response: any) => ({
                table: {
                    widths: ['*', '*'], // 2 columns in the nested table
                    body: [
                        [
                            { text: 'Franchise', fontSize: "6",alignment: "center" },
                            {
                                text: garantieIndex==1? "15%": response.garantie?.[garantieIndex]?.categorieList?.find((el: any) => el.description === "franchise")?.valeur || '/',
                                fontSize: "6",
                                alignment: "center"
                            }
                        ],
                        [
                            { text: 'Capital', fontSize: "6",alignment: "center" },
                            {
                                text: response.garantie?.[garantieIndex]?.categorieList?.find((el: any) => el.description === "plafond")?.valeur || '/',
                                fontSize: "6",
                                alignment: "center"
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: (i: number, node: any) => {
                        // Remove top and bottom outer border
                        return i === 0 || i === node.table.body.length ? 0 : 0.5;
                    },
                    vLineWidth: (i: number, node: any) => {
                        // Remove left and right outer border
                        return i === 0 || i === node.table.widths.length ? 0 : 0.5;
                    },
                    hLineColor: () => 'black',
                    vLineColor: () => 'black'
                },
                margin: [0, 0, 0, 0]
            }))
        ];
    };
    outputGarantieFlotte(params:any,idDevis:string){
        const headersGarantie= [
            "N ordre",
            "Responsabilité Civile",
            "Dommage Tout Accident (DTA)",
            "Vol",
            "Incendie ",
            "Vol Auto-Radio",
            "Bris de glace",
            "Dommage Collision",
            "Défense et recours",
            "Assistance",
            "Dommage Collision Valeur Vénale",
            "Décès IAD",
            "Incapacité Partielle Permanente",
            "Frais Médicaux",
            "Prime nette"
        ]
        let pourcentage = 100 / headersGarantie?.length;
        let width: any = []
        headersGarantie.map(() => {
            width.push(pourcentage + "%")
        })

        const tableBody: any[] = [];

            tableBody.push(headersGarantie.map((garantie: any) => ({
                text: garantie || '-',
                style: 'tableHeader',      
                alignment: 'center',
                fontSize: 8,
                bold: true
            })));
        headersGarantie.pop()   
        params.map((el:any)=>{
            tableBody.push(headersGarantie?.slice(1)?.map((garantie: any) => ({
                text: el.garantieList?.find((gar:any)=>gar.description==garantie)?.prime ? Number(el.garantieList?.find((gar:any)=>gar.description==garantie)?.prime)?.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })  : '-',
                style: 'tableCell',
                fontSize: 8,
                alignment: 'center'
            })));
        })
        for (let index = 0; index < tableBody.length; index++) {
            if(index != 0){
                tableBody[index].unshift({
                    text: params[index-1]?.idRisque || '-',
                    style: 'tableCell',
                    fontSize: 8,
                    alignment: 'center'
                })
                tableBody[index].push({
                    text:Number(params[index-1]?.primeList?.find((prime:any)=>prime?.typePrime?.code=="CP101").prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" ,
                    style: 'tableCell',
                    fontSize: 8,
                    alignment: 'center'
                })
            }
            
        }
        console.log("tbody",tableBody)
           
        const docDefinitionPrimesGaranties: any = {
            watermark: { text: '', color: 'blue', opacity: 0.1 },
            pageMargins: [35, 110, 35, 90],
            border: [false, false, false, false],
            pageOrientation: 'landscape',
            header: function (currentPage: any, pageCount: any) {
                // Common header for all pages
                const commonHeader = {
                    text: 'Devis N° : '+idDevis,
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
                {
                    table: {
                        headerRows: 1,
                        widths: width ,
                        body: tableBody
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

        pdfMake.createPdf(docDefinitionPrimesGaranties).download("Devis_Garanties");
    }

    getDetailsPrime(idDevis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_DEVIS}/${idDevis}/details-prime`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    


    //generate devis pdf
    generatePdf(devis: any) {  

        let index = 0;
        let risque: any = [];
        let garanties: any = [];
        let primes: any = [];
        let champs: any = ["Garanties"];
        let primeChamps: any = [];
        let widthChamp: any = [];
        let widthChampPrime: any = [];
        let dateNaissance: string = "";
        let categoriePermis: string = "";
        let dateObtentionPermis: string = "";
        let risqueList: any = [];
        let risqueListConducteur: any = [];
        let valeurVenale: any = 0
        let zone:string="";
        let dateDebut = moment(devis.risqueList.find((risk:any)=>risk.codeRisque==="P211")?.reponse?.valeur).format('DD/MM/YYYY');
        let dateRetour = moment(devis.risqueList.find((risk:any)=>risk.codeRisque==="P212")?.reponse?.valeur).format('DD/MM/YYYY');;
        let destination = devis.risqueList.find((risk:any)=>risk.codeRisque==="P182")?.reponse?.description;
        let duree=0;
        let primeGestion = Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        let droitTimbre = Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        let primeTotal = Number(devis?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        let primeNette = Number(devis?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        let pack= devis?.pack?.description
        let risquesRows=[]
        let widthTableAssures=devis.produit.codeProduit ==="20G"?["*","*","*","*","*"]:["*","*","*","*"]
        let bodyTableAssure :any[]=[]
        let garantis=[];
        let packRowsGav= [{text:"Garanties", style: 'headerTable'}]
        let widthspackRowsGav=["*"]
        let gavGarantieTable :any[]=[]
        let isScolaire:boolean=false





        if(devis?.produit?.codeProduit=='97'){
            if(devis.sousProduit.code=="CTH"){
        
            const    valas= devis?.risqueList.find((risque: { codeRisque: string; }) => risque.codeRisque === "P152");
            this.valas= valas.reponse.valeur*0.8
        console.log('je suis la valeur assure', this.valas)
    }
        if(devis.sousProduit.code =="CTI"){
            const    valas= devis?.risqueList.find((risque: { codeRisque: string; }) => risque.codeRisque === "P270");
        this.valtot= valas.reponse.valeur*0.5

}}

        const isDevisVoyage = devis.produit.codeProduit ==="20A"

        console.log("devised",devis);
         if (isDevisVoyage ||devis.produit.codeProduit ==="20G"){

        if(devis.produit.codeProduit ==="20G"){

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

        if (dateDebut && dateRetour) {
            const startDate = moment(dateDebut, 'DD/MM/YYYY');
            const endDate = moment(dateRetour, 'DD/MM/YYYY').add(1,"day");
            duree = endDate.diff(startDate, 'days');
        }

         

        switch (devis?.pack?.codePack) {
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

        if(devis.produit.codeProduit ==="20G"){
            devis?.groupes.forEach((el:any) => {

                packRowsGav.push({text:el.pack.description, style: 'headerTable'})

                widthspackRowsGav.push("*")

                if(el.pack.codePack=="G03"){

                    isScolaire=true               

                } else {
                    console.log("devis.gavGarantieTable ", devis.gavGarantieTable);
                    devis.gavGarantieTable = devis.gavGarantieTable.filter((item: any) => 
                        item[0].text !== "Bris de lunettes en cas d’accident" && 
                        item[0].text !== "Prothèse dentaire en cas d’accident"
                    );
                }

            });

            devis.gavGarantieTable.unshift(packRowsGav)


            risquesRows = devis?.groupes?.flatMap((groupe: any) =>

                groupe?.risques?.map((risque: any) => [
                  { text: risque?.idRisque, fontSize: "8", alignment: "center" },
                  { 
                    text: (risque?.risque[0]?.valeur || '') + " " + (risque?.risque[1]?.valeur || ''), 
                    fontSize: "8", 
                    alignment: "center" 

                  },
                  { 
                    text: moment(risque?.risque[2]?.valeur).format('DD/MM/YYYY') || '', 
                    fontSize: "8", 
                    alignment: "center" 

                  },
                  { 
                    text: groupe.pack.description, 
                    fontSize: "8", 
                    alignment: "center" 
                  },
                  { 
                    text: devis?.primeListRisques?.find((rsq: any) => rsq.id === risque?.idRisque)?.prime || '', 
                    fontSize: "8", 
                    alignment: "center" 
                  }
                ])
              ) || [];
              console.log("risqrow",risquesRows)

        }else{

            risquesRows = devis?.groupes[0]?.risques?.map((risque: any) => [
                { text: risque?.idRisque, fontSize: "8",alignment:"center" },
                { text: (risque?.risque[0]?.valeur || '') + " " + (risque?.risque[1]?.valeur || ''), fontSize: "8",alignment:"center" },
                { text: moment(risque?.risque[2]?.valeur).format('DD/MM/YYYY') || '', fontSize: "8",alignment:"center" },
                { text: devis?.primeListRisques?.find((rsq:any)=>rsq.id ===risque?.idRisque).prime, fontSize: "8",alignment:"center" }
            ]) || [];

        }
         garantis = devis?.paramDevisList.map((garantie:any,idx:number)=>[
            {text:garantie.description,fontSize:"8"},
            {text:idx!==1?"-":"15%",alignment:"center",fontSize:"8"},
            {text:idx===2?"Voir conditions au verso":`${devis.garantiePlafond[garantie.description]} DZD`,alignment:"center",fontSize:"8"}
        ])||[];

    }
        risqueList = devis?.risqueList?.filter((risque: any) => risque?.categorieParamRisque != "Conducteur")
        
        

        


        function reorderRisqueList(risqueList:any, codesRisqueRecherche:any) {
                
            const matchingItems = risqueList
              .filter((item:any) => codesRisqueRecherche.includes(item.codeRisque))
              .sort((a:any, b:any) => codesRisqueRecherche.indexOf(a.codeRisque) - codesRisqueRecherche.indexOf(b.codeRisque));
          
              
            const remainingItems = risqueList.filter((item:any) => !codesRisqueRecherche.includes(item.codeRisque));
          
            
            return [...matchingItems, ...remainingItems];
        }
          

        switch (devis.produit.codeProduit) {
            case "97" :{

        const indexSMPToRemove = risqueList?.findIndex((risque:any) => risque?.codeRisque === "P245");

        if (indexSMPToRemove !== -1) {
        // Remove the found object at the found index
        risqueList.splice(indexSMPToRemove, 1);
        console.log('new rsiquelist',risqueList)
        }

                  const codesRisqueRecherche = ["P222", "P264", "P263", "P223", "P224", "P318"];
                  risqueList = reorderRisqueList(risqueList, codesRisqueRecherche);

                  break;
            }

            default:
                break;

        }
   
        valeurVenale = devis?.risqueList?.find((risque: any) => risque?.codeRisque == "P40")?.reponse?.valeur
        

        console.log('je cherceh smp',devis?.risqueList?.find((risque: any) => risque?.codeRisque == "P245"))


        while ((index < risqueList?.length )) {
           
            risque.push({
                text1: [
                    { text: risqueList[index].libelle + ": ", bold: true, fontSize: "8" },
                    { text: risqueList[index].typeChamp?.description == "Liste of values" ? risqueList[index].reponse?.idParamReponse?.description : risqueList[index].typeChamp?.description == "From Table" ? risqueList[index].reponse?.description : risqueList[index].reponse?.valeur, fontSize: "8" },
                ],
                text2: [
                    { text: risqueList[index + 1] ? risqueList[index + 1].libelle + ": " : "", bold: true, fontSize: "8" },
                    { text: risqueList[index + 1] ? risqueList[index + 1].typeChamp?.description == "Liste of values" ? risqueList[index + 1].reponse?.idParamReponse?.description : risqueList[index + 1].typeChamp?.description == "From Table" ? risqueList[index + 1].reponse?.description : risqueList[index + 1].reponse?.valeur : "", fontSize: "8" },
                ]
            })
            index = index + 2;
       }

        index = 0;
        while (index < risqueListConducteur?.length) {
            switch (risqueListConducteur[index].libelle) {
                case "Date obtention permis":
                    dateObtentionPermis = risqueListConducteur[index].reponse?.valeur.split("T")[0]
                    break;
                case "Date de Naissance":
                    dateNaissance = risqueListConducteur[index].reponse?.valeur.split("T")[0]
                    break;
                case "Categorie Permis":
                    categoriePermis = risqueListConducteur[index].reponse?.valeur
                    break;

                default:
                    break;
            }
            index = index + 1;
        }

        index = 0;
        while (index < devis?.paramDevisList?.length) {
            if((devis?.paramDevisList[index].prime && devis?.paramDevisList[index].prime != "0") || devis?.produit?.codeProduit != "95")
            {
                devis?.paramDevisList[index].categorieList?.map((element: any) => {
                    champs.push(element?.description)
                });
            }

            index++;
        }
        champs = champs.filter((x: any, i: any) => champs.indexOf(x) === i);
        champs.push("Primes")

        champs.map((champ: string) => {
            widthChamp.push("*")
        })

        index = 0;
        while (index < devis?.paramDevisList?.length) {
            if((devis?.paramDevisList[index].prime && devis?.paramDevisList[index].prime != "0") || devis?.produit?.codeProduit != "95")
            {
                let tmp : any
                
                if (devis.produit.codeProduit!='97' )
                    {
                        tmp = {
                            Garanties: [
                                { text: devis?.paramDevisList[index].description, fontSize: "8" },
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
                            "Primes": [
                                { text: Number(devis?.paramDevisList[index].prime).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+ " DZD", fontSize: "8" },
                            ],
                        };}
                devis?.paramDevisList[index].categorieList?.map((cat: any) => {
                    switch (cat.description) {
                        case "plafond":
                            if (cat.valeur == '0') { cat.valeur = valeurVenale }
                            tmp.plafond[0].text = Number(cat.valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            break;
    
                        case "formule":
                            tmp.formule[0].text = Number(cat.valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            break;
    
                        case "franchise":
                            tmp.franchise[0].text = Number(cat.valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            break;
    
                        default:
                            break;
                    }
                })
    
                garanties.push(tmp);
    
            }
            index++;
          
        }

        index = 0;
        while (index < devis?.primeList?.length) {
            if (devis?.primeList[index].typePrime?.code == "CP101") {
                primeChamps.push(devis?.primeList[index].typePrime?.description)
                primes.push(Number(devis?.primeList[index].prime).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
            }

            index++;
        }

        index = 0;
        while (index < devis?.primeList?.length) {
            if (devis?.primeList[index].typePrime?.code != "CP186" && devis?.primeList[index].typePrime?.code != "CP101") {
                if((devis?.primeList[index].typePrime?.code != "CP102" && devis?.primeList[index].typePrime?.code != "CP103" && devis?.primeList[index].typePrime?.code != "CP104" && devis?.primeList[index].typePrime?.code != "CP105") || devis?.produit?.codeProduit != '95')
                {   

                    primeChamps.push(devis?.primeList[index].typePrime?.description)
                    primes.push(devis?.primeList[index].prime?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                }
            }

            index++;
        }

        index = 0;
        while (index < devis?.taxeList?.length) {
            primeChamps.push(devis?.taxeList[index].taxe?.description)
            primes.push(Number(devis?.taxeList[index].prime).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

            index++;
        }

        index = 0;
        while (index < devis?.primeList?.length) {
            if (devis?.primeList[index].typePrime?.code == "CP186") {
                primeChamps.push(devis?.primeList[index].typePrime?.description)
                primes.push(Number(devis?.primeList[index].prime).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
            }

            index++;
        }

        primeChamps.map((champ: string) => {
            widthChampPrime.push("*")
        })

        const docDefinition: any = {
            watermark: { text: 'DEVIS', color: 'blue', opacity: 0.1 },
            pageMargins: [35, 30, 35, 120],
           
            border: [false, false, false, false],
            content: [
             
                devis?.produit.codeProduit == "96"?
                {                            
                    text: 'AXA  MultiRisque Habitation' ,
                    style: 'sectionHeader'
                }
                 :
                {                            
                    text: 'AXA ' + devis?.produit?.description.toUpperCase(),
                    style: 'sectionHeader'
                },


                (devis?.produit?.codeProduit=='97' && devis.sousProduit.code=="CTI")?
                                {                            
                                    text: 'Bien commerecial et industriel' ,
                                    style: 'sectionHeader'
                                }
                                 :
                                 (devis?.produit?.codeProduit=='97' && devis.sousProduit.code=="CTH")?
                                 {                            
                                     text: 'Bien immobilier' ,
                                     style: 'sectionHeader'
                                 }:{},







                {
                    text: 'Devis',
                    style: 'sectionHeader',
                    color: 'black'
                },
                {
                    text: isDevisVoyage || devis.produit.codeProduit=="20G" ?"":devis?.pack?.description,
                    style: 'sectionHeader',
                    color: 'black'
                },
                devis?.convention != null?
                {
                    text: 'Convention: '+devis?.reduction.convention?.nomConvention,
                    style: 'sectionHeader',
                    color: 'black'
                }:
                devis?.reduction != null?
                {
                    text: 'Réduction: ' +devis?.reduction?.nomReduction,
                    style: 'sectionHeader',
                    color: 'black'
                }:{},
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
                                            text: `Référence `,
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
                                                { text: devis?.agence?.codeAgence + " " + devis?.agence?.raisonSocial, fontSize: "8" },
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
                                                { text: `Devis N° : `, bold: true, fontSize: "8" },
                                                { text: devis?.idDevis, fontSize: "8" },
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
                                                { text: devis?.agence?.adresse, fontSize: "8" },
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
                                                { text: `Date devis : `, bold: true, fontSize: "8" },
                                                { text: devis?.auditDate.split("T")[0], fontSize: "8" },
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
                                                { text: "0"+devis?.agence?.telephone, fontSize: "8" },
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
                                                { text: `Date expiration devis : `, bold: true, fontSize: "8" },
                                                { text: devis?.dateExpiration, fontSize: "8" },
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
                                                { text: devis?.agence?.email, fontSize: "8" },
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
                                                { text: `Ce présent devis est valide 30 jours`, bold: true, fontSize: "8" },
                                                // { text: devis?.duree?.description, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        }
                    ],
                },
                {
                    columns:isDevisVoyage || devis.produit.codeProduit=="20G" ? [
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
                       
                    ] : [
                        {
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `Assuré(e)`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
                        },
                        risqueListConducteur?.length != 0 ?
                            {
                                style: "table",
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: `Conducteur`,
                                                style: "headerTable"
                                            },
                                        ],
                                    ],
                                },
                            } : {},
                    ],
                },
                {
                    columns: isDevisVoyage || devis.produit.codeProduit=="20G" ?[
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: devis?.typeClient?.description == "personne morale" ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                { text: devis?.typeClient?.description == "personne morale" ? devis?.raisonSocial : devis?.nom + " " + devis?.prenom, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        
                    ]:[
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: devis?.typeClient?.description == "personne morale" ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                { text: devis?.typeClient?.description == "personne morale" ? devis?.raisonSocial : devis?.nom + " " + devis?.prenom, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        risqueListConducteur?.length != 0 ?
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Date de naissance : `, bold: true, fontSize: "8" },
                                                    { text: dateNaissance, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            } : {}
                    ],
                },
                {
                    columns: isDevisVoyage || devis.produit.codeProduit=="20G" ?
                    [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Téléphone : `, bold: true, fontSize: "8" },
                                                { text: "0" + devis?.telephone, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        
                    ]
                    :[
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `E-mail : `, bold: true, fontSize: "8" },
                                                { text: devis?.email, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        risqueListConducteur?.length != 0 ?
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Categorie du permis : `, bold: true, fontSize: "8" },
                                                    { text: categoriePermis, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            } : {}
                    ],
                },
                {
                    columns: isDevisVoyage || devis.produit.codeProduit=="20G" ?
                    [
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `E-mail : `, bold: true, fontSize: "8" },
                                                { text: devis?.email, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        
                    ]
                    :[
                        {
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: [
                                                { text: `Téléphone : `, bold: true, fontSize: "8" },
                                                { text: "0"+devis?.telephone, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        risqueListConducteur?.length != 0 ?
                            {
                                table: {
                                    widths: ["*"],
                                    alignment: "right",
                                    body: [
                                        [
                                            {
                                                text: [
                                                    { text: `Date d'obtention du permis : `, bold: true, fontSize: "8" },
                                                    { text: dateObtentionPermis, fontSize: "8" },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            } : {}
                    ],
                },
                isDevisVoyage || devis.produit.codeProduit=="20G" ?
                [{
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
                      widths:widthTableAssures, 
                      body: [
                        bodyTableAssure,
                         ...risquesRows, 
                      ]
                    }
                  },]
                :[{
                    style: "table",
                    table: {
                        widths: ["*"],
                        alignment: "right",
                        body: [
                            [
                                {
                                   // text: risqueList[0].categorieParamRisque,
                                    text:'Caractéristiques du risque assuré',
                                    style: "headerTable"
                                },
                            ],
                        ],
                    },
                },
                this.table(risque, ['text1', 'text2'])],
                { text: "\n" },
                isDevisVoyage?{
                    table: {
                        widths: ['*', '*'], 
                        body: [
                          [
                            { text: 'Informations du voyage', style: 'headerTable', colSpan: 2, alignment: 'center' },
                            ''
                          ], // Header row
                          [
                            { text: `Formule : ${pack}`,fontSize:"8"  },
                            { text: `Durée : ${duree} Jour(s)`,fontSize:"8" }
                          ], // Row 1
                          [
                            { text: `Zone : ${zone}`,fontSize:"8"  },
                            { text: `Date d'effet : ${dateDebut}`,fontSize:"8" }
                          ], // Row 2
                          [
                            { text: `Pays destination : ${destination}`,fontSize:"8"},
                            { text: `Date d'échéance : ${dateRetour}`,fontSize:"8" }
                          ], // Row 3
                        ]
                      }
                }:{},
                //Debut Garanties et sous-garanties
                isDevisVoyage?[
                    { text: "\n" },
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
                  },
                ]:  devis.produit.codeProduit=="20G"?
                [{
                    table: {
                        headerRows: 1,
                        widths: widthspackRowsGav,
                        body: isScolaire? devis.gavGarantieTable.slice(0,6) : devis.gavGarantieTable
                    },
                },
                 { text: `(*) : Décès accidentel 4 – 13 ans Pas de capital décès                 (*) : Décès accidentel 13 – 18 ans`, fontSize: 6 }

            ]: 
            devis.produit.codeProduit!="97"?
               [this.table(garanties, champs)]:[],




               (devis?.produit?.codeProduit=='97' && devis.sousProduit.code=="CTH")?[
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
               
        
            (devis?.produit?.codeProduit=='97' && devis.sousProduit.code=="CTI")?[
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
                
            ]:[],
        //    [this.table(garanties, champs)],
                //fin Garanties et sous garanties
                
                //debut Prime
                {
                    style: "table",
                    table: {
                        widths: ["*"],
                        alignment: "right",
                        body: [
                            [
                                {
                                    text: `Décompte de primes`,
                                    style: "headerTable"
                                },
                            ],
                        ],
                    },
                },
                
                devis?.produit?.codeProduit == "45A" || devis?.produit?.codeProduit == "45F"?
            
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
                                            text: `Coût de police`,
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
                                            text: primeNette + " DZD",
                                            fontSize: 10
                                        },
                                        
                                        {
                                            text: primeGestion + " DZD",
                                            fontSize: 10
                                        },
                                        {
                                            text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },                                      
                                        {
                                            text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')? devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.prime : ' ').toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },
                                        {
                                            text: droitTimbre + " DZD",
                                            fontSize: 10
                                        },
                                      
                                        {
                                            text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')? devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.prime : ' ').toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
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
                                            text: primeTotal + " DZD" ,
                                            fontSize: 8
                                        },
                                    ],
                                   
                                ],
                            }
                        }
                    ],
                }:isDevisVoyage || devis.produit.codeProduit=="20G" ?{
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
                            {text:`${primeNette} DZD`,bold:true,alignment:"center",fontSize:"8"},
                            
                            {text:`${primeGestion} DZD`,bold:true,alignment:"center",fontSize:"8"},
                            {text:`${droitTimbre} DZD`,bold:true,alignment:"center",fontSize:"8"},
                            {text:`${primeTotal} DZD `,bold:true,alignment:"center",fontSize:"8"}
                          ] // Row 2
                        ]
                      }
                }:
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
                                            text: `Prime sans réduction`,
                                            style: "headerTable"
                                        },
                                        {
                                            text: `Coût de police`,
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
                                       
                                       
                                    ],
                                    [
                                        {
                                            text: primeNette + " DZD",
                                            fontSize: 10
                                        },
                                        {
                                            text: Number(devis?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP264')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },
                                        {
                                            text: primeGestion + " DZD",
                                            fontSize: 10
                                        },
                                        // {
                                        //     text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                        //     fontSize: 10
                                        // },                                      
                                       

                                        {
                                            text: devis?.codeproduit === 97
                                                ? "0.00 DZD"
                                                : Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.prime || 0)
                                                    .toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },
                                        {
                                            text: droitTimbre + " DZD",
                                            fontSize: 10
                                        },
                                      
                                        
                                    ],
                                    [                                        
                                        {},
                                        {},
                                        {},
                                        {
                                            text: `Prime Totale`,
                                            style: "headerTable",
                                        },
                                        {
                                            text: primeTotal + " DZD" ,
                                            fontSize: 8
                                        },
                                    ],
                                   
                                ],
                            }
                        }
                    ],
                },
            

                
                {
                    pageBreak:devis.produit.codeProduit=="20G"?'':'before',  
                    style: "table",
                    text: [
                        { text: `Déclaration du souscripteur \n`, bold: true, fontSize: "8" },
                        { text: `Je reconnais avoir été informé(e), au moment de la collecte d'informations que les conséquences qui pourraient résulter d'une omission ou d'une déclaration inexacte sont celles prévues par l'article 19 de l'ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006.\n`, fontSize: "6", alignment: 'justify' },
                        { text: `Je reconnais également avoir été informé(e), que les informations saisies dans ce document soient, utilisées, exploitées, traitées par AXA Assurances Algérie Dommage, transférées à l'étranger et à ses sous-traitants, dans le cadre de l'exécution des finalités de la relation commerciale, conformément à la Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.\n`, fontSize: "6", alignment: 'justify' },
                        { text: `J'autorise AXA Assurances Algérie Dommage à m'envoyer des messages et des appels de prospections commerciales quel qu'en soit le support ou la nature.\n`, fontSize: "6", alignment: 'justify' },
                        { text: `Pour toute demande concernant le traitement et vos droits relatifs à vos données à caractère personnel, merci de nous contacter sur l'adresse : dpo@axa.dz\n`, fontSize: "6", alignment: 'justify' },
                    ]
                },
                sessionStorage.getItem("roles")?.includes("COURTIER") ? 
                    {
                        text: [
                         `\n`,
                          'Je donne par le présent mandat à ',
                          { text: `${devis?.agence?.raisonSocial}`, bold: true },
                          ' En tant que Société de Courtage en assurances, à l’effet de négocier et gérer pour mon compte auprès des compagnies d’assurances aux meilleures conditions de garanties et de tarifs, en veillant à la défense de mes intérêts pendant toute la durée de l’assurance depuis la confection du contrat, qu’à l’occasion des règlements des sinistres. Le présent mandat prend effet à la date de signature du présent, et demeure valable tant qu’il n’a pas été dénoncé expressément par mes soins conformément à la législation en vigueur \n\n'
                        ],
                        fontSize: 8,
                        alignment: 'justify'
                      }:{},
                {
                    layout: 'noBorders',
                    margin: [35, 25, 35, 5],
                    table: {
                        widths: ["*", "*"],
                        alignment: "center",
                        body: [
                            [
                                {
                                    text: `Fait à Alger Le `+  moment(devis?.auditDate)?.format('DD/MM/YYYY'),//devis?.auditDate.split("T")[0],
                                    fontSize: 8,
                                    alignment: 'left'
                                },
                                {
                                    text: `Assureur`,
                                    fontSize: 8,
                                    alignment: 'right'
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

        pdfMake.createPdf(docDefinition).open();
    }

    outputDevisFlotte(devis: any){  
      
        let garanties : any =[]   
        let garantiesList : any =[]
        let risqueListVehicule : any =[]
        let risquegarantiesList : any =[]
        let risques : any =[]
        let vehicules : any =[]
        let headersGarantie = ["Garantie(s)",  "Primes"]
        let headersRisque = ["Nº ORDRE", "MARQUE", "IMMATRICULATION", "CHASSIS", "VALEUR_VENALE"]      
        let sums : any = {}       
       
               
        risquegarantiesList = devis?.groupes.filter((groupe:any) => groupe?.garantieList)           
            risquegarantiesList?.forEach((element: any) => {
                garantiesList.push(element.garantieList)
            })    
       
       
         garantiesList?.map((grList:any)=>{
            grList.forEach((gr: any) => {
                const { idGarantie, description, prime } = gr;
        
                if (!sums[idGarantie]) {               
                    sums[idGarantie] = {
                        idGarantie,
                        description,
                        sumPrime: 0,
                    };
                }   
                sums[idGarantie].sumPrime += parseFloat(prime);
            });
         })            

        for (const key in sums) {
            if (Object.hasOwnProperty.call(sums, key)) {
                const garantie = sums[key];
                let tmp = {
                    "Garantie(s)": [
                        { text: garantie.description, fontSize: "8" },
                    ], 
                    "Primes": [
                        { text: Number(garantie.sumPrime).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " DZD", fontSize: "8" },
                    ],    
                };
        
                garanties.push(tmp);
            }
        }
      
       risqueListVehicule = devis?.groupes?.filter((groupe: any) => groupe?.risques);
        risqueListVehicule?.forEach((groupe: any) => {           
            groupe?.risques?.forEach((risque: any) => {               
                risques.push(risque);
            });
        });
     
       let index = 0;
        while (index < risques?.length) {
        
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
        
        

        const docDefinition: any = {
            watermark: { text: 'DEVIS', color: 'blue', opacity: 0.1 },
            pageMargins: [35, 30, 35, 120],         
            border: [false, false, false, false],
            content: [
                {
                    text: 'AXA '+ devis?.produit?.description.toUpperCase(),
                    style: 'sectionHeader'
                },
                {
                    text: 'Devis',
                    style: 'sectionHeader',
                    color: 'black'
                },
                devis?.convention != null?
                {
                    text: 'Convention: '+devis?.reduction.convention?.nomConvention,
                    style: 'sectionHeader',
                    color: 'black'
                }:{},
                devis?.reduction != null?
                {
                    text: 'Réduction: ' +devis?.reduction?.nomReduction,
                    style: 'sectionHeader',
                    color: 'black'
                }:{},
              
               
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
                                                { text: `Nom et code agence : `, bold: true, fontSize: "8" },
                                                { text: devis?.agence?.codeAgence + " " + devis?.agence?.raisonSocial, fontSize: "8" },
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
                                                { text: `Devis N° : `, bold: true, fontSize: "8" },
                                                { text: devis?.idDevis, fontSize: "8" },
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
                                                { text: devis?.agence?.adresse, fontSize: "8" },
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
                                                { text: `Date devis : `, bold: true, fontSize: "8" },
                                                { text: devis?.auditDate.split("T")[0], fontSize: "8" },
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
                                                { text: devis?.agence?.telephone, fontSize: "8" },
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
                                                { text: `Date expiration devis : `, bold: true, fontSize: "8" },
                                                { text: devis?.dateExpiration, fontSize: "8" },
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
                                                { text: devis?.agence?.email, fontSize: "8" },
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
                                                { text: `Ce présent devis est valide 30 jours`, bold: true, fontSize: "8" },                                              
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
                            style: "table",
                            table: {
                                widths: ["*"],
                                alignment: "left",
                                body: [
                                    [
                                        {
                                            text: `Assuré(e)`,
                                            style: "headerTable"
                                        },
                                    ],
                                ],
                            }
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
                                                { text: devis?.typeClient?.description == "personne morale" ? `Raison Sociale : ` : `Nom & Prénom : `, bold: true, fontSize: "8" },
                                                { text: devis?.typeClient?.description == "personne morale" ? devis?.raisonSocial : devis?.nom + " " + devis?.prenom, fontSize: "8" },
                                            ],
                                        },
                                    ],
                                ],
                            }
                        },
                        
                           
                    ],
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
                                    { text: devis?.email, fontSize: "8" },
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
                                       { text: devis?.telephone, fontSize: "8" },
                                   ],
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
                    table: {
                        widths: ["*"],
                        alignment: "left",
                        body: [
                            [
                                {
                                    text: [
                                        { text:"Voir liste des véhicules assurés en ANNEXE A - Détail des véhicules assurés", bold: true, fontSize: "8" },
                                      
                                    ],
                                },
                            ],
                        ],
                    }
                 },
               //Garanties
               {text : '\n'},

               garanties.length != 0 ? this.table(garanties, headersGarantie):{},
                {               
                       
                    style: "table",
                    table: {
                        widths: ["*"],
                        alignment: "left",
                        body: [
                            [
                                {
                                    text: `Décompte de la Prime`,
                                    style: "headerTable"
                                },
                            ],
                        ],
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
                                    [
                                        {
                                            text: Number(devis?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP101')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },
                                        
                                        {
                                            text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T01' || taxe?.taxe?.code == 'T08')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },
                                        {
                                            text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T04')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },                                      
                                        {
                                            text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T07')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },
                                        {
                                            text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T03')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
                                            fontSize: 10
                                        },
                                      
                                        {
                                            text: Number(devis?.taxeList?.find((taxe: any) => taxe?.taxe?.code == 'T02')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD",
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
                                            text: Number(devis?.primeList?.find((prime: any) => prime?.typePrime?.code == 'CP186')?.prime).toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DZD" ,
                                            fontSize: 8
                                        },
                                    ],
                                   
                                ],
                            }
                        }
                    ],
                },
                {
                    style: "table",
                    text: [
                        { text: `Déclaration du souscripteur \n`, bold: true, fontSize: "9" },
                        { text: `Je reconnais avoir été informé(e), au moment de la collecte d'informations que les conséquences qui pourraient résulter d'une omission ou d'une déclaration inexacte sont celles prévues par l'article 19 de l'ordonnance n°95/07 du 25 janvier 1995 relative aux assurances modifiée et complétée par la loi n°06/04 du 20 février 2006.\n`, fontSize: "8", alignment: 'justify' },
                        { text: `Je reconnais également avoir été informé(e), que les informations saisies dans ce document soient, utilisées, exploitées, traitées par AXA Assurances Algérie Dommage, transférées à l'étranger et à ses sous-traitants, dans le cadre de l'exécution des finalités de la relation commerciale, conformément à la Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.\n`, fontSize: "8", alignment: 'justify' },
                        { text: `J'autorise AXA Assurances Algérie Dommage à m'envoyer des messages et des appels de prospections commerciales quel qu'en soit le support ou la nature.\n`, fontSize: "8", alignment: 'justify' },
                        { text: `Pour toute demande concernant le traitement et vos droits relatifs à vos données à caractère personnel, merci de nous contacter sur l'adresse : dpo@axa.dz\n`, fontSize: "8", alignment: 'justify' },
                    ]
                },
                sessionStorage.getItem("roles")?.includes("COURTIER") && 
                    {
                        text: [
                          'Je donne par le présent mandat à ',
                          { text: `${devis?.agence?.raisonSocial}`, bold: true },
                          ' En tant que Société de Courtage en assurances, à l’effet de négocier et gérer pour mon compte auprès des compagnies d’assurances aux meilleures conditions de garanties et de tarifs, en veillant à la défense de mes intérêts pendant toute la durée de l’assurance depuis la confection du contrat, qu’à l’occasion des règlements des sinistres. Le présent mandat prend effet à la date de signature du présent, et demeure valable tant qu’il n’a pas été dénoncé expressément par mes soins conformément à la législation en vigueur \n\n'
                        ],
                        fontSize: 8,
                        alignment: 'justify'
                      },

                {
                    layout: 'noBorders',
                    margin: [5, 5, 5, 5],
                    table: {
                        widths: ["*", "*"],
                        alignment: "center",
                        body: [
                            [
                               
                                    { text: `Fait à Alger Le 09/09/2023`, bold: true, fontSize: "8" },
                                  
                                {
                                    text: `Assureur`,
                                    fontSize: "8",
                                    alignment: 'right',
                                    pageBreak: 'after'   
                                }
                            ]
                        ],
                    },
                },
             /*   {
                    text : ' ',
                    pageBreak: 'after'
 
                 },
               */  

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
                {text : '\n'},

                vehicules.length != 0 ? this.table(vehicules, headersRisque):{},
                
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
        pdfMake.createPdf(docDefinition).open();
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
                    column1.text = col
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
        let pourcentage = 100 / columns.length;
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
    getAccessByDevis(idDevis: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.get<any[]>(`${Constants.API_ENDPOINT_DEVIS_ACCESS}/${idDevis}`, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        );
    }

    updateAccessDevis(devisAccess: any) {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.put(`${Constants.API_ENDPOINT_DEVIS_ACCESS}`, devisAccess, httpOption).pipe(
            tap((response) => this.logs(response)),
            catchError((error) => throwError(error.error))
        )
    }

    approveDevis(idDevis: any, auditUser: any, isConfirmed: boolean) {
        const httpOption: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'

            }),
            responseType: 'text',
        };

        return this.http.put(`${Constants.API_ENDPOINT_DEVIS_APPROUVAL}/${idDevis}/${auditUser}/${isConfirmed}`, null, httpOption).pipe(
            tap((response) => response),
            catchError((error) => throwError(error.error))
        )
    }
}
