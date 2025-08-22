import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import { Questions } from 'src/app/core/models/questions';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { EditQuestionnaireQuestionsDialogComponent } from './edit-questionnaire-questions-dialog/edit-questionnaire-questions-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CreationQuestionnaireReponsesDialogComponent } from './creation-questionnaire-reponses-dialog/creation-questionnaire-reponses-dialog.component';
import { ConsultationQuestionnaireReponsesComponent } from './consultation-questionnaire-reponses/consultation-questionnaire-reponses.component';
import { Questionnaires } from 'src/app/core/models/questionnaires';
import { trigger, style, state, animate, transition } from '@angular/animations';
import { CreationQuestionsComponent } from './creation-questions/creation-questions.component';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2'
import * as moment from 'moment';

@Component({
  selector: 'app-creation-questionnaires-dialog',
  templateUrl: './creation-questionnaires-dialog.component.html',
  styleUrls: ['./creation-questionnaires-dialog.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({

          opacity: 0,

          transform: 'translateX(-100%)',

        }),

        animate(400),

      ]),

    ]),

  ]
})
export class CreationQuestionnairesDialogComponent implements OnInit {

  formCreationQuestionnaire: FormGroup|any;

  questionnaireCreationSuccess=false;
  minDate = new Date()
  idQuestionnaire: number | undefined;
  questionnaireCreationError=false;
  messageError: string;
  displayedColumns: string[] = ['description', 'numeroOrdre', 'dateDebut', 'dateFin', 'action'];
  dataSource: MatTableDataSource<Questions>|any;
  lengthColumns = this.displayedColumns.length;
  questions: Questions[] = [];
  question: Questions;
  step: boolean = true;
  questionnaire: Questionnaires;

  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;

  constructor(private formBuilderAuth: FormBuilder, private questionnairesService: QuestionnairesService, private router: Router, public dialog: MatDialog) { }

  //event after output consultation questionnaire reponses
  stepChange(stepper: MatStepper):void {
    stepper.previous();
    this.step = true
  }

  //init form questionnaire
  ngOnInit(): void {
    this.formCreationQuestionnaire = this.formBuilderAuth.group({
      description: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
      auditUser: ['test'],
    });
  }

  //dialog modification question
  openDialogEdit(Question: any) {
    const dialogRef = this.dialog.open(EditQuestionnaireQuestionsDialogComponent,{
      width: '60%',
      data: {
        Question: Question,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.table(result);
      this.questions = this.questions.map(qst => {
        if(qst.idQuestion == result.Question.idQuestion)
        {
          qst.description = result.Question.description
          qst.numeroOrdre = result.Question.numeroOrdre
          qst.dateDebut = result.Question.dateDebut
          qst.dateFin = result.Question.dateFin
        }
        return qst;
      })

    });
  }

  //view reponses 
  viewReponse(Question: any) {
    this.question = Question;
    this.step = false;
  }

  //redirect to get all questionnaire
  back() {
    this.router.navigateByUrl("gestion-produits/gestion-questionnaires");
  }

  //dialog ajout question
  addQuestion() {
    const dialogRef = this.dialog.open(CreationQuestionsComponent,{
      width: '60%',
      data: {
        questions: this.questions
      }
    });
 

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(this.questions);
      this.paginate();
    });
  }

  submitCreationQuestionnaire(){
    this.formCreationQuestionnaire.get("dateDebut").setValue(moment(this.formCreationQuestionnaire.get("dateDebut").value).format('YYYY-MM-DD'))
  
    this.questionnaire = this.formCreationQuestionnaire.value;

    this.questionnaire.questions = this.questions;

      this.questionnairesService.addQuestionnaire(this.questionnaire).subscribe(
        (data:any) => {
          this.questionnaireCreationSuccess = true;
          this.questionnaireCreationError = false;
          this.idQuestionnaire = data.idQuestionnaire;
          Swal.fire(
            `Le questionnaire N°${data.idQuestionnaire} a été ajouter avec succés`,
            '',
            'success'
          )
          this.formCreationQuestionnaire.reset();
          this.back();
        },
      
        error => {
          this.questionnaireCreationError = true;
          this.questionnaireCreationSuccess = false;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
          Swal.fire(
            this.messageError,
            '',
            'error'
          )
        })
  }
  debutDateChange(value: any) {
    this.minDate = value

  }
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

