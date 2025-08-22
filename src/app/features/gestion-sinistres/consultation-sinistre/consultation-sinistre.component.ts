import { Component, OnInit, ViewChild } from '@angular/core';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { MatPaginator } from '@angular/material/paginator';
import { ParamRisqueService } from '../../../core/services/param-risque.service'
import { ActivatedRoute, Params } from '@angular/router';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
@Component({
  selector: 'app-consultation-sinistre',
  templateUrl: './consultation-sinistre.component.html',
  styleUrls: ['./consultation-sinistre.component.scss']
})

export class ConsultationSinistreComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  constructor(private authentificationService: AuthentificationService, private route: ActivatedRoute, private sinistresService: SinistresService, private paramRisqueService: ParamRisqueService) { }
  adversaireTab: any = []
  blessesTab: any = []
  idProduit = 0
  conducteurSinistre: any = []
  infoSinistre: any = []
  paramRisqueAll = []
  auditUser: any
  createUser: any
  codeSinistre: any
  codeProduit: any
  nomProduit: any
  imatriculationNew:any
  ngOnInit(): void {
    this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre')
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    this.nomProduit = this.route.snapshot.paramMap.get('nameProduit')
    this.route.queryParams.subscribe((params: Params) => {
      // Récupérer la valeur du paramètre 'immatriculation' depuis les queryParams
      this.imatriculationNew = params['immatriculation'];
      
 
    });
    this.getProductId()
    this.getAllParamRisque()



  }
  getProductId() {
    this.idProduit = JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == "45A").idProduit

  }
  getAllParamRisque() {
    this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
      next: (data: any) => {
        this.paramRisqueAll = data
        this.getSinistreByCode(this.codeSinistre)
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  getSinistreByCode(code: any) {
    let i = 0
    this.sinistresService.getSinistreByCode(code).subscribe({
      next: (data: any) => {       
        this.getUserById(data.auditUser, 'audit')
        this.getUserById(data.createUser, 'create')

      
        //info sinistre 
        this.infoSinistre = {
          "codeSinistre": data.codeSinistre,
          "codeRisque": data.codeRisque,
          "dateDeclaration": data.dateDeclaration,
          "dateSurvenance": data.dateSurvenance,
          "paysSurvenance": data.paysSurvenance?.description,
          "wilayaSurvenance": data.wilayaSurvenance?.description,
          "communeSurvenance": data.communeSurvenance?.description,
          "causeSinistre": data.causeSinistre?.description,
          "origineSinistre": data.origineSinistre?.description,
          "zoneAffecte": data.zoneAffecte?.description,
          "statut": data.statut?.description,
          "tauxResponsabilite": data.tauxResponsabilite,
          "canCirculate": data.canCirculate ? "Oui" : "Non",
          "autorite": data.autorite ? "Oui" : "Non",
          "description": data.description,
          "agence": data.agence?.idPersonneMorale?.raisonSocial,
          "natureDommage": data.natureDommage,
          "assisteurExist": data.sinistreAssistances.length == 0 ? false : true,
          "assisteur": "non",
          "adresse":data?.contratHistorique?.contratPersonneRoleList[0]?.personne?.adressesList[0]?.description,
         "immatriculation":data?.contratHistorique?.risqueList
         .find((item:any) => item.paramRisque.codeParam=='P38' && item.risque == data?.codeRisque)?.valeur
        }

      
        
        if (this.infoSinistre.assisteurExist) {
          if (data.sinistreAssistances[0].existeAssistance) { this.infoSinistre.assisteur = data.sinistreAssistances[0].assisteur.description }
          else {

            if (data.sinistreAssistances[0].appelAssistance)
              this.infoSinistre.assisteur = data.sinistreAssistances[0].assisteur?.description
          }
        }
        //aversaires
        this.adversaireTab = data.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne?.code == "C46")

        this.adversaireTab.filter((adversaire: any) => {

          if (adversaire.sinsitreparams.length != 0) {
            adversaire.sinsitreparams.filter((param: any) => {
              this.paramRisqueAll.filter((paramDesc: any) => {
                if (paramDesc.paramRisque?.codeParam == param.paramrisque?.codeParam) {
                  param.descriptionChamp = paramDesc.paramRisque?.descriptionChamp;
                  // if(param.paramrisque.codeParam== "P25" || param.paramrisque.codeParam== "P26" || param.paramrisque.codeParam== "P56" )
                  // param.valeur = paramDesc.paramRisque.descriptionChamp;
                }
              })
            })
          }
        })
       
        //blesses
        this.blessesTab = data.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne?.code == "C47")

        if(this.codeProduit == "45A" || this.codeProduit == "45F")
        {
          // conducteur
          this.conducteurSinistre = data.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne?.code == "C45")[0]
          this.conducteurSinistre.sinsitreparams.filter((param: any) => {
            this.paramRisqueAll.filter((paramDesc: any) => {
              if (paramDesc.paramRisque.codeParam == param.paramrisque.codeParam) {
                param.descriptionChamp = paramDesc.paramRisque?.descriptionChamp;
              }
            })
          })
        }

      
      }

      ,
      error: (error: any) => {

        console.log(error);

      }
    });
  }
  getUserById(userId: any, typeUser: string) {
    this.authentificationService.getByUserId(userId).subscribe({
      next: (data: any) => {
        if (typeUser == 'audit')
          this.auditUser = data.email
        else
          this.createUser = data.email

      },
      error: (error: any) => {

        console.log(error);

      }
    });
  }
}
