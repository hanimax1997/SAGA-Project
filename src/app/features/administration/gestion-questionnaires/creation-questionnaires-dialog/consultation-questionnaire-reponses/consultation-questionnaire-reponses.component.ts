import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import {  MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Questions } from 'src/app/core/models/questions';
import { Reponses } from 'src/app/core/models/reponses';
import { trigger, style, state, animate, transition } from '@angular/animations';
import { CreationQuestionnaireReponsesDialogComponent } from '../creation-questionnaire-reponses-dialog/creation-questionnaire-reponses-dialog.component';
import { CreationQuestionnairesDialogComponent } from '../creation-questionnaires-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
@Component({
  selector: 'app-consultation-questionnaire-reponses',
  templateUrl: './consultation-questionnaire-reponses.component.html',
  styleUrls: ['./consultation-questionnaire-reponses.component.scss'],
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
export class ConsultationQuestionnaireReponsesComponent implements OnInit {

  displayedColumns: string[] = ['description', 'questionnaire', 'numeroOrdre', 'action'];
  dataSource: MatTableDataSource<Reponses>;
  lengthColumns = this.displayedColumns.length;
  reponses: Reponses[] | undefined;
  now: Date = new Date();
  @Input() Question: Questions | undefined
  @Output() newItemEvent = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;
  questionnaireList: any;

  constructor(private questionnaireService: QuestionnairesService, public dialog: MatDialog) { }

  step() {
    this.newItemEvent.emit();
  }

  //dialog ajouter reponse
  addReponse(){
    const dialogRef = this.dialog.open(CreationQuestionnaireReponsesDialogComponent,{
      width: '80%',
      data: {
        Question: this.Question,
      }
    });
 

    dialogRef.afterClosed().subscribe(result => {
      this.getReponse();
    });
  }

  //get reponse by questionnaire
  getReponse(): void {
    this.questionnaireService.getAllQuestionnaires().subscribe({
      next: (data: any) => {
        this.questionnaireList = data;
      },
      error: (error) => {

        console.log(error);

      }
    });

    this.reponses = this.Question?.reponseList?.filter((rep: any) => rep.dateFin != null ? rep.dateFin.split("T")[0] != this.now.toISOString().split("T")[0]:true)
    this.reponses?.map(reponse => {
      reponse.questionnaire = this.questionnaireList?.find((q: any) => q.idQuestionnaire == reponse.idQuestionnaire)?.description
    })
    this.dataSource = new MatTableDataSource(this.reponses);
    this.paginate();
  }

  ngOnInit(): void {
    this.getReponse();
  }
  
  //delete reponse
  delete(id: any) {
    this.Question?.reponseList?.map((rep: any) => {
      rep.id == id ? rep.dateFin = this.now.toISOString():false
    });
    this.getReponse();
  }

  //Ajouter pagination
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
