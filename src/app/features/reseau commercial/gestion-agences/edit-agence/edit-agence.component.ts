
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//service 
import { GenericService } from '../../../../core/services/generic.service'
import { AgencesService } from '../../../../core/services/agences.service'
import * as moment from 'moment';

@Component({
  selector: 'app-edit-agence',
  templateUrl: './edit-agence.component.html',
  styleUrls: ['./edit-agence.component.scss']
})
export class EditAgenceComponent implements OnInit {
  formCreationAgence: FormGroup | any;
  typeContact: string = "email"
  iconTypeContact: string = ""
  contactsArray: any = []
  typesContact: any = []
  communesByWilaya: any = []
  wilayas: any = []
  zones: any = []
  indexForm = 0
  minDay = new Date()
  maxDay = new Date()
  agence: any = []
  pays: any = {}
  isEmail = true //AD. variable inutilisable
  oneAgence: any = []
  allAgences: any = []
  reseauDistribution: any = []
  codesPostalByWilaya: any = []
  idAgence: any
  errorVar = false
  errorMessage: String = ""
  editAgenceSpinner: boolean = false
  successVar = false
  successMessage: String = ""
  idPays: any 
  statutAgence = ''
  formDisabled = false
  loader=true
  constructor(private agencesService: AgencesService, private genericService: GenericService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.idAgence = this.route.snapshot.paramMap.get('id')

    this.getByAgence()

  }
  initCreationAgence() {

    this.getCommunes(this.oneAgence.idPersonneMorale.adressesList[0].wilaya.idWilaya)
    this.getCodesPostal(this.oneAgence.idPersonneMorale.adressesList[0].wilaya.idWilaya)
    this.formCreationAgence = this.formBuilder.group({
      codeAgence: [this.oneAgence.codeAgence, [Validators.required, Validators.pattern("^[0-9]*$")]],
      nomAgence: [this.oneAgence.idPersonneMorale.raisonSocial, [Validators.required, Validators.pattern("^[A-Za-z0-9 ]+$")]],
      adresse: [this.oneAgence.idPersonneMorale.adressesList[0].description, [Validators.required, Validators.pattern("^[A-Za-zÀ-ȕ0-9(),-_.,' ]+$")]],
      codePostal: [this.oneAgence.idPersonneMorale.adressesList[0].codePostal.idCodePostal, [Validators.required]],
      commune: [this.oneAgence.idPersonneMorale.adressesList[0].commune.idCommune, [Validators.required]],
      wilaya: [this.oneAgence.idPersonneMorale.adressesList[0].wilaya.idWilaya, [Validators.required]],
      newAgence: [{ value: this.oneAgence.newAgence?.idPersonneMorale.raisonSocial, disabled: true }, this.statutAgence=='désactivé' ? [Validators.required]:[]],
      contact: this.formBuilder.array([]),

      agenceAnnexe: [this.oneAgence.codeAnnexe?.idAgence, []],
      codeTresorerie: [this.oneAgence.codeTresorie, [Validators.required, Validators.pattern("^[0-9]*$")]],
      reseauDistribution: [this.oneAgence.reseauDistribution.idReseau, [Validators.required]],
      zone: [this.oneAgence.zone.idParam, [Validators.required]],
      dateOuverture: [this.oneAgence.idPersonneMorale.dateOuverture, [Validators.required]],
    });

  }

  get contact(): FormArray {
    return this.formCreationAgence.get("contact") as FormArray
  }
  initTypeContrat() {
    // get first email 
    let firstEmail = this.oneAgence.idPersonneMorale.contactList?.filter((contact: any) => {
      return contact.typeContact.description == "email"
    })[0]

    this.contact.push(
      this.formBuilder.group({
        typeContact: [{ value: "email", disabled: true }, [Validators.required]],
        idContact: [firstEmail.idContact, [Validators.required]],
        contactEmail: [firstEmail.description, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        contactMobile: ['', [Validators.pattern("^[0-9][0-9]{9}$")]],
        isdeleted: [false],
      })

    );
    this.contactsArray.push({
      index: this.indexForm,
      icon: "mail",
      title: "email",
      type: "email",
    })

    // let allContacts = this.oneAgence.idPersonneMorale.contactList;
    let allContacts = this.oneAgence.idPersonneMorale.contactList.filter(function (el: any) { return el.idContact != firstEmail.idContact; });

    allContacts.filter((contact: any) => {
      this.addExistanceTypeContact(contact.idContact, contact.typeContact.description, contact.description)

    })
    this.disabledForms()
  }


  navigateToAllAgence() {
    this.router.navigate(['reseau-commercial/gestion-agences']);
  }


  //type contact 
  getAllTypeContact() {
    this.genericService.getAllContacts().subscribe({
      next: (data: any) => {
        this.typesContact = data
        this.getReseauDist()
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
        idContact: [0, [Validators.required]],
        contactEmail: ['', [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        contactMobile: ['', [Validators.required, Validators.pattern("^[0-9][0-9]{9}$")]],
        isdeleted: [false],
      })
    );
    this.contactsArray.push({
      index: this.indexForm,
      title: this.typeContact,
      icon: this.iconTypeContact,
      type: "mobile",
    })
  }
  addExistanceTypeContact(idContact: any, typeContact: string, contact: string) {
    this.indexForm = this.indexForm + 1
    this.typeContact = typeContact
    if (typeContact == 'email') {
      this.contact.push(
        this.formBuilder.group({
          typeContact: ["email", [Validators.required]],
          idContact: [idContact, [Validators.required]],
          contactEmail: [contact, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
          contactMobile: ["", [Validators.pattern("^[0-9][0-9]{9}$")]],
          isdeleted: [false],

        })
      );
      this.contactsArray.push({
        index: this.indexForm,
        title: this.typeContact,
        icon: this.iconTypeContact,
        type: "email",
      })
    } else {
      this.contact.push(
        this.formBuilder.group({
          typeContact: ["mobile", [Validators.required]],
          idContact: [idContact, [Validators.required]],
          contactEmail: ["", Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
          contactMobile: [contact, [Validators.required, Validators.pattern("^[0-9][0-9]{9}$")]],
          isdeleted: [false],
        })
      );
      this.contactsArray.push({
        index: this.indexForm,
        title: this.typeContact,
        icon: this.iconTypeContact,
        type: "mobile",
      })
    }

  }
  //wilaya & commune 
  getPays() {
    this.genericService.getPays().subscribe({
      next: (data: any) => {
        this.pays = data
        this.idPays =data.find((pays: any) => pays.codePays == "DZA").idPays
        // get all wilaya
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
        // get ZONES
        this.getAllZones()
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
  // zones
  getAllZones() {
    this.genericService.getAllZones().subscribe({
      next: (data: any) => {
        this.zones = data
        //get all type contact
        this.getAllTypeContact()
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  submitAgence(value: any) {
    let contact: any = []
    let allTypesContact = this.typesContact
    if (this.formCreationAgence.valid) {
      //get contact array 
      this.formCreationAgence.get("contact")?.value?.filter(function (elem: any, i: any) {

        let type: string
        let contactInfo: string
        let dateFin
        if (i == 0)
          type = allTypesContact?.filter((typesContact: any) => { return typesContact.description == "email" })[0]
        else {
          type = allTypesContact?.filter((typesContact: any) => { return typesContact.description == elem.typeContact })[0]

        }

        if (type == allTypesContact?.filter((typesContact: any) => { return typesContact.description == "email" })[0])
          contactInfo = elem.contactEmail
        else
          contactInfo = elem.contactMobile
        //  })
        // if contact new or not deleted 
        if (elem.idContact == 0 || !elem.isdeleted)
          dateFin = ""
        else
          dateFin = new Date()
        contact.push({
          'typeContact': type,
          'description': contactInfo,
          'dateDebut': moment(new Date()).format('YYYY-MM-DD'),
          'dateFin': dateFin != "" ? moment(dateFin).format('YYYY-MM-DD'):"",
          'idContact': elem.idContact,
        })


      })

      //EDIT json agence
      this.agence = {
        "codeTresorie": this.formCreationAgence.get("codeTresorerie").value,
        "codeAgence": this.formCreationAgence.get("codeAgence").value,
        "nomAgence": this.formCreationAgence.get("nomAgence").value,
        "zone": this.zones.find((zone: any) => { return zone.idParam == this.formCreationAgence.get("zone").value }),
        "reseauDistribution": this.reseauDistribution.find((reseau: any) => { return reseau.idReseau == this.formCreationAgence.get("reseauDistribution").value }),
        "codeAnnexe": this.formCreationAgence.get("agenceAnnexe").value,
        "idPersonneMorale": this.oneAgence.idPersonneMorale.idClient,
        "dateOuverture": moment(this.formCreationAgence.get("dateOuverture").value).format('YYYY-MM-DD'),
        "adressesList": [
          {
            "idAdresse": this.oneAgence.idPersonneMorale.adressesList[0].idAdresse,
            "description": this.formCreationAgence.get("adresse").value,
            "pays": this.pays.find((wilaya: any) => wilaya.idWilaya == this.idPays),
            "wilaya": this.wilayas.find((wilaya: any) => wilaya.idWilaya == this.formCreationAgence.get("wilaya").value),
            "commune": this.communesByWilaya.find((commune: any) => { return commune.idCommune == this.formCreationAgence.get("commune").value }),
            "codePostal": this.codesPostalByWilaya.find((codePostal: any) => { return codePostal.idCodePostal == this.formCreationAgence.get("codePostal").value }),
          }
        ],
        "contactList": contact,
      }
      this.editAgence()
    }
  }
  getValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (control.value) {
        if (this.typeContact == "email") {
          if (!control.value.toString().match("^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$")) {
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


    this.contact.at(index).get('isdeleted')?.setValue(true)
    // this.contact.removeAt(index);
    // this.contactsArray.splice(index, 1);
    // this.contactsArray.removeAt(index);
  }
  getByAgence() {
    this.agencesService.getAgenceById(this.idAgence).subscribe({
      next: (data: any) => {
        this.loader=false
        this.oneAgence = data
        this.statutAgence = this.oneAgence.statut
        this.idAgence = this.oneAgence.idAgence
        this.minDay = this.oneAgence.idPersonneMorale.auditDate
        this.maxDay = this.oneAgence.idPersonneMorale.dateDebut
        //get pays 
        this.getAllAgence();
    
      },
      error: (error) => {

        console.log(error);

      }
    });
    this.oneAgence = this.agencesService.getAgenceById(this.idAgence)

  }

  // get all agence
  getAllAgence() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.allAgences = data
        this.allAgences = this.allAgences.filter((agence: any) => !(agence.idAgence == this.idAgence));

        this.getPays();

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  editAgence() {
    // this.editAgenceSpinner=true
    this.agencesService.editAgence(this.agence, this.idAgence).subscribe({
      next: (data: any) => {
      
        this.errorVar = false
        this.successVar = true
        this.successMessage = "L'agence a été modifiée avec succée"
        this.editAgenceSpinner = false
        this.ScollToTop()
      },
      error: (error) => {
        if (error.code == 400) {
          this.errorVar = true
          this.errorMessage = error.message
          this.ScollToTop()
          // this.editAgenceSpinner=false
        }
        console.log(error);

      }
    });
  }
  ScollToTop() {
    const El = document.getElementById('containerRef');
    El?.scrollTo({ top: 100, behavior: 'smooth' });

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
        this.initCreationAgence()
        this.initTypeContrat()
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  disabledForms() {
    this.formDisabled = true
    this.formCreationAgence.disable()
    this.formCreationAgence.get('contact').controls
      .forEach((control: any) => {

        control.disable();
      })
  }
  enableForm() {
    this.formDisabled = false
    this.formCreationAgence.enable()
    // this.formCreationAgence.get('contact').controls
    //   .forEach((control: any, index: number) => {
    //     if (index == 0)
    //      control.disable();
     
    //   })
  }
}

