import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ReductionService } from 'src/app/core/services/reduction.service';
import { DesactivationReductionDialogComponent } from './desactivation-reduction-dialog/desactivation-reduction-dialog.component';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ProduitService } from 'src/app/core/services/produit.service';
@Component({
  selector: 'app-gestion-reduction',
  templateUrl: './gestion-reduction.component.html',
  styleUrls: ['./gestion-reduction.component.scss']
})
export class GestionReductionComponent implements OnInit {

  displayedColumns: string[] = ['codeReduction', 'nomReduction', 'idProduit', 'typeReduction', 'dateFin', 'action'];


  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource = new MatTableDataSource()
  formFilter: FormGroup | any;
  typeProduits: any[] = []
  todayDate = new Date()
  constructor(private produitService: ProduitService, private formBuilder: FormBuilder, private router: Router, private reductionService: ReductionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initFormFilter()
    this.getAllReduction()
    this.getAllProduits()
  }
  initFormFilter() {
    this.formFilter = this.formBuilder.group({
      codeReduction: [null],
      idReduction: [0],
      nomReduction: [null],
      typeReduction: [0],
      produit: [0],
      dateFin: [null],


    });


  }
  getAllReduction() {


    this.reductionService.getAllReduction().subscribe(data => {
      data.map((reduc:any)=>{
        reduc.dateFin=new Date(reduc.dateFin)
 
        // if (reduc.idReduction == 29) {
        
        //   reduc.dateFin=new Date(reduc.dateFin)
      
         
        // }
      })
      this.dataSource = new MatTableDataSource(data)
      this.paginate();
    })
  }
  submitFilter() {
    this.reductionService.reductionFiltre(this.formFilter.value).subscribe({
      next: (data: any) => {


        this.dataSource = new MatTableDataSource(data)
        this.paginate();

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  resetTable(formDirective: any) {
    this.getAllReduction()
    formDirective.resetForm();
    this.formFilter.reset();
    this.initFormFilter()
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
  desactiveReduction(idReduction: any) {
    let dialogRef = this.dialog.open(DesactivationReductionDialogComponent, {
      width: '40%',
      data: {
        idGarantie: idReduction
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {

      if (result.data != undefined) {
        let reduction = {
          "idReduction": idReduction,
          "date": result.data,
        }
        this.reductionService.desactiverReduction(reduction, idReduction).subscribe(data => {
          this.getAllReduction()
          this.paginate();
        })
      }

    });
  }

  navigateToCreation() {
    this.router.navigate(['gestion-reduction/creation-reduction']);
  }
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  consultReduction(idReduction:any){
    this.router.navigate(['gestion-reduction/consultation-reduction/' + idReduction ]);

  }
  modiftReduction(idReduction:any){
    this.router.navigate(['gestion-reduction/modification-reduction/' + idReduction ]);

  }
}