
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PackService } from "../../../../core/services/pack.service"
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-list-sous-garanties',
  templateUrl: './list-sous-garanties.component.html',
  styleUrls: ['./list-sous-garanties.component.scss'],
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
export class ListSousGarantiesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSourceSousGaranties.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  }

  dataSourceSousGaranties = new MatTableDataSource()
  displayedColumnsSousGarantie: string[] = ['idSousgarantie', 'description', 'obligatoire', 'action'];
  idPack: any
  idGarantie: any
  lengthColumns: Number
  formFilter: FormGroup | any;
  constructor(private formBuilderAuth: FormBuilder, private router: Router, private route: ActivatedRoute, private packService: PackService) { }

  ngOnInit() {
    this.initFilter()
    this.idPack = this.route.snapshot.paramMap.get('idPack')
    this.idGarantie = this.route.snapshot.paramMap.get('idGarantie')
    this.initSousGaranties()
    this.lengthColumns = this.displayedColumnsSousGarantie.length;


  }
  initFilter() {
    this.formFilter = this.formBuilderAuth.group({
      description: ['',],
    });
  }
  initSousGaranties() {
    this.packService.getSousGarantiePack(this.idPack, this.idGarantie).subscribe({
      next: (datas: any) => {

        this.dataSourceSousGaranties = new MatTableDataSource(datas)
        this.dataSourceSousGaranties.paginator = this.paginator;


      },
      error: (error) => {

        console.log(error);

      }
    });



  }
  seeParam(idSousGarantie: any) {
    let url: string = "gestion-referentiels/gestion-pack/" + this.idPack + "/garanties/" + this.idGarantie + "/sous-garanties/" + idSousGarantie + "/parametres"

    this.router.navigateByUrl(url);
  }

  back(): void {
    this.router.navigateByUrl("gestion-referentiels/gestion-pack/" + this.idPack + "/garanties");
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSousGaranties.filter = filterValue.trim().toLowerCase();
  }
}

