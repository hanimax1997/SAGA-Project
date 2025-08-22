import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { CodePostal } from 'src/app/core/models/code-postal';
import { Commune } from 'src/app/core/models/commune';
import { Pays } from 'src/app/core/models/pays';
import { PersonneMorale } from 'src/app/core/models/personne-morale';
import { PersonnePhysique } from 'src/app/core/models/personne-physique';
import { Profession } from 'src/app/core/models/profession';
import { SecteurActivite } from 'src/app/core/models/secteur-activite';
import { Wilaya } from 'src/app/core/models/wilaya';
import { GenericService } from 'src/app/core/services/generic.service';
import { PersonneService } from 'src/app/core/services/personne.service';
import Swal from 'sweetalert2'
import * as moment from 'moment';
import { Adresse } from 'src/app/core/models/adresse';
import { Modalite } from 'src/app/core/models/modalite';
import { Contact } from 'src/app/core/models/contact';
import { ProfessionSecteur } from 'src/app/core/models/professionSecteur';
import { Documents } from 'src/app/core/models/document';
import { Patterns } from 'src/app/core/validiators/patterns';

@Component({
  selector: 'app-edit-personne',
  templateUrl: './edit-personne.component.html',
  styleUrls: ['./edit-personne.component.scss']
})
export class EditPersonneComponent implements OnInit {

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
  idPays:any
  types_modalite: any;
  types_rib: any = ['CCP', 'RIB'];
  types_relation: any;
  categories: any = ['A', 'B', 'C'];
  pays: Pays[];
  wilayas: Wilaya[];
  communes: Commune[];
  codesPostal: CodePostal[];
  typesEntreprise: any;
  secteursActivite: SecteurActivite[];
  professions: Profession[];
  formCreationPersonnePhysique: FormGroup|any;
  formCreationPersonneMorale : FormGroup|any;
  formCreationAdresse : FormGroup|any;
  formCreationModalite : FormGroup|any;
  formCreationContact : FormGroup|any;
  formCreationProfession : FormGroup|any;
  formCreationDocument : FormGroup|any;
  formCreationRib : FormGroup|any;
  formCreationRelation : FormGroup|any;

  descriptionAdress: any;
  paysAdress: any;
  communeAdress: any;
  wilayaAdress: any;
  codePostalAdress: any;

  minDate = new Date();
  personnePhysique: PersonnePhysique;
  personneMorale: PersonneMorale;
  myControl: FormControl;
  myControlEdit: FormControl;

  adresses : MatTableDataSource<Adresse> = new MatTableDataSource();
  displayedColumnsAdresse: string[] = ['description', 'pays', 'wilaya', 'commune', 'codePostal'];
  lengthColumnsAdresse = this.displayedColumnsAdresse.length;

  modalites : MatTableDataSource<Modalite> = new MatTableDataSource();;
  displayedColumnsModalite: string[] = ['typeModalite', 'taux'];
  lengthColumnsModalite = this.displayedColumnsModalite.length;

  contacts : MatTableDataSource<Contact> = new MatTableDataSource();;
  displayedColumnsContact: string[] = ['typeContact', 'description'];
  lengthColumnsContact = this.displayedColumnsContact.length;

  professionsPersonne : MatTableDataSource<ProfessionSecteur> = new MatTableDataSource();;
  displayedColumnsProfession: string[] = ['secteurActivite', 'profession'];
  lengthColumnsProfession = this.displayedColumnsProfession.length;

  documentPersonne: MatTableDataSource<Documents> = new MatTableDataSource();
  displayedColumnsDocument: string[] = ['typeDocument', 'description', 'dateDelivrance', 'dateExpiration', 'wilayaDelivrance', 'communeDelivrance'];
  lengthColumnsDocument = this.displayedColumnsDocument.length;

  ribPersonne: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsRIB: string[] = ['description', 'swift'];
  lengthColumnsRIB = this.displayedColumnsRIB.length;

  relationPersonne: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsRelation: string[] = ['DNI', 'relation'];
  lengthColumnsRelation = this.displayedColumnsRelation.length;

  filteredOptions: Observable<any>;
  personnes: any;
  personneById: any;
  idPersonne: any;
  nationalite_selected: any = [];
  hasEditPriv:boolean=false;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,private formBuilderAuth: FormBuilder, private personneService: PersonneService, private route: ActivatedRoute, private genericService: GenericService) { }

  //Enable champs de modification
  changePage(disable: boolean) {
    if(disable)
    {
      if(this.personne)
      {
        this.formCreationPersonnePhysique.enable()
      }
      else
      {
        this.formCreationPersonneMorale.enable();
      }

      this.formCreationProfession.enable();
    }
    else
    {
      this.personne ? this.formCreationPersonnePhysique.disable(): this.formCreationPersonneMorale.disable();
      this.formCreationProfession.disable();
    }
  }

  getCommuneByWilaya(idWilaya: any) {
    let id = idWilaya.idWilaya == undefined ?  idWilaya:idWilaya.idWilaya;
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
    let id = idCommune?.idCommune == undefined ?  idCommune:idCommune?.idCommune;
    this.genericService.getAllCodeByCommune(id).subscribe({
      next: (data: any) => {
        this.codesPostal = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  //enable champs documents aprés selection type document
  enableDocument() {
    this.formCreationDocument.get('description').enable();
    this.formCreationDocument.get('dateDelivrance').enable();
    this.formCreationDocument.get('dateExpiration').enable();
    this.formCreationDocument.get('wilaya').enable();
    this.formCreationDocument.get('commune').enable();
  }

  initPersonneEdit() {
    if(this.personne) {
      this.personneById?.nationalitesList?.forEach((nat: any) => {
        this.nationalite_selected.push(nat?.nationalite?.idPays)
      })

      this.formCreationPersonnePhysique = this.formBuilderAuth.group({
        nom: [{value: this.personneById?.nom, disabled: true}, [Validators.required, Validators.pattern(Patterns.nom)]],
        titre: [this.personneById?.titre ? this.personneById?.titre?.idParam:''],
        nomJeuneFille: [this.personneById?.nomJeuneFille, [Validators.pattern(Patterns.nom)]],
        prenom1: [{value: this.personneById?.prenom1, disabled: true}, [Validators.required, Validators.pattern(Patterns.nom)]],
        prenom2: [this.personneById?.prenom2, [Validators.pattern(Patterns.nom)]],
        prenom3: [this.personneById?.prenom3, [Validators.pattern(Patterns.nom)]],
        sexe: [this.personneById?.sexe ? this.personneById?.sexe?.idParam:'', [Validators.required]],
        situationFamiliale: [this.personneById?.situationFamiliale ? this.personneById?.situationFamiliale?.idParam:''],
        nationalite: [this.nationalite_selected, [Validators.required]],
        nationalitesList: [[]],
        pays: [this.personneById?.pays?.idPays],
        wilaya: [this.personneById?.wilaya?.idWilaya],
        commune: [this.personneById?.commune?.idCommune],
        nin: [this.personneById?.nin],
        vip: [this.personneById?.vip],
        dateNaissance: [this.personneById?.dateNaissance, [Validators.required]],
        dateDebut: [this.personneById?.dateDebut],
        dateFin: [this.personneById?.dateFin],
        auditUser: [this.personneById?.auditUser],
        professionSecteurList: [[]],
        modaliteList: [[]],
        payment: [[]],
        documentList: [[]],
        contactList: [[]],
        adressesList: [[]],
        relationList: [[]],
      });

      this.formCreationProfession = this.formBuilderAuth.group({
        id: [0],
        secteurActivite: ['', [Validators.required]],
        profession: ['', [Validators.required]],
        dateDebutProfession: [new Date()],
        dateFinProfession: [''],
      });


      this.formCreationPersonnePhysique.disable();
    }
    else
    {
      this.formCreationPersonneMorale = this.formBuilderAuth.group({
        raisonSocial: [{value: this.personneById?.raisonSocial, disabled: true}, [Validators.required]],
        typeEntreprise: [this.personneById?.typeEntreprise ? this.personneById?.typeEntreprise?.idParam:''],
        capitaleSocial: [this.personneById?.capitaleSocial],
        statue: [this.personneById?.statue],
        chiffreAffaire: [this.personneById?.chiffreAffaire],
        nombreSalarie: [this.personneById?.nombreSalarie],
        nif: [this.personneById?.nif ?this.personneById?.nif : null, [Validators.pattern(Patterns.NIF)]],
        vip: [this.personneById?.vip],
        dateOuverture: [this.personneById?.dateOuverture],
        dateDebut: [this.personneById?.dateDebut],
        dateFin: [this.personneById?.dateFin],
        auditUser: [this.personneById?.auditUser],
        professionSecteur: [[]],
        payment: [[]],
        documentList: [[]],
        contactList: [[]],
        adressesList: [[]],
        relationList: [[]],
      });

      this.formCreationProfession = this.formBuilderAuth.group({
        id: [this.personneById?.secteurActivite ? this.personneById?.secteurActivite?.idSecteur:0],
        secteurActivite: [this.personneById?.secteurActivite ? this.personneById?.secteurActivite?.idSecteur:''],
        profession: [''],
        dateDebutProfession: [this.personneById?.secteurActivite ? this.personneById?.secteurActivite?.dateDebut:new Date()],
        dateFinProfession: [this.personneById?.secteurActivite ? this.personneById?.secteurActivite?.dateFin:''],
      });

      this.formCreationPersonneMorale.disable();
      this.formCreationProfession.disable();
    }

    
    this.formCreationAdresse = this.formBuilderAuth.group({
      idAdresse: [0],
      description: ['', [Validators.required]],
      pays: ['', [Validators.required]],
      wilaya: ['', [Validators.required]],
      commune: ['', [Validators.required]],
      codePostal: ['', [Validators.required]],
    });    
    
    this.formCreationContact = this.formBuilderAuth.group({
      idContact: [0],
      typeContact: ['', [Validators.required]],
      description: [{value: '', disabled: true}, [Validators.required]],
      dateDebut: [new Date()]
    });
    
    this.formCreationDocument = this.formBuilderAuth.group({
      idDocument: [0],
      typeDocument: [''],
      description: [{value: '', disabled: true}],
      dateDelivrance: [{value: '', disabled: true}],
      dateExpiration: [{value: '', disabled: true}],
      wilayaDelivrance: [{value: '', disabled: true}],
      communeDelivrance: [{value: '', disabled: true}],
      sousCategorie: [''],
    });
    
    this.formCreationRib = this.formBuilderAuth.group({
      idPayment: [0],
      description: [''],
      swift: [''],
      dateDebut: [new Date()],
      dateFin: ['']
    });
    
    this.formCreationRelation = this.formBuilderAuth.group({
      idRelation: [0],
      idClient: [''],
      relation: [''],
      dateDebut: [new Date()],
      dateFin: ['']
    });

    this.myControl = new FormControl<any>('');

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.nom ? value?.nom + value?.prenom1: value?.raisonSocial;
        return name ? this._filter(name as string) : this.personnes?.slice();
      }),
    );

    this.myControlEdit = new FormControl<any>('');

    this.filteredOptions = this.myControlEdit.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.nom ? value?.nom + value?.prenom1: value?.raisonSocial;
        return name ? this._filter(name as string) : this.personnes?.slice();
      }),
    );
  }

  ngOnInit(): void {
    this.idPersonne = this.route.snapshot.paramMap.get('idPersonne');
    this.hasEditPriv = Boolean(sessionStorage.getItem("roles")?.includes("BO"))
    console.log("haspriv",this.hasEditPriv)
    
    this.personneService.getPersonneById(this.idPersonne).subscribe({
      next: (data: any) => {
        data.nom != undefined ? this.personne =true:this.personne =false;
        this.personneById = data;

        this.adresses.data = data?.adressesList;
                
        data?.professionSecteurList ? this.professionsPersonne.data = data?.professionSecteurList:''

        this.contacts.data = data?.contactList
        
        this.documentPersonne.data = data?.documentList

        this.ribPersonne.data = data?.payment
        
        this.relationPersonne.data = data?.relationList

        this.adresses.data.forEach(address => {
          this.getCommuneByWilaya(address.wilaya?.idWilaya);
          this.getCodeByCommune(address.commune?.idCommune);
        })
        
        this.getAllParameters();
        this.initPersonneEdit();
      },
      error: (error) => {console.log(error);}
    });
  }

  _filter(name: string): any {
    const filterValue = name;
    
    return this.personnes.filter((option: any) => option.nom ? (option.nom+option.prenom1).includes(filterValue):option.raisonSocial.includes(filterValue));
  }

  //delete tables adresse, contact, profession, document, rib, relation
  delete(type: string, index: number) {
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

  getAllParameters() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C4").idCategorie).subscribe({
      next: (data: any) => {
        this.typesEntreprise = data;
      },
      error: (error) => {console.log(error);}
    });

    this.genericService.getPays().subscribe({
      next: (data: any) => {
        this.pays = data;
        this.nationalites = data;
        this.idPays =data.find((pays: any) => pays.codePays == "DZA").idPays

        this.genericService.getAllWilayas(this.idPays).subscribe({
          next: (data: any) => {
            this.wilayas = data
          },
          error: (error) => {
    
            console.log(error);
    
          }
        });
      },
      error: (error) => {console.log(error);}
    });


    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C3").idCategorie).subscribe({
      next: (data: any) => {
        this.types_contact = data;
      },
      error: (error) => {console.log(error);}
    });

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C6").idCategorie).subscribe({
      next: (data: any) => {
        this.sexes = data;
      },
      error: (error) => {console.log(error);}
    });

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C10").idCategorie).subscribe({
      next: (data: any) => {
        this.titres = data;
      },
      error: (error) => {console.log(error);}
    });

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C1").idCategorie).subscribe({
      next: (data: any) => {
        this.situationsFamiliale = data;
      },
      error: (error) => {console.log(error);}
    });

    this.genericService.getSecteur().subscribe({
      next: (data: any) => {
        this.secteursActivite = data;
      },
      error: (error) => {console.log(error);}
    });

    this.genericService.getProfession().subscribe({
      next: (data: any) => {
        this.professions = data;
      },
      error: (error) => {console.log(error);}
    });

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C2").idCategorie).subscribe({
      next: (data: any) => {
        this.types_document = data;
      },
      error: (error) => {console.log(error);}
    });

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C8").idCategorie).subscribe({
      next: (data: any) => {
        this.types_relation = data;
      },
      error: (error) => {console.log(error);}
    });

    this.personneService.getAllPersonne().subscribe({
      next: (data: any) => {
        this.personnes = data;

        this.paginate(this.adresses);
        this.paginate(this.professionsPersonne);
        this.paginate(this.contacts);
        this.paginate(this.documentPersonne);
        this.paginate(this.ribPersonne);
        this.paginate(this.relationPersonne);
      },
      error: (error) => {console.log(error);}
    });
  }
  onChangeWilaya(eve:any,element:any){
    
    element.wilaya.idWilaya=eve
    this.getCommuneByWilaya(eve)

  }
  ajouterSecteur(formDirective: any) {
    if (this.formCreationProfession.value?.secteurActivite != '' && this.formCreationProfession.value?.profession != '') {
      let add = true;
      if(this.professionsPersonne.data.length == 0)
      {
        this.professionsPersonne.data = [];
      }
      else
      {
        this.professionsPersonne.data?.map(profession => {
          (profession.secteurActivite?.description == this.formCreationProfession.value.secteurActivite?.description && profession.profession?.description == this.formCreationProfession.value.profession?.description) ? add = false:""
        })
      }

      if(add) {
        this.professionsPersonne.data.push(this.formCreationProfession.value)
        this.paginate(this.professionsPersonne)
        this.formCreationProfession = this.formBuilderAuth.group({
          id: [0],
          secteurActivite: [''],
          profession: [''],
          dateDebutProfession: [new Date()],
          dateFinProfession: [''],
        });
      }
      else
      {
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
      if(this.documentPersonne.data.length == 0)
      {
        this.documentPersonne.data = [];
      }
      else
      {
        this.documentPersonne.data.map(doc => {
          (doc.description == this.formCreationDocument.value.description) ? add = false:""
        })
      }

      if(add) {
        this.documentPersonne.data.push(this.formCreationDocument.value)
        this.paginate(this.documentPersonne)
        this.formCreationDocument = this.formBuilderAuth.group({
          idDocument: [0],
          typeDocument: [''],
          description: [{ value: '', disabled: true }],
          dateDelivrance: [{ value: '', disabled: true }],
          dateExpiration: [{ value: '', disabled: true }],
          wilaya: [{ value: '', disabled: true }],
          commune: [{ value: '', disabled: true }],
          sousCategorie: [''],
        });
      }
      else
      {
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
      if(this.adresses.data.length == 0)
      {
        this.adresses.data = []
      }
      else
      {
        this.adresses.data.map(address => {
          (address.description == this.formCreationAdresse.value.description && address.pays?.description == this.formCreationAdresse.value.pays?.description && address.wilaya?.description == this.formCreationAdresse.value.wilaya?.description && address.commune?.description === this.formCreationAdresse.value.commune?.description && address.codePostal?.description == this.formCreationAdresse.value.codePostal?.description) ? add = false:""
        })
      }

      if(add) {
        this.adresses.data.push(this.formCreationAdresse.value)
        this.paginate(this.adresses)
        this.formCreationAdresse = this.formBuilderAuth.group({
          idAdresse: [0],
          description: ['', [Validators.required]],
          pays: ['', [Validators.required]],
          wilaya: ['', [Validators.required]],
          commune: ['', [Validators.required]],
          codePostal: ['', [Validators.required]],
        });
      }
      else
      {
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
      if(this.contacts.data.length == 0) {
        this.contacts.data = [];
      } 
      else
      {
        this.contacts.data.map(contact => {
          (contact.description == this.formCreationContact.value.description) ? add = false:""
        })
      }

      if(add) {
        this.contacts.data.push(this.formCreationContact.value)
        this.paginate(this.contacts)
        this.formCreationContact = this.formBuilderAuth.group({
          idContact: [0],
          typeContact: ['', [Validators.required]],
          description: [{ value: '', disabled: true }, [Validators.required]],
          dateDebut: [new Date()]
        });
      }
      else
      {
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
      if(this.ribPersonne.data.length == 0)
      {
        this.ribPersonne.data = []
      }
      else
      {
        this.ribPersonne.data.map(rib => {
          (rib.description == this.formCreationRib.value.description) ? add = false:""
        })
      }

      if(add)
      {
        this.ribPersonne.data.push(this.formCreationRib.value)
        this.paginate(this.ribPersonne)
        this.formCreationRib = this.formBuilderAuth.group({
          idPayment: [0],
          description: [''],
          swift: [''],
          dateDebut: [new Date()],
          dateFin: ['']
        });
      }
      else
      {
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
      if(this.relationPersonne.data.length == 0)
      {
        this.relationPersonne.data = []
      }
      else
      {
        this.relationPersonne.data.map(relation => {
          (relation.idClient == this.formCreationRelation.value.idClient) ? add = false:""
        })
      }
      
      if(add)
      {
        this.relationPersonne.data.push(this.formCreationRelation.value)
        this.paginate(this.relationPersonne)
        this.formCreationRelation = this.formBuilderAuth.group({
          idRelation: [0],
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
      else
      {
        Swal.fire(
          'la relation existe déjà',
          '',
          'error'
        )
      }
    }
  }

  sauvegarderPersonne() {
    if(this.personne)
    {
      this.personnePhysique = this.formCreationPersonnePhysique.value

      this.professionsPersonne.data?.forEach(profession => {
        this.personnePhysique.professionSecteurList?.push({
          id: profession.id,
          secteurActivite: profession.secteurActivite?.idSecteur != undefined ? profession.secteurActivite:this.secteursActivite.find((sect: any) => sect.idSecteur == profession.secteurActivite),
          profession: profession.profession?.idProfession != undefined ? profession.profession:this.professions.find((prof: any) => prof.idProfession == profession.profession),
          dateDebutProfession: profession.dateDebutProfession,
          dateFinProfession: profession.dateFinProfession
        })
      });

      this.documentPersonne.data?.forEach(document => {
        this.personnePhysique.documentList?.push({
          idDocument: document.idDocument,
          typeDocument: document.typeDocument?.idParam != undefined ? document.typeDocument:this.types_document.find((doc: any) => doc.idParam == document.typeDocument),
          description: document.description,
          sousCategorie: document.sousCategorie,
          dateDelivrance: document.dateDelivrance,
          dateExperation: document.dateExperation,
          communeDelivrance: document.communeDelivrance?.idCommune != undefined ? document.communeDelivrance:this.communes.find((commune: any) => commune.idCommune == document.communeDelivrance),
          wilayaDelivrance: document.wilayaDelivrance?.idWilaya != undefined ? document.wilayaDelivrance:this.wilayas.find((wilaya: any) => wilaya.idWilaya == document.wilayaDelivrance)
        })
      });

      this.adresses.data?.forEach(adresse => {
        this.personnePhysique.adressesList?.push({
          idAdresse: adresse.idAdresse,
          description: adresse.description,
          pays: adresse.pays?.idPays != undefined ? adresse.pays:this.pays.find((pays: any) => pays.idPays == adresse.pays),
          wilaya: adresse.wilaya?.idWilaya != undefined ? adresse.wilaya:this.wilayas.find((wilaya: any) => wilaya.idWilaya == adresse.wilaya),
          commune: adresse.commune?.idCommune != undefined ? adresse.commune:this.communes.find((commune: any) => commune.idCommune == adresse.commune),
          codePostal: adresse.codePostal?.idCodePostal != undefined ? adresse.codePostal:this.codesPostal.find((code: any) => code.idCodePostal == adresse.codePostal),
        })
      });

      this.contacts.data?.forEach(contact => {
        this.personnePhysique.contactList?.push({
          idContact: contact.idContact,
          idTypeContact: contact.typeContact?.idParam,
          typeContact: contact.typeContact?.idParam != undefined ? contact.typeContact:this.types_contact.find((type: any) => type.idParam == contact.typeContact),
          description: contact.description,
          dateDebut: contact.dateDebut
        })
      });

      this.ribPersonne.data?.forEach(rib => {
        this.personnePhysique.payment?.push({
          idPayment: rib.idPayment,
          donneBancaire : {
            idDonneBancaire: rib.description ? '':rib.donneBancaire?.idDonneBancaire,
            description: rib.description ? rib.description:rib.donneBancaire?.description,
            swift: rib.swift ? rib.swift: rib.donneBancaire?.swift
          },
          dateDebut: rib.dateDebut,
          dateFin: rib.dateFin
        })
      });

      this.relationPersonne.data?.forEach((relation: any) => {
        this.personnePhysique.relationList?.push({
          idRelation: relation.idRelation,
          adherent: relation.adherent,
          dateDebut: relation.dateDebut,
          dateFin: relation.dateFin,
          relation: relation.relation?.idParam != undefined ? relation.relation:this.types_relation.find((relation: any) => relation.idParam == relation.relation),
        })
      });

      this.personnePhysique.nationalite?.forEach((nat: any) => {
        this.personnePhysique.nationalitesList?.push({
          nationalite: this.nationalites.find((nat2: any) => nat2?.idPays == nat),
          dateDebut: "",
          dateFin: "",
        })
      });


      if(this.formCreationPersonnePhysique.valid)
      {
        this.personneService.updatePersonne(this.personnePhysique, this.idPersonne, "physique").subscribe(
          (data:any) => {
            this.personneCreationSuccess = true;
            this.personneCreationError = false;
            Swal.fire(
              `La personne N°${data.idClient} a été modifié avec succés`,
              '',
              'success'
            )
            this.formCreationPersonnePhysique.reset();
            this.back();
          },
        
          error => {
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
    else
    {
      this.personneMorale = this.formCreationPersonneMorale.value

      let secteursActivite = this.secteursActivite.find(sect => sect.idSecteur == this.formCreationProfession.value.secteurActivite)
      this.personneMorale.secteurActivite = secteursActivite;

      let typesEntreprise = this.typesEntreprise.find((type: any) => type.idParam == this.formCreationPersonneMorale.value.typeEntreprise)
      this.personneMorale.typeEntreprise = typesEntreprise

      this.documentPersonne.data?.forEach(document => {
        this.personneMorale.documentList?.push({
          idDocument: document.idDocument,
          typeDocument: document.typeDocument?.idParam != undefined ? document.typeDocument:this.types_document.find((doc: any) => doc.idParam == document.typeDocument),
          description: document.description,
          sousCategorie: document.sousCategorie,
          dateDelivrance: document.dateDelivrance,
          dateExperation: document.dateExperation,
          communeDelivrance: document.communeDelivrance?.idCommune != undefined ? document.communeDelivrance:this.communes.find((commune: any) => commune.idCommune == document.communeDelivrance),
          wilayaDelivrance: document.wilayaDelivrance?.idWilaya != undefined ? document.wilayaDelivrance:this.wilayas.find((wilaya: any) => wilaya.idWilaya == document.wilayaDelivrance)
        })
      });

      this.adresses.data?.forEach(adresse => {
        this.personneMorale.adressesList?.push({
          idAdresse: adresse.idAdresse,
          description: adresse.description,
          pays: adresse.pays?.idPays != undefined ? adresse.pays:this.pays.find((pays: any) => pays.idPays == adresse.pays),
          wilaya: adresse.wilaya?.idWilaya != undefined ? adresse.wilaya:this.wilayas.find((wilaya: any) => wilaya.idWilaya == adresse.wilaya),
          commune: adresse.commune?.idCommune != undefined ? adresse.commune:this.communes.find((commune: any) => commune.idCommune == adresse.commune),
          codePostal: adresse.codePostal?.idCodePostal != undefined ? adresse.codePostal:this.codesPostal.find((code: any) => code.idCodePostal == adresse.codePostal),
        })
      });

      this.contacts.data?.forEach(contact => {
        this.personneMorale.contactList?.push({
          idContact: contact.idContact,
          idTypeContact: contact.typeContact?.idParam,
          typeContact: contact.typeContact?.idParam != undefined ? contact.typeContact:this.types_contact.find((type: any) => type.idParam == contact.typeContact),
          description: contact.description,
          dateDebut: contact.dateDebut
        })
      });

      this.ribPersonne.data?.forEach(rib => {
        this.personneMorale.payment?.push({
          idPayment: rib.idPayment,
          donneBancaire : {
            idDonneBancaire: rib.description ? '':rib.donneBancaire?.idDonneBancaire,
            description: rib.description ? rib.description:rib.donneBancaire?.description,
            swift: rib.swift ? rib.swift: rib.donneBancaire?.swift
          },
          dateDebut: rib.dateDebut,
          dateFin: rib.dateFin
        })
      });

      this.relationPersonne.data?.forEach((relation: any) => {
        this.personneMorale.relationList?.push({
          idRelation: relation.idRelation,
          adherent: relation.adherent,
          dateDebut: relation.dateDebut,
          dateFin: relation.dateFin,
          relation: relation.relation?.idParam != undefined ? relation.relation:this.types_relation.find((relation: any) => relation.idParam == relation.relation),
        })
      });

      if(this.formCreationPersonneMorale.valid)
      {
        this.personneService.updatePersonne(this.personneMorale, this.idPersonne ,"morale").subscribe(
          (data:any) => {
            this.personneCreationSuccess = true;
            this.personneCreationError = false;
            Swal.fire(
              `La personne N°${data.idClient} a été modifié avec succés`,
              '',
              'success'
            )
            this.formCreationPersonneMorale.reset();
            this.back();
          },
        
          error => {
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
  }

  //pagination tables
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
