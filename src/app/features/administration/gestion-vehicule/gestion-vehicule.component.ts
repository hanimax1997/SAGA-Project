import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { ConfirmationDeleteDialogComponent } from '../../confirmation-delete-dialog/confirmation-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/core/services/generic.service';
@Component({
  selector: 'app-gestion-vehicule',
  templateUrl: './gestion-vehicule.component.html',
  styleUrls: ['./gestion-vehicule.component.scss']
})
export class GestionVehiculeComponent {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(private genericService: GenericService,private router: Router, private formBuilder: FormBuilder, private vehiculeService: VehiculeService, public dialog: MatDialog) { }
  formFilterVehicule: FormGroup | any;
  marques: any = []
  genres: any = []
  models: any = []

  displayedColumns: string[] = ['idVehicule', 'marque', 'modele', 'action'];
  dataSource = new MatTableDataSource()
  ngOnInit(): void {
   
    this.geAllVehicules()
    this.initFormFilter()
    this.getGenre()
    this.getMarque()

  }

  getGenre() {
    console.log("je rentre là ")
  
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C18").idCategorie).subscribe({
      next: (data: any) => {
    
        this.genres = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  geAllVehicules() {
    this.vehiculeService.getAllVehicules().subscribe({
      next: (data: any) => {
     
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  initFormFilter() {
    this.formFilterVehicule = this.formBuilder.group({
      idVehicule: [],
      marque:[],
      genre: [],
      modele:[],
      dateCreation: []

    });
  }
  getMarque() {
    this.vehiculeService.getAllMarque().subscribe({
      next: (data: any) => {
        this.marques = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  submitFilter() {
    if (this.formFilterVehicule.valid) {
      this.vehiculeService.filtresVehicule(this.formFilterVehicule.value).subscribe({
        next: (data: any) => {

          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator
        },
        error: (error) => {

          console.log(error);

        }
      });
    }
  }
deleteVehicule(idVehicule: any) {
    const dialogRef = this.dialog.open(ConfirmationDeleteDialogComponent, {
      width: '40%',
      data: {
        id: idVehicule,
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.vehiculeService.deleteVehicule(idVehicule).subscribe({
          next: (data: any) => {
          //  window.location.reload();
      //    this.dataSource.data = this.dataSource.data.filter((vehicule: any) => vehicule.id !== idVehicule);
      const index = this.dataSource.data.findIndex((vehicule: any) => vehicule.idVehicule === idVehicule);
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
        // Mettre à jour la pagination si nécessaire
        this.dataSource.paginator = this.paginator;}
          },
          error: (error) => {
  
            console.log(error);
  
          }
        });
      }
    });
  }
  editVehicule(idVehicule: any) {
    this.router.navigate(['gestion-vehicules/modifier-vehicule/' + idVehicule]);


  }

consulterVehicule(idVehicule: any) {

  this.router.navigate(['gestion-vehicules/consulter-vehicule/' + idVehicule]);


  }
  resetTable(formDirective: any) {
    this.geAllVehicules()
    this.formFilterVehicule.reset
    formDirective.resetForm();
  }

  getModele(idmarque:any) {
    this.vehiculeService.getModelByMarque(idmarque).subscribe({
      next: (data: any) => {
        this.models = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
