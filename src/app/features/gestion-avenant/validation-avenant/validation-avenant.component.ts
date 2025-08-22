import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-validation-avenant',
  templateUrl: './validation-avenant.component.html',
  styleUrls: ['./validation-avenant.component.scss']
})
export class ValidationAvenantComponent {
  commentaire: string;
  approbation: any = {};
  loaderValider: boolean = false;
  loaderRefuser: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ValidationAvenantComponent>,private avenantService: AvenantService, private router: Router) {}

  ngOnInit(): void {

  }

  validationAvenant(type: boolean) {
    
    type ? this.loaderValider = true : this.loaderRefuser = true;
      this.approbation = {
        idContratAvenant: this.data.idContratAvenant,
        validation: type,
        commentaire: this.commentaire
      }
    

    this.avenantService.approbationAvenant(this.approbation).subscribe(
      (data:any) => {
        this.commentaire = ""
        if(type)
        {
          this.loaderValider = false;
          Swal.fire(
            `Avenant approuvé`,
            '',
            'success'
          )
        }
        else
        {
          this.loaderRefuser = false;
          Swal.fire(
            `Avenant refusé`,
            '',
            'success'
          )
        }
        this.dialogRef.close();
      },
      error => {
        this.loaderValider = false;
        this.loaderRefuser = false;
        Swal.fire(
          `Une erreur s'est produite lors de l'approbation`,
          '',
          'error'
        )
      })
    }

}
