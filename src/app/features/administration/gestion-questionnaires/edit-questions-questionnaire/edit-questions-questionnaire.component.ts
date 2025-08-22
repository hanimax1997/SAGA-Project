import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Questions } from 'src/app/core/models/questions';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EditQuestionnaireQuestionsDialogComponent } from '../creation-questionnaires-dialog/edit-questionnaire-questions-dialog/edit-questionnaire-questions-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CreationQuestionnaireReponsesDialogComponent } from '../creation-questionnaires-dialog/creation-questionnaire-reponses-dialog/creation-questionnaire-reponses-dialog.component';
import { ConsultationQuestionnaireReponsesComponent } from '../creation-questionnaires-dialog/consultation-questionnaire-reponses/consultation-questionnaire-reponses.component';
import { Questionnaires } from 'src/app/core/models/questionnaires';
import { QuestionsService } from 'src/app/core/services/questions.service';
import { ReponsesService } from 'src/app/core/services/reponses.service';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import { trigger, style, state, animate, transition } from '@angular/animations';
import { CreationQuestionsComponent } from '../creation-questionnaires-dialog/creation-questions/creation-questions.component';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-edit-questions-questionnaire',
  templateUrl: './edit-questions-questionnaire.component.html',
  styleUrls: ['./edit-questions-questionnaire.component.scss'],
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
export class EditQuestionsQuestionnaireComponent implements OnInit {

  questionnaireEditSuccess = false;
  minDate = new Date()
  idQuestionnaire: string | null;
  Questionnaire: string | undefined;
  questionnaireEditError = false;
  messageError: string;
  displayedColumns: string[] = ['description', 'numeroOrdre', 'dateDebut', 'dateFin', 'action'];
  dataSource: MatTableDataSource<Questions> | any;
  lengthColumns = this.displayedColumns.length;
  formEditQuestion: FormGroup | any;
  questions: Questions[] = [];
  questionnaire: Questionnaires;
  question: Questions;
  step: boolean = true
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private formBuilderAuth: FormBuilder, private questionnaireService: QuestionnairesService, private questionsService: QuestionsService, private reponsesService: ReponsesService, private router: Router, public dialog: MatDialog, private route: ActivatedRoute) { }

  stepChange(stepper: MatStepper):void {
    stepper.previous();
    this.step = true;
  }

  ngOnInit(): void {
    //init form modification question
    this.formEditQuestion = this.formBuilderAuth.group({
      idQuestion: [''],
      idQuestionnaire: [''],
      description: ['', [Validators.required]],
      numeroOrdre: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
      auditUser: ['test'],
    });

    //get questionnaire
    this.idQuestionnaire = this.route.snapshot.paramMap.get('idQuestionnaire');
    this.questionnaireService.getQuestionnaireById(this.idQuestionnaire).subscribe(questionnaire => {
      this.Questionnaire = questionnaire.description;
    })

    //get questions by questionnaire et reponses by question
    this.questionsService.getQuestionsByQuestionnaire(this.idQuestionnaire).subscribe(questionList => {
      this.questions = questionList
      this.questions.map(question => {
        this.reponsesService.getReponsesByQuestion(question.id).subscribe(reponseList => {
          question.reponseList = reponseList
        })
      })
      this.dataSource = new MatTableDataSource(questionList)
      this.paginate();
    })
  }

  //dialog modification question
  openDialogEdit(Question: any) {
    const dialogRef = this.dialog.open(EditQuestionnaireQuestionsDialogComponent, {
      width: '60%',
      data: {
        Question: Question,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.table(result);
      this.questions = this.questions.map(qst => {
        if (qst.id == result.Question.id) {
          qst.description = result.Question.description
          qst.numeroOrdre = result.Question.numeroOrdre
          qst.dateDebut = result.Question.dateDebut
          qst.dateFin = result.Question.dateFin
        }
        return qst;
      })

    });
  }

  //view reponse list
  viewReponse(Question: any) {
    this.question = Question;
    this.step = false
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

  debutDateChange(value: any) {
    this.minDate = value

  }

  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  back() {
    this.router.navigateByUrl("gestion-produits/gestion-questionnaires");
  }

  submitEditQuestionnaire() {
    let question_new: Questions[] = this.questions.filter(qst => (typeof qst.idQuestion) == "string" ? qst.idQuestion?.includes("M") : false)
    let question_old: Questions[] = this.questions.filter(qst => (typeof qst.idQuestion) == "string" ? false : true)

    question_new.forEach(question => {
      question.idQuestion = '0';
      this.questionsService.addQuestion(question, this.idQuestionnaire).subscribe(
        (data:any) => {
          this.idQuestionnaire = data.idQuestionnaire;
          this.formEditQuestion.reset();
          question.reponseList?.forEach(reponse => {
            this.reponsesService.addReponse(reponse, data.id).subscribe(
              (data2:any) => {},
              error => {
                this.questionnaireEditSuccess = false;
                this.questionnaireEditError = true;
                error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
              }
            )
          })
        },

        error => {
          this.questionnaireEditSuccess = false;
          this.questionnaireEditError = true;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        }
      )
    })

    question_old.forEach(question => {
      this.questionsService.updateQuestion(question, question.id, this.idQuestionnaire).subscribe(
        (data: any) => {
          question.reponseList?.filter(repp => (typeof repp.idReponse) == "string" ? repp.idReponse?.includes("M") : false).forEach(repfiltre => {
            this.reponsesService.addReponse(repfiltre, data.id).subscribe(
              (data2: any) => { },
              error => {
                this.questionnaireEditSuccess = false;
                this.questionnaireEditError = true;
                error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
              }
            )
          })

          question.reponseList?.filter(repp => (typeof repp.idReponse) == "string" ? false : true).forEach(repfiltre => {
            this.reponsesService.updateReponse(repfiltre, data.id, repfiltre.id).subscribe(
              (data3: any) => { },
              error => {
                this.questionnaireEditSuccess = false;
                this.questionnaireEditError = true;
                error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
              }
            )
          })

          this.questionnaireEditSuccess = true;
          this.questionnaireEditError = false;
        },
        error => {
          this.questionnaireEditSuccess = false;
          this.questionnaireEditError = true;
          error.ErreurMessage ? this.messageError = error.ErreurMessage : this.messageError = error.message;
        }
      )
    })


  }

}
