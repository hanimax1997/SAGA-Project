import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Duree } from '../../../../core/models/duree';
import { DureeService } from '../../../../core/services/duree.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-edit-duree-dialog',
  templateUrl: 'edit-duree-dialog.component.html',
  styleUrls: ['edit-duree-dialog.component.scss'
  ]
})
export class EditDureeDialogComponent implements OnInit {
  formEditDuree: FormGroup | any;
  duree: Duree | any;
  dureeEditSuccess = false;
  now: Date = new Date();
  idDuree: number;
  dureeEditError = false;
  messageError: string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilderAuth: FormBuilder, private dureeService: DureeService, private router: Router) { }

  ngOnInit(): void {
    this.getDureeById(this.data.idDuree);


  }
  getDureeById(idDuree: any) {
    this.dureeService.getDureeById(idDuree).subscribe((result: any) => {

      this.initFormEditDuree(result);
    })
  }

  initFormEditDuree(infoDuree: any) {
    this.formEditDuree = this.formBuilderAuth.group({
      id: [infoDuree.id_duree],
      type_duree: [infoDuree.type_duree, [Validators.required]],
      duree: [infoDuree.duree, [Validators.required]],
      description: [infoDuree.description, [Validators.required]],
      auditUser: [infoDuree.auditUser],
    });
  }

  submitEditDuree(formDirective: any) {
    if (this.formEditDuree.valid) {
      this.dureeService.updateDuree(this.formEditDuree.value,this.data.idDuree).subscribe(
        (data:any) => {
          this.dureeEditSuccess = true;
          this.dureeEditError = false;
          this.idDuree = data.id_duree;
          formDirective.resetForm();
          this.formEditDuree.reset();
        },
      
        error => {
          this.dureeEditError = true;
          this.dureeEditSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        }
      )
    }
  }

}
