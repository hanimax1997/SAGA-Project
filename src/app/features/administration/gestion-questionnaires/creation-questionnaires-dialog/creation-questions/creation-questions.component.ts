import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-creation-questions',
  templateUrl: './creation-questions.component.html',
  styleUrls: ['./creation-questions.component.scss']
})
export class CreationQuestionsComponent implements OnInit {

  formCreationQuestion: FormGroup|any;
  minDate = new Date();
  questionCreationSuccess = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private formBuilderAuth: FormBuilder, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    //init form creation question
    this.formCreationQuestion = this.formBuilderAuth.group({
      idQuestion: [''],
      idQuestionnaire: [''],
      description: ['', [Validators.required]],
      numeroOrdre: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
      auditUser: ['test'],
    });
  }

  //ajouter question
  AjouterQuestion(formDirective: any) {
    if(formDirective.valid)
    {
      this.data.questions.push(
        {
          id: this.data.questions.length+1,
          idQuestion: "M"+this.data.questions.length+1,
          idQuestionnaire: undefined,
          reponseList: [],
          description: this.formCreationQuestion.value.description,
          numeroOrdre: this.formCreationQuestion.value.numeroOrdre,
          dateDebut: moment(this.formCreationQuestion.value.dateDebut).format('YYYY-MM-DD'),
          dateFin: moment(this.formCreationQuestion.value.dateFin).format('YYYY-MM-DD'),
          auditUser: 'test'
        }
      )
      
      this.formCreationQuestion = this.formBuilderAuth.group({
        idQuestion: [''],
        idQuestionnaire: [''],
        description: [''],
        numeroOrdre: [''],
        dateDebut: [''],
        dateFin: ['']
      });
      
      this.questionCreationSuccess = true;
    }
  }

  debutDateChange(value: any) {
    this.minDate = value

  }

}
