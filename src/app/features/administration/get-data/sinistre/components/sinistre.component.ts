import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AgencesService } from 'src/app/core/services/agences.service';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { ProduitService } from 'src/app/core/services/produit.service';
import { PackService } from 'src/app/core/services/pack.service';
import { Dictionnaire } from 'src/app/core/models/dictionnaire';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { GenericService } from 'src/app/core/services/generic.service';

@Component({
  selector: 'app-components',
  templateUrl: './sinistre.component.html',
  styleUrls: ['./sinistre.component.scss']
})
export class SinistreComponent implements OnInit {
  sinistreForm!: FormGroup;
  sinistredecForm!: FormGroup;
  sinistreprovForm!: FormGroup;
  sinistresuiteForm!: FormGroup;
  startDateValue!: Date;
  maxEndDate!: Date;
  today = new Date();
  minDate: Date = new Date('2025-01-01');
  statutsSinistre: string[] = ['Émis', 'Encaissé', 'Annulé'];
  produits: any[] = [];
  afficherListeAgences: boolean = false;
  agencesUtilisateur: any[] = [];
  agenceUnique: any = null;
  aucuneAgence: boolean = false;
  agences: any = [];
  zoneNom: any = '';
  allAgencesDetails: any[] = [];
  societes: string[] = ['Vie', 'Dommage'];
  isLoading: boolean = false;
  selectedForm = 'sinistres';
  availableForms = [
    { label: 'sinistres', value: 'sinistres' },
    { label: 'sinistres déclarés', value: 'sinistresdec' },
    { label: 'sinistre en provisions', value: 'sinistreprov' },
    { label: 'sinistres sans suite', value: 'sinistressuite' }
  ];
  
  packs: any[] = [];
  AgencesDeSouscription: any[] = [];
  natureDommageList: any[] = [];
  garanties: any[];
  CompagnieAdverse: string[] = ['CompanyA', 'CompanyB', 'CompanyC', 'CompanyD', 'CompanyE', 'CompanyF'];
  NatureDommage: string[] = ['M', 'Mc'];
  dictionnaires: Dictionnaire[] = [];
  produitsSuite: any[] = [];
  packsSuite: any[] = [];
  garantiesSuite: any[] = [];
  produitsDec: any[] = [];
  packsDec: any[] = [];
  packsprov: any[] = [];
  garantiesDec: any[] = [];
  produitssuite: any[] = [];
  http: any;
  situations: any;



  constructor(private fb: FormBuilder,
    private produitService: ProduitService,
    private agencesService: AgencesService,
    private authService: AuthentificationService,
    private packService: PackService,
    private sinistreService: SinistresService,
    private genericService: GenericService,
  ) { }
  ngOnInit(): void {
    this.initsinistreForm();
    this.initsinistredecForm();
    this.initsinistreprovForm();
    this.initsinistresuiteForm();
    this.getAllProduits();
    this.getAllAgenceDetails();
    this.getAllAgences();
    this.getSituation();

  }


  onFormChange() {
    // Réinitialiser les formulaires
    this.sinistreForm?.reset();
    this.sinistredecForm?.reset();
    this.sinistreprovForm?.reset();
    this.sinistresuiteForm?.reset();

    console.log('Form changé :', this.selectedForm);

    // Charger le bon formulaire
    if (this.selectedForm === 'sinistres') {
      this.initsinistreForm();
    } else if (this.selectedForm === 'sinistresdec') {
      this.initsinistredecForm();
    } else if (this.selectedForm === 'sinistreprov') {
      this.initsinistreprovForm();
    } else if (this.selectedForm === 'sinistressuite') {
      this.initsinistresuiteForm();
    }
  }





  initsinistreForm() {
    this.sinistreForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [{ value: null, disabled: true }, Validators.required],
      numeroPolice: [''],
      numeroSinistre: [null],
      numeroOP: [''],
      produit: [],
      agence: ['', Validators.required],
      email: [''],
      pack: [''],
      avenant: [''],
      statutSinistre: [''],
      zoneNom: '',
      nomAssure: ['', [Validators.pattern('^[A-Za-z]+$')]],
      societe: [''],


    },
      {
        validators: [this.dateRangeValidator]
      }
    );
    const user = this.Userinformation();
    this.sinistreForm.patchValue({
      email: user.email?.slice(1, -1)
    });
    if (user.email) {
      const email = user.email.replace(/"/g, '');
      this.authService.getUserId(email).subscribe({
        next: (data) => {
          if (data.agences?.length === 1) {
            this.agenceUnique = data.agences[0];
            this.sinistreForm.patchValue({
              agence: `${this.agenceUnique.codeAgence} - ${this.agenceUnique.nomAgence}`
            });
            this.afficherListeAgences = false;
          } else if (data.agences?.length > 1) {
            this.agencesUtilisateur = data.agences;
            this.afficherListeAgences = true;
          } else {
            this.aucuneAgence = true;
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des agences utilisateur', err);
          this.aucuneAgence = true;
        }
      });
    }
    this.sinistreForm.get('agence')?.valueChanges.subscribe((agenceStr: string) => {
      if (agenceStr?.trim()) {
        const codeAgence = agenceStr.split(' - ')[0];
        const agenceDetail = this.allAgencesDetails.find(a => a.codeAgence === codeAgence);

        if (agenceDetail) {
          this.zoneNom = agenceDetail.zone;

          this.sinistreForm.get('zoneNom')?.setValue(agenceDetail.zone, { emitEvent: false });

        } else {
          this.zoneNom = '';
          this.sinistreForm.get('zoneNom')?.setValue('', { emitEvent: false });
        }
      }
    });
    this.sinistreForm.get('startDate')?.valueChanges.subscribe((selectedStart: Date) => {
      if (selectedStart) {
        this.startDateValue = selectedStart;

        // Calcul de la date max: min(startDate + 30 jours, aujourd’hui)
        const tempMaxDate = new Date(selectedStart);
        tempMaxDate.setDate(tempMaxDate.getDate() + 30);

        this.maxEndDate = tempMaxDate > this.today ? this.today : tempMaxDate;

        // Réinitialise et active le champ endDate avec les nouvelles limites
        const endDateControl = this.sinistreForm.get('endDate');
        endDateControl?.enable();
        endDateControl?.reset();
      }
    });

    // this.sinistreForm.get('numeroPolice')?.value
    this.sinistreForm.get('numeroPolice')?.valueChanges.subscribe;
    this.sinistreForm.get('numeroSinistre')?.valueChanges.subscribe;
    this.sinistreForm.get('numeroOP')?.valueChanges.subscribe;
    this.sinistreForm.get('produit')?.valueChanges.subscribe;
  }


  initsinistredecForm() {
    this.sinistredecForm = this.fb.group({
      produit: [],
      // pack: [''],
      // garantie: [''],
      pack: [{ value: null, disabled: true }],
      garantie: [{ value: null, disabled: true }],
      AgenceDeSouscription: [''],
      AgenceDeclaration: [''],
      CompagnieAdverse: [''],
      NatureDommage: [''],
      startDate: [null, [Validators.required]],
      endDate: [{ value: null, disabled: true }, Validators.required],
    },
      {
        validators: [this.dateRangeValidator]
      }
    );
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produitsDec = data;
      },
      error: (err) => {
        console.error('Erreur chargement produits suite:', err);
      }
    });

    // this.sinistredecForm.get('produit')?.valueChanges.subscribe((selectedProduit) => {
    //   this.garantiesDec = [];
    //   this.sinistredecForm.get('pack')?.reset();
    //   if (selectedProduit) {
    //     this.packService.getPackByProduit(selectedProduit).subscribe({
    //       next: (data) => {
    //         this.packsDec = data;
    //         console.log('Les pack dec ', this.packsDec)
    //       },
    //       error: (err) => {
    //         console.error('Erreur chargement packs suite:', err);
    //         this.packsDec = [];
    //       }
    //     });
    //   } else {
    //     this.packsDec = [];
    //   }
    // });

    // this.sinistredecForm.get('pack')?.valueChanges.subscribe((selectedPack) => {
    //   this.garantiesDec = [];
    //   if (selectedPack) {
    //     this.packService.getGarantiePack(selectedPack).subscribe({
    //       next: (data) => {
    //         this.garantiesDec = data;
    //       },
    //       error: (err) => {
    //         console.error('Erreur chargement garanties suite:', err);
    //         this.garantiesDec = [];
    //       }
    //     });
    //   } else {
    //     this.garantiesDec = [];
    //   }
    // });



    this.sinistredecForm.get('produit')?.valueChanges.subscribe((selectedProduit) => {
      const packControl = this.sinistredecForm.get('pack');
      const garantieControl = this.sinistredecForm.get('garantie');

      this.packsDec = [];
      this.garantiesDec = [];

      packControl?.reset();
      garantieControl?.reset();

      packControl?.disable();
      garantieControl?.disable();

      if (selectedProduit) {
        this.packService.getPackByProduit(selectedProduit).subscribe({
          next: (data) => {
            this.packsDec = data || [];
            if (this.packsDec.length > 0) {
              packControl?.enable();
            } else {
              packControl?.disable();
            }
          },
          error: (err) => {
            console.error('Erreur chargement packs suite:', err);
            this.packsDec = [];
            packControl?.disable();
          }
        });
      }
    });
    this.sinistredecForm.get('pack')?.valueChanges.subscribe((selectedPack) => {
      const garantieControl = this.sinistredecForm.get('garantie');

      this.garantiesDec = [];
      garantieControl?.reset();
      garantieControl?.disable();

      if (selectedPack) {
        this.packService.getGarantiePack(selectedPack).subscribe({
          next: (data) => {
            this.garantiesDec = data || [];
            if (this.garantiesDec.length > 0) {
              garantieControl?.enable();
            } else {
              garantieControl?.disable();
            }
          },
          error: (err) => {
            console.error('Erreur chargement garanties suite:', err);
            this.garantiesDec = [];
            garantieControl?.disable();
          }
        });
      }
    });

  }




  initsinistreprovForm() {
    this.sinistreprovForm = this.fb.group({
      produit: [],
      // pack: [''],
      pack: [{ value: null, disabled: true }],
      AgenceDeSouscription: [''],
      AgenceDeclaration: [''],
      dictionnaires: [''],
      NatureDommage: [''],
      startDate: [null, [Validators.required]],
      endDate: [{ value: null, disabled: true }, Validators.required],

    },
      {
        validators: [this.dateRangeValidator]
      }
    );
    // this.sinistreprovForm.get('produit')?.valueChanges.subscribe((selectedProduit) => {
    //   if (selectedProduit) {
    //     this.getPacksByProduit(selectedProduit);
    //   }
    // });
    this.sinistreprovForm.get('produit')?.valueChanges.subscribe((selectedProduit) => {
      const packControl = this.sinistreprovForm.get('pack');
      this.packsprov=[],

      packControl?.reset();
      packControl?.disable(); 

       if (selectedProduit) {
        this.packService.getPackByProduit(selectedProduit).subscribe({
          next: (data) => {
            this.packsprov = data || [];
            if (this.packsprov.length > 0) {
              packControl?.enable();
            } else {
              packControl?.disable();
            }
          },
          error: (err) => {
            console.error('Erreur chargement packs suite:', err);
            this.packsprov = [];
            packControl?.disable();
          }
        });
      }
    });

    this.sinistreprovForm.get('pack')?.valueChanges.subscribe((selectedPack) => {
      if (selectedPack) {
        this.getGarantiePack(selectedPack);
      }
    });
    const id = 8;
    this.getDictionnaireData(id);
  }








  initsinistresuiteForm() {
    this.sinistresuiteForm = this.fb.group({
      produit: [],
      pack: [{ value: null, disabled: true }],
      garantie: [{ value: null, disabled: true }],
      NatureDommage: [''],
      startDate: [null, [Validators.required]],
      endDate: [{ value: null, disabled: true }, Validators.required],
    },
      {
        validators: [this.dateRangeValidator]
      });

    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produitsSuite = data;
      },
      error: (err) => {
        console.error('Erreur chargement produits suite:', err);
      }
    });

    // this.sinistresuiteForm.get('produit')?.valueChanges.subscribe((selectedProduit) => {
    //   this.garantiesSuite = [];  // Vider les garanties
    //   this.sinistredecForm.get('pack')?.reset();
    //   if (selectedProduit) {
    //     this.packService.getPackByProduit(selectedProduit).subscribe({
    //       next: (data) => {
    //         this.packsSuite = data;  // 👈 Liste spécifique
    //       },
    //       error: (err) => {
    //         console.error('Erreur chargement packs suite:', err);
    //         this.packsSuite = [];
    //       }
    //     });
    //   } else {
    //     this.packsSuite = [];
    //   }
    // });

    // this.sinistresuiteForm.get('pack')?.valueChanges.subscribe((selectedPack) => {
    //   this.garantiesSuite = [];
    //   if (selectedPack) {
    //     this.packService.getGarantiePack(selectedPack).subscribe({
    //       next: (data) => {
    //         this.garantiesSuite = data;
    //       },
    //       error: (err) => {
    //         console.error('Erreur chargement garanties suite:', err);
    //         this.garantiesSuite = [];
    //       }
    //     });
    //   } else {
    //     this.garantiesSuite = [];
    //   }
    // });

    this.sinistresuiteForm.get('produit')?.valueChanges.subscribe((selectedProduit) => {
      const packControl = this.sinistresuiteForm.get('pack');
      const garantieControl = this.sinistresuiteForm.get('garantie');

      this.packsSuite = [];
      this.garantiesSuite = [];

      packControl?.reset();
      garantieControl?.reset();

      packControl?.disable();
      garantieControl?.disable();

      if (selectedProduit) {
        this.packService.getPackByProduit(selectedProduit).subscribe({
          next: (data) => {
            this.packsSuite = data || [];
            if (this.packsSuite.length > 0) {
              packControl?.enable();
            } else {
              packControl?.disable();
            }
          },
          error: (err) => {
            console.error('Erreur chargement packs suite:', err);
            this.packsSuite = [];
            packControl?.disable();
          }
        });
      }
    });
    this.sinistresuiteForm.get('pack')?.valueChanges.subscribe((selectedPack) => {
      const garantieControl = this.sinistresuiteForm.get('garantie');

      this.garantiesSuite = [];
      garantieControl?.reset();
      garantieControl?.disable();

      if (selectedPack) {
        this.packService.getGarantiePack(selectedPack).subscribe({
          next: (data) => {
            this.garantiesSuite = data || [];
            if (this.garantiesSuite.length > 0) {
              garantieControl?.enable();
            } else {
              garantieControl?.disable();
            }
          },
          error: (err) => {
            console.error('Erreur chargement garanties suite:', err);
            this.garantiesSuite = [];
            garantieControl?.disable();
          }
        });
      }
    });
  }



  dateRangeValidator: ValidatorFn = (group: AbstractControl): { [key: string]: any } | null => {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end) {
      const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
      const diff = new Date(end).getTime() - new Date(start).getTime();
      if (diff > oneMonthMs || diff < 0) {
        return { dateRange: true };
      }
    }
    return null;
  };
  getAllProduits() {
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (err) => {
        console.error('Error fetching produits:', err);
      }
    });
  }
  getAllAgences() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agences = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  Userinformation() {
    return {
      id: Number(sessionStorage.getItem('userId')),
      email: sessionStorage.getItem('userEmail'),
      agence: Number(sessionStorage.getItem('agence'))
    };

  }
  getAllAgenceDetails() {
    this.agencesService.getAllAgenceDetails().subscribe({
      next: (data: any[]) => {
        this.allAgencesDetails = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des agences :', error);
      }
    });
  }
  getPacksByProduit(idProduit: any) {
    this.packService.getPackByProduit(idProduit).subscribe({
      next: (data) => {
        this.packs = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des packs:', err);
        this.packs = [];
      }
    });
  }

  getGarantiePack(idPack: any) {
    this.packService.getGarantiePack(idPack).subscribe({
      next: (data) => {
        this.garanties = data;
        console.log('Garanties:', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des garanties:', err);
        this.garanties = [];
      }
    });
  }
  getDictionnaireData(id: any): void {
    this.sinistreService.getDictionnaire(id).subscribe({
      next: (data) => {
        console.log('Dictionnaire:', data);
        this.dictionnaires = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du dictionnaire:', error);
      }
    });
  }
  exportFormData(formType: string): void {
    let formData: any;

    switch (formType) {
      case 'sinistres':
        if (this.sinistreForm.invalid) return;
        formData = this.sinistreForm.value;
        break;
      case 'sinistresdec':
        if (this.sinistredecForm.invalid) return;
        formData = this.sinistredecForm.value;
        break;
      case 'sinistresuite':
        if (this.sinistresuiteForm.invalid) return;
        formData = this.sinistresuiteForm.value;
        break;
      case 'sinistreprov':
        if (this.sinistreprovForm.invalid) return;
        formData = this.sinistreprovForm.value;
        break;
      default:
        return;
    }

    // this.http.post(`${environment.apiUrl}/export/${formType}`, formData, {
    this.http.post('loclahost:4000/export', formData, {
      responseType: 'blob'  // pour recevoir le fichier Excel
    }).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-${formType}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    }, (error: any) => {
      console.error("Erreur export:", error);
    });
  }
  getSituation() {
    this.genericService.getParam(
      JSON.parse(sessionStorage.getItem('dictionnaire') || '{}')
        .find((parametre: any) => parametre.code == "C48").idCategorie
    ).subscribe({
      next: (data: any) => {
        this.situations = data;
      },
      error: (error) => {
        // console.log(error);
      }
    });
  }

}
