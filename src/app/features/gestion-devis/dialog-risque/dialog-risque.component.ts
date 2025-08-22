import { Component } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-dialog-risque',
  templateUrl: './dialog-risque.component.html',
  styleUrls: ['./dialog-risque.component.scss']
})
export class DialogRisqueComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  risqueInfo=this.data.risque
  ngOnInit(): void {
  
  }
}
