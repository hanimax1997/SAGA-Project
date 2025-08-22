import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParamRisque } from 'src/app/core/models/param-risque';
import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
import { TYPERISQUE } from 'src/app/core/models/type-risque';
import { TypeRisqueService } from 'src/app/core/services/type-risque.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dictionnaire } from 'src/app/core/models/dictionnaire';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GenericService } from 'src/app/core/services/generic.service';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-param-risque-',
  templateUrl: './creation-param-risque-dialog.component.html',
  styleUrls: ['./creation-param-risque-dialog.component.scss']
})
export class CreationParamRisqueDialogComponent implements OnInit {
  formCreationDetailRisque: FormGroup | any;
  detailRisque: ParamRisque | any;
  detailRisqueCreationSuccess = false;
  now: Date = new Date();
  idDetailRisque: number | undefined;
  detailRisqueCreationError = false;
  messageError: string | undefined;
  types_risque: TYPERISQUE[];
  types_champs: Dictionnaire[];
  genericTables: any = []
  fromTableExist = false
  minDate = new Date();
  options: any = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  categorieRisque: any
  categories: Dictionnaire[];
  paramRisqueByType: ParamRisque[];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private genericService: GenericService, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilderAuth: FormBuilder, private paramRisqueService: ParamRisqueService, private typeRisqueService: TypeRisqueService, private router: Router) { }

  //add reponse in list of value
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.options.push({
        reponse: value.trim()
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  //remove reponse
  remove(option: any): void {
    const index = this.options.indexOf(option);

    if (index >= 0) {
      this.options.splice(index, 1);
    }
  }

  ngOnInit(): void {
    //init formulaire param risque
    this.formCreationDetailRisque = this.formBuilderAuth.group({
      idParamRisque: [''],
      typeRisque: [this.data.typeRisque, [Validators.required]],
      libelle: ['', [Validators.required]],
      tableGeneric: [null, [Validators.required]],
      descriptionChamp: ['', [Validators.required]],
      categorieRisquelist: ['', [Validators.required]],
      categorieRisque: [''],
      orderChamp: [''],
      typeChamp: [''],
      reponses: [[]],
      listparam: [[]],
      listParamRisque: [[]],
      sizeChamp: [''],
      isParent: [false],
      isFils: [false],
      isList: [false],
      idParamParent: [''],
      dateDebut: ['', [Validators.required]],
      dateFin: [null],
      auditUser: [null],
    });

    //get types champ
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C12").idCategorie).subscribe(data => {
      this.types_champs = data;
    })

    //get categories
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C28").idCategorie).subscribe(data => {
      this.categories = data;
    })

    //get param risque by type risque
    this.paramRisqueService.getParamRisqueByTypeRisque(this.data.typeRisque.idTypeRisque).subscribe((detailRisqueList: ParamRisque[]) => {
      this.paramRisqueByType = detailRisqueList
    })
  }

  submitCreationDetailRisque(formDirective: any) {
    if (this.formCreationDetailRisque.valid) {
      this.formCreationDetailRisque.get("dateDebut").setValue(moment(this.formCreationDetailRisque.get("dateDebut").value).format('YYYY-MM-DD'))

      Object.assign(this.formCreationDetailRisque.value, { idcategorie: 72 });
      if (this.categorieRisque == 192) {
        this.formCreationDetailRisque.get("categorieRisque").setValidators([Validators.required])
        Object.assign(this.formCreationDetailRisque.value, { categorieParamRisque: { "idParam": null, "description": this.formCreationDetailRisque.get("categorieRisque").value }, });

      }
      else {
        this.formCreationDetailRisque.get("categorieRisque").setValidators([])
        Object.assign(this.formCreationDetailRisque.value, { categorieParamRisque: { "idParam": this.categorieRisque, "description": null }, });

      }

      this.formCreationDetailRisque.value.reponses = this.options;
      this.formCreationDetailRisque.value.listparam.map((p: any) => {
        this.formCreationDetailRisque.value.listParamRisque.push({ idParamRisque: p });
      })
      this.formCreationDetailRisque.removeControl('listparam')

      this.paramRisqueService.addParamRisque(this.formCreationDetailRisque.value).subscribe(
        (data: any) => {
          this.detailRisqueCreationSuccess = true;
          this.detailRisqueCreationError = false;
          this.idDetailRisque = data.idParamRisque;
          formDirective.resetForm();
          this.formCreationDetailRisque.reset();
        },

        error => {
          this.detailRisqueCreationError = true;
          this.detailRisqueCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    } else {
      const invalid = [];
      const controls = this.formCreationDetailRisque.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }

    }
  }

  debutDateChange(value: any) {
    this.minDate = value

  }
  getCategorie(value: any) {
    this.categorieRisque = value.value

  }
  getTypeChamp(typeChamp: any) {
    if (typeChamp.code == 'L08') {
      this.fromTableExist = true
      this.formCreationDetailRisque.get('tableGeneric').setValidators([Validators.required])
      this.getTableGeneric()
    } else
      this.formCreationDetailRisque.get('tableGeneric').setValidators([])
    this.formCreationDetailRisque.get('tableGeneric').updateValueAndValidity();


  }
  getTableGeneric() {
    this.genericService.getAllGenericTables().subscribe({
      next: (data: any) => {
        this.genericTables = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
}
