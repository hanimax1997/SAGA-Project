import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AgencesService } from 'src/app/core/services/agences.service';
import { ContratService } from 'src/app/core/services/contrat.service';
import { GenericService } from 'src/app/core/services/generic.service';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-product-commercial-line',
  templateUrl: './create-product-commercial-line.component.html',
  styleUrls: ['./create-product-commercial-line.component.scss']
})
export class CreateProductCommercialLineComponent implements OnInit {
  formCreation: FormGroup | any;
  agences: any = []
  produits: any
  sousProduit: any
  canalList: any
  dateDebut = new Date()
  constructor(private router: Router, private sinistresService: SinistresService, private genericService: GenericService, private contratService: ContratService, private agencesService: AgencesService, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.getAgences()
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C102").idCategorie).subscribe(data => {
      this.produits = data;

    })

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C22").idCategorie).subscribe(data => {
      this.canalList = data;

    })

  }
  getRelation(produitId: any) {
    this.sinistresService.getByLien(produitId).subscribe({
      next: (data: any) => {
        this.sousProduit = data

      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  initForm() {
    this.formCreation = this.formBuilder.group({
      produit: ['', [Validators.required]],
      SousProduit: ['', [Validators.required]],
      numPolice: ['', [Validators.required]],
      numQuittance: ['', [Validators.required]],
      mouvement: ['', [Validators.required]],
      dateOperation: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      primeTotale: ['', [Validators.required]],
      primeNette: ['', [Validators.required]],
      coutPolice: ['', [Validators.required]],
      tva: ['', [Validators.required]],
      timbreDimension: ['', [Validators.required]],
      agence: ['', [Validators.required]],
      capital: ['', [Validators.required]],
      limite: ['', [Validators.required]],
      limiteRc: ['', [Validators.required]],
      canal: ['', [Validators.required]],
      nbSite: ['', [Validators.required]],
      nomClient: ['', [Validators.required]],

    });
  }
  getAgences() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agences = data
        this.initForm()
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  submitProduct(form: any) {

    let body = this.formCreation.value
    body.produit = { "idParam": this.formCreation.get('produit').value }
    body.sousProduit = { "idParam": this.formCreation.get('SousProduit').value }
    this.contratService.addContratCommercialLine(body).subscribe({
      next: (data: any) => {
        Swal.fire(
          "Contrat créé avec succès",
          '',
          'success'
        )
        Swal.fire({
          title: "Contrat créé avec succès",
          icon: 'success',
          confirmButtonText: `Ok`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/gestion-commercial-line']);
          }
        })

      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
