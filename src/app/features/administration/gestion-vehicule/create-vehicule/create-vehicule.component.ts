import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
import { MatDialog } from '@angular/material/dialog';
import { VehiculeService } from 'src/app/core/services/vehicule.service';

import Swal from 'sweetalert2'
import { NewConfigVehiculeDialogComponent } from './new-config-vehicule-dialog/new-config-vehicule-dialog.component';

@Component({
  selector: 'app-create-vehicule',
  templateUrl: './create-vehicule.component.html',
  styleUrls: ['./create-vehicule.component.scss']
})
export class CreateVehiculeComponent {
  formCreationVehicule: FormGroup | any;
  marques: any = []
  modeles: any = []
  genres: any = []
  energies: any = []
  minDate = new Date()
  receivedObject: any;
  newModel:any;
  marqueChoisi:any;


  constructor(private genericService: GenericService, private vehiculeService: VehiculeService, private formBuilder: FormBuilder,public dialog: MatDialog) {

  }
  ngOnInit(): void {

  
    this.initFormVehicule()
    this.getMarque()
    this.getGenre()
    this.getEnergie()

  }

  getGenre() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C18").idCategorie).subscribe({
      next: (data: any) => {
        this.genres = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getEnergie() {
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C31").idCategorie).subscribe({
      next: (data: any) => {
        this.energies = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  initFormVehicule() {
    const oldmARQUE=this.formCreationVehicule?.value?.marque;
    this.formCreationVehicule = this.formBuilder.group({
      marque: [this.receivedObject && this.receivedObject.modele ? oldmARQUE :" ", [Validators.required]],
     // modele: ["", [Validators.required]],
      modele: [this.receivedObject && this.receivedObject.modele ? this.receivedObject.idParam : '', [Validators.required]],
      typeVehicule: ['', [Validators.required]],
      puissanceFiscale: ['', [Validators.required]],
      nbPlace: ['', [Validators.required]],
      energie: ['', ],
      poidsTotalEnCharge: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
    })

  }

  debutDateChange(value: any) {

    this.minDate = value

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
  changeMarque(value: any) {

    if (value == "new") {
      const dialogRef = this.dialog.open(NewConfigVehiculeDialogComponent, {
        width: '60%',
        data: {
          type: "marque"
        }
      });

      dialogRef.afterClosed().subscribe((marqueIdParam: any) => {
    

      this.formCreationVehicule.get("marque").setValue(marqueIdParam.idParam);

      this.marques=[...this.marques,marqueIdParam]

       
      });
    } else {
      
      this.marqueChoisi=value;
      //call api get modele by Marque 
      this.getModele(value)

    }

  }
  getModele(idMarque: any) {
    
    this.vehiculeService.getModelByMarque(idMarque).subscribe({
      next: (data: any) => {
        this.modeles = data


      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  changeModele(value: any) {
    if (value == "new") {
      //Add modele dialog 
      const dialogRef = this.dialog.open(NewConfigVehiculeDialogComponent, {
        width: '60%',
        data: {
          type: "modele",
          marques:this.marques
        }
      });

      dialogRef.afterClosed().subscribe((result: any) => {

        this.formCreationVehicule.get("modele").setValue(result.idParam);

        this.modeles=[...this.modeles,result]

      });
    }
  }
  submitVehicule(formDirective: any) {
    this.formCreationVehicule.get("energie").setValue(1);
    this.vehiculeService.addVehicule(this.formCreationVehicule.value).subscribe({
      next: (data:any) => {
    
        Swal.fire(
          `véhicule ajouter avec succés`,
          '',
          'success'
        )
        formDirective.resetForm();
        this.formCreationVehicule.reset();
      },
    
      error: (error) =>{
        Swal.fire(
          error.error ? error.erro : error.error,
          'véhicule exist deja',
          'error'
        )
      }
    
    
     } )
  }


}
