
import { Component, OnInit, ViewChild } from '@angular/core';
import { FamilleProduitService } from '../../../core/services/famille-produit.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreationFamilleProduitDialogComponent } from './creation-famille-produit-dialog/creation-famille-produit-dialog.component';
import { EditFamilleProduitDialogComponent } from './edit-famille-produit-dialog/edit-famille-produit-dialog.component';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-gestion-famille-produit',
  templateUrl: './gestion-famille-produit.component.html',
  styleUrls: ['./gestion-famille-produit.component.scss']
})

export class GestionFamilleProduitComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  }

  constructor(private familleProduitService: FamilleProduitService, private dialog: MatDialog) { }

  displayedColumns: string[] = ['id_famille', 'description', 'codificationNationale', 'codificationMetier',  'date_Debut', 'date_Fin', 'action'];
  dataSource = new MatTableDataSource()

  ngOnInit(): void {
    this.getAllFamilleProduit()

  }
  openCreateDialog() {

    let dialogRef = this.dialog.open(CreationFamilleProduitDialogComponent, {
      width: '60%'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllFamilleProduit();
    });
  }
  openDialogEdit(idFamilleProduit:any) {
    let dialogRef = this.dialog.open(EditFamilleProduitDialogComponent, {
      width: '60%',
      data: {
        idFamilleProduit: idFamilleProduit
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllFamilleProduit();
    });
  }
  getAllFamilleProduit() {

    this.familleProduitService.getFamilleProduitsList().subscribe({
      next: (datas: any) => {
  
        this.dataSource = new MatTableDataSource(datas);
        this.paginate()

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