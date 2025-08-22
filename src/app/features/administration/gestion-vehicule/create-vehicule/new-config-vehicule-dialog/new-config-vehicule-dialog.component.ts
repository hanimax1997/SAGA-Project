
import { Component, Inject, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-config-vehicule-dialog',
  templateUrl: './new-config-vehicule-dialog.component.html',
  styleUrls: ['./new-config-vehicule-dialog.component.scss']
})
export class NewConfigVehiculeDialogComponent {
  

  constructor(private vehiculeService:VehiculeService,private router: Router ,private formBuilder:FormBuilder,public dialogRef: MatDialogRef<NewConfigVehiculeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  formCreationMarque: FormGroup | any;
  formCreationModele: FormGroup | any;

  header: string
  ngOnInit(): void {
    this.header = (this.data.type == 'marque') ? 'Ajouter une nouvelle marque' : 'Ajouter un nouveau modele';
  
    this.formCreationMarque = this.formBuilder.group({
      marque: ["", [Validators.required]],
    });
  
    this.formCreationModele = this.formBuilder.group({
      modele: ["", [Validators.required]],
      marque: [""],

    });
  }
  
  sendObject() {

    const objToSend = { modele: this.formCreationModele.value.modele, idParam: "tempid" };
    this.vehiculeService.send(objToSend);
    
  }
  submitForm() :void {
    if (this.data.type === 'marque') {

            if (this.formCreationMarque.valid) {

                    this.vehiculeService.addMarque(this.formCreationMarque.value).subscribe({
                      next: (data: any) => {
                        this.dialogRef.close({marque:this.formCreationMarque.value.marque,idParam:data.idParam});

                        Swal.fire(
                          `marque ajouter avec succés`,
                          '',
                          'success'
                        )
                      },
                      error: (error) => {
                        Swal.fire(
                          error.error ? error.error : error.error,
                          '',
                          'error'
                        )
                      }
                    });
                }

    } else {
    //  this.dialogRef.close({modele:this.formCreationModele.value.modele,idParam:" "});

      let model : any;
      this.formCreationModele.get('modele').value

     if (this.formCreationModele.valid) {
 

        this.vehiculeService.addModele(this.formCreationModele.value).subscribe({
          next: (data: any) => {
            this.dialogRef.close({modele:this.formCreationModele.value.modele,idParam:data.idParam});


           /* Swal.fire(
              `Model ajouter avec succés`,
              '',
              'success'
            )*/
          },
          error: (error) => {

            Swal.fire(
              error.error ? error.error : error.error,
              'model exist deja',
              'error'
            )
          }
        });
         
    }
  }}
}
