import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReseauDistributionService } from 'src/app/core/services/reseau-distribution.service';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-reseau-distribution-dialog',
  templateUrl: './creation-reseau-distribution-dialog.component.html',
  styleUrls: ['./creation-reseau-distribution-dialog.component.scss']
})
export class CreationReseauDistributionDialogComponent implements OnInit {

  formCreationReseauDistribution: FormGroup|any;

  reseauDistributionCreationSuccess=false;
  minDate = new Date()
  idReseau: number | undefined;
  reseauDistributionCreationError=false;
  messageError: string;

  constructor(private formBuilderAuth: FormBuilder, private reseauDistributionService: ReseauDistributionService, private router: Router) { }

  ngOnInit(): void {
    this.formCreationReseauDistribution = this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
    });
  }

  submitCreationReseauDistribution(formDirective: any){
    if(this.formCreationReseauDistribution.valid){
      this.formCreationReseauDistribution.get("dateDebut").setValue(moment(this.formCreationReseauDistribution.get("dateDebut").value).format('YYYY-MM-DD'))

      this.reseauDistributionService.addReseauDistribution(this.formCreationReseauDistribution.value).subscribe(
        (data:any) => {
          this.reseauDistributionCreationSuccess = true;
          this.reseauDistributionCreationError = false;
          this.idReseau = data.idReseau;
          formDirective.resetForm();
          this.formCreationReseauDistribution.reset();
        },
      
        error => {
          this.reseauDistributionCreationError = true;
          this.reseauDistributionCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }
  debutDateChange(value: any) {
    this.minDate = value

  }

}
