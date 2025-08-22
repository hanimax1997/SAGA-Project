import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';

import { FormGroup, FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';

//service

import { AgencesService } from '../../../core/services/agences.service';

import { GenericService } from '../../../core/services/generic.service';

import { MatDialog } from '@angular/material/dialog';

import { DeleteAgenceDialogComponent } from './delete-agence-dialog/delete-agence-dialog.component';
import { UploadAgencesComponent } from './upload-agence/upload-agences/upload-agences.component';

@Component({
  selector: 'app-gestion-agences',

  templateUrl: './gestion-agences.component.html',

  styleUrls: ['./gestion-agences.component.scss'],
})
export class GestionAgencesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  constructor(
    private dialog: MatDialog,
    private genericService: GenericService,
    private agencesService: AgencesService,
    private router: Router,
    private formBuilderAuth: FormBuilder
  ) {}

  displayedAgenceColumns: string[] = [
    'codeAgence',
    'nomAgence',
    'typeReseau',
    'zone',
    'status',
    'action',
  ];

  formFilter: FormGroup | any;

  dataSourceAllAgences = new MatTableDataSource();

  zones: any = [];

  reseauDist: any = [];

  ngOnInit(): void {
    this.initFilters();

    this.getAllAgence();

    // get ZONES

    this.getAllZones();

    this.getAllReseau();
  }

  initFilters() {
    this.formFilter = this.formBuilderAuth.group({
      codeAgence: [null],

      reseauDistribution: [0],

      zone: [0],

      statut: [null],
    });
  }

  // get all agence

  getAllAgence() {
    this.agencesService.getAllAgenceDetails().subscribe({
      next: (data: any) => {
        this.dataSourceAllAgences = new MatTableDataSource(data);
        this.dataSourceAllAgences.paginator = this.paginator;
      },

      error: (error) => {
        console.log(error);
      },
    });
  }

  uploadAgences(){
    const dialogRef = this.dialog.open(UploadAgencesComponent, {
      width: '60%',
    });
  }

  // zones

  getAllZones() {
    this.genericService.getAllZones().subscribe({
      next: (data: any) => {
        this.zones = data;
      },

      error: (error) => {
        console.log(error);
      },
    });
  }

  getAllReseau() {
    this.genericService.getReseauDistribution().subscribe({
      next: (data: any) => {
        this.reseauDist = data;
      },

      error: (error) => {
        console.log(error);
      },
    });
  }

  editAgence(idAgence: any) {
    let url: string =
      'reseau-commercial/gestion-agences/modification-agence/' + idAgence;

    this.router.navigateByUrl(url);
  }

  navigateToAllCreate() {
    this.router.navigate(['reseau-commercial/gestion-agences/creation-agence']);
  }

  desactivateAgence(idAgence: any, desc: string) {
    let dialogRef = this.dialog.open(DeleteAgenceDialogComponent, {
      width: '40%',

      data: {
        idAgence: idAgence,

        desc: desc,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.agencesService.DesactAgence(idAgence, result.data).subscribe({
          next: (data: any) => {
            this.getAllAgence();
          },

          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }

  submitFilter() {
    this.agencesService.filterAgence(this.formFilter.value).subscribe({
      next: (data: any) => {
        this.dataSourceAllAgences = new MatTableDataSource(data);

        this.formFilter = this.formBuilderAuth.group({
          codeAgence: [null],

          reseauDistribution: [0],

          zone: [0],

          statut: [null],
        });
        // this.getAllAgence()
      },

      error: (error) => {
        console.log(error);
      },
    });
  }
}
