import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { consultation_leasing } from './consultation-automobile-leasing';
import { Consultation } from '../consultation';

export interface AutomobileLeasing {
  police: string;
  assure: string;
  date_debut: Date;
  date_fin: Date;
  mise_a_jour: Date;
  statut: string;
  action: string;
}

const ELEMENT_DATA: AutomobileLeasing[] = [
  {police: '0PCSA1000449', assure: 'Yanis ait ameur meziane', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'Refusé', action: 'more_vert'},
  {police: '0PCSA1000450', assure: 'Menad Mohammed lekhder', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'Succés', action: 'more_vert'},
  {police: '0PCSA1000450', assure: 'Idir BADSI', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'En attente BO', action: 'more_vert'},
  {police: '0PCSA1000450', assure: 'Naila Belkis  DIF', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'Refusé', action: 'more_vert'},
  {police: '0PCSA1000450', assure: 'Djamel Eddine Derrar', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'Succés', action: 'more_vert'},
  {police: '0PCSA1000450', assure: 'Djamel Eddine Derrar', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'Succés', action: 'more_vert'},
  {police: '0PCSA1000450', assure: 'Djamel Eddine Derrar', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'Succés', action: 'more_vert'},
  {police: '0PCSA1000450', assure: 'Djamel Eddine Derrar', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'Succés', action: 'more_vert'},
  {police: '0PCSA1000450', assure: 'Djamel Eddine Derrar', date_debut: new Date('10/11/2021'), date_fin: new Date('10/11/2021'), mise_a_jour: new Date('10/11/2021'), statut: 'Succés', action: 'more_vert'},
];

@Component({
  selector: 'app-consultation',
  templateUrl: '../consultation.component.html',
  styleUrls: ['../consultation.component.scss']
})
export class ConsultationAutomobileLeasingComponent implements AfterViewInit  {

  displayedColumns: string[] = ['police', 'assure', 'date_debut', 'date_fin', 'mise_a_jour', 'statut', 'action'];
  dataSource: MatTableDataSource<AutomobileLeasing>;
  title: string = "Automobile leasing";
  consultations: Consultation[] = consultation_leasing;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
