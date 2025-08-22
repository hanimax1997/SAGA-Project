import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ProduitService } from 'src/app/core/services/produit.service';
import Swal from 'sweetalert2'

import { PersonneService } from 'src/app/core/services/personne.service';
import { ReductionService } from 'src/app/core/services/reduction.service';
import { ConventionService } from 'src/app/core/services/convention.service';
import { ReductionFiltreJson } from 'src/app/core/models/reduction';
import { SelectionModel } from '@angular/cdk/collections';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-creation-convention',
  templateUrl: './creation-convention.component.html',
  styleUrls: ['./creation-convention.component.scss']
})
export class CreationConventionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('stepper') private stepper: MatStepper;

  formInfoGenarale: FormGroup | any;
  formReduction: FormGroup | any;
  formInfoClient: FormGroup | any;
  formFiltre: FormGroup | any;
  typeProduits: any = []
  reductions: any = []
  displayedColumns: string[] = ['idReduction', 'nomReduction', 'produit'];
  displayedColumnsClient: string[] = ['action', 'numClient', 'RaisonSociale'];
  selection3 = new SelectionModel<any>(false, []);
  personneMorales: any = []
  minDate = new Date()
  ReducTab: any = []
  reducEmpty = true
  erreurDateDebut = false
  dateDebut = new Date()
  selectedReductions: any = []
  typeReduction = 261
  filterReduction = ReductionFiltreJson
  idProduit: number
  dataSourcesReductions = new MatTableDataSource()
  produitReady: boolean = false;
  conventionSuccess: boolean = false;
  dateFinEntry: boolean = false;
  idConvention = 0
  errorHandler = {
    "error": false,
    "msg": ""
  }
  codeConvention: any
  bodyConvention: any = [];
  dataSourceClients: MatTableDataSource<any>;
  constructor(private produitService: ProduitService, private personneService: PersonneService, private conventionService: ConventionService, private reductionService: ReductionService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initFormConvention()

    this.getAllProduits()
    this.getAllPersonneMorale()
  }
  initFormConvention() {

    this.formInfoGenarale = this.formBuilder.group({
      nomConvention: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [{ value: "", disabled: true }, Validators.required],
    });
    this.formReduction = this.formBuilder.group({
      idProduit: ['', Validators.required],
      reduction: [{ value: "", disabled: true }, Validators.required]

    });
    this.formFiltre = this.formBuilder.group({
      raisonSociale: ['', Validators.required],

    });
  }
  resetSearch() {
    console.log(this.personneMorales)
    this.getAllPersonneMorale()
  }
  addNewClient() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['gestion-personnes/create']));
    // open link in new tab
    window.open(url, '_blank');
  }
  submitFilter() {
    if (this.formFiltre.valid) {
      const recherche = this.formFiltre.get('raisonSociale').value.toLowerCase();

      const resultatsFiltres = this.personneMorales.filter((client: any) => 
        client?.raisonSocial?.toLowerCase().includes(recherche)
      );
      console.log('gggg resultatsFiltres personneMorales',resultatsFiltres,this.personneMorales ,)
     // let data = this.dataSourceClients.data.filter((client: any) => client.raisonSocial == this.formFiltre.get('raisonSociale').value)
      this.dataSourceClients.data = resultatsFiltres
    }
  }
  getAllProduits() {
    this.produitService.getAllProduits().subscribe({
      next: (data: any) => {
        this.typeProduits = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  changeDateFin(dateFin: any) {
    this.ReducTab = []
    this.dataSourcesReductions.data = []
    if (dateFin != null) {
      this.dateFinEntry = true
    }
    if (this.produitReady && dateFin != null) {
      this.formReduction.get("reduction").enable()

    }
  }
  changeTypeProduit(value: any) {

    if (this.dateFinEntry)
      this.formReduction.get("reduction").enable()
    this.idProduit = value
    this.refreshListReduction()
    this.produitReady = true
    
    // this.formConvention.get("reduction").setValidators([Validators.required])
    //call reduction list avec id famille produit 
  }
  navigateToReduction() {
    //   this.formConvention.get("dateDebut").setValue(moment(this.formConvention.get("dateDebut").value).format('YYYY-MM-DD'))
    console.log('blabla',this.codeConvention)
console.log("je suis le forminfogroup",this.formInfoGenarale)
    if (this.formInfoGenarale.get("dateDebut").value != "") {
      const url = this.router.serializeUrl(this.router.createUrlTree(['creation-convention/creation-reduction'], { queryParams: { dateDebut: this.formInfoGenarale.get("dateDebut").value, dateFin: this.formInfoGenarale.get("dateFin").value } }));
      // open link in new tab
      window.open(url, '_blank');
      this.erreurDateDebut = false
    } else {
      this.erreurDateDebut = true
    }

     
    }
  onChangeReduc(reduction: any) {

    if (this.formInfoGenarale.get("dateFin").value != null && this.formInfoGenarale.get("dateFin").value != '') {
      if (new Date(reduction.dateFin) < new Date(this.formInfoGenarale.get("dateFin").value)) {
        Swal.fire(
          `La réduction choisie ne couvre pas toute la période de la convention`,
          '',
          'error'
        )
      } else {
        if (this.ReducTab.find((reduc: any) => reduc.idReduction === reduction.idReduction) == undefined) {
          this.ReducTab.push(reduction)
          this.selectedReductions.push(reduction.idReduction)
        }

        else {
          this.ReducTab.splice(this.ReducTab.map((item: any) => item.idReduction).indexOf(reduction.idReduction), 1);
        }
        if (this.ReducTab.length != 0)
          this.reducEmpty = false
        else
          this.reducEmpty = true

        this.dataSourcesReductions = new MatTableDataSource(this.ReducTab)
      }


    }

  }
  gtest(event: any) {
    console.log(event)

  }
  deleteReduction(idReduction: number) {
    this.ReducTab.splice(this.ReducTab.map((item: any) => item.idReduction).indexOf(idReduction), 1);
    this.dataSourcesReductions = new MatTableDataSource(this.ReducTab)

  }
  refreshListReduction() {
    this.filterReduction.typeReduction = this.typeReduction
    this.filterReduction.produit = this.idProduit
    console.log('bonjourines',this.filterReduction)

    this.reductionService.reductionFiltre(this.filterReduction).subscribe({
      next: (data: any) => {


        this.reductions = data
        this.formReduction.get("reduction").setValue(this.selectedReductions)
console.log('heeeeeeyyyy',data)
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllPersonneMorale() {
    this.personneService.getAllPersonneMorale().subscribe({
      next: (data: any) => {
        this.personneMorales = data
        this.dataSourceClients = new MatTableDataSource(data)
        this.dataSourceClients.paginator = this.paginator

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  addClient(value: any, event: any) {
    console.log(value)

    this.bodyConvention.idClient = value.idClient
  }
  submitConvention(formDirective: any) {
    if (this.formReduction.valid && this.formInfoGenarale.valid && this.bodyConvention.idClient) {
      this.bodyConvention.reduction = this.ReducTab.map((objet: any) => objet.idReduction);
    
      this.bodyConvention.idProduit = this.formReduction.get("idProduit").value
      this.conventionService.addConventions(this.bodyConvention).subscribe({
        next: (data: any) => {
          // this.conventionSuccess = true
          // this.codeConvention = data.codeConvention
          // //  this.idConvention=data.idConvention
          // formDirective.resetForm();
          // this.formInfoGenarale.reset();
          // this.formReduction.reset();
          // this.ReducTab = []
          // this.selectedReductions = []
          // this.dataSourcesReductions = new MatTableDataSource(this.ReducTab)
          Swal.fire({
            title: "Convention" + data.codeConvention + "a été créer avec succés",
            icon: 'success',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: `Créer une nouvelle convention`,
            cancelButtonText: `Retour à la liste des conventions`,
            confirmButtonColor: "#00008F",
            width: 600
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();


            } else
              this.router.navigate(['gestion-convention']);

          })
        },
        error: (error) => {
          this.handleError(error)
          this.conventionSuccess = false
          console.log(error);
          // this.conventionService.addConventions().subscribe({
          //   next: (data: any) => {

        }
      });
    }
  }
  submitInfoGenerale(formDirective: any) {
    if (this.formInfoGenarale.valid) {
      this.bodyConvention.nomConvention = this.formInfoGenarale.get("nomConvention").value
      this.bodyConvention.dateDebut = moment(this.formInfoGenarale.get("dateDebut").value).format('YYYY-MM-DD[T]HH:mm:ss.000Z')
      this.bodyConvention.dateFin = moment(this.formInfoGenarale.get("dateFin").value).format('YYYY-MM-DD[T]HH:mm:ss.000Z')
    
      this.stepper.next()
    }
  }

  handleError(error: any) {

    switch (error.status) {
      case 500: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur systeme, veuillez contacter l'administrateur."
        break;
    }

  }
  setDateDebut(dateDebut: any) {
    this.formInfoGenarale.get("dateFin").enable()
    this.dateDebut = dateDebut
  }
}