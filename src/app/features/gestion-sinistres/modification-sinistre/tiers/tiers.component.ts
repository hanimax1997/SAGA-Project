import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { MatTableDataSource } from '@angular/material/table';
import { PersonneSinistre } from 'src/app/core/models/sinistre';
import * as moment from 'moment';
import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { MatPaginator } from '@angular/material/paginator';
import { DeletePersonneDialogComponent } from '../delete-personne-dialog/delete-personne-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tiers',
  templateUrl: './tiers.component.html',
  styleUrls: ['./tiers.component.scss']
})
export class TiersComponent implements OnInit {
  formAddTier: FormGroup | any;
  // formObject: FormGroup | any;
  formVehicule: FormGroup | any;
  typeTierSelected: any
  typeTierSelectedCode: any
  typeAdversaireArray: any = []
  companiesAdverse: any = []
  agenceAdversesArray: any = []
  filteredAgenceAdversesArray: any = []
  marques: any = []
  models: any = []
  wilayas: any = []
  informationsTier: any = []
  dataSourceTier = new MatTableDataSource()
  adversairePersonne = new PersonneSinistre()
  paramRisqueAll: any = []
  infoSinistre: any = []
  idProduit = 0
  codeSinistre: any
  codeProduit: any
  statutSinistre: any
  consultTierShow = false
  editTierSuccess = false
  editTierVar = false
  idSinistre = 0
  typeTierConsult: any
  selectedValue: boolean = true;

  errorHandler = {
    "error": false,
    "msg": ""
  }
  tempArray = [
    {
      "id": 1,
      "description": "exemple 1"
    },
    {
      "id": 2,
      "description": "exemple 2"
    },
    {
      "id": 3,
      "description": "exemple 3"
    },
  ]
  disabledAddTier = false
  displayedColumns: any = []
  roleExist: any = false;
    roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
    sinistreRoles: any = {
      "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
      "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
      "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
      "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
      "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
    }
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  constructor(private dialog: MatDialog, private router: Router, private sinistresService: SinistresService, private route: ActivatedRoute, private paramRisqueService: ParamRisqueService, private vehiculeService: VehiculeService, private genericService: GenericService, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre')
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    this.displayedColumns = this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L' ? ['typeAdversaire', "nom", "prenom", "action"] : ["nom", "prenom", "action"];

    this.getDictionnaireList()

    this.getIdPays("DZA")
    this.getSinistreInfo()
    this.getProductId()
    this.getAllParamRisque()
    this.initAddTier()
    this.getMarque()

    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        this.roleExist = true;
        return;
      }
    })
    if(!this.roleExist) this.router.navigate(['/dashboard'])

  }

  getSinistreInfo() {
    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.infoSinistre = data

        this.idSinistre = data.idSinistre
        this.dataSourceTier.data = data.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne.code == "C46")
        this.dataSourceTier.paginator = this.paginator;
        this.statutSinistre = this.infoSinistre.statut.code
        if (this.statutSinistre == 'CP355' || this.statutSinistre == 'CP415' ||this.statutSinistre == 'CP524'  || this.statutSinistre == 'CP525' || this.statutSinistre == 'CP526')
          this.formAddTier.disable()
        else this.formAddTier.enable()
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  getDictionnaireList() {
    //get type adversaires 
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C46").idCategorie).subscribe(data => {
      this.typeAdversaireArray = data;
    })
    //get entreprise adverse
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C51").idCategorie).subscribe(data => {
      this.companiesAdverse = data;
    })

  }
  getProductId() {
    this.idProduit = JSON.parse(sessionStorage.getItem('products') || '{}').find((parametre: any) => parametre.codeProduit == "45A").idProduit

  }

  tiersAssure(reponse: any) {

    if(reponse)
    {
      this.formAddTier.get("companyAdverse").setValidators([Validators.required])
      this.formAddTier.get("companyAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("agenceAdverse").setValidators([Validators.required])
      this.formAddTier.get("agenceAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("numPolice").setValidators([Validators.required])
      this.formAddTier.get("numPolice").updateValueAndValidity([Validators.required])
    }
    else
    {
      this.formAddTier.get("companyAdverse").setValidators([])
      this.formAddTier.get("companyAdverse").updateValueAndValidity([])
      this.formAddTier.get("agenceAdverse").setValidators([])
      this.formAddTier.get("agenceAdverse").updateValueAndValidity([])
      this.formAddTier.get("numPolice").setValidators([])
      this.formAddTier.get("numPolice").updateValueAndValidity([])
    }
  }

  initAddTier() {
    this.formAddTier = this.formBuilder.group({
      typeAdversaire: ["", (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') ? [Validators.required] : []],
      isFamily: ["", (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') ? [Validators.required] : []],
      nomAdversaire: ["", [Validators.required]],
      prenomAdversaire: ["", [Validators.required]],
      companyAdverse: ["", [Validators.required]],
      agenceAdverse: ["", [Validators.required]],
      numPolice: ["", [Validators.required]],
      contact: ["", []],
      tauxResponsabilite: ["", [Validators.required]],
      // conducteur adverse
      nomConducteurAdverse: ["", []],
      prenomConducteurAdverse: ["", []],
      numPermisConducteurAdverse: ["", []],
      dateDelivranceAdverse: ["", []],
      lieuDelivranceAdverse: ["", []],
      //vehicule adverse
      marqueVehiculeAdverse: ["", []],
      modeleVehiculeAdverse: ["", []],
      // FIX Validators.maxLength(13),Validators.minLength(13)
      immatriculationVehiculeAdverse: ["", []],
      assure: [{value: true, disabled: (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') ? true : false}],
    });

  }
  // initFormObject() {
  //   this.formObject = this.formBuilder.group({
  //     nomAdversaire: ["", Validators.required],
  //     prenomAdversaire: ["", Validators.required],
  //     companyAdverse: ["", []],
  //     agenceAdverse: ["", []],
  //     numPolice: ["", []],
  //     contact: ["", []],
  //   });
  // }
  changeTypeAdversaire(typeAdversaire: any) {
    this.typeTierSelected = typeAdversaire.idParam
    this.typeTierSelectedCode = typeAdversaire.code
    if (this.typeTierSelectedCode== "CP309") { //  typeAdversaire == vehicule
      // this.formAddTier.get("agenceAdverse").setValidators([Validators.required])
      // this.formAddTier.get("agenceAdverse").updateValueAndValidity([Validators.required])
      // this.formAddTier.get("companyAdverse").setValidators([Validators.required])
      // this.formAddTier.get("companyAdverse").updateValueAndValidity([Validators.required])
      // this.formAddTier.get("numPolice").setValidators([Validators.required])
      // this.formAddTier.get("numPolice").updateValueAndValidity([Validators.required])

      this.formAddTier.get("nomConducteurAdverse").setValidators([Validators.required])
      this.formAddTier.get("nomConducteurAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("prenomConducteurAdverse").setValidators([Validators.required])
      this.formAddTier.get("prenomConducteurAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("numPermisConducteurAdverse").setValidators([Validators.required])
      this.formAddTier.get("numPermisConducteurAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("dateDelivranceAdverse").setValidators([Validators.required])
      this.formAddTier.get("dateDelivranceAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("lieuDelivranceAdverse").setValidators([Validators.required])
      this.formAddTier.get("lieuDelivranceAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("marqueVehiculeAdverse").setValidators([Validators.required])
      this.formAddTier.get("marqueVehiculeAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("modeleVehiculeAdverse").setValidators([Validators.required])
      this.formAddTier.get("modeleVehiculeAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("immatriculationVehiculeAdverse").setValidators([Validators.required])
      this.formAddTier.get("immatriculationVehiculeAdverse").updateValueAndValidity([Validators.required])
      this.formAddTier.get("isFamily").setValidators([Validators.required])
      this.formAddTier.get("isFamily").updateValueAndValidity([Validators.required])
    } else { // type objet  310
      // this.formAddTier.get("agenceAdverse").setValidators([])
      // this.formAddTier.get("agenceAdverse").updateValueAndValidity([])
      // this.formAddTier.get("companyAdverse").setValidators([])
      // this.formAddTier.get("companyAdverse").updateValueAndValidity([])
      // this.formAddTier.get("numPolice").setValidators([])
      // this.formAddTier.get("numPolice").updateValueAndValidity()
      this.formAddTier.get("isFamily").setValidators([])
      this.formAddTier.get("isFamily").updateValueAndValidity([])
      this.formAddTier.get("nomConducteurAdverse").setValidators([])
      this.formAddTier.get("nomConducteurAdverse").updateValueAndValidity([])
      this.formAddTier.get("prenomConducteurAdverse").setValidators([])
      this.formAddTier.get("prenomConducteurAdverse").updateValueAndValidity([])
      this.formAddTier.get("numPermisConducteurAdverse").setValidators([])
      this.formAddTier.get("numPermisConducteurAdverse").updateValueAndValidity([])
      this.formAddTier.get("dateDelivranceAdverse").setValidators([])
      this.formAddTier.get("dateDelivranceAdverse").updateValueAndValidity([])
      this.formAddTier.get("lieuDelivranceAdverse").setValidators([])
      this.formAddTier.get("lieuDelivranceAdverse").updateValueAndValidity([])
      this.formAddTier.get("marqueVehiculeAdverse").setValidators([])
      this.formAddTier.get("marqueVehiculeAdverse").updateValueAndValidity([])
      this.formAddTier.get("modeleVehiculeAdverse").setValidators([])
      this.formAddTier.get("modeleVehiculeAdverse").updateValueAndValidity([])
      this.formAddTier.get("immatriculationVehiculeAdverse").setValidators([])
      this.formAddTier.get("immatriculationVehiculeAdverse").updateValueAndValidity([])
    }
  }
  submitTier(formDirective: any) {
    
    if (this.formAddTier.valid) {
      if(this.codeProduit != '95' && this.codeProduit != '96')
      {
        this.adversairePersonne.typePersonne = {
          "idParam": this.typeTierSelected
        }
      }
      else
      {
        this.adversairePersonne.typePersonne = {
          idParam: this.typeAdversaireArray.find((type: any) => type.code == "CP309")?.idParam,
          code: "CP309",
        }
      }
      this.adversairePersonne.nom = this.formAddTier.get("nomAdversaire").value
      this.adversairePersonne.prenom = this.formAddTier.get("prenomAdversaire").value
      this.adversairePersonne.companyAdverse = { "idParam": this.formAddTier.get("companyAdverse").value.idParam }
      if (this.formAddTier.get("agenceAdverse").value == '')
        this.adversairePersonne.agenceAdverse = null
      else
        this.adversairePersonne.agenceAdverse = { "idParam": this.formAddTier.get("agenceAdverse").value }

      this.adversairePersonne.isFamilly = this.formAddTier.get("isFamily").value
      this.adversairePersonne.nomConducteur = this.formAddTier.get("nomConducteurAdverse").value
      this.adversairePersonne.prenomConducteur = this.formAddTier.get("prenomConducteurAdverse").value
      this.adversairePersonne.numPoliceAdverse = this.formAddTier.get("numPolice").value
      this.adversairePersonne.contact = this.formAddTier.get("contact").value
      this.adversairePersonne.dateDelivrance = this.formAddTier.get("dateDelivranceAdverse").value
      this.adversairePersonne.tauxResponsabilite = this.formAddTier.get("tauxResponsabilite").value
      this.adversairePersonne.numeroPermis = this.formAddTier.get("numPermisConducteurAdverse").value
      if (this.typeTierSelectedCode == "CP309") {
        let codeRisqueTableForm = [

          {
            "value": this.formAddTier.get("lieuDelivranceAdverse").value,
            "code": "P56",
          },
          {
            "value": this.formAddTier.get("marqueVehiculeAdverse").value,
            "code": "P25",
          },
          {
            "value": this.formAddTier.get("modeleVehiculeAdverse").value,
            "code": "P26",
          }
          ,
          {
            "value": this.formAddTier.get("immatriculationVehiculeAdverse").value,
            "code": "P38",
          }
        ]
        this.adversairePersonne.paramRisque = []
        codeRisqueTableForm.forEach((codeValue: any) => this.setParam(codeValue))
      }
      this.adversairePersonne.auditUser = sessionStorage.getItem("userId")
      this.sinistresService.addPersonne(this.adversairePersonne, this.idSinistre).subscribe({
        next: (data: any) => {
          //reset form 
          this.getSinistreInfo()
          //reset form 
          formDirective.resetForm();
          this.formAddTier.reset();
          Object.keys(this.formAddTier.controls).forEach(key => {
            this.formAddTier.controls[key].setErrors(null)
          });
        },
        error: (error) => {
          this.handleError = error
          console.log(error);

        }
      })


    }


  }

  setParam(codeValue: any) {

    this.adversairePersonne.paramRisque.push({

      "idParam": this.paramRisqueAll.filter((risque: any) => risque.paramRisque.codeParam == codeValue.code)[0].paramRisque.idParamRisque,
      "valeur": codeValue.value

    })

    // this.paramRisqueAll.filter((risque: any) => {risque.paramRisque.codeParam == codeValue.code})
  }

  getAllParamRisque() {
    this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
      next: (data: any) => {
        this.paramRisqueAll = data
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  getMarque() {
    this.vehiculeService.getAllMarque().subscribe({
      next: (data: any) => {
        this.marques = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getModel(marque: any) {
    this.vehiculeService.getModelByMarque(marque).subscribe({
      next: (data: any) => {
        this.models = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getIdPays(codePays: string) {
    this.genericService.getPays().subscribe({
      next: (data: any) => {

        this.getWilayas(data.find((pays: any) => pays.codePays == codePays).idPays);
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getWilayas(idPays: any) {
    this.genericService.getAllWilayas(idPays).subscribe({
      next: (data: any) => {

        this.wilayas = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAgenceAdverse(agenceid: any) {
    this.formAddTier.get("agenceAdverse").setValue("")
    this.sinistresService.getByLien(agenceid.idParam).subscribe({
      next: (data: any) => {
        this.agenceAdversesArray = data
        this.filteredAgenceAdversesArray = this.agenceAdversesArray.slice()

      },
      error: (error) => {

        console.log(error);

      }
    })


  }
  getAgenceAdverseEdit(agenceid: any) {
 
    if(agenceid==false){
      this.formAddTier.get("agenceAdverse").disable();
      this.formAddTier.get("numPolice").disable();
     }
  
    this.formAddTier.get("agenceAdverse").setValue("")
    this.sinistresService.getByLien(agenceid).subscribe({
      next: (data: any) => {
        this.agenceAdversesArray = data
       
        this.filteredAgenceAdversesArray = this.agenceAdversesArray.slice()

      },
      error: (error) => {

        console.log(error);

      }
    })


  }
  consultTier(typeTier: any, infoTier: any) {
    this.typeTierConsult = typeTier.code
    this.consultTierShow = true
    this.changeTypeAdversaire(typeTier.code)
    this.formAddTier.disable()
    this.informationsTier = infoTier
    //if object
   console.log(infoTier)

    this.getAgenceAdverseEdit(infoTier.compagnyAdverse?.idParam)
    this.formAddTier.get("typeAdversaire").setValue(infoTier.typePersonne?.idParam)
    this.formAddTier.get("nomAdversaire").setValue(infoTier.nom)
    this.formAddTier.get("prenomAdversaire").setValue(infoTier.prenom)
    this.formAddTier.get("companyAdverse").setValue(infoTier.compagnyAdverse?.idParam)
    this.formAddTier.get("agenceAdverse").setValue(infoTier.agenceAdvese?.idParam)
    this.formAddTier.get("numPolice").setValue(infoTier.policeAdversaire)
    this.formAddTier.get("contact").setValue(infoTier.contact)
    this.formAddTier.get("tauxResponsabilite").setValue(infoTier.tauxResponsabilite)
    if (this.typeTierConsult == "CP309") {
      this.formAddTier.get("isFamily").setValue(infoTier.isFamilly)
      this.formAddTier.get("nomConducteurAdverse").setValue(infoTier.nomConducteur)
      this.formAddTier.get("prenomConducteurAdverse").setValue(infoTier.prenomConducteur)
      this.formAddTier.get("numPermisConducteurAdverse").setValue(infoTier.numeroPermis)
      this.formAddTier.get("dateDelivranceAdverse").setValue(new Date(infoTier.dateDelivrance))


      this.formAddTier.get("lieuDelivranceAdverse").setValue(Number(infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P56")[0]?.idValeur))

     /* this.formAddTier.get("marqueVehiculeAdverse").setValue((infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P25")[0]?.idValeur)?.toString())
      infoTier.sinsitreparams.length !=0 ?
      this.getModel(infoTier.sinsitreparams.filter((param: any) => param.paramrisque.codeParam == "P25")[0]?.idValeur)
      : ''
      this.formAddTier.get("modeleVehiculeAdverse").setValue((infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P26")[0]?.idValeur)?.toString())

*/
      const typeIdval =infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P25")[0]?.idValeur;
      const typeVal =infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P25")[0]?.valeur;
      if(typeIdval !=null ){
        this.formAddTier.get("marqueVehiculeAdverse").setValue(typeIdval)
        this.getModel(infoTier.sinsitreparams.filter((param: any) => param.paramrisque.codeParam == "P25")[0]?.idValeur)
      }else{
        this.formAddTier.get("marqueVehiculeAdverse").setValue(typeVal)
      }


      const modelVal =infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P26")[0]?.valeur;
      const modelIdVal =infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P26")[0]?.idValeur;
      if(modelIdVal !=null ){
      
        this.formAddTier.get("modeleVehiculeAdverse").setValue(modelIdVal)
      
      
      }else{
  this.formAddTier.get("modeleVehiculeAdverse").setValue(infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P26")[0]?.valeur)
      
      }


      this.formAddTier.get("immatriculationVehiculeAdverse").setValue(infoTier.sinsitreparams.filter((param: any) => param.paramrisque?.codeParam == "P38")[0]?.valeur)
   
   
   
   
   
   
   
    }


  }
  editTier() {
    this.editTierVar = true
    this.formAddTier.enable()
  }
  submitEditTier(formDirective: any) {
    if (this.formAddTier.valid) {
      this.informationsTier.nom = this.formAddTier.get("nomAdversaire").value
      this.informationsTier.prenom = this.formAddTier.get("prenomAdversaire").value

      if (this.formAddTier.get("companyAdverse").value != false) {
        if (this.formAddTier.get("companyAdverse").value != null)
          this.informationsTier.compagnyAdverse = { "idParam": this.formAddTier.get("companyAdverse").value }
      } else {
        this.informationsTier.compagnyAdverse = null
      }

      if (this.formAddTier.get("agenceAdverse").value != false) {
        if (this.formAddTier.get("agenceAdverse").value != null)
          this.informationsTier.agenceAdvese = { "idParam": this.formAddTier.get("agenceAdverse").value }
      } else {
        this.informationsTier.agenceAdvese = null
      }


      this.informationsTier.policeAdversaire = this.formAddTier.get("numPolice").value
      this.informationsTier.contact = this.formAddTier.get("contact").value
      this.informationsTier.tauxResponsabilite = this.formAddTier.get("tauxResponsabilite").value

      if (this.typeTierConsult == "CP309") {
        this.informationsTier.nomConducteur = this.formAddTier.get("nomConducteurAdverse").value
        this.informationsTier.prenomConducteur = this.formAddTier.get("prenomConducteurAdverse").value
        this.informationsTier.numeroPermis = this.formAddTier.get("numPermisConducteurAdverse").value
        this.informationsTier.sinsitreparams.map((param: any) => {
          switch (param.paramrisque.codeParam) {
            case "P54":
              param.valeur = this.formAddTier.get("dateDelivranceAdverse").value
              break;
            case "P56":
              param.idValeur = this.formAddTier.get("lieuDelivranceAdverse").value
              param.valeur = this.formAddTier.get("lieuDelivranceAdverse").value
              // param.valeur = this.wilayas.filter((wilaya: any) => wilaya.idWilaya == param.idValeur)[0].description
              break;
            case "P25":
              param.idValeur = this.formAddTier.get("marqueVehiculeAdverse").value
              param.valeur = this.formAddTier.get("marqueVehiculeAdverse").value
              // param.valeur = this.marques.filter((marque: any) => marque.idParam == param.idValeur)[0].marque
              break;
            case "P26":
              param.idValeur = this.formAddTier.get("modeleVehiculeAdverse").value
              param.valeur = this.formAddTier.get("modeleVehiculeAdverse").value
              // param.valeur = this.models.filter((modele: any) => modele.idParam == param.idValeur)[0].modele
              break;
            case "P38":
              param.valeur = this.formAddTier.get("immatriculationVehiculeAdverse").value
              break;
            default:
              break;
          }
        })

      }
      this.updatePersonne(formDirective, 'edit')
    } 
  }
  updatePersonne(formDirective: any, typeUpdate: string) {
    this.informationsTier.auditUser = sessionStorage.getItem("userId")
    this.sinistresService.updateInfosPersonne(this.informationsTier, this.informationsTier.idSinistrePersonne).subscribe({
      next: (data: any) => {
        if (typeUpdate == 'edit') {
          this.getSinistreInfo()
          //reset form 
          formDirective.resetForm();
          this.formAddTier.reset();
          // Object.keys(this.formAddTier.controls).forEach(key => {
          //   this.formAddTier.controls[key].setErrors(null)

          // });
          this.consultTierShow = false
          this.editTierVar = false
          this.editTierSuccess = true
          setTimeout(() => {
            this.editTierSuccess = false

          }, 20000);
        } else {
          this.getSinistreInfo()
        }
      },
      error: (error) => {
        this.handleError = error
        console.log(error);

      }
    })
  }

  handleError(error: any) {

    switch (error.status) {
      case 500: // 
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur système, veuillez contacter l'administrateur."
        break;
      case 402: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur lors de la validation du devis, veuillez contacter l'administrateur."
        break;
      case 404: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = error.message
        break;
    }
    setTimeout(() => {
      this.errorHandler.error = false
      this.errorHandler.msg = ""

    }, 20000);
  }
  goBack() {
    
    if (this.consultTierShow) { // step 2 
      this.consultTierShow = false
      this.editTierVar = false
      this.formAddTier.reset();
      this.formAddTier.enable();
    } else {
    
      this.router.navigate(['../'], { relativeTo: this.route });

    }
  }
  deleteTier(infoTier: any) {
    if ((this.dataSourceTier.data.length != 1 && this.infoSinistre.causeSinistre?.code == "AUT005") || this.infoSinistre.causeSinistre?.code != "AUT005") {
      const dialogRef = this.dialog.open(DeletePersonneDialogComponent, {
        width: '40%',
        data: { "typeContent": 'personne' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.data.data) {
          this.informationsTier = infoTier
          this.informationsTier.dateFin = result.data.dateFin

          this.updatePersonne(undefined, 'delete')
        }
      });
    } else {
      Swal.fire(
        `Il est interdit de supprimer tous les tiers tant que la cause est une 'Collision
          `,
        '',
        'error'
      )

    }


  }
}
