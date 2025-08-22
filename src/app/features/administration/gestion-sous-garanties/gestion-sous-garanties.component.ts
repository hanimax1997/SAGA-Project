import { Component, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { SousGaranties } from '../../../core/models/sous-garanties';
import { SousGarantiesService } from '../../../core/services/sous-garanties.service';

import { GarantiesService } from 'src/app/core/services/garanties.service';

import {MatDialog} from '@angular/material/dialog';
import { CreationSousGarantiesDialogComponent } from './creation-sous-garanties-dialog/creation-sous-garanties-dialog.component';
import { EditSousGarantiesDialogComponent } from './edit-sous-garanties-dialog/edit-sous-garanties-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sous-garanties',
  templateUrl: './gestion-sous-garanties.component.html',
  styleUrls: ['./gestion-sous-garanties.component.scss']
})
export class GestionSousGarantiesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'description', 'valeurEnvloppe', 'dateDebut', 'dateFin', 'idNational', 'action'];
  dataSource: MatTableDataSource<SousGaranties>|any;
  idGarantie:any
  @Input() Garantie: any;
  @Output() newItemEvent = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;

  constructor(private route: ActivatedRoute,private sousgarantiesService: SousGarantiesService, private garantiesService: GarantiesService, public dialog: MatDialog) {
  }

  step() {
    this.newItemEvent.emit();
  }

  ngOnInit(): void {
    this.idGarantie = this.route.snapshot.paramMap.get('id')
    this.dataSource = new MatTableDataSource();
    
    this.sousgarantiesService.getSousGarantiesByGarantie(this.idGarantie).subscribe(sousgarantyList => {

      this.dataSource = new MatTableDataSource(sousgarantyList)
      this.paginate();
    })
  }

  openDialogAdd() {
    const dialogRef = this.dialog.open(CreationSousGarantiesDialogComponent,{
      width: '60%',
      data: {
        idGarantie: this.idGarantie
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openDialogEdit(idSousGarantie: any) {
    const dialogRef = this.dialog.open(EditSousGarantiesDialogComponent,{
      width: '60%',
      data: {
        idSousGarantie: idSousGarantie
      }
    });
 

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}