import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
import { AgencesService } from 'src/app/core/services/agences.service';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaiementSinistre } from 'src/app/core/models/sinistre';

import Swal from 'sweetalert2';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { Patterns } from 'src/app/core/validiators/patterns';
@Component({
  selector: 'app-paiement-sinistre',
  templateUrl: './paiement-sinistre.component.html',
  styleUrls: ['./paiement-sinistre.component.scss']
})
export class PaiementSinistreComponent implements OnInit {
  @Input() jsonOp: any;
  formPayment: FormGroup | any;
  modePayement: any = []
  agencesArray: any = []
  typeOpList: any = []
  sinistreInf: any = []
  codeProduit:any;
  statusSinistre:any;
  modeSelected: any
  errorCheck = false
  codeSinistre: any;
  idSinistre: any;
  instance: any;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  paimentBody = new PaiementSinistre()
  constructor(private authentificationService: AuthentificationService, private route: ActivatedRoute, private router: Router, private sinistresService: SinistresService, private agencesService: AgencesService, private formBuilder: FormBuilder, private genericService: GenericService) { }
  ngOnInit(): void {

    this.getSinistreInfo()
    // this.checkPaiement()
    this.getDictionnaire()
    this.getActiveAgence()
    this.initFormPayment()
    this.jsonOp ? "" : this.getInstanceById()
    //console.log(this.jsonOp)
    if (this.codeSinistre !== null) {
      this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre');

      let roleExist = false;
      this.roleUser.find((r: any) => {
        if(this.sinistreRoles[this.codeProduit].includes(r)) {
          roleExist = true;
          return;
        }
      })

      if(!roleExist) this.router.navigate(['/dashboard'])
    }
  }

  getInstanceById() {
    this.sinistresService.getInstanceById(this.route.snapshot.paramMap.get('idInstance')).subscribe({
      next: (data: any) => {
        console.log(data)
        this.instance = data
      },
      error: (error) => {
        Swal.fire('error', '', 'error');
      },
    });
  }

  getSinistreInfo() {
    this.sinistresService.getSinistreByCode(this.route.snapshot.paramMap.get('codeSinistre')).subscribe({
      next: (data: any) => {
        this.idSinistre=data.idSinistre
        this.sinistreInf=data;
        this.statusSinistre=data?.statut?.code
       this.codeProduit=data?.produit.codeProduit;
      },
      error: (error) => {

        console.log(error);

      }
    })
  }

  checkPaiement() {
    this.sinistresService.checkPaiement(this.route.snapshot.paramMap.get('codeSinistre'), this.jsonOp ? this.jsonOp : this.instance.decompteOp).subscribe({
      next: (data: any) => {
      },
      error: (error) => {
        console.log("error ", error?.messageStatut);
        Swal.fire({
          title: error?.messageStatut ? error?.messageStatut : error,
          icon: 'error',
          allowOutsideClick: false,
          confirmButtonText: `Ok`,
          width: 400
        }).then((result) => {
          if (result.isConfirmed) {

            this.router.navigate(['../../../../'+'gestion-op'], { relativeTo: this.route });
         //   this.router.navigate(['gestion-sinistre-automobileMono/'+this.codeSinistre+'/gestion-sinistres/gestion-op']);
          }
        })

        this.errorCheck = true
        this.formPayment.disabled()
        console.log(error);

      }
    })
  }
  getActiveAgence() {
    let filterbody = {
      "codeAgence": null,
      "reseauDistribution": 0,
      "zone": 0,
      "statut": "active"
    }
    this.agencesService.filterAgence(filterbody).subscribe({
      next: (data: any) => {
        this.agencesArray = data;

      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  getDictionnaire() {
    // get mode payement 
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C72").idCategorie).subscribe(data => {
      this.modePayement = data;
    })
    // get type op 
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C52").idCategorie).subscribe(data => {
      this.typeOpList = data;
    })


  }
  initFormPayment() {
    this.formPayment = this.formBuilder.group({
      modePayement: ['', [Validators.required]],
      rib: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agence: ['', [Validators.required]],
    });
  }
  getSelectedMode(mode: any) {
    this.modeSelected = mode.code

    if (mode.code == '04')
      this.formPayment.get("rib").setValidators([Validators.required, Validators.pattern(Patterns.number)])
    else
      this.formPayment.get("rib").setValidators([])

    this.formPayment.get('rib').updateValueAndValidity();

  }
  submitPayement(formDirective: any) {
   console.log(this.jsonOp)
    if(this.formPayment.valid) {      
      this.paimentBody.sinistre = { "idSinistre": this.idSinistre }
      this.paimentBody.typeOp = this.jsonOp ? this.jsonOp.typeOp : this.instance.decompteOp.typeOp
      this.paimentBody.modeRecouvrement = {
        "idParam": this.formPayment.get("modePayement").value.idParam,
        "code": this.formPayment.get("modePayement").value.code
      }
      if (this.route.snapshot.paramMap.get('typeDecompte') == 'PV') {
        this.jsonOp.decomptePv = this.jsonOp.calculateur
        this.paimentBody.decompteOp = { 
          "typeOp": this.jsonOp ? this.jsonOp.typeOp : this.instance.decompteOp.typeOp,
          "decomptePv": this.jsonOp ? this.jsonOp.calculateur : this.instance.decompteOp.decomptePv,
          "sinistrePersonne": this.jsonOp ? this.jsonOp.sinistrePersonne : this.instance.decompteOp.sinistrePersonne,
          "typeBenificiaire": this.jsonOp ? this.jsonOp.typeBenificiaire : this.instance.decompteOp.typeBenificiaire,
          "benificiaire": this.jsonOp ? this.jsonOp.benificiaire : this.instance.decompteOp.benificiaire,
          "nom": this.jsonOp ? this.jsonOp.nom : this.instance.decompteOp.nom,
          "prenom": this.jsonOp ? this.jsonOp.prenom : this.instance.decompteOp.prenom,
          "referenceDocument": this.jsonOp ? this.jsonOp.referenceDocument : this.instance.decompteOp.referenceDocument,      
          "auditUser": sessionStorage.getItem('userId')
        }
        
        this.paimentBody.decompteOp = this.jsonOp ? this.jsonOp : this.instance.decompteOp
  
  
      }
      else {
        this.paimentBody.decompteOp = { 
          "typeOp": this.jsonOp ? this.jsonOp.typeOp : this.instance.decompteOp.typeOp,
          "decomptePv": null,
          "sinistrePersonne": this.jsonOp ? this.jsonOp.sinistrePersonne : this.instance.decompteOp.sinistrePersonne,
          "typeBenificiaire": this.jsonOp ? this.jsonOp.typeBenificiaire : this.instance.decompteOp.typeBenificiaire,       
          "benificiaire": this.jsonOp ? this.jsonOp.benificiaire : this.instance.decompteOp.benificiaire,
          "expert": this.jsonOp ? this.jsonOp.expert : this.instance.decompteOp.expert,
          "nom": this.jsonOp ? this.jsonOp.nom : this.instance.decompteOp.nom,
          "prenom": this.jsonOp ? this.jsonOp.prenom : this.instance.decompteOp.prenom,
          "referenceDocument": this.jsonOp ? this.jsonOp.referenceDocument : this.instance.decompteOp.referenceDocument,
          "montantTTC": this.jsonOp ? this.jsonOp.montantTTC : this.instance.decompteOp.montantTTC,      
          "montantHTC": this.jsonOp ? this.jsonOp.montantHTC : this.instance.decompteOp.montantHTC,
          "tva": this.jsonOp ? this.jsonOp.tva : this.instance.decompteOp.tva,
          "totalHt": this.jsonOp ? this.jsonOp.totalHt : this.instance.decompteOp.totalHt,
          "auditUser": sessionStorage.getItem('userId'),
  
         
        }
        
  
       
        // this.paimentBody.decomptePv = { "idSinistreDecompte": null }
      }
      this.paimentBody.agence = { "idAgence": this.formPayment.get("agence").value }
  
      this.paimentBody.instance = { "idSinistreInstance": this.jsonOp ? null : this.route.snapshot.paramMap.get('idInstance'), }
      this.paimentBody.referencePaiement = this.formPayment.get("rib").value ? this.formPayment.get("rib").value : null
  
      this.paimentBody.auditUser = sessionStorage.getItem('userId')
  
      this.sinistresService.paiement(this.route.snapshot.paramMap.get('codeGarantie'), this.route.snapshot.paramMap.get('codeReserve'), this.paimentBody).subscribe({
        next: (reglement: any) => {
          this.sinistresService.getReglement(reglement.idSinistreOp).subscribe({
            next: (data: any) => {              
              let his = {
                contrat: reglement?.sinistreReserve?.sinistre?.contratHistorique?.idContrat?.idContrat,
                dateEffet: reglement?.sinistreReserve?.sinistre?.dateDeclaration
              }
      
              reglement?.typeOp?.code == "OPA" ? this.sinistresService.outputIndemnisation(data) : '';
      
              this.sinistresService.historiqueAvenant(his).subscribe({
                next: (historique: any) => {
                  
                  if (reglement?.statut?.code == "CP421") {
                    this.sinistresService.getOpById(reglement.idSinistreOp).subscribe({
                      next: (dataOP: any) => {
                        this.sinistresService.outputOp(data, historique,dataOP) 
                       },
                      error: (error) => { console.log(error); }
                    })
                  }
                  Swal.fire({
                    title: "paiement executé avec succées",
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: `Confirmer`,
                    width: 400
                  }).then((result) => {
                    if (result.isConfirmed) {
                      if(this.codeProduit=='96'){
                        this.router.navigate(['/gestion-sinistre/dommage/96/mrh/gestionnaire-sinistre/dommage/'+this.codeSinistre+'/'+this.statusSinistre+'/reserve-paiement'],{ relativeTo: this.route });}
  
                     // this.router.navigate(['../../../../'], { relativeTo: this.route });
                     if(this.codeProduit=='45A'){
                      this.router.navigate(['/gestion-sinistre/45A/automobileMono/gestionnaire-sinistre/'+this.codeSinistre+'/'+this.statusSinistre+'/reserve-paiement'],{ relativeTo: this.route });
                    }else if(this.codeProduit=='45F'){
                      this.router.navigate(['/gestion-sinistre/45F/automobilFlotte/gestionnaire-sinistre/'+this.codeSinistre+'/'+this.statusSinistre+'/reserve-paiement'],{ relativeTo: this.route });
                    }
                    }
                  })
                },
                error: (error) => { console.log(error); }
              })
            
          },
          error: (error: any) => {
            console.log(error);
          }
        });
        
  
  
  
        },
       
        error: (error) => {
          console.log("error ", error);
          Swal.fire({
            title: error?.messageStatut ? error?.messageStatut : error,
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: `Ok`,
            width: 400
          })
  
          this.errorCheck = true
          this.formPayment.disabled()
          console.log(error);
  
        }
      })
    }
  }
  goBack(){    
   
    this.router.navigate(['../../../../../'+'gestion-op'], { relativeTo: this.route });

  }
}
