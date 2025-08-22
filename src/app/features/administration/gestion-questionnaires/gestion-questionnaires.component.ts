import { Component, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Questionnaires } from 'src/app/core/models/questionnaires';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import {MatDialog} from '@angular/material/dialog';
import { CreationQuestionnairesDialogComponent } from './creation-questionnaires-dialog/creation-questionnaires-dialog.component';
import { EditQuestionnairesDialogComponent } from './edit-questionnaires-dialog/edit-questionnaires-dialog.component'; 
import { Router} from '@angular/router';

@Component({
  selector: 'app-gestion-questionnaires',
  templateUrl: './gestion-questionnaires.component.html',
  styleUrls: ['./gestion-questionnaires.component.scss']
})
export class GestionQuestionnairesComponent implements OnInit {

  displayedColumns: string[] = ['idQuestionnaire', 'description', 'dateDebut', 'dateFin', 'action'];
  dataSource: MatTableDataSource<Questionnaires>|any;
  lengthColumns = this.displayedColumns.length;

  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;

  constructor(private router: Router,private questionnairesService: QuestionnairesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllQuestionnaires()
  }

  //redirect to create questionnaire
  openCreateDialog() {
    this.router.navigateByUrl("gestion-produits/gestion-questionnaires/create");
  }

  //dialog modification questionnaire
  openDialogEdit(idQuestionnaire: Questionnaires) {
    const dialogRef = this.dialog.open(EditQuestionnairesDialogComponent,{
      width: '60%',
      data: {
        idQuestionnaire: idQuestionnaire
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllQuestionnaires()
    });
  }

  //get questionnaires
  getAllQuestionnaires() {
    this.questionnairesService.getAllQuestionnaires().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.paginate();
      },
      error: (error) => {

        console.log(error);

      }
    });
  }

  //Ajouter pagination
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //redirect to details questionnaire
  viewQuestion(idQuestionnaire:any){
    this.router.navigateByUrl("gestion-produits/gestion-questionnaires/"+idQuestionnaire+"/edit-questions");
  }
}
