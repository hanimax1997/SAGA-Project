import { Component, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ReseauDistribution } from 'src/app/core/models/reseau-distribution';
import { ReseauDistributionService } from 'src/app/core/services/reseau-distribution.service';
import {MatDialog} from '@angular/material/dialog';
import { CreationReseauDistributionDialogComponent } from './creation-reseau-distribution-dialog/creation-reseau-distribution-dialog.component';
import { EditReseauDistributionDialogComponent } from './edit-reseau-distribution-dialog/edit-reseau-distribution-dialog.component';
import { Router} from '@angular/router';

@Component({
  selector: 'app-gestion-reseau-distribution',
  templateUrl: './gestion-reseau-distribution.component.html',
  styleUrls: ['./gestion-reseau-distribution.component.scss']
})
export class GestionReseauDistributionComponent implements OnInit {

  displayedColumns: string[] = ['idReseau', 'description', 'dateDebut', 'dateFin', 'action'];
  dataSource: MatTableDataSource<ReseauDistribution>|any;
  lengthColumns = this.displayedColumns.length;

  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;

  constructor(private router: Router,private reseauDistributionService: ReseauDistributionService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllReseauDistribution()
  }

  //dialog ajout reseau distribution
  openCreateDialog() {
    const dialogRef = this.dialog.open(CreationReseauDistributionDialogComponent,{
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllReseauDistribution()
    });
  }

  //dialog modification reseau distribution
  openDialogEdit(idReseau: ReseauDistribution) {
    const dialogRef = this.dialog.open(EditReseauDistributionDialogComponent,{
      width: '60%',
      data: {
        idReseau: idReseau
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllReseauDistribution()
    });
  }

  //get reseaux distribution
  getAllReseauDistribution() {

    this.reseauDistributionService.getAllReseauDistribution().subscribe({
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
}
