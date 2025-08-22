import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-risque-dialog',
  templateUrl: './list-risque-dialog.component.html',
  styleUrls: ['./list-risque-dialog.component.scss']
})
export class ListRisqueDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  constructor(public dialogRef: MatDialogRef<ListRisqueDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  dataSourceListParamRisque = new MatTableDataSource();
  retourData: any;
  paramListAttr:any[]=[]
  ngOnInit(): void {
   
    this.retourData = this.data.dataSourceListParamRisque
 
    this.dataSourceListParamRisque.data = this.data.dataSourceListParamRisque.filter((value: any) => {
      return this.data.displayedColumnsListParamRisque.every((cle: any) => value.hasOwnProperty(cle));
    });
    this.data.displayedColumnsListParamRisque.push("action")
    this.data.listParamRisque.map((el:any)=>this.paramListAttr.push(el.libelle))
    // this.dataSourceListParamRisque.paginator = this.paginator;
  }

  deleteList(index: any) {
    const data = this.retourData
    const data2 = this.dataSourceListParamRisque.data
    data.splice(index, 1)
    data2.splice(index, 1)
    this.retourData = data
    this.dataSourceListParamRisque = new MatTableDataSource(data2);
  }

  ajouterParam() {
    
    if(this.data?.garantie?.codeGarantie=="G53" && this.dataSourceListParamRisque?.data?.length == this.data?.numberEffective){
      Swal.fire(
        "le nombre d'effectif a atteint le nombre de d'effectif indiqué",
        `error`
      )
      return
    }

    if(this.data.formListParamRisque.valid)
    {
      const newData = [...this.dataSourceListParamRisque.data, this.data.formListParamRisque.value];
      this.retourData.push(this.data.formListParamRisque.value) 
      this.dataSourceListParamRisque.data = newData;
      this.data.formListParamRisque.reset()
    }
  }
  submitList(){
    this.dialogRef.close({data:this.retourData,listAtt:this.paramListAttr})
  }
}
