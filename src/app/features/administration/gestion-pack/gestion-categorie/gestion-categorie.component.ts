import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PackService } from "../../../../core/services/pack.service"
import { GarantiesService } from "../../../../core/services/garanties.service"
import { SousGarantiesService } from "../../../../core/services/sous-garanties.service"
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-gestion-categorie',
  templateUrl: './gestion-categorie.component.html',
  styleUrls: ['./gestion-categorie.component.scss'],
  animations: [

    trigger('enterAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)',
        }),
        animate(400),
      ]),
    ]),
  ]
})
export class GestionCategorieComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSourceCategory.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  }

  dataSourceCategory = new MatTableDataSource()
  displayedColumns: string[] = ['id', 'souscategories', 'categorieValeur', 'typeValeur', 'valeur'];
  idGarantie: any
  idPack: any
  idSousGarantie: any
  lengthColumns: Number
  titleCell: string
  titleCellId: any
  formFilter: FormGroup | any;
  constructor(private formBuilderAuth: FormBuilder, private sousGarantiesService: SousGarantiesService, private garantiesService: GarantiesService, private router: Router, private route: ActivatedRoute, private packService: PackService) { }

  ngOnInit() {
    this.initFilter();
    this.idPack = this.route.snapshot.paramMap.get('idPack')
    this.idGarantie = this.route.snapshot.paramMap.get('idGarantie')
    this.idSousGarantie = this.route.snapshot.paramMap.get('idSousGarantie')
    if (this.idGarantie == null) {
      this.initPackCategory(this.idPack)
      this.titleCellId = this.idPack
      this.titleCell = "code pack"
    }
    else {
      if (this.idSousGarantie == null) {
        this.initGarantiesCategory(this.idGarantie)
        this.titleCellId = this.idGarantie
        this.titleCell = "Garantie"
      }
      else {
        this.initSousGarantiesCategory(this.idSousGarantie)
        this.titleCellId = this.idSousGarantie
        this.titleCell = "Sous Garantie"
      }

    }


    this.lengthColumns = this.displayedColumns.length;


  }
  initFilter() {
    this.formFilter = this.formBuilderAuth.group({
      CategorieValeur: ['',],
    });
  }
  initPackCategory(id: any) {
    this.packService.getPackAndCategories(this.idPack).subscribe({
      next: (datas: any) => {

       this.dataSourceCategory = new MatTableDataSource(datas.categorieList)
       this.dataSourceCategory.paginator = this.paginator;

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  initGarantiesCategory(id: any) {
    this.packService.getGarantiePackCategories(this.idPack,this.idGarantie).subscribe({
      next: (datas: any) => {

       this.dataSourceCategory = new MatTableDataSource(datas.categorieList)
       this.dataSourceCategory.paginator = this.paginator;


      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  initSousGarantiesCategory(id: any) {
    this.packService.getSousGarantiePackCategories(this.idPack,this.idGarantie,this.idSousGarantie).subscribe({
      next: (datas: any) => {

       this.dataSourceCategory = new MatTableDataSource(datas.categorieList)
       this.dataSourceCategory.paginator = this.paginator;

      },
      error: (error) => {

        console.log(error);

      }
    });

  }
  back(): void {

    if (this.idGarantie == null)
      this.router.navigateByUrl("gestion-referentiels/gestion-pack");
    else {
      if (this.idSousGarantie == null)
        this.router.navigateByUrl("gestion-referentiels/gestion-pack/" + this.idPack + "/garanties");
      else
        this.router.navigateByUrl("gestion-referentiels/gestion-pack/" + this.idPack + "/garanties/" + this.idGarantie + "/sous-garanties");

    }

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCategory.filter = filterValue.trim().toLowerCase();
  }
}
