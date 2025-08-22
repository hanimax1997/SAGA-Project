import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { AuthentificationService } from 'src/app/core/services/authentification.service';

@Component({
  selector: 'app-consulter-vehicule',
  templateUrl: './consult-vehicule.component.html',
  styleUrls: ['./consult-vehicule.component.scss']
})
export class ConsultVehiculeComponent implements OnInit  {
  codeSinistre      : any;
  idVehicule             : any;
  typeOpCode        : any;
  vehiculeInfo        : any;
  code              : any;
  expert      : any; 
  beneficiaire      : any; 
  userValidation      : any; 
  //typeBenificiaire      : any; 
  compagnieAdverse  : any;
  rib               : any =null;
  decompteOp        : any = {};


  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private vehiculeService: VehiculeService,
    private authentificationService: AuthentificationService,
  ) {}

  ngOnInit(): void {   
   
    if (this.codeSinistre !== null) {
      this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre');
    }    
    if (this.idVehicule !== null) {
      this.idVehicule = this.route.snapshot.paramMap.get('idVehicule');
    } 
    
   this.getVehiculeById(this.idVehicule);
  }
 
    getVehiculeById(idVehicule : any){
    this.vehiculeService.getVehiculeById(idVehicule).subscribe({
      next: (data: any) => {         
        this.vehiculeInfo =data  ;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
  goBack() {
   
  //  this.router.navigateByUrl("gestion-sinistre-automobileMono/" + this.codeSinistre + "/gestion-sinistres/gestion-op");
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
