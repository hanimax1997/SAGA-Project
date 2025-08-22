import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-search-vehicule',
  templateUrl: './search-vehicule.component.html',
  styleUrls: ['./search-vehicule.component.scss']
})
export class SearchVehiculeComponent implements OnInit {

  displayedColumns: string[] = ['idVehicule', 'marque', 'modele', 'puissance', 'energie'];
  dataSource: MatTableDataSource<Object> | any;
  lengthColumns = this.displayedColumns.length;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(public dialogRef: MatDialogRef<SearchVehiculeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data?.vehiculeList)
    this.paginate();
  }

  selectVehicule(vehicule: any) {
    this.dialogRef.close(vehicule);
  }

  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
