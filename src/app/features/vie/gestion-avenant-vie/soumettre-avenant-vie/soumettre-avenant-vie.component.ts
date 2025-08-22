import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import Swal from 'sweetalert2';
import { ContratService } from 'src/app/core/services/contrat.service';
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-soumettre-avenant-vie',
  templateUrl: './soumettre-avenant-vie.component.html',
  styleUrls: ['./soumettre-avenant-vie.component.scss']
})
export class SoumettreAvenantVieComponent {
  typeAvenant: any;
  types_avenant: any = [];
  getTypeAvenant: any = {
    idProduit: '',
    idAvenantPrecedent: ''
  };
  today = new Date()
  dateExpirationContrat = new Date(this.data.dateExpiration)
  multiRisque = false;
  risques: any;
  filteredcausesRisques: any;
  risquesArray: any = []
  formTypeAvenant: FormGroup;
  constructor(private formBuilder: FormBuilder, private dataTransferService: DataTransferService, private contratService: ContratService, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SoumettreAvenantVieComponent>, private avenantService: AvenantService, private router: Router) { }

  ngOnInit(): void {
    this.formTypeAvenant = this.formBuilder.group({
      typeAvenant: ['', [Validators.required]],
      risque: ['', []],
    });
    this.types_avenant = this.data.types_avenant
  }
  getInfoAvenant() {
    this.dataTransferService.emptyDataArray()
    this.avenantService.getAvenantById(this.typeAvenant.idTypeAvenant).subscribe({
      next: (data: any) => {
        this.multiRisque = data.multirisque
        if (this.multiRisque) {
          this.formTypeAvenant.get("risque")?.setValidators([Validators.required])
        }
        else
          this.formTypeAvenant.get("risque")?.setValidators([])


        if (this.multiRisque)
          this.contratService.getRisquesByContrat(this.data.idContrat, this.data.codeProduit).subscribe({
            next: (data: any) => {
              this.risques = data
              this.filteredcausesRisques = this.risques.slice()

              if ((this.typeAvenant.code == 'A03' || this.typeAvenant.code == 'A04' || this.typeAvenant.code == 'A23'|| this.typeAvenant.code == 'A24'|| this.typeAvenant.code == 'A25')) {
                this.formTypeAvenant.get("risque")?.setValue(data)
                this.formTypeAvenant.get("risque")?.disable()
              } else {
                this.formTypeAvenant.get("risque")?.setValue('')
                this.formTypeAvenant.get("risque")?.enable()
              }

            },
            error: (error) => {
              console.log(error);
            }
          });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  submitAvenant() {
    if (this.formTypeAvenant.valid) {
      this.dataTransferService.setDataRisquesArray(this.formTypeAvenant.get("risque")?.value);
      this.dialogRef.close();

      this.router.navigate(['application-avenant/vie/' + this.data.codeProduit + '/' + this.typeAvenant.idTypeAvenant + '/' + this.data.idContrat]);
    }
  }
}
