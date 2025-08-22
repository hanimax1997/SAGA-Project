
import { Component, OnInit,ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {CreationTypeRisqueComponent} from './creation-type-risque/creation-type-risque.component';
import {EditTypeRisqueDialogComponent} from './edit-type-risque-dialog/edit-type-risque-dialog.component';
import {TypeRisqueService} from '../../../core/services/type-risque.service'


@Component({
  selector: 'app-gestion-type-risque',
  templateUrl: './gestion-type-risque.component.html',
  styleUrls: ['./gestion-type-risque.component.scss']
})

export class GestionTypeRisqueComponent implements OnInit {
  @ViewChild(MatPaginator, {static : false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  }

  constructor(private typeRisqueService:TypeRisqueService,private dialog: MatDialog) { }

  displayedColumns: string[] = ['idTypeRisque', 'description', 'Codification_nationale', 'Codification_metier', 'date_Debut', 'date_Fin','action'];
  dataSource = new MatTableDataSource()
  step = true;
  typeRisque: any;

  ngOnInit(): void {
    this.getAllTypeRisque();
    if (this.dataSource.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  stepChange():void {
    this.step = true
  }
  openCreateDialog() {
    let dialogRef = this.dialog.open(CreationTypeRisqueComponent, {
      width: '60%'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllTypeRisque();
    });
  }
  openEditDialog(idTypeRisque: any) {
    let dialogRef = this.dialog.open(EditTypeRisqueDialogComponent, {
      disableClose: true,
      width: '60%',
      data: {
        idTypeRisque: idTypeRisque
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllTypeRisque();
    });


  }

  getAllTypeRisque() {

    this.typeRisqueService.getTypeRisqueList().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.paginate();


      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  viewParamRisque(typeRisque : any) {

    console.log("typeRisque")
    console.log(this.typeRisque)
    this.step = false
    this.typeRisque = typeRisque;
  }

}