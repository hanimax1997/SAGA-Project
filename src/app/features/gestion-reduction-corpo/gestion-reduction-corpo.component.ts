
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PackService } from 'src/app/core/services/pack.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';

@Component({
  selector: 'app-gestion-reduction-corpo',
  templateUrl: './gestion-reduction-corpo.component.html',
  styleUrls: ['./gestion-reduction-corpo.component.scss']
})
export class GestionReductionCorpoComponent implements OnInit {
  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;
  formInfoGeneral: FormGroup | any;
  infoProduit: FormGroup | any;
  infoVehicule: FormGroup | any;
  infoPack: FormGroup | any;
  VOFormGaranties: FormGroup;
  typeReduction = ""
  loadTablePack = false
  garantiePart = false
  step = 0
  minDate = new Date()
  dataSourceGaranties: any = []
  dataSourcePacks = new MatTableDataSource<any>();
  displayedColumns: string[] = ['garantie', 'franchise', 'pourcentage', 'action'];
  displayedPackColumns: string[] = ['id', 'description', 'dateDebut', 'action'];
  displayedColumnsReductions: string[] = ['nomReduction', 'dateDebut', 'typeProduit', 'action'];

  packs: any = []
  garantieTab: any = []
  packsTab: any = []
  typeProduit = ""
  typeProduits = [{ "id": 1, "description": "Auto" }, { "id": 2, "description": "Voyage" }]
  reductionList: any = []
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSourceReduction = new MatTableDataSource(this.reductionList)
  emptyTable = true
  dateDebutConvention = new Date()
  dateFinConvention = new Date()
  constructor(private router: ActivatedRoute, private packService: PackService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //
    this.router.queryParams.subscribe(params => {
 
      this.dateDebutConvention=new Date(params['dateDebut'])
      this.dateFinConvention=new Date(params['dateFin'])
    });

    if (this.reductionList.length != 0)
      this.emptyTable = false
    // if (this.router.url.includes('/creation-convention'))
    //   this.typeReduction = "convention"
    // else
    //   this.typeReduction = "retail"
    this.initFormGeneral()
    this.initInfoVehicule()
    this.initInfoProduit()
    this.initInfoPack()
    this.getAllPack()
  }
  initFormGeneral() {
    this.formInfoGeneral = this.formBuilder.group({
      nomReduction: ['', Validators.required],
      dateDebut: [{value:this.dateDebutConvention,disabled:true}, Validators.required],
      dateFin: [{value:this.dateFinConvention,disabled:true}],
      // typeProduit: ['', Validators.required]

    });
  }
  initInfoVehicule() {
    return this.formBuilder.group({
      ageVehiculeMin: ['', Validators.required],
      ageVehiculeMax: ['', Validators.required],
      ageConducteurMin: ['', Validators.required],
      ageConducteurMax: ['', Validators.required],
      marqueVehicule: ['', Validators.required],
      genreConducteur: ['', Validators.required],
      valeurVenaleMin: ['', Validators.required],
      valeurVenaleMax: ['', Validators.required],

    });
  }
  initInfoProduit() {
    this.infoProduit = this.formBuilder.group({
      agence: ['', Validators.required],
      utilisateur: ['', Validators.required],
      canalDistribution: ['', Validators.required],
      // pack: ['', Validators.required],
      segment: ['', Validators.required],
      // VORows: this.formBuilder.array([]),
      infoVehicule: this.initInfoVehicule()
    });
  }
  initInfoPack() {
    this.infoPack = this.formBuilder.group({
      pack: ['', Validators.required],
      VORowsPacks: this.formBuilder.array([]),
    });
  }
  newPack(idPack: any, description: string): FormGroup {
    return this.formBuilder.group({
      idPack: idPack,
      description: description,
      garanties: this.formBuilder.array([])
    })
  }
  newGarantie(garantie: any): FormGroup {
    return this.formBuilder.group({
      idGarantie: new FormControl(garantie.idGarantie),
      garantie: new FormControl(garantie.description),
      franchise: new FormControl(garantie.franchise),
      pourcentage: new FormControl(garantie.pourcentage),
      isEditable: new FormControl(false),
    });

  }
  addPackGaranties(packIndex: number, garantie: any) {
    this.VORowsGaranties(packIndex).push(this.newGarantie(garantie));
  }
  VORowsPacks(): FormArray {
    return this.infoPack.get("VORowsPacks") as FormArray
  }
  VORowsGaranties(packIndex: number): FormArray {
    return this.VORowsPacks().at(packIndex).get("garanties") as FormArray
  }
  // pack 
  getAllPack() {
    this.packService.getPackByProduit(150).subscribe({
      next: (data: any) => {
        data.map((pack: any) => {
          this.packs.push(pack)

        })

     

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getPack(idPack: any, packIndex: any) {

    this.packService.getPackById(idPack).subscribe({
      next: (data: any) => {
        this.garantiePart = true
        this.loadTablePack = true
        this.garantieTab = []
        data.garantie.filter((garantie: any) => {
          let franchise: any = "/"
          garantie.categorieList.filter((category: any) => {
            if (category.description == "franchise") {
              franchise = category.valeur
            }
          })
          let oneGarantie = {
            "idGarantie": garantie.idGarantie,
            "idPackComplet": garantie.idPackComplet,
            "description": garantie.description,
            "franchise": franchise,
            "pourcentage": "/",
          }
          this.garantieTab.push(
            {
              "idGarantie": garantie.idGarantie,
              "idPackComplet": garantie.idPackComplet,
              "description": garantie.description,
              "franchise": franchise,
              "pourcentage": "/",
            }
          )
      
          this.addPackGaranties(packIndex, oneGarantie)
        })
        this.initFormGarantie(packIndex)
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  initFormGarantie(packIndex: any) {

    // this.garantieTab.map((garantie: any) => {
    //   let garantieLigne = this.formBuilder.group({
    //     idGarantie: new FormControl(garantie.idGarantie),
    //     garantie: new FormControl(garantie.description),
    //     franchise: new FormControl(garantie.franchise),
    //     pourcentage: new FormControl(garantie.pourcentage),
    //     isEditable: new FormControl(false),
    //   });
    //   this.VORows.push(garantieLigne);
    // });

    this.dataSourceGaranties[packIndex] = new MatTableDataSource(this.VORowsGaranties(packIndex).controls);
    // this.form.get('albums') as FormArray
    this.dataSourceGaranties.paginator = this.paginator;
  }
  get VORows() {
    return this.infoPack.controls['VORows'] as FormArray;
  }
  EditGarantieLigne(form: any, index: number) {
    form.get('garanties').at(index).get('isEditable').patchValue(true);
  }
  SaveGarantieLigne(form: any, index: number) {
    form.get('garanties').at(index).get('isEditable').patchValue(false);

  }
  // submitReductionProduit() {

  // }
  saveReduction() {

    // let tempTabReduction: any = []
    this.reductionList.push({
      "nomReduction": this.formInfoGeneral.get("nomReduction").value,
      "dateDebut": moment(this.formInfoGeneral.get("dateDebut").value).format('YYYY-MM-DD'),
      "typeProduit": this.typeProduit,
    })
    this.emptyTable = false


    this.dataSourceReduction = new MatTableDataSource(this.reductionList)
    this.step = 0
    this.resetForm();
  }
  resetForm() {
    this.formInfoGeneral.reset()
    this.infoPack.reset()
    this.infoProduit.reset()
  }
  onChangePack(pack: any, checked: any) {

    if (checked.checked && this.packsTab.find((o: any) => o.idPack0 === pack.idPack0) == undefined) {
      this.packsTab.push(pack)
      this.VORowsPacks().push(this.newPack(pack.idPack0, pack.description));
      this.getPack(pack.idPack0, this.VORowsPacks().controls.findIndex((x: any) => x.value.idPack === pack.idPack0))

    }

    else if (!checked.checked && this.packsTab.find((o: any) => o.idPack0 === pack.idPack0) != undefined) {
      this.removePack(this.VORowsPacks().controls.findIndex((x: any) => x.value.idPack === pack.idPack0))
      this.packsTab.splice(this.packsTab.map((item: any) => item.idPack0).indexOf(pack.idPack0), 1);
    }




  }
  // removePack(packIndex: number, skillIndex: number) {
  //   this.VORowsPacks(empIndex).removeAt(skillIndex);
  // }
  removePack(packIndex: number) {
    this.VORowsPacks().removeAt(packIndex);
  }
  // end pack
  //submit info Produit 2nd form 
  submitInfoProduit() {
  }
  changeTypeProduit(value: any) {
    this.step = 1

    this.typeProduit = value.description
  }

}