import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ElementRef } from "@angular/core";

//pattern
import { Patterns } from '../../../../core/validiators/patterns'



//service 
import { GenericService } from '../../../../core/services/generic.service'
import { AgencesService } from '../../../../core/services/agences.service'
import * as moment from 'moment';

@Component({
  selector: 'app-create-agence',
  templateUrl: './create-agence.component.html',
  styleUrls: ['./create-agence.component.scss']
})
export class CreateAgenceComponent implements OnInit {
  formCreationAgence: FormGroup | any;

  public containerRef!: ElementRef; // Using "definite assignment" assertion (query).

  typeContact: string = "email"
  iconTypeContact: string = ""
  contactsArray: any = []
  typesContact: any = []
  communesByWilaya: any = []
  wilayas: any = []
  zones: any = []
  indexForm = 0
  minDay = new Date()
  agence: any = []
  allAgences: any = []
  codesPostalByWilaya: any = []
  reseauDistribution: any = []
  isEmail = true //AD. variable inutilisable
  errorVar = false
  errorMessage: String = ""
  idPays: any
  successVar = false
  successMessage: String = "" //AD. variable inutilisable
  // codeAgence: any
  createAgenceSpinner:boolean=false
  idPersonne: any;
  codeAgence: any;
  constructor( private agencesService: AgencesService, private genericService: GenericService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getIdPays("DZA")
    this.initCreationAgence()
    this.initTypeContrat()
    //get all agences 
    this.getAllAgence();
    // get all type contrat
    this.getAllTypeContact()
    // get all wilaya
   // this.getAllWilaya()
    // get ZONES
    this.getAllZones()
    // get reseau distribution
    this.getReseauDist()
    
  }
  initTypeContrat() {
    this.contact.push(
      this.formBuilder.group({
        typeContact: [{ value: "email", disabled: true }, [Validators.required]],
        contactEmail: ['', [Validators.required, Validators.pattern(Patterns.email)]],
        contactMobile: ['', [Validators.pattern(Patterns.mobile)]],
      })
    );
    this.contactsArray.push({
      index: this.indexForm,
      icon: "mail",
      title: "email",
      type: "email",
    })
  }
  initCreationAgence() {
    this.formCreationAgence = this.formBuilder.group({
      // codeAgence: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      nomAgence: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9 ]+$")]],
      adresse: ['', [Validators.required, Validators.pattern("^[A-Za-zÀ-ȕ0-9(),-_.,' ]+$")]],
      codePostal: ['', [Validators.required]],
      commune: ['', [Validators.required]],
      wilaya: ['', [Validators.required]],
      // typeContact: ['', [Validators.required]],
      // contact: ['', [Validators.required]],
      contact: this.formBuilder.array([]),

      agenceAnnexe: ['', []],
      codeTresorerie: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      reseauDistribution: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      dateOuverture: ['', [Validators.required]],
    });
  }
  navigateToAllAgence() {
    this.router.navigate(['reseau-commercial/gestion-agences']);
  }

  get contact(): FormArray {
    return this.formCreationAgence.get("contact") as FormArray
  }
  // get all agence
  getAllAgence() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.allAgences = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  //type contact 
  getAllTypeContact() {
    this.genericService.getAllContacts().subscribe({
      next: (data: any) => {
        this.typesContact = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  changeTypeContact(value: any, index: any) {
    this.typeContact = value
    switch (value) {
      case "fax": {
        //fax; 
        this.iconTypeContact = "print"
        this.contact.at(index).get('contactEmail')?.setValidators([]);
        this.contact.at(index).get('contactMobile')?.setValidators([Validators.required]);
        break;
      }
      case "conjoint": {
        //fixe; 
        this.iconTypeContact = "fax"
        this.contact.at(index).get('contactEmail')?.setValidators([]);
        this.contact.at(index).get('contactMobile')?.setValidators([Validators.required]);

        break;
      }
      case "mobile": {
        //mobile; 
        this.iconTypeContact = "call"
        this.contact.at(index).get('contactEmail')?.setValidators([]);
        this.contact.at(index).get('contactMobile')?.setValidators([Validators.required]);
        break;
      }
      case "email": {
        //email; 
        this.iconTypeContact = "mail"

        this.contact.at(index).get('contactEmail')?.setValidators([Validators.required]);
        this.contact.at(index).get('contactMobile')?.setValidators([]);
        // this.typeContact = "email"

        break;
      }
      default: {
        //statements; 
        break;
      }
    }
    this.contactsArray.filter((contact: any) => {
      if (contact.index == index) {
        contact.type = this.typeContact
        contact.title = this.typeContact
        contact.icon = this.iconTypeContact
      }
    })
  }
  addTypeContact() {
    this.indexForm = this.indexForm + 1
    this.typeContact = "mobile"
    this.contact.push(
      this.formBuilder.group({
        typeContact: ['mobile', [Validators.required]],
        contactEmail: ['', [Validators.pattern(Patterns.email)]],
        contactMobile: ['', [Validators.required, Validators.pattern(Patterns.mobile)]],
      })
    );
    this.contactsArray.push({
      index: this.indexForm,
      title: this.typeContact,
      icon: this.iconTypeContact,
      type: "mobile",
    })
  }
  getIdPays(codePays:string){
    this.genericService.getPays().subscribe({
      next: (data: any) => {

        this.idPays =data.find((pays: any) => pays.codePays == codePays).idPays
    
        this.getAllWilaya()
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  //wilaya & commune 
  getAllWilaya() {
    this.genericService.getAllWilayas(this.idPays).subscribe({
      next: (data: any) => {
        this.wilayas = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  // zones
  getAllZones() {
    this.genericService.getAllZones().subscribe({
      next: (data: any) => {
        this.zones = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getInfoByWilaya(idWilaya: any) {
    this.getCommunes(idWilaya)
    this.getCodesPostal(idWilaya)
  }
  getCommunes(idWilaya: any) {
    this.genericService.getAllCommuneByWilaya(idWilaya).subscribe({
      next: (data: any) => {
        this.communesByWilaya = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  getCodesPostal(idWilaya: any) {
    this.genericService.getCodesPostal(idWilaya).subscribe({
      next: (data: any) => {
        this.codesPostalByWilaya = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  getReseauDist() {
    this.genericService.getReseauDistribution().subscribe({
      next: (data: any) => {
        this.reseauDistribution = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  submitAgence(formDirective: any) {

    let contact: any = []
    let allTypesContact = this.typesContact
    if (this.formCreationAgence.valid) {
      //get contact array 

      this.formCreationAgence.get("contact").value.filter(function (elem: any, i: any) {


        let type: string
        let contactInfo: string
        if (i == 0)
          type = allTypesContact.filter((typesContact: any) => { return typesContact.description == "email" })[0].idParam
        else {
          type = allTypesContact.filter((typesContact: any) => { return typesContact.description == elem.typeContact })[0].idParam

        }

        if (type == allTypesContact.filter((typesContact: any) => { return typesContact.description == "email" })[0].idParam)
          contactInfo = elem.contactEmail
        else
          contactInfo = elem.contactMobile

        contact.push({
          'idTypeContact': type,
          'description': contactInfo,
          'dateDebut': moment(new Date()).format('YYYY-MM-DD'),
          'dateFin': '',
        })


      })

      //create json agence
      this.agence = {
        // "codeAgence": this.formCreationAgence.get("codeAgence").value,
        "codeTresorie": this.formCreationAgence.get("codeTresorerie").value,
        "nomAgence": this.formCreationAgence.get("nomAgence").value,
        "zone": this.formCreationAgence.get("zone").value,
        "reseauDistribution": this.formCreationAgence.get("reseauDistribution").value,
        "codeAnnexe": this.formCreationAgence.get("agenceAnnexe").value,
        "dateOuverture": moment(this.formCreationAgence.get("dateOuverture").value).format('YYYY-MM-DD'),
        "adressesList": [
          {
            "description": this.formCreationAgence.get("adresse").value,
            "pays": this.idPays,
            "wilaya": this.formCreationAgence.get("wilaya").value,
            "commune": this.formCreationAgence.get("commune").value,
            "codePostal": this.formCreationAgence.get("codePostal").value,
          }
        ],
        "contactList": contact
      }
      this.createAgence(formDirective);


    }
  }
  createAgence(formDirective: any) {
    // this.createAgenceSpinner=true
    this.agencesService.createAgence(this.agence).subscribe({
      next: (data: any) => {
       //this.codeAgence = this.agence.codeAgence
        formDirective.resetForm();
        this.formCreationAgence.reset();
        this.errorVar = false
        this.successVar = true
        // this.createAgenceSpinner=false
      this.codeAgence=data.codeAgence
      this.idPersonne=data.idPersonne
        this.ScollToTop()
      },
      error: (error) => {
        if (error.code == 400) {
          this.errorVar = true
          this.successVar = false
          this.errorMessage = error.message
          this.ScollToTop()
        }
        console.log(error);

      }
    });
  }
  navigateToPerson(){
   let url="gestion-personnes/"+this.idPersonne +"/edit"


   window.location.href =url;
  }
  ScollToTop() {
    const El = document.getElementById('containerRef');
    El?.scrollTo({ top: 100, behavior: 'smooth' });

  }
  getValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      if (control.value) {
        if (this.typeContact == "email") {
  
          if (!control.value.toString().match("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
           
            return {
              'emailInvalid': true
            };
          }
        } else {
          if (!control.value.toString().match("^[0-9][0-9]{9}$")) {
            return {
              'mobile': true
            };
          }
        }


      }
      return null;
    }
  }
  deleteContact(index: number) {

    this.contact.removeAt(index);
    this.contactsArray.splice(index, 1);
    // this.contactsArray.removeAt(index);
  }

}
