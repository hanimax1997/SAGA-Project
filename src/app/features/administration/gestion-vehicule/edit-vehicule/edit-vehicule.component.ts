import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { NewConfigVehiculeDialogComponent } from '../create-vehicule/new-config-vehicule-dialog/new-config-vehicule-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GenericService } from 'src/app/core/services/generic.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-edit-vehicule',
  templateUrl: './edit-vehicule.component.html',
  styleUrls: ['./edit-vehicule.component.scss']
})
export class EditVehiculeComponent {
  formEditVehicule: FormGroup | any;
  marques: any = []
  infoVehicule: any
  genres: any = []
  energies: any = []
  modeles: any;
  minDate = new Date()

  constructor(public dialog: MatDialog,private route: ActivatedRoute,private router: Router, private genericService: GenericService, private vehiculeService: VehiculeService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getVehiculeById(this.route.snapshot.paramMap.get('idVehicule'))
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

  debutDateChange(value: any) {

    this.minDate = value

  }
  getVehiculeById(idVehicule: any) {
    this.vehiculeService.getVehiculeById(idVehicule).subscribe({
      next: (data: any) => {
        this.infoVehicule = data
        this.initFormVehicule()

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

      dialogRef.afterClosed().subscribe((result: any) => {

      });
    } else {
      //call api get modele by Marque 
      this.getModele(value)
    }
  }
  getModele(idMarque: any) {
    this.vehiculeService.getModelByMarque(idMarque).subscribe({
      next: (data: any) => {
        this.modeles = data
        this.formEditVehicule.get("modele").setValue(220)
        console.log(this.formEditVehicule.get("modele").value)
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

      });
    }
  }
  initFormVehicule() {
    this.formEditVehicule = this.formBuilder.group({
      idVehicule:[this.infoVehicule.idVehicule],
      marque: [this.infoVehicule.marque.idParam, [Validators.required]],
      modele: [this.infoVehicule.modele.idParam, [Validators.required]],
      typeVehicule: [this.infoVehicule.typeVehicule.idParam, [Validators.required]],
      puissanceFiscale: ['', [Validators.required]],
      nbPlace: ['', [Validators.required]],
      energie: ['', [Validators.required]],
      poidsTotalEnCharge: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
    })


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
  submitVehicule() {
    this.vehiculeService.editVehicule(this.formEditVehicule.value, this.route.snapshot.paramMap.get('idVehicule')).subscribe(
      (data:any) => {
        Swal.fire({
          title: "véhicule a été modifié avec succés",
          icon: 'info',
          allowOutsideClick: false,           
          confirmButtonText: `Ok`,           
          width: 600
        }).then((result) => {
          if (result.isConfirmed) {
           
            this.router.navigate(['gestion-vehicules']);
          }
        })
      },
    
      error => {
        Swal.fire(
          error.ErreurMessage ? error.ErreurMessage : error.message,
          '',
          'error'
        )
     
     
      })
  }
}
