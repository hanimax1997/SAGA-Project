import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { Router} from '@angular/router';
import { Produit } from 'src/app/core/models/produit';
import { ProduitService } from 'src/app/core/services/produit.service';
import { FamilleProduitService } from 'src/app/core/services/famille-produit.service';

@Component({
  selector: 'app-gestion-produit-risque',
  templateUrl: './gestion-produit-risque.component.html',
  styleUrls: ['./gestion-produit-risque.component.scss']
})
export class GestionProduitRisqueComponent implements OnInit {

  displayedColumns: string[] = ['idProduit', 'description', 'dateDebut', 'dateFin', 'action'];
  dataSource: MatTableDataSource<Produit>|any;
  lengthColumns = this.displayedColumns.length;

  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;


  constructor(
    private router: Router,
    private produitService: ProduitService,
    public dialog: MatDialog,
    private familleProduitService : FamilleProduitService
  ) { }

  ngOnInit(): void {
    this.getAllProduits();

  }

  editProduit(idProduit : any) {
    this.router.navigateByUrl("gestion-produits/gestion-produit-risque/"+idProduit+"/edit");
  }
  
  /*openDialogEdit(idCodeProduit: Produit) {
    const dialogRef = this.dialog.open(EditProduitDialogComponent,{
      width: '60%',
      data: {
        idCodeProduit: idCodeProduit
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllProduits()
    });
  }*/
  viewProduit(idProduit : any) {
    this.router.navigateByUrl("gestion-produits/gestion-produit-risque/"+idProduit+"/edit");
  }

  getAllProduits() {
    this.produitService.getAllProduits().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.paginate();
        console.table(data);
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

  openCreateDialog() {
    this.router.navigateByUrl("gestion-produits/gestion-produit-risque/create");
  }

}
