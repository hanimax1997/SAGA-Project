import { Component, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Formules } from '../../../core/models/formules';
import { FormulesService } from '../../../core/services/formules.service';
import {MatDialog} from '@angular/material/dialog';
import { CreationFormuleDialogComponent } from './creation-formule-dialog/creation-formule-dialog.component';
import { EditFormuleDialogComponent } from './edit-formule-dialog/edit-formule-dialog.component';

@Component({
  selector: 'app-gestion-formule',
  templateUrl: 'gestion-formule.component.html',
  styleUrls: ['gestion-formule.component.scss']
})
export class GestionFormuleComponent implements OnInit {

  displayedColumns: string[] = ['id_formule', 'description', 'date_debut', 'date_fin', 'action'];
  dataSource: MatTableDataSource<Formules>|any;
  lengthColumns = this.displayedColumns.length;

  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;

  constructor(private formuleService: FormulesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllFormule()
  }
  getAllFormule(){
    this.formuleService.getAllFormules().subscribe(formuleList => {
      this.dataSource = new MatTableDataSource(formuleList)
      this.paginate();
    })
  }
  openCreateDialog() {
    const dialogRef = this.dialog.open(CreationFormuleDialogComponent,{
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllFormule();
    });
  }

  openDialogEdit(idFormule: any) {
    const dialogRef = this.dialog.open(EditFormuleDialogComponent,{
      width: '60%',
      data: {
        idFormule: idFormule
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.getAllFormule();
    });
  }

  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
