import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AvenantService } from 'src/app/core/services/avenant.service';
import Swal from 'sweetalert2';
import { ContratService } from 'src/app/core/services/contrat.service';
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-soumettre-avenant',
  templateUrl: './soumettre-avenant.component.html',
  styleUrls: ['./soumettre-avenant.component.scss']
})
export class SoumettreAvenantComponent {
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
  constructor(private formBuilder: FormBuilder, private dataTransferService: DataTransferService, private contratService: ContratService, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SoumettreAvenantComponent>, private avenantService: AvenantService, private router: Router) { }

  ngOnInit(): void {
    this.formTypeAvenant = this.formBuilder.group({
      typeAvenant: ['', [Validators.required]],
      risque: ['', []],
    });
    this.types_avenant = this.data.types_avenant

    // this.getTypeAvenant.idAvenantPrecedent = this.data.idTypeAvenant
    // this.avenantService.getTypeAvenantbyAvenantPrecedent(this.getTypeAvenant).subscribe({
    //   next: (data: any) => {
    //     this.types_avenant = data
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // });
  }
  public isFiltered(risque: any) {
    return this.filteredcausesRisques.find((item: any) => item.idRisque === risque.idRisque)
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

              if ((this.typeAvenant.code == 'A03' || this.typeAvenant.code == 'A04')) {
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

      this.router.navigate(['application-avenant/' + this.data.codeProduit + '/' + this.typeAvenant.idTypeAvenant + '/' + this.data.idContrat]);
    }

    // //EXP check if date expiration contrat > 30 ou <30 otherwise erreur 
    // let afterDate = new Date()
    // let beforeDate = new Date()
    // afterDate = new Date(afterDate.setDate(this.dateExpirationContrat.getDate() + 30));
    // beforeDate = new Date(beforeDate.setDate(this.dateExpirationContrat.getDate() - 30));
    // if ((this.typeAvenant.code == "A13" && (this.today >= beforeDate || this.today <= afterDate)) || this.typeAvenant.code != "A13") {
    //   this.dialogRef.close();
    //   this.router.navigate(['application-avenant/' + this.typeAvenant.idTypeAvenant + '/' + this.data.idContrat]);
    // } else if (this.today <= beforeDate || this.today >= afterDate) {
    //   let message=""
    //   if (this.today <= beforeDate)
    //     message = "Echéance dépassée de plus de 30 jours, veuillez actionnez une affaire nouvelle"
    //   else
    //     message = "“Ce contrat ne peut être renouvelé  à plus de 30 jours de la date d’échéance"
    //   Swal.fire(
    //     message,
    //     '',
    //     'error'
    //   )
    // }

  }
}
