import { Component, OnInit, ViewChild } from '@angular/core';
import { dateFormatPipe } from '../../../shared/pipes/dateFormatPipe'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreationTaxeDialogComponent } from './creation-taxe-dialog/creation-taxe-dialog.component';
import { EditTaxeDialogComponent } from './edit-taxe-dialog/edit-taxe-dialog.component';
//services
import { TaxeService } from '../../../core/services/taxe.service'

@Component({
  selector: 'app-gestion-taxes',
  templateUrl: './gestion-taxes.component.html',
  styleUrls: ['./gestion-taxes.component.scss']
})


export class GestionTaxesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  }
  displayedColumns: string[] = ['idtaxe','idNational', 'description', 'ValeurType', 'valeur','valeurMax','valeurMin', 'dateDebut', 'dateFin', 'action'];
  lengthColumns = this.displayedColumns.length;
  dataSource = new MatTableDataSource()
  constructor(private dialog: MatDialog, private taxeService: TaxeService) { }


  ngOnInit(): void {

    this.getAllTaxes();
    if (this.dataSource.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  openCreateDialog() {
    let dialogRef = this.dialog.open(CreationTaxeDialogComponent, {
      width: '60%',

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllTaxes();
    });
  }
  openEditDialog(idTaxe: any) {
    let dialogRef = this.dialog.open(EditTaxeDialogComponent, {
      disableClose: true,
      width: '60%',
      data: {
        idTaxe: idTaxe
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllTaxes();
    });


  }
  getAllTaxes() {

    this.taxeService.getTaxesList().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data);


      },
      error: (error) => {

        console.log(error);

      }
    });
  }

}
