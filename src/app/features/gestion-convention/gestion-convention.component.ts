import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConventionService } from 'src/app/core/services/convention.service';
import { DesactivationConventionDialogComponent } from './desactivation-convention-dialog/desactivation-convention-dialog.component';
import { EditConventionDialogComponent } from './edit-convention-dialog/edit-convention-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PersonneService } from 'src/app/core/services/personne.service';
import * as moment from 'moment';
@Component({
  selector: 'app-gestion-convention',
  templateUrl: './gestion-convention.component.html',
  styleUrls: ['./gestion-convention.component.scss']
})
export class GestionConventionComponent implements OnInit {
  displayedColumns: string[] = ['codeConvention', 'nomConvention', 'idClient', 'dateFin', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource = new MatTableDataSource()
  formFilter: FormGroup | any;
  clients: any = []
  constructor(private personneService:PersonneService,private formBuilder: FormBuilder, private router: Router, private conventionService: ConventionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllConventions()
    this.initFormFilter()
    this.getClients()
  }
  getAllConventions() {


    this.conventionService.getAllConventions().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.paginate();
    })
  }
  initFormFilter() {
    this.formFilter = this.formBuilder.group({
      codeConvention: [null],
      nomConvention: [null],
      codeClient: [null],
      dateFin: [null],


    });
  }
  getClients() {

      this.personneService.getAllPersonneMorale().subscribe({
        next: (data: any) => {
          this.clients = data
        },
        error: (error) => {
  
          console.log(error);
  
        }
      });

  }
  desactiveConvention(idConvention: any) {
    let dialogRef = this.dialog.open(DesactivationConventionDialogComponent, {
      width: '40%',
      data: {
        idConvention: idConvention
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
console.log('result',result.data.value['dateFin'])
      if (result.data.value != undefined) {
        
        let convention = {
          "date": result.data.value['dateFin'],
        }
        this.conventionService.desactiverConvention(idConvention,convention).subscribe(data => {
          this.getAllConventions()
          this.paginate();
        })
      }

    });
  }
  editConvention(idConvention:any){
    console.log("11111111111111111111111111111111111111111111")
    let dialogRef = this.dialog.open(EditConventionDialogComponent, {
      width: '40%',
      data: {
        idConvention: idConvention
      }

    });
    dialogRef.afterClosed().subscribe((result: any) => {
console.log('result22222222222222222222',result)
      if (result.data.value != undefined) {
        let convention = result.data.value
convention.dateDebut = moment(result.data.controls['dateDebut'].value).format('YYYY-MM-DD');
// convention.dateDebut = moment(result.data.controls.get('dateDebut').value).format('YYYY-MM-DD');

     
        this.conventionService.modifConvention(convention,idConvention).subscribe(data => {
          this.getAllConventions()
          this.paginate();
        })
      }

    });
  }
  submitFilter() {
    this.conventionService.filterConvention(this.formFilter.value).subscribe({
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
    this.getAllConventions()
    formDirective.resetForm();
    this.formFilter.reset();
    this.initFormFilter()
  }
  navigateToCreation() {
    this.router.navigate(['gestion-convention/creation-convention']);
  }
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  consultConvention(idConvention:any){
    this.router.navigate(['gestion-convention/consultation-convention/' + idConvention ]);

  }

}

