import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DureeService } from '../../../core/services/duree.service';
import { Duree } from '../../../core/models/duree';
import { MatDialog } from '@angular/material/dialog';
import { CreationDureeDialogComponent } from './creation-duree-dialog/creation-duree-dialog.component';
import { EditDureeDialogComponent } from './edit-duree-dialog/edit-duree-dialog.component';

@Component({
  selector: 'app-gestion-duree',
  templateUrl: 'gestion-duree.component.html',
  styleUrls: ['gestion-duree.component.scss'
  ]
})
export class GestionDureeComponent implements OnInit {
  displayedColumns: string[] = ['id_duree', 'type_duree', 'duree', 'description', 'action'];
  dataSource: MatTableDataSource<Duree> | any;
  lengthColumns = this.displayedColumns.length;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private dureeService: DureeService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllDuree()
  }
  getAllDuree() {
    this.dureeService.getAllDuree().subscribe(dureeList => {
      this.dataSource = new MatTableDataSource(dureeList)
      this.paginate();
    })
  }
  openCreateDialog() {
    const dialogRef = this.dialog.open(CreationDureeDialogComponent, {
      width: '60%',

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllDuree();
    });
  }

  openDialogEdit(idDuree: any) {
    const dialogRef = this.dialog.open(EditDureeDialogComponent, {
      width: '60%',
      data: {
        idDuree: idDuree
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.getAllDuree();
    });
  }

  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
