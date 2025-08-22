import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParamRisque } from 'src/app/core/models/param-risque';
import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { TYPERISQUE } from 'src/app/core/models/type-risque';
import { TypeRisqueService } from 'src/app/core/services/type-risque.service';
import { Dictionnaire } from 'src/app/core/models/dictionnaire';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2'
import { GenericService } from 'src/app/core/services/generic.service';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-param-risque-dialog',
  templateUrl: './edit-param-risque-dialog.component.html',
  styleUrls: ['./edit-param-risque-dialog.component.scss']
})
export class EditParamRisqueDialogComponent implements OnInit {
  fromTableExist = false
  formEditDetailRisque: FormGroup | any;
  detailRisque: ParamRisque | any;
  detailRisqueEditSuccess = false;
  now: Date = new Date();
  idDetailRisque: number;
  detailRisqueEditError = false;
  messageError: string | undefined;
  types_risque: TYPERISQUE[];
  types_champs: any ;
  checkListOf =false;
  minDate = new Date();
  options: any = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  categorieRisque: any
  categories: Dictionnaire[];
  paramRisqueByType: ParamRisque[];
  genericTables: any = [];
  selectedList: any;
  selectedCategorie: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public dialogRef: MatDialogRef<EditParamRisqueDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilderAuth: FormBuilder, private paramRisqueService: ParamRisqueService, private typeRisqueService: TypeRisqueService, private router: Router, private genericService: GenericService) { }

  ngOnInit(): void {
    this.getDetailRisqueServiceById(this.data.idDetailRisque);

  }

  //get details param risqie
  getDetailRisqueServiceById(idDetailRisque: any) {

    //get types champ
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C12").idCategorie).subscribe(typesChamp => {
      this.types_champs = typesChamp        
    })
    //get param risque by id
     this.paramRisqueService.getParamRisqueById(idDetailRisque).subscribe((result: any) => {
     
       this.selectedList = result.listdetails?.map((details: { idParamRisqueFils: { idParamRisque: any; }; }) => details.idParamRisqueFils.idParamRisque);
      
       this.initFormEditDetailRisque(result);

    })

    //get param risque by type risque
    this.paramRisqueService.getParamRisqueByTypeRisque(this.data.idTypeRisque).subscribe((detailRisqueList: ParamRisque[]) => {
      this.paramRisqueByType = detailRisqueList
    })

  }

  //init formulaire param risque
  initFormEditDetailRisque(infoDetailRisque: any) {
   
    this.formEditDetailRisque = this.formBuilderAuth.group({
      idParamRisque: [infoDetailRisque.idParamRisque],
      typeRisque: [infoDetailRisque.typeRisque, [Validators.required]],
      libelle: [infoDetailRisque.libelle, [Validators.required]],
      tableGeneric: [null, []],
      descriptionChamp: [infoDetailRisque.descriptionChamp, [Validators.required]],
      categorieRisquelist: [infoDetailRisque.categorieParamRisque?.idParam, [Validators.required]],
      categorieRisque: [''],
      orderChamp: [infoDetailRisque.orderChamp],   
      typeChamp: [infoDetailRisque.typeChamp ? infoDetailRisque.typeChamp.idParam : ''],      
      reponses: [infoDetailRisque.reponses],
      sizeChamp: [infoDetailRisque.sizeChamp],
      isParent: [false],
      listparam: [this.selectedList],
      listParamRisque: [[]],
      isFils: [false],
      isList: [infoDetailRisque.isList],
      idParamParent: [''],
      dateDebut: [infoDetailRisque.dateDebut, [Validators.required]],
      dateFin: [infoDetailRisque.dateFin],
      auditUser: [infoDetailRisque.auditUser]
    });
   // this.categorieRisque = infoDetailRisque.categorieParamRisque?.idParam
    this.categorieRisque = infoDetailRisque.categorieParamRisque
    infoDetailRisque.reponses ? this.options = infoDetailRisque.reponses : '';
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C28").idCategorie).subscribe(data => {
      this.categories = data;

    })
    console.log("codeCategorie")
    console.log(infoDetailRisque.categorieParamRisque)
    infoDetailRisque.typeChamp.code == 'L01' ? this.checkListOf=true :  this.checkListOf=false
  }

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
  //submit modification param risque
  submitEditDetailRisque(formDirective: any) {


    if (this.formEditDetailRisque.valid) {
      this.formEditDetailRisque.get("dateDebut").setValue(moment(this.formEditDetailRisque.get("dateDebut").value).format('YYYY-MM-DD'))

      Object.assign(this.formEditDetailRisque.value, { idcategorie: 72 });
      if (this.categorieRisque == 'CP239') {
        this.formEditDetailRisque.get("categorieRisque").setValidators([Validators.required])
        Object.assign(this.formEditDetailRisque.value, { categorieParamRisque: { "idParam": null, "description": this.formEditDetailRisque.get("categorieRisque").value }, });
      }
      else {
        this.formEditDetailRisque.get("categorieRisque").setValidators([])
        Object.assign(this.formEditDetailRisque.value, { categorieParamRisque: { "idParam": this.categorieRisque.idParam, "description": null }, });
      }

      this.formEditDetailRisque.value.reponses = this.options;
      this.formEditDetailRisque.value.listparam.map((p: any) => {
      this.formEditDetailRisque.value.listParamRisque.push({ idParamRisque: p });
      })
      this.formEditDetailRisque.removeControl('listparam')

      //  this.formEditDetailRisque.value.typeChamp = this.types_champs.find((type: any) => type.idParam == this.formEditDetailRisque.value.typeChamp)
      this.formEditDetailRisque.value.reponses = this.options;

      console.log("submitEditForm-------->")
      console.log(this.formEditDetailRisque.value)

      this.paramRisqueService.updateParamRisque(this.formEditDetailRisque.value, this.data.idDetailRisque).subscribe({
        next: (data: any) => {

          this.detailRisqueEditSuccess = true;
          this.detailRisqueEditError = false;
          this.idDetailRisque = data.idParamRisque;

          Swal.fire(
            `Le param risque N°${data.idParamRisque} a été modifié avec succés`,
            '',
            'success'
          )
          this.dialogRef.close();

        },
        error: (error) => {
         
          this.detailRisqueEditError = true;
          this.detailRisqueEditSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
          Swal.fire(
            this.messageError,
            '',
            'error'
          )

        }
      });

    } 
  }

  debutDateChange(value: any) {
    this.minDate = value

  }
  getTypeChamp(typeChamp: any) {

 
    //if type champ == from table( code='L08')
    if (this.types_champs.find((champ: any) => champ.idParam == typeChamp).code == 'L08') {
      this.fromTableExist = true
      this.checkListOf = false
      this.formEditDetailRisque.get('tableGeneric').setValidators([Validators.required])
      this.getTableGeneric()
    } else if(this.types_champs.find((champ: any) => champ.idParam == typeChamp).code == 'L01'){
      this.checkListOf = true
    }else{
      this.fromTableExist = false
      this.checkListOf = false
      this.formEditDetailRisque.get('tableGeneric').setValidators([])
      this.formEditDetailRisque.get('tableGeneric').updateValueAndValidity();
    }
   

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
  getCategorie(value: any) {  

    this.categorieRisque = this.categories.find((cat:any)=>cat.idParam == value.value)


   // this.categorieRisque = value.value
    console.log("selectedCat")
    console.log(this.categorieRisque)
    
    //selectedCategorie

  }
}
