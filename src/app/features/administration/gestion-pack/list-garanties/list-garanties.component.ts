import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PackService } from "../../../../core/services/pack.service"
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-list-garanties',
  templateUrl: './list-garanties.component.html',
  styleUrls: ['./list-garanties.component.scss'],
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
export class ListGarantiesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSourceGaranties.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  }

  dataSourceGaranties = new MatTableDataSource()
  displayedColumnsGarantie: string[] = ['idGarantie', 'description', 'obligatoire', 'action'];
  idPack: any
  lengthColumns: Number
  formFilter: FormGroup|any;

  constructor(private formBuilderAuth: FormBuilder,private router: Router, private route: ActivatedRoute, private packService: PackService) { }

  ngOnInit() {
    this.initFilter()
    this.idPack = this.route.snapshot.paramMap.get('idPack')
    this.initGaranties(this.idPack)
    this.lengthColumns = this.displayedColumnsGarantie.length;


  }
  initFilter(){
    this.formFilter = this.formBuilderAuth.group({
      description: ['',],
    });
  }
  initGaranties(id: any) {
    this.packService.getGarantiePack(id).subscribe({
      next: (datas: any) => {
  
        this.dataSourceGaranties = new MatTableDataSource(datas)
      this.dataSourceGaranties.paginator = this.paginator;
   
 

      },
      error: (error) => {

        console.log(error);

      }
    });

  }
  seeParam(idGarantie: any) {
    let url: string = "gestion-referentiels/gestion-pack/" + this.idPack + "/garanties/" + idGarantie + "/parametres"

    this.router.navigateByUrl(url);
  }
  seeSousGarantie(idGarantie: any) {
    let url: string = "gestion-referentiels/gestion-pack/" + this.idPack + "/garanties/"+idGarantie+"/sous-garanties"

    this.router.navigateByUrl(url);
  }
    back(): void {
      this.router.navigateByUrl("gestion-referentiels/gestion-pack");
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGaranties.filter = filterValue.trim().toLowerCase();
  }
}

