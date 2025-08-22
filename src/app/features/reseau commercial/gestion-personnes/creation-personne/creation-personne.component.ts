import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Patterns } from 'src/app/core/validiators/patterns';
import Swal from 'sweetalert2'

//Models
import { CodePostal } from 'src/app/core/models/code-postal';
import { Commune } from 'src/app/core/models/commune';
import { Pays } from 'src/app/core/models/pays';
import { PersonneMorale } from 'src/app/core/models/personne-morale';
import { PersonnePhysique } from 'src/app/core/models/personne-physique';
import { Profession } from 'src/app/core/models/profession';
import { SecteurActivite } from 'src/app/core/models/secteur-activite';
import { Wilaya } from 'src/app/core/models/wilaya';

//Services
import { GenericService } from 'src/app/core/services/generic.service';
import { PersonneService } from 'src/app/core/services/personne.service';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-personne',
  templateUrl: './creation-personne.component.html',
  styleUrls: ['./creation-personne.component.scss']
})
export class CreationPersonneComponent implements OnInit {

  personneCreationError = false;
  personneCreationSuccess = false;
  messageError: string;
  personne: boolean = false;
  sexes: any;
  situationsFamiliale: any;
  nationalites: any;
  titres: any;
  statuts: any = ['EURL', 'SNC', 'SARL', 'SPA', 'SPASU', 'SPAS', 'Groupement', 'Association', 'Fondation', 'Artisan', 'Profession libérale', 'Personne physique commercante'];
  types_document: any;
  types_contact: any;
  types_modalite: any;
  types_relation: any;
  categories: any = ['A', 'B', 'C'];
  pays: Pays[];
  wilayas: Wilaya[];
  communes: Commune[];
  codesPostal: CodePostal[];
  typesEntreprise: any;
  secteursActivite: SecteurActivite[];
  professions: Profession[];
  formCreationPersonnePhysique: FormGroup | any;
  formCreationPersonneMorale: FormGroup | any;
  formCreationAdresse: FormGroup | any;
  formCreationModalite: FormGroup | any;
  formCreationContact: FormGroup | any;
  formCreationProfession: FormGroup | any;
  formCreationDocument: FormGroup | any;
  formCreationRib: FormGroup | any;
  formCreationRelation: FormGroup | any;
  minDate = new Date();
  personnePhysique: PersonnePhysique;
  personneMorale: PersonneMorale;
  myControl = new FormControl<any>('');
  somePlaceholder: string;
  message = false;
  idPays: any
  adresses: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsAdresse: string[] = ['description', 'pays', 'wilaya', 'commune', 'codePostal', 'action'];
  lengthColumnsAdresse = this.displayedColumnsAdresse.length;

  modalites: MatTableDataSource<any> = new MatTableDataSource();;
  displayedColumnsModalite: string[] = ['typeModalite', 'tauxModalite', 'action'];
  lengthColumnsModalite = this.displayedColumnsModalite.length;

  contacts: MatTableDataSource<any> = new MatTableDataSource();;
  displayedColumnsContact: string[] = ['typeContact', 'description', 'dateDebut', 'action'];
  lengthColumnsContact = this.displayedColumnsContact.length;

  professionsPersonne: MatTableDataSource<any> = new MatTableDataSource();;
  displayedColumnsProfession: string[] = ['secteurActivite', 'profession', 'action'];
  lengthColumnsProfession = this.displayedColumnsProfession.length;

  documentPersonne: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsDocument: string[] = ['typeDocument', 'description', 'dateDelivrance', 'dateExpiration', 'wilaya', 'commune', 'action'];
  lengthColumnsDocument = this.displayedColumnsDocument.length;

  ribPersonne: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsRIB: string[] = ['description', 'swift', 'action'];
  lengthColumnsRIB = this.displayedColumnsRIB.length;

  relationPersonne: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsRelation: string[] = ['DNI', 'typeRelation', 'action'];
  lengthColumnsRelation = this.displayedColumnsRelation.length;

  filteredOptions: Observable<any>;
  personnes: any;
  isLoogedOut = false;
  msg = false;
  selected: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private router: Router, private formBuilderAuth: FormBuilder, private personneService: PersonneService, private genericService: GenericService) { }

  changePage(message: any) {
    this.message = message;
    this.ScollToTop();
  }

  ScollToTop() {
    const El = document.getElementById('containerRef');
    El?.scrollTo({ top: 100, behavior: 'smooth' });

  }

  changeStatut(value: any) {
    console.log(value)
    switch (value) {
      case "EURL":
      case "SNC":
      case "SARL":
      case "SPA":
      case "SPASU":
      case "SPAS":
        this.formCreationPersonneMorale.get('nif').setValidators([Validators.required])
        break;
    
      default:
        this.formCreationPersonneMorale.get('nif').setValidators([])
        break;
    }
    this.formCreationPersonneMorale.get('nif').updateValueAndValidity();

  }

  async ngOnInit() {
    this.getAllParameters();

    this.formCreationPersonnePhysique = await this.formBuilderAuth.group({
      nom: ['', [Validators.required]],
      titre: [''],
      nomJeuneFille: [''],
      prenom1: ['', [Validators.required]],
      prenom2: [''],
      prenom3: [''],
      sexe: ['', [Validators.required]],
      situationFamiliale: [''],
      nationalite: [[], [Validators.required]],
      nationalitesList: [[]],
      pays: [''],
      wilaya: [''],
      commune: [''],
      nin: [''],
      vip: [false],
      dateNaissance: ['', [Validators.required]],
      dateDebut: [new Date()],
      dateFin: [''],
      auditUser: ['latif'],
      professionSecteur: [[]],
      modaliteList: [[]],
      donneBancaireList: [[]],
      documentList: [[]],
      contactList: [[]],
      adressesList: [[]],
      relationList: [[]],
    });

    this.formCreationPersonneMorale = await this.formBuilderAuth.group({
      raisonSocial: ['', [Validators.required]],
      typeEntreprise: [''],
      capitaleSocial: [''],
      statue: [''],
      chiffreAffaire: [''],
      secteurActivite: [''],
      nombreSalarie: [''],
      nif: [null, [Validators.required, Validators.pattern(Patterns.NIF)]],
      vip: [false],
      dateOuverture: [''],
      dateDebut: [new Date()],
      dateFin: [''],
      auditUser: [null],
      professionSecteur: [[]],
      donneBancaireList: [[]],
      documentList: [[]],
      contactList: [[]],
      adressesList: [[]],
      relationList: [[]],
    });

    this.formCreationAdresse = await this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      pays: ['', [Validators.required]],
      wilaya: ['', [Validators.required]],
      commune: ['', [Validators.required]],
      codePostal: ['', [Validators.required]],
    });

    this.formCreationContact = await this.formBuilderAuth.group({
      typeContact: ['', [Validators.required]],
      description: [{ value: '', disabled: true }, [Validators.required]],
      dateDebut: [new Date()]
    });

    this.formCreationProfession = await this.formBuilderAuth.group({
      secteurActivite: [''],
      profession: [''],
      dateDebutProfession: [new Date()],
      dateFinProfession: [''],
    });

    this.formCreationDocument = await this.formBuilderAuth.group({
      typeDocument: [''],
      description: [{ value: '', disabled: true }],
      dateDelivrance: [{ value: '', disabled: true }],
      dateExpiration: [{ value: '', disabled: true }],
      wilaya: [{ value: '', disabled: true }],
      commune: [{ value: '', disabled: true }],
      sousCategorie: [''],
    });

    this.formCreationRib = await this.formBuilderAuth.group({
      description: [''],
      swift: [''],
      dateDebut: [new Date()],
      dateFin: ['']
    });

    this.formCreationRelation = await this.formBuilderAuth.group({
      idClient: [''],
      typeRelation: [''],
      dateDebut: [new Date()],
      dateFin: ['']
    });

    this.filteredOptions = await this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.nom ? value?.nom + value?.prenom1 : value?.raisonSocial;
        return name ? this._filter(name as string) : this.personnes?.slice();
      }),
    );
  }

  enableContact(typeContact: any) {
    this.formCreationContact.get('description').enable();
    if (typeContact == "email") {
      this.formCreationContact.get('description').setValue('')
      this.formCreationContact.get('description').setValidators([Validators.pattern(Patterns.email)])
      this.somePlaceholder = "exemple@exemple.com"
    }
    else if (typeContact == "fix" || typeContact == "fax") {
      this.formCreationContact.get('description').setValue('+213')
      this.formCreationContact.get('description').setValidators([Validators.pattern(Patterns.indicatifFix)])
      this.somePlaceholder = "+213"
    }
    else {
      this.formCreationContact.get('description').setValue('+213')
      this.formCreationContact.get('description').setValidators([Validators.pattern(Patterns.indicatifMobile)])
      this.somePlaceholder = "+213"
    }
  }

  enableDocument() {
    this.formCreationDocument.get('description').enable();
    this.formCreationDocument.get('dateDelivrance').enable();
    this.formCreationDocument.get('dateExpiration').enable();
    this.formCreationDocument.get('wilaya').enable();
    this.formCreationDocument.get('commune').enable();
  }

  delete(type: string, index: number) {
    Swal.fire({
      title: 'Etes vous sur de vouloir supprimer ?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        switch (type) {
          case 'adresse':
            let adresses = this.adresses.data
            adresses.splice(index, 1);
            this.adresses = new MatTableDataSource(adresses);
            break;
          case 'contact':
            let contacts = this.contacts.data
            this.contacts.data.splice(index, 1);
            this.contacts = new MatTableDataSource(contacts);
            break;
          case 'profession':
            let professionsPersonne = this.professionsPersonne.data
            this.professionsPersonne.data.splice(index, 1);
            this.professionsPersonne = new MatTableDataSource(professionsPersonne);
            break;
          case 'document':
            let documentPersonne = this.documentPersonne.data
            this.documentPersonne.data.splice(index, 1);
            this.documentPersonne = new MatTableDataSource(documentPersonne);
            break;
          case 'rib':
            let ribPersonne = this.ribPersonne.data
            this.ribPersonne.data.splice(index, 1);
            this.ribPersonne = new MatTableDataSource(ribPersonne);
            break;
          case 'relation':
            let relationPersonne = this.relationPersonne.data
            this.relationPersonne.data.splice(index, 1);
            this.relationPersonne = new MatTableDataSource(relationPersonne);
            break;

          default:
            break;
        }
      }
    })
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();

    return this.personnes.filter((option: any) => option.nom ? (option.nom + option.prenom1).toLowerCase().includes(filterValue) : option.raisonSocial.toLowerCase().includes(filterValue));
  }

  getCommuneByWilaya(idWilaya: any) {
    let id = idWilaya.idWilaya == undefined ? idWilaya : idWilaya.idWilaya;
    this.genericService.getAllCommuneByWilaya(id).subscribe({
      next: (data: any) => {
        this.communes = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  getCodeByCommune(idCommune: any) {
    let id = idCommune.idCommune == undefined ? idCommune : idCommune.idCommune;
    this.genericService.getAllCodeByCommune(id).subscribe({
      next: (data: any) => {
        this.codesPostal = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  getAllParameters() {
    //Types Entreprise
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C4").idCategorie).subscribe({
      next: (data: any) => {
        this.typesEntreprise = data;
      },
      error: (error) => { console.log(error); }
    });

    //Pays
    this.genericService.getPays().subscribe({
      next: (data: any) => {
        this.pays = data;
        this.nationalites = data;
        this.idPays = data.find((pays: any) => pays.codePays == "DZA").idPays

        this.genericService.getAllWilayas(this.idPays).subscribe({
          next: (data: any) => {
            this.wilayas = data
          },
          error: (error) => {

            console.log(error);

          }
        });

      },
      error: (error) => { console.log(error); }
    });

    //Wilayas


    //Types contact
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C3").idCategorie).subscribe({
      next: (data: any) => {
        this.types_contact = data;
      },
      error: (error) => { console.log(error); }
    });

    //Genre
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C6").idCategorie).subscribe({
      next: (data: any) => {
        this.sexes = data;
      },
      error: (error) => { console.log(error); }
    });

    //Civilités
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C10").idCategorie).subscribe({
      next: (data: any) => {
        this.titres = data;
      },
      error: (error) => { console.log(error); }
    });

    //Situation Familiale
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C1").idCategorie).subscribe({
      next: (data: any) => {
        this.situationsFamiliale = data;
      },
      error: (error) => { console.log(error); }
    });

    //Secteurs d'activité
    this.genericService.getSecteur().subscribe({
      next: (data: any) => {
        this.secteursActivite = data;
      },
      error: (error) => { console.log(error); }
    });

    //Profession
    this.genericService.getProfession().subscribe({
      next: (data: any) => {
        this.professions = data;
      },
      error: (error) => { console.log(error); }
    });

    //Types Document
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C2").idCategorie).subscribe({
      next: (data: any) => {
        this.types_document = data;
      },
      error: (error) => { console.log(error); }
    });

    //Types relation
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C8").idCategorie).subscribe({
      next: (data: any) => {
        this.types_relation = data;
      },
      error: (error) => { console.log(error); }
    });

    //All personne
    this.personneService.getAllPersonne().subscribe({
      next: (data: any) => {
        this.personnes = data;
      },
      error: (error) => { console.log(error); }
    });
  }

  ajouterSecteur(formDirective: any) {
    if (this.formCreationProfession.value.secteurActivite != '' && this.formCreationProfession.value.profession != '') {
      let add = true;
      if (this.professionsPersonne.data.length == 0) {
        this.professionsPersonne.data = [];
      }
      else {
        this.professionsPersonne.data.map(profession => {
          (profession.secteurActivite.description == this.formCreationProfession.value.secteurActivite.description && profession.profession.description == this.formCreationProfession.value.profession.description) ? add = false : ""
        })
      }

      if (add) {
        this.professionsPersonne.data.push(this.formCreationProfession.value)
        this.paginate(this.professionsPersonne)
        this.formCreationProfession = this.formBuilderAuth.group({
          secteurActivite: [''],
          profession: [''],
          dateDebutProfession: [new Date()],
          dateFinProfession: [''],
        });
      }
      else {
        Swal.fire(
          'la profession existe déjà',
          '',
          'error'
        )
      }
    }
  }

  ajouterDocument(formDirective: any) {
    if (this.formCreationDocument.value.typeDocument != '' && this.formCreationDocument.value.description != '') {
      let add = true;
      if (this.documentPersonne.data.length == 0) {
        this.documentPersonne.data = [];
      }
      else {
        this.documentPersonne.data.map(doc => {
          (doc.description == this.formCreationDocument.value.description) ? add = false : ""
        })
      }

      if (add) {
        this.documentPersonne.data.push(this.formCreationDocument.value)
        this.paginate(this.documentPersonne)
        this.formCreationDocument = this.formBuilderAuth.group({
          typeDocument: [''],
          description: [{ value: '', disabled: true }],
          dateDelivrance: [{ value: '', disabled: true }],
          dateExpiration: [{ value: '', disabled: true }],
          wilaya: [{ value: '', disabled: true }],
          commune: [{ value: '', disabled: true }],
          sousCategorie: [''],
        });
      }
      else {
        Swal.fire(
          'le document existe déjà',
          '',
          'error'
        )
      }
    }
  }

  ajouterAdresse(formDirective: any) {
    if (this.formCreationAdresse.value.description != '' && this.formCreationAdresse.value.pays != '' && this.formCreationAdresse.value.wilaya != '' && this.formCreationAdresse.value.commune != '' && this.formCreationAdresse.value.codePostal != '') {
      let add = true;
      if (this.adresses.data.length == 0) {
        this.adresses.data = []
      }
      else {
        this.adresses.data.map(address => {
          (address.description == this.formCreationAdresse.value.description && address.pays.description == this.formCreationAdresse.value.pays.description && address.wilaya.description == this.formCreationAdresse.value.wilaya.description && address.commune.description === this.formCreationAdresse.value.commune.description && address.codePostal.description == this.formCreationAdresse.value.codePostal.description) ? add = false : ""
        })
      }

      if (add) {
        this.adresses.data.push(this.formCreationAdresse.value)
        this.paginate(this.adresses)
        this.formCreationAdresse = this.formBuilderAuth.group({
          description: ['', [Validators.required]],
          pays: ['', [Validators.required]],
          wilaya: ['', [Validators.required]],
          commune: ['', [Validators.required]],
          codePostal: ['', [Validators.required]],
        });
      }
      else {
        Swal.fire(
          'l\'adresse existe déjà',
          '',
          'error'
        )
      }
    }
  }

  ajouterContact(formDirective: any) {
    if (this.formCreationContact.value.typeContact != '' && this.formCreationContact.value.description != '' && this.formCreationContact.controls.description.valid) {
      let add = true;
      if (this.contacts.data.length == 0) {
        this.contacts.data = [];
      }
      else {
        this.contacts.data.map(contact => {
          (contact.description == this.formCreationContact.value.description) ? add = false : ""
        })
      }

      if (add) {
        this.contacts.data.push(this.formCreationContact.value)
        this.paginate(this.contacts)
        this.formCreationContact = this.formBuilderAuth.group({
          typeContact: ['', [Validators.required]],
          description: [{ value: '', disabled: true }, [Validators.required]],
          dateDebut: [new Date()]
        });
      }
      else {
        Swal.fire(
          'le contact existe déjà',
          '',
          'error'
        )
      }
    }
  }

  ajouterRib(formDirective: any) {
    if (this.formCreationRib.value.description != '' && this.formCreationRib.controls.description.valid) {
      let add = true;
      if (this.ribPersonne.data.length == 0) {
        this.ribPersonne.data = []
      }
      else {
        this.ribPersonne.data.map(rib => {

          (rib.description == this.formCreationRib.value.description) ? add = false : ""
        })
      }

      if (add) {
        this.ribPersonne.data.push(this.formCreationRib.value)
        this.paginate(this.ribPersonne)
        this.formCreationRib = this.formBuilderAuth.group({
          description: [''],
          swift: [''],
          dateDebut: [new Date()],
          dateFin: ['']
        });
      }
      else {
        Swal.fire(
          'le RIB existe déjà',
          '',
          'error'
        )
      }
    }
  }

  ajouterRelation(formDirective: any) {
    if (this.formCreationRelation.value.typeRelation != '' && this.myControl.value != '') {
      let add = true;
      this.formCreationRelation.value.idClient = this.myControl.value
      if (this.relationPersonne.data.length == 0) {
        this.relationPersonne.data = []
      }
      else {
        this.relationPersonne.data.map(relation => {
          (relation.idClient == this.formCreationRelation.value.idClient) ? add = false : ""
        })
      }

      if (add) {
        this.relationPersonne.data.push(this.formCreationRelation.value)
        this.paginate(this.relationPersonne)
        this.formCreationRelation = this.formBuilderAuth.group({
          idClient: [''],
          typeRelation: [''],
          dateDebut: [new Date()],
          dateFin: ['']
        });
        this.myControl = new FormControl<any>('');
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            const name = typeof value === 'string' ? value : value?.nom ? value?.nom + value?.prenom1 : value?.raisonSocial;
            return name ? this._filter(name as string) : this.personnes?.slice();
          }),
        );
      }
      else {
        Swal.fire(
          'la relation existe déjà',
          '',
          'error'
        )
      }
    }
  }

  sauvegarderPersonne() {

    //IF personne physique
    if (this.personne) {
      this.personnePhysique = this.formCreationPersonnePhysique.value

      //Ajouter les secteur d'activté et professions a la personne
      this.professionsPersonne.data.forEach(profession => {
        this.personnePhysique.professionSecteur?.push({
          id: 0,
          secteurActivite: profession.secteurActivite.idSecteur,
          profession: profession.profession.idProfession,
          dateDebutProfession: moment(profession.dateDebutProfession).format('YYYY-MM-DD'),
          dateFinProfession: moment(profession.dateFinProfession).format('YYYY-MM-DD')
        })
      });

      //Ajouter les document a la personne
      this.documentPersonne.data.forEach(document => {
        this.personnePhysique.documentList?.push({
          idDocument: 0,
          typeDocument: document.typeDocument.idParam,
          description: document.description,
          sousCategorie: document.sousCategorie,
          dateDelivrance: moment(document.dateDelivrance).format('YYYY-MM-DD'),
          dateExperation: moment(document.dateExperation).format('YYYY-MM-DD'),
          communeDelivrance: document.commune.idCommune,
          wilayaDelivrance: document.wilaya.idWilaya
        })
      });

      //Ajouter les adresses a la personne
      this.adresses.data.forEach(adresse => {
        this.personnePhysique.adressesList?.push({
          idAdresse: 0,
          description: adresse.description,
          pays: adresse.pays.idPays,
          wilaya: adresse.wilaya.idWilaya,
          commune: adresse.commune.idCommune,
          codePostal: adresse.codePostal.idCodePostal
        })
      });

      //Ajouter les contact a la personne
      this.contacts.data.forEach(contact => {
        this.personnePhysique.contactList?.push({
          idContact: 0,
          idTypeContact: contact.typeContact.idParam,
          typeContact: contact.typeContact,
          description: contact.description,
          dateDebut: moment(contact.dateDebut).format('YYYY-MM-DD')
        })
      });

      //Ajouter les compte RIB a la personne
      this.ribPersonne.data.forEach(rib => {

        this.personnePhysique.donneBancaireList?.push({
          description: rib.description,
          swift: rib.swift,
          dateDebut: moment(rib.dateDebut).format('YYYY-MM-DD'),
          dateFin: rib.dateFin == "" ? '' : moment(rib.dateFin).format('YYYY-MM-DD')
        })
      });

      //Ajouter les relations a la personne
      this.relationPersonne.data.forEach((relation: any) => {
        this.personnePhysique.relationList?.push({
          adherent: relation.idClient,
          dateDebut: moment(relation.dateDebut).format('YYYY-MM-DD'),
          dateFin: moment(relation.dateFin).format('YYYY-MM-DD'),
          relation: relation.typeRelation
        })
      });

      //Ajouter les nationnalités a la personne
      this.personnePhysique.nationalite.forEach((nat: any) => {
        this.personnePhysique.nationalitesList?.push({
          nationalite: nat,
          dateDebut: "",
          dateFin: "",
        })
      });


      this.personneService.addPersonne(this.personnePhysique, "physique").subscribe(
        (data: any) => {
          if (data.idClient != undefined) {
            this.personneCreationSuccess = true;
            this.personneCreationError = false;
            this.formCreationPersonnePhysique.reset();
            Swal.fire(
              `La personne N°${data.idClient} a été créée avec succés`,
              '',
              'success'
            )
            this.back();
          }
          else {
            this.personneCreationError = true;
            this.personneCreationSuccess = false;
            data.message ? this.messageError = data.message : this.messageError = data.ErreurMessage;
            Swal.fire(
              this.messageError,
              '',
              'error'
            )
          }
        },

        error => {
          this.personneCreationError = true;
          this.personneCreationSuccess = false;
          error.message ? this.messageError = error.message : this.messageError = error.ErreurMessage;
          Swal.fire(
            this.messageError,
            '',
            'error'
          )
        })
    }
    else {//Personne morale
      this.personneMorale = this.formCreationPersonneMorale.value

      //Ajouter le secteur d'activité a la personne
      this.personneMorale.secteurActivite = this.formCreationProfession.value.secteurActivite.idSecteur

      //Ajouter les document a la personne
      this.documentPersonne.data.forEach(document => {
        this.personneMorale.documentList?.push({
          idDocument: 0,
          typeDocument: document.typeDocument.idParam,
          description: document.description,
          sousCategorie: document.sousCategorie,
          dateDelivrance: moment(document.dateDelivrance).format('YYYY-MM-DD'),
          dateExperation: moment(document.dateExperation).format('YYYY-MM-DD'),
          communeDelivrance: document.commune.idCommune,
          wilayaDelivrance: document.wilaya.idWilaya
        })
      });

      //Ajouter les adresses a la personne
      this.adresses.data.forEach(adresse => {
        this.personneMorale.adressesList?.push({
          idAdresse: 0,
          description: adresse.description,
          pays: adresse.pays.idPays,
          wilaya: adresse.wilaya.idWilaya,
          commune: adresse.commune.idCommune,
          codePostal: adresse.codePostal.idCodePostal
        })
      });

      //Ajouter les contacts a la personne
      this.contacts.data.forEach(contact => {
        this.personneMorale.contactList?.push({
          idContact: 0,
          idTypeContact: contact.typeContact.idParam,
          typeContact: contact.typeContact,
          description: contact.description,
          dateDebut: moment(contact.dateDebut).format('YYYY-MM-DD')
        })
      });

      //Ajouter les comptes RIB a la personne
      this.ribPersonne.data.forEach(rib => {
      
        this.personneMorale.donneBancaireList?.push({
          description: rib.description,
          swift: rib.swift,
          dateDebut: moment(rib.dateDebut).format('YYYY-MM-DD'),
          dateFin: rib.dateFin == "" ? '' : moment(rib.dateFin).format('YYYY-MM-DD')
        })
      });

      //Ajouter les relations a la personne
      this.relationPersonne.data.forEach((relation: any) => {
        this.personneMorale.relationList?.push({
          adherent: relation.idClient,
          dateDebut: moment(relation.dateDebut).format('YYYY-MM-DD'),
          dateFin: moment(relation.dateFin).format('YYYY-MM-DD'),
          relation: relation.typeRelation
        })
      });


      this.personneService.addPersonne(this.personneMorale, "morale").subscribe(
        (data: any) => {
          if (data.idClient != undefined) {
            this.personneCreationSuccess = true;
            this.personneCreationError = false;
            this.formCreationPersonneMorale.reset();
            Swal.fire(
              `La personne N°${data.idClient} a été créée avec succés`,
              '',
              'success'
            )
            this.back();
          }
          else {
            this.personneCreationError = true;
            this.personneCreationSuccess = false;
            data.ErreurMessage ? this.messageError = data.ErreurMessage : this.messageError = data.message;
            Swal.fire(
              this.messageError,
              '',
              'error'
            )
          }

        },

        error => {
          console.log(error)
          this.personneCreationError = true;
          this.personneCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
          Swal.fire(
            this.messageError,
            '',
            'error'
          )
        })
    }
  }

  //paginations des tables (adresses, contacts, professions, rib, relations)
  paginate(dataSource: any) {
    dataSource.paginator = this.paginator;
    dataSource.sort = this.sort;
  }

  back() {
    this.router.navigateByUrl("gestion-personnes");
  }

  debutDateChange(value: any) {
    this.minDate = value

  }

}
