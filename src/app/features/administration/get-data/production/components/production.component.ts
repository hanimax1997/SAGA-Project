import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ProduitService } from 'src/app/core/services/produit.service';
import { AgencesService } from 'src/app/core/services/agences.service';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { PackService } from 'src/app/core/services/pack.service';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { DateAdapter } from '@angular/material/core';
import { UsersService } from 'src/app/core/services/users.service';
@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit {
  rapportForm!: FormGroup;
  produits: any[] = [];
  selectedSousProduits: any[] = [];
  agences: any = [];
  userId: any;
  agencesUtilisateur: any[] = [];
  agenceUnique: any = null;
  afficherListeAgences: boolean = false;
  aucuneAgence: boolean = false;
  packs: any[] = [];
  avenants: any[] = [];
  statutQuittance: [''];
  zoneNom: any = '';
  allAgencesDetails: any[] = [];
  maxDate = new Date('2025-01-01');
  today = new Date();
  minDate: Date = new Date('2025-01-01');
  statutsQuittance: string[] = ['Émis', 'Encaissé', 'Annulé'];
  societes: string[] = ['Vie', 'Dommage'];
  isLoading: boolean = false;
  startDateValue!: Date;
  maxEndDate!: Date;
  role: string | null;
  cdcEmail: string;
  allCdcEmails: any;
  cdcList: any;






  constructor(private fb: FormBuilder,
    private produitService: ProduitService,
    private agencesService: AgencesService,
    private authService: AuthentificationService,
    private packService: PackService,
    private avenantService: AvenantService,
    private dateAdapter: DateAdapter<Date>,
    private usersService: UsersService,
  ) { }
  ngOnInit(): void {
    this.rapportForm = this.fb.group({
      produit: [],
      // sousProduit: [],
      sousProduit: [{ value: null, disabled: true }],
      agence: ['', Validators.required],
      codeUser: [''],
      // pack: [''],
      pack: [{ value: null, disabled: true }],
      numeroPolice: [''],
      avenant: [''],
      statutQuittance: [''],
      zoneNom: '',
      nomAssure: ['', [Validators.pattern('^[A-Za-z]+$')]],
      societe: [''],
      startDate: [null, [Validators.required]],
      endDate: [{ value: null, disabled: true }, Validators.required],
      allCdcEmails: [''],



    },
      {
        validators: [this.dateRangeValidator]
      }
    );
    // this.role = sessionStorage.getItem('roles');
    // // if (this.role === 'CDC') {
    // //   const storedEmail = sessionStorage.getItem('userEmail');
    // //   this.cdcEmail = storedEmail ? storedEmail : '';
    // // }
    // if (this.role === 'CDC') {
    //   const storedEmail = sessionStorage.getItem('userEmail');
    //   this.cdcEmail = storedEmail ? storedEmail : '';
    // } else {
    //   // 2. Charger la liste des CDC si ce n'est pas un CDC
    //   this.loadCdcUsers();
    // }
    const storedRole = sessionStorage.getItem('roles');
    this.role = storedRole ? JSON.parse(storedRole)[0] : null;

    if (this.role === 'CDC') {
      const storedEmail = sessionStorage.getItem('userEmail');
      this.cdcEmail = storedEmail ? storedEmail : '';
    } else {
      this.loadCdcUsers();
    }
  
    this.rapportForm.get('startDate')?.valueChanges.subscribe((selectedStart: Date) => {
    if (selectedStart) {
      this.startDateValue = selectedStart;

      // Calcul de la date max: min(startDate + 30 jours, aujourd’hui)
      const tempMaxDate = new Date(selectedStart);
      tempMaxDate.setDate(tempMaxDate.getDate() + 30);

      this.maxEndDate = tempMaxDate > this.today ? this.today : tempMaxDate;

      // Réinitialise et active le champ endDate avec les nouvelles limites
      const endDateControl = this.rapportForm.get('endDate');
      endDateControl?.enable();
      endDateControl?.reset();
    }
  });



this.getAllProduits();
this.getAllAgenceDetails();

const user = this.Userinformation();

this.rapportForm.patchValue({
  codeUser: user.email?.slice(1, -1)
});

if (user.email) {
  const email = user.email.replace(/"/g, '');
  this.authService.getUserId(email).subscribe({
    next: (data) => {
      if (data.agences?.length === 1) {
        this.agenceUnique = data.agences[0];
        this.rapportForm.patchValue({
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
// this.rapportForm.get('produit')?.valueChanges.subscribe((selectedId: number) => {
//   const selectedProduct = this.produits.find(p => p.idCodeProduit === selectedId);
//   this.selectedSousProduits = selectedProduct?.sousProduits || [];
//   this.rapportForm.get('sousProduit')?.reset();
//   this.packs = [];

//   // Charger les packs du produit
//   if (selectedId) {
//     this.getPacksByProduit(selectedId);
//   }
// });

this.rapportForm.get('sousProduit')?.valueChanges.subscribe((sousProduitId: number) => {
  if (sousProduitId) {
    this.getPacksByProduit(sousProduitId);
  }
});

this.rapportForm.get('produit')?.valueChanges.subscribe((selectedId: number) => {
  const selectedProduct = this.produits.find(p => p.idCodeProduit === selectedId);
  this.selectedSousProduits = selectedProduct?.sousProduits || [];
  
  const sousProduitControl = this.rapportForm.get('sousProduit');
  
  sousProduitControl?.reset();

  if (!selectedId || this.selectedSousProduits.length === 0) {
    sousProduitControl?.disable();  
  } else {
    sousProduitControl?.enable();   
  }

  this.packs = [];

  if (selectedId) {
    this.getPacksByProduit(selectedId);
  }
});
this.rapportForm.get('sousProduit')?.valueChanges.subscribe((sousProduitId: number) => {
  const packControl = this.rapportForm.get('pack');
  packControl?.reset();

  if (sousProduitId) {
    this.getPacksByProduit(sousProduitId);  
  } else {
    this.packs = [];
    packControl?.disable();
  }
});



// this.rapportForm.get('numeroPolice')?.value
this.rapportForm.get('numeroPolice')?.valueChanges.subscribe((police: string) => {
  if (police && police.trim() !== '') {
    this.avenantService.getAvenantByContrat(police).subscribe({
      next: (data) => {
        this.avenants = data;
      },
      error: (err) => {
        console.error('Erreur chargement avenants :', err);
        this.avenants = [];
      }
    });


  } else {
    this.avenants = [];
  }
});




// this.rapportForm.get('agence')?.valueChanges.subscribe((agenceStr: string) => {
//   if (agenceStr?.trim()) {
//     const codeAgence = agenceStr.split(' - ')[0]; 
//     const agenceDetail = this.allAgencesDetails.find(a => a.codeAgence === codeAgence);

//     if (agenceDetail) {
//       this.zoneNom = agenceDetail.zone;

//       // this.reseauNom = agenceDetail.reseauDistribution;
//     } else {
//       this.zoneNom = '';
//       // this.reseauNom = '';
//     }
//   }

// });

this.rapportForm.get('agence')?.valueChanges.subscribe((agenceStr: string) => {
  if (agenceStr?.trim()) {
    const codeAgence = agenceStr.split(' - ')[0];
    const agenceDetail = this.allAgencesDetails.find(a => a.codeAgence === codeAgence);

    if (agenceDetail) {
      this.zoneNom = agenceDetail.zone;

      this.rapportForm.get('zoneNom')?.setValue(agenceDetail.zone, { emitEvent: false });

    } else {
      this.zoneNom = '';
      this.rapportForm.get('zoneNom')?.setValue('', { emitEvent: false });
    }
  }
});



  }
loadCdcUsers(): void {
  this.usersService.getAllUsers().subscribe({
    next: (users) => {
      console.log("Liste de user", users);
      this.cdcList = users.email;

      console.log('Liste des CDC:', this.cdcList);
    },
    error: (error) => {
      console.error('Erreur lors du chargement des CDC:', error);
    }
  });
}
getMonthDifference(start: Date, end: Date): number {
  const msInMonth = 1000 * 60 * 60 * 24 * 30;
  const diff = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  return diff / msInMonth;
}


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
AppartienAgence() {
  return {

  }
}
// getPacksByProduit(idProduit: any) {
//   this.packService.getPackByProduit(idProduit).subscribe({
//     next: (data) => {
//       this.packs = data;
//     },
//     error: (err) => {
//       console.error('Erreur lors du chargement des packs:', err);
//       this.packs = [];
//     }
//   });
// }
getPacksByProduit(sousProduitId: number) {
  this.packService.getPackByProduit(sousProduitId).subscribe((response: any) => {
    this.packs = response || [];

    const packControl = this.rapportForm.get('pack');
    if (this.packs.length > 0) {
      packControl?.enable();
    } else {
      packControl?.disable();
    }
  });
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
onSubmit() {
  if (this.rapportForm.invalid) {
    this.rapportForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  const jsonPayload = this.rapportForm.getRawValue();

  // 🔍 Affiche les données du formulaire dans la console
  console.log('Données envoyées au backend :', jsonPayload);

  fetch('http://localhost:4200', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonPayload)
  })
    .then(response => {
      this.isLoading = false;
      if (!response.ok) throw new Error('Erreur lors de la génération du fichier');
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rapport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      this.isLoading = false;
      alert('Une erreur est survenue : ' + error.message);
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



}
