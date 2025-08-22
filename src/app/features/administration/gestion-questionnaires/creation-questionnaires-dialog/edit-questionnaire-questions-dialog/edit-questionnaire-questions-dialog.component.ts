import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Questionnaires } from 'src/app/core/models/questionnaires';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import { Questions } from 'src/app/core/models/questions';
import { QuestionsService } from 'src/app/core/services/questions.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-questionnaire-questions-dialog',
  templateUrl: './edit-questionnaire-questions-dialog.component.html',
  styleUrls: ['./edit-questionnaire-questions-dialog.component.scss']
})
export class EditQuestionnaireQuestionsDialogComponent implements OnInit {

  formEditQuestion: FormGroup|any;
  questionnaires: Questionnaires[] | any;
  question: Questions|any;
  questionEditSuccess=false;
  minDate = null
  idQuestion: number | undefined;
  questionEditError=false;
  messageError: string;

  constructor(public dialogRef: MatDialogRef<EditQuestionnaireQuestionsDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private questionnaireService: QuestionnairesService, private questionService: QuestionsService) { }

  ngOnInit(): void {
    this.getQuestionById(this.data.Question) 
  }

  getQuestionById(Question:any){ 
    this.iniEditQuestion(Question);
  }

  //init form modification question
  iniEditQuestion(infoQuestion:any){
    this.debutDateChange(infoQuestion.dateDebut);
    this.formEditQuestion = this.formBuilderAuth.group({
      id: [infoQuestion.id],
      idQuestion: [infoQuestion.idQuestion],
      description: [infoQuestion.description, [Validators.required]],
      numeroOrdre: [infoQuestion.numeroOrdre, [Validators.required]],
      dateDebut: [infoQuestion.dateDebut, [Validators.required]],
      dateFin: [infoQuestion.dateFin],

    });
  }

  //close dialog modification question
  submitEditQuestion(formDirective: any){
    this.formEditQuestion.get("dateDebut").setValue(moment(this.formEditQuestion.get("dateDebut").value).format('YYYY-MM-DD'))

    this.dialogRef.close({ Question: this.formEditQuestion.value });
  }
  
  debutDateChange(value: any) {

    this.minDate = value

  }
}

