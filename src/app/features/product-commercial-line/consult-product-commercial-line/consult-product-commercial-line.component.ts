import { Component, OnInit } from '@angular/core';
import { ContratService } from 'src/app/core/services/contrat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-consult-product-commercial-line',
  templateUrl: './consult-product-commercial-line.component.html',
  styleUrls: ['./consult-product-commercial-line.component.scss']
})
export class ConsultProductCommercialLineComponent implements OnInit {
  informationsContrat: any
  
  displayedColumns = ['id', 'valeurAssure', "contenu", "contenant", "risqueLocatif", "bi", 'smp', 'adresse',  'longitude', 'latitude']
  dataSource = new MatTableDataSource()
  
  constructor(private router: Router, private route: ActivatedRoute, private contratService: ContratService) { }
  ngOnInit(): void {
    this.getContratById(this.route.snapshot.paramMap.get('idContrat'))
  }
  goBack() {
    this.router.navigate(['gestion-commercial-line/']);
  }
  getContratById(idContrat: any) {
    this.contratService.getContratCommercialLine(idContrat).subscribe({
      next: (data: any) => {
        
        this.informationsContrat = data     
        this.dataSource = new MatTableDataSource(data.siteList)        
      }, error: (error: any) => {
        console.log(error);
      }

    })
  }

  
}
