import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Questionnaires } from 'src/app/core/models/questionnaires';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-questionnaires-dialog',
  templateUrl: './edit-questionnaires-dialog.component.html',
  styleUrls: ['./edit-questionnaires-dialog.component.scss']
})
export class EditQuestionnairesDialogComponent implements OnInit {

  formEditQuestionnaire: FormGroup|any;
  questionnaire: Questionnaires|any;
  questionnaireEditSuccess=false;
  minDate = null
  idQuestionnaire:number;
  questionnaireEditError=false;
  messageError: string;

  constructor(public dialogRef: MatDialogRef<EditQuestionnairesDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private questionnairesService: QuestionnairesService, private router: Router) { }

  ngOnInit(): void {
    this.getQuestionnaireById(this.data.idQuestionnaire)
  }

  //get questionnaire
  getQuestionnaireById(idQuestionnaire:any){
    this.questionnairesService.getQuestionnaireById(idQuestionnaire).subscribe((result:any) => {
      
      this.iniEdittQuestionnaire(result);
    })
  }

  //init form modification questionnaire
  iniEdittQuestionnaire(infoQuestionnaire:any){
    this.debutDateChange(infoQuestionnaire.dateDebut);
    this.formEditQuestionnaire = this.formBuilderAuth.group({
      idQuestionnaire: [infoQuestionnaire.idQuestionnaire],
      description: [infoQuestionnaire.description, [Validators.required]],
      dateDebut: [infoQuestionnaire.dateDebut, [Validators.required]],
      dateFin: [infoQuestionnaire.dateFin],
      auditUser: [infoQuestionnaire.auditUser],
    });
  }

  //valider modification questionnaire
  submitEditQuestionnaire(formDirective: any){
    if(this.formEditQuestionnaire.valid){
      this.formEditQuestionnaire.get("dateDebut").setValue(moment(this.formEditQuestionnaire.get("dateDebut").value).format('YYYY-MM-DD'))

      this.questionnairesService.updateQuestionnaire(this.data.idQuestionnaire,this.formEditQuestionnaire.value).subscribe(
        (data:any) => {
          this.questionnaireEditSuccess = true;
          this.questionnaireEditError = false;
          this.idQuestionnaire = data.idQuestionnaire;
          this.dialogRef.close();
        },
      
        error => {
          this.questionnaireEditError = true;
          this.questionnaireEditSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        })
    }
  }

  debutDateChange(value: any) {

    this.minDate = value

  }

}
