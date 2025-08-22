import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
import { ParamRisque } from 'src/app/core/models/param-risque';
import { MatDialog } from '@angular/material/dialog';
import { CreationParamRisqueDialogComponent } from './creation-param-risque-dialog/creation-param-risque-dialog.component';
import { EditParamRisqueDialogComponent } from './edit-param-risque-dialog/edit-param-risque-dialog.component';

@Component({
  selector: 'app-gestion-param-risque',
  templateUrl: './gestion-param-risque.component.html',
  styleUrls: ['./gestion-param-risque.component.scss']
})
export class GestionParamRisqueComponent implements OnInit {

  displayedColumns: string[] = ['id', 'libelle', 'description', 'orderChamp', 'categorie','sizeChamp', 'typeChamp', 'action'];
  dataSource: MatTableDataSource<ParamRisque>;
  @Input() typeRisque: any | undefined
  @Output() newItemEvent = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private paramRisqueService: ParamRisqueService, public dialog: MatDialog) {

  }

  step() {
    this.newItemEvent.emit();
  }

  ngOnInit(): void {
    this.getAllDuree()
  }

  //get Durée
  getAllDuree() {
    this.paramRisqueService.getParamRisqueByTypeRisque(this.typeRisque.idTypeRisque).subscribe((detailRisqueList: ParamRisque[]) => {
      

      this.dataSource = new MatTableDataSource(detailRisqueList);

      this.paginate();
    })
  }

  //dialog de creation param risque
  openDialogAdd() {
    const dialogRef = this.dialog.open(CreationParamRisqueDialogComponent, {
      width: '60%',
      data: {
        typeRisque: this.typeRisque
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllDuree();
    });
  }

  //dialog de modification param risque
  openDialogEdit(idDetailRisque: any) {
    const dialogRef = this.dialog.open(EditParamRisqueDialogComponent, {
      width: '60%',
      data: {
        idDetailRisque: idDetailRisque,
        idTypeRisque:  this.typeRisque.idTypeRisque
       
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.getAllDuree();
    });
  }

  //Ajouter pagination
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}