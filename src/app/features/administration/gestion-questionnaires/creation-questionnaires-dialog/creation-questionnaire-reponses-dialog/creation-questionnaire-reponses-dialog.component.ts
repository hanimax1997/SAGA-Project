import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Questionnaires } from 'src/app/core/models/questionnaires';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';

import { Questions } from 'src/app/core/models/questions';
import { QuestionsService } from 'src/app/core/services/questions.service';

import { Reponses } from 'src/app/core/models/reponses';
import { ReponsesService } from 'src/app/core/services/reponses.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-questionnaire-reponses-dialog',
  templateUrl: './creation-questionnaire-reponses-dialog.component.html',
  styleUrls: ['./creation-questionnaire-reponses-dialog.component.scss']
})
export class CreationQuestionnaireReponsesDialogComponent implements OnInit {

  formCreationReponse: FormGroup|any;
  questionnaires: Questionnaires[] | any;
  questions: Questions[] | any;
  reponseCreationSuccess= false;
  minDate: Date = new Date();
  idReponse:any
  reponseCreationError=false;
  messageError: string;
  reponses: Reponses[] = [];
  dataSource: MatTableDataSource<Reponses>|any;
  displayedColumns: string[] = ['description', 'action'];
  lengthColumns = this.displayedColumns.length;
  questionnaireList: any;

  constructor(public dialogRef: MatDialogRef<CreationQuestionnaireReponsesDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private questionService: QuestionsService, private questionnaireService: QuestionnairesService, private reponseService: ReponsesService) { 
    
  }

  ngOnInit(): void {
    this.questionnaireService.getAllQuestionnaires().subscribe({
      next: (data: any) => {
        this.questionnaireList = data;
      },
      error: (error) => {

        console.log(error);

      }
    });
    
    this.reponses = this.data.Question.reponseList;
    this.dataSource = new MatTableDataSource(this.reponses);

    //init form creation reponse
    this.formCreationReponse = this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      numeroOrdre: ['', [Validators.required]],
      isQuestion: [''],
      idQuestionnaire: [''],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
      auditUser: ['test']
    });
  }

  //close dialog
  closeReponse(){
    this.dialogRef.close({ Question: this.data.Question });
  }

  //Ajouter reponse
  ajouterReponse(formDirective: any) {
    this.reponses.push(
      {
        id: this.reponses.length+1,
        idReponse: 'M'+this.reponses.length+1,
        isQuestion: this.formCreationReponse.value.isQuestion,
        idQuestionnaire: this.formCreationReponse.value.idQuestionnaire,
        questionnaire: '',
        idQuestion: 0,
        description: this.formCreationReponse.value.description,
        numeroOrdre: this.formCreationReponse.value.numeroOrdre,
        dateDebut: moment(this.formCreationReponse.value.dateDebut).format('YYYY-MM-DD'),
        dateFin: this.formCreationReponse.value.dateFin ? this.formCreationReponse.value.dateFin.toISOString():'',
        auditUser: this.formCreationReponse.value.auditUser
      }
    )

    this.reponseCreationSuccess = true;
    this.dataSource = new MatTableDataSource(this.reponses);
    this.data.Question.reponseList = this.reponses;

    formDirective.resetForm();
  }

  deleteReponse(reponse: any) {

  }

  debutDateChange(value: any) {

    this.minDate = value

  }
}

