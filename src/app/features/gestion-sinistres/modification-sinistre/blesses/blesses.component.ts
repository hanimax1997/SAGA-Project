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

@Component({
  selector: 'app-blesses',
  templateUrl: './blesses.component.html',
  styleUrls: ['./blesses.component.scss']
})
export class BlessesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  constructor(private dialog: MatDialog, private router: Router, private sinistresService: SinistresService, private route: ActivatedRoute, private paramRisqueService: ParamRisqueService, private vehiculeService: VehiculeService, private genericService: GenericService, private formBuilder: FormBuilder) { }
  codeSinistre: any
  codeProduit: any
  infoSinistre: any = []
  idSinistre = 0
  dataSourceBlesse = new MatTableDataSource()
  formInfoBlesses: FormGroup | any;
  blessePersonne = new PersonneSinistre()
  errorHandler = {
    "error": false,
    "msg": ""
  }
  statutSinistre: any
  today = new Date()
  typeConsult: any
  consultBlesseShow = false
  informationsBlesse: any = []
  editBlesseVar = false
  editBlesseSuccess = false
  typeBlessesArray: any = []
  typesinistree: any = []
  displayedColumns = ['typeBlesses', "nomBlesse", "prenomBlesse", "etatBlesse", "action"]
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  ngOnInit(): void {
    this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre')
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })

    if(!roleExist) this.router.navigate(['/dashboard'])

    this.getSinistreInfo()
    this.initAddBlesse()
    //get type typeBlesses 
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C47").idCategorie).subscribe(data => {
      this.typeBlessesArray = data;
    })
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C54").idCategorie).subscribe(data => {
      this.typesinistree = data;
    })
  }
  getSinistreInfo() {
    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.infoSinistre = data
        this.idSinistre = data.idSinistre
        this.dataSourceBlesse.data = data.sinistrePersonnes.filter((personne: any) => personne.categoriePersonne.code == "C47")
        this.dataSourceBlesse.paginator = this.paginator;
        this.statutSinistre = this.infoSinistre.statut.code
        
        if (this.statutSinistre == 'CP355'|| this.statutSinistre == 'CP415' || this.statutSinistre == 'CP524'  || this.statutSinistre == 'CP525'|| this.statutSinistre == 'CP526')
          this.formInfoBlesses.disable()
        else this.formInfoBlesses.enable()
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  editBlesse() {
    this.editBlesseVar = true
    this.formInfoBlesses.enable()
  }
  initAddBlesse() {
    this.formInfoBlesses = this.formBuilder.group({
      typeBlesses: ["", (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L') ? [Validators.required] : []],
      nomBlesse: [""],
      prenomBlesse: [""],
      dateNaissanceBlesse: [""],
      etatBlesse: ["", [Validators.required]],
      contact: [""],
    });
  }
  consultBlesse(typeTier: any, infoBlesse: any) {
    this.typeConsult = typeTier.code
    this.consultBlesseShow = true
    this.formInfoBlesses.disable()
    this.informationsBlesse = infoBlesse
    this.formInfoBlesses.get("typeBlesses").setValue(infoBlesse.typePersonne.idParam)
    this.formInfoBlesses.get("nomBlesse").setValue(infoBlesse.nom)
    this.formInfoBlesses.get("prenomBlesse").setValue(infoBlesse.prenom)
    this.formInfoBlesses.get("dateNaissanceBlesse").setValue(infoBlesse.dateNaissance)
    this.formInfoBlesses.get("etatBlesse").setValue(infoBlesse.etatSinistre.idParam)
    this.formInfoBlesses.get("contact").setValue(infoBlesse.contact)

  }
  submitBlesse(formDirective: any) {
    if (this.formInfoBlesses.valid) {
      
      if(this.codeProduit != '95' && this.codeProduit != '96')
      {
        this.blessePersonne.typePersonne = {
          "idParam": this.formInfoBlesses.get("typeBlesses").value
        }
      }
      else
      {
        this.blessePersonne.typePersonne = {
          "idParam": this.typeBlessesArray.find((blesse: any) => blesse.code == "TP98")?.idParam
        }
      }
      
      this.blessePersonne.nom = this.formInfoBlesses.get("nomBlesse").value
      this.blessePersonne.prenom = this.formInfoBlesses.get("prenomBlesse").value
      this.blessePersonne.dateNaissance = this.formInfoBlesses.get("dateNaissanceBlesse").value
      this.blessePersonne.etatSinistre = { "idParam": this.formInfoBlesses.get("etatBlesse").value }
      this.blessePersonne.contact = this.formInfoBlesses.get("contact").value
      this.blessePersonne.auditUser=sessionStorage.getItem("userId")
      this.sinistresService.addPersonne(this.blessePersonne, this.idSinistre).subscribe({
        next: (data: any) => {

          this.getSinistreInfo()
          // reset form 
          formDirective.resetForm();
          this.formInfoBlesses.reset();

        },
        error: (error) => {
          this.handleError = error
          console.log(error);

        }
      })
    }
  }
  submitEditBlesse(formDirective: any) {
    this.informationsBlesse.typePersonne = { "idParam": this.formInfoBlesses.get("typeBlesses").value }
    this.informationsBlesse.nom = this.formInfoBlesses.get("nomBlesse").value
    this.informationsBlesse.prenom = this.formInfoBlesses.get("prenomBlesse").value
    this.informationsBlesse.dateNaissance = this.formInfoBlesses.get("dateNaissanceBlesse").value
    this.informationsBlesse.etatSinistre = { "idParam": this.formInfoBlesses.get("etatBlesse").value }
    this.informationsBlesse.contact = this.formInfoBlesses.get("contact").value
    this.updatePersonne(formDirective, 'edit')
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
  updatePersonne(formDirective: any, typeUpdate: string) {
    this.informationsBlesse.auditUser=sessionStorage.getItem("userId")

    this.sinistresService.updateInfosPersonne(this.informationsBlesse, this.informationsBlesse.idSinistrePersonne).subscribe({
      next: (data: any) => {
        if (typeUpdate == 'edit') {
          this.getSinistreInfo()
          //reset form 
          formDirective.resetForm();
          this.formInfoBlesses.reset();

          this.consultBlesseShow = false
          this.editBlesseVar = false
          this.editBlesseSuccess = true
          setTimeout(() => {
            this.editBlesseSuccess = false

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
  deleteTier(infoTier: any) {
    const dialogRef = this.dialog.open(DeletePersonneDialogComponent, {
      width: '40%',
      data: {"typeContent":'personne'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data.data) {
        this.informationsBlesse = infoTier
        this.informationsBlesse.dateFin = result.data.dateFin

        this.updatePersonne(undefined, 'delete')
      }
    });
  }
  goBack() {

    if (this.consultBlesseShow) { // step 2 
      this.consultBlesseShow = false
      this.editBlesseVar = false
      this.formInfoBlesses.reset();      
      this.formInfoBlesses.enable();      
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
