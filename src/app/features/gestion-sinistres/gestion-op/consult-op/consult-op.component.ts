import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { AuthentificationService } from 'src/app/core/services/authentification.service';

@Component({
  selector: 'app-consult-op',
  templateUrl: './consult-op.component.html',
  styleUrls: ['./consult-op.component.scss']
})
export class ConsultOpComponent implements OnInit  {
  codeSinistre      : any;
  idOp              : any;
  typeOpCode        : any;
  code              : any;
  expert      : any; 
  beneficiaire      : any; 
  userValidation      : any; 
  //typeBenificiaire      : any; 
  compagnieAdverse  : any;
  rib               : any =null;
  decompteOp        : any = {};
  codeProduit  : any;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private sinistresService: SinistresService,
    private authentificationService: AuthentificationService,
  ) {}

  ngOnInit(): void {   
   this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

 
   this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })
    
    if (this.codeSinistre !== null) {
      this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre');
    }    
    if (this.idOp !== null) {
      this.idOp = this.route.snapshot.paramMap.get('idOp');
    } 
    
   this.getOpById(this.idOp);
  }
 
    getOpById(idOp : any){
    this.sinistresService.getOpById(idOp).subscribe({
      next: (data: any) => {         
      this.typeOpCode =data.typeOp.code    
        if(this.typeOpCode == 'OR' ){
          this.decompteOp =data;          
        }else if(this.typeOpCode == 'ROR'){
          this.rib =  this.decompteOp.referencePaiement;
          this.decompteOp =data;         
        }else{          
          this.decompteOp =data; 
          this.code = this.decompteOp.decompteOp != null? this.decompteOp.decompteOp.typeOp.code : this.decompteOp.typeOp.code
          if(this.decompteOp.decompteOp.benificiaire != null){
            this.beneficiaire = this.decompteOp.decompteOp.benificiaire
          }         
          if(this.decompteOp.decompteOp?.expert != null){
            this.expert = this.decompteOp.decompteOp.expert
          }         
          if(this.decompteOp.userValidation != null){
            this.userValidation = this.decompteOp.userValidation
          }         
          if(this.code=="OPT"){
            this.compagnieAdverse=this.decompteOp.decompteOp.sinistrePersonne.compagnyAdverse?.code
          }
       
          this.rib = this.decompteOp.referencePaiement
        }
       
     
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
