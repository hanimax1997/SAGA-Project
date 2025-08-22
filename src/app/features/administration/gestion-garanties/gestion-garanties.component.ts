import { Component, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Garanties } from '../../../core/models/garanties';
import { GarantiesService } from '../../../core/services/garanties.service';
import {MatDialog} from '@angular/material/dialog';
import { CreationGarantieDialogComponent } from './creation-garantie-dialog/creation-garantie-dialog.component';
import { EditGarantieDialogComponent } from './edit-garantie-dialog/edit-garantie-dialog.component';
import { Router} from '@angular/router';

@Component({
  selector: 'app-garanties',
  templateUrl: './gestion-garanties.component.html',
  styleUrls: ['./gestion-garanties.component.scss']
})
export class GestionGarantiesComponent implements OnInit{

  displayedColumns: string[] = ['idGarantie', 'idNationnal', 'description', 'valeurEnvloppe', 'dateDebut', 'dateFin', 'categorieGarantie', 'withTaxe', 'action'];
  dataSource: MatTableDataSource<Garanties>|any;
  garantie: any;
  step: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;

  constructor(private router: Router,private garantiesService: GarantiesService, public dialog: MatDialog) {}


  ngOnInit(): void {
    this.getAllGaranties()
  }

  openDialogAdd() {
    const dialogRef = this.dialog.open(CreationGarantieDialogComponent,{
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllGaranties()
    });
  }

  openDialogEdit(idGarantie: Garanties) {
    const dialogRef = this.dialog.open(EditGarantieDialogComponent,{
      width: '60%',
      data: {
        idGarantie: idGarantie,
      }
    });
    // dialogRef.componentInstance.garantie = garantie;

    dialogRef.afterClosed().subscribe(result => {
      this.getAllGaranties()
    });
  }
  getAllGaranties() {

    this.garantiesService.getAllGaranties().subscribe({
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
  viewSousGarantie(idGarantie:any){
    let url: string = "gestion-produits/gestion-garanties/" + idGarantie +"/gestion-sous-garanties"
    
    this.router.navigateByUrl(url);
  }
}