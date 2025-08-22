import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat.service';
@Component({
  selector: 'app-product-commercial-line',
  templateUrl: './product-commercial-line.component.html',
  styleUrls: ['./product-commercial-line.component.scss']
})
export class ProductCommercialLineComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private contratService: ContratService) { }

  displayedColumns = ['idContrat', 'produit', 'sousProduit', 'mouvemant',  'dateDebut', 'dateFin', 'action']
  dataSource = new MatTableDataSource()
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | any;
  personneTable: any;

  ngOnInit(): void {
    this.getContrats(0, 10)
  }
  onPageChange(value: any) {
    this.getContrats(value.pageIndex, value.pageSize)
  }
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getContrats(index: any, size: any) {
        this.contratService.getAllContratsCommercialLine(index,size).subscribe({
      next: (data: any) => {
        this.personneTable = data
        this.dataSource = new MatTableDataSource(data.content)
        if(this.paginator)
          this.paginator.length = data.totalElements;
          this.paginate();
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  redirectToCreation() {
    this.router.navigate(['gestion-commercial-line/creation-commercial-line']);

  }
  consultContrat(idContrat:any) {
    this.router.navigate(['gestion-commercial-line/' + idContrat]);

  }
  addSite(idContrat:any){
    this.router.navigate(['gestion-commercial-line/create-site-police/' + idContrat]);
  }
}
