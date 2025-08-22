import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Duree } from '../../../../core/models/duree';
import { DureeService } from '../../../../core/services/duree.service';

@Component({
  selector: 'app-creation-duree-dialog',
  templateUrl: 'creation-duree-dialog.component.html',
  styleUrls: ['creation-duree-dialog.component.scss'
  ]
})
export class CreationDureeDialogComponent implements OnInit {

  formCreationDuree: FormGroup|any;
  duree: Duree|any;
  dureeCreationSuccess=false;
  now: Date = new Date();
  idDuree: number | undefined;
  dureeCreationError=false;
  messageError: string | undefined;

  constructor(private formBuilderAuth: FormBuilder, private dureeService: DureeService, private router: Router) { }

  ngOnInit(): void {
    this.formCreationDuree = this.formBuilderAuth.group({
      id: [''],
      type_duree: ['', [Validators.required]],
      duree: ['', [Validators.required]],
      description: ['', [Validators.required]],
      auditUser: ['test'],
    });
  }

  submitCreationDuree(formDirective: any){
    if(this.formCreationDuree.valid){
      this.dureeService.addDuree(this.formCreationDuree.value).subscribe(
        (data:any) => {
          this.dureeCreationSuccess = true;
          this.dureeCreationError = false;
          this.idDuree = data.id_duree;
          formDirective.resetForm();
          this.formCreationDuree.reset();
        },
      
        error => {
          this.dureeCreationError = true;
          this.dureeCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }

}