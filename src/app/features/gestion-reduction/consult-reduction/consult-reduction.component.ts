import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { ReductionService } from 'src/app/core/services/reduction.service';
@Component({
  selector: 'app-consult-reduction',
  templateUrl: './consult-reduction.component.html',
  styleUrls: ['./consult-reduction.component.scss']
})
export class ConsultReductionComponent implements OnInit {
  idReduction:any
  reduction:any=[]
  reductionRisque:any=[]
  reductionPack:any=[]
  reductionReady=false
  displayedColumnsReduc: string[] = ['codeReduction', 'nomReduction', 'tauxReduction', 'action'];
  displayedColumns: string[] = ['garantie', 'franchise', 'pourcentage'];

  constructor( private router: Router,private route: ActivatedRoute, private reductionService: ReductionService) { }


  ngOnInit(): void {
    this.idReduction = this.route.snapshot.paramMap.get('idReduction');
    this.reductionService.getReductionById(this.idReduction).subscribe({
      next: (datas: any) => {
        this.reductionReady=true
        this.reduction=datas
        this.reductionRisque=this.reduction.paramList
        this.reductionPack=this.reduction.packList.reduce((x: any, y: any) => {

          (x[y.idPackComplet.idPack0.idPack0] = x[y.idPackComplet.idPack0.idPack0] || []).push(y);

          return x;

        }, {});
        this.reductionPack = Object.values(this.reductionPack)


      }

      ,
      error: (error: any) => {

        console.log(error);

      }
    });

  }
  consultReduction(idReduction:any){
    this.router.navigate(['gestion-reduction/consultation-reduction/' + idReduction ]);

  }                                                                                                                                                                                                                                                                                                                                                 
}
