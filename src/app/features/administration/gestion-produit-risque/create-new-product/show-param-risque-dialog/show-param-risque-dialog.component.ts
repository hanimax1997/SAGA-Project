import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-param-risque-dialog',
  templateUrl: 'show-param-risque-dialog.component.html',
  styleUrls: ['show-param-risque-dialog.component.scss']
})
export class ShowParamRisqueDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  selectedProduit: any = [];
  selectedWorkflow: any = [];

  ngOnInit(): void {
    this.data.paramRisqueWorkflows.forEach((workflow: any) => {
      this.selectedProduit.push(workflow.dictionnaire.idParam)
      workflow.obligatoire ? this.selectedWorkflow.push(workflow.dictionnaire.idParam):''
    });
  }

}
