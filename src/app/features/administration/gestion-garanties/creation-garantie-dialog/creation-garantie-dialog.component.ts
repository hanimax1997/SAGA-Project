import { GenericService } from 'src/app/core/services/generic.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GarantiesService } from '../../../../core/services/garanties.service';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-garantie-dialog',
  templateUrl: './creation-garantie-dialog.component.html',
  styleUrls: ['./creation-garantie-dialog.component.scss']
})
export class CreationGarantieDialogComponent implements OnInit {

  formCreationGarantie: FormGroup | any;

  garantieCreationSuccess = false;
  minDate = new Date()
  idGarantie: number | undefined;
  garantieCreationError = false;
  messageError: string;
  categorieGarantieArray: any = [];

  constructor(private formBuilderAuth: FormBuilder, private garantiesService: GarantiesService, private router: Router, private genericService: GenericService) { }

  ngOnInit(): void {
    this.formCreationGarantie = this.formBuilderAuth.group({
      idNationnal: [''],
      description: ['', [Validators.required]],
      valeurEnvloppe: [''],
      categorieGarantie: ['', [Validators.required]],
      withTaxe: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
      auditUser: ['test'],

    });
    this.getCategorieGarantie();
  }

  getCategorieGarantie() {

    this.genericService
      .getParam(
        JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
          (parametre: any) => parametre.code == 'C80'
        ).idCategorie
      )
      .subscribe((data) => {
        this.categorieGarantieArray = data

      });
  }

  submitCreationGarantie(formDirective: any) {
    if (this.formCreationGarantie.valid) {
      this.formCreationGarantie.get("dateDebut").setValue(moment(this.formCreationGarantie.get("dateDebut").value).format('YYYY-MM-DD'))
      let body = this.formCreationGarantie.value
      body.categorieGarantie = { "idParam": this.formCreationGarantie.get("categorieGarantie").value }
   
      this.garantiesService.addGarantie(body).subscribe(
        (data: any) => {
          this.garantieCreationSuccess = true;
          this.garantieCreationError = false;
          this.idGarantie = data.idGarantie;
          formDirective.resetForm();
          this.formCreationGarantie.reset();
        },

        error => {
          this.garantieCreationError = true;
          this.garantieCreationSuccess = false;
        })
    }
  }
  debutDateChange(value: any) {
    this.minDate = value

  }
}
