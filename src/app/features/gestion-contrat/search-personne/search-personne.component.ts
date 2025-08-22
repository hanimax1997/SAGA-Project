import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PersonneService } from 'src/app/core/services/personne.service';

@Component({
  selector: 'app-search-personne',
  templateUrl: './search-personne.component.html',
  styleUrls: ['./search-personne.component.scss']
})
export class SearchPersonneComponent implements OnInit {

  displayedColumnsPhysique: string[] = ['idClient', 'nom', 'dateNaissance'];
  displayedColumnsMorale: string[] = ['idClient', 'raisonSocial', 'dateOuverture'];
  dataSource: MatTableDataSource<Object> | any;
  lengthColumnsPhysique = this.displayedColumnsPhysique.length;
  lengthColumnsMorale = this.displayedColumnsMorale.length;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private personneService: PersonneService, public dialogRef: MatDialogRef<SearchPersonneComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data?.personneList)
    this.paginate();
  }

  selectPersonne(personne: any) {
    this.personneService.getPersonneById(personne).subscribe({
      next: (data: any) => {
        this.dialogRef.close(data);
      },
      error: (error) => {console.log(error);}
    });
  }

  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
