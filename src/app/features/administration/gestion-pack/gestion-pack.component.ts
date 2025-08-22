

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PackService } from '../../../core/services/pack.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';




@Component({
  selector: 'app-gestion-pack',
  templateUrl: './gestion-pack.component.html',
  styleUrls: ['./gestion-pack.component.scss'],
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
export class GestionPackComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSourceAllPack.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Nombre d'éléments par page";
  }
  displayedPackColumns: string[] = ['description', 'dateDebut', 'dateFin', 'action'];
  lengthColumns = this.displayedPackColumns.length;
  formFilter: FormGroup | any;
  dataSourceAllPack = new MatTableDataSource()
  packEmptyVar = false
  constructor(private formBuilderAuth: FormBuilder, private router: Router, private packService: PackService) { }


  ngOnInit(): void {
    this.formFilter = this.formBuilderAuth.group({
      codePack: [''],
      description: ['',],
    });
    this.initPackTab()


  }
  navigateToCreatePack() {
    this.router.navigate(['gestion-referentiels/gestion-pack/creation-pack']);
  }
  initPackTab() {
    this.packService.getAllPack().subscribe({
      next: (datas: any) => {
        if (datas.length == 0)
          this.packEmptyVar = true
        this.dataSourceAllPack = new MatTableDataSource(datas)
        this.dataSourceAllPack.paginator = this.paginator;


      },
      error: (error) => {

        console.log(error);

      }
    });

  }
  seeParam(idPack: any) {
    let url: string = "gestion-referentiels/gestion-pack/" + idPack + "/parametres"

    this.router.navigateByUrl(url);
  }
  seeGarantie(codePack: any) {
    let url: string = "gestion-referentiels/gestion-pack/" + codePack + "/garanties"

    this.router.navigateByUrl(url);
  }
  editPack(codePack: any) {
    let url: string = "gestion-referentiels/gestion-pack/modification-pack/" + codePack

    this.router.navigateByUrl(url);
  }
}

