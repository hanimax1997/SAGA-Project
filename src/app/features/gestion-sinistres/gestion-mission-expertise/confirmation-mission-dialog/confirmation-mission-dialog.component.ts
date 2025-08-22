import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-confirmation-mission-dialog',
  templateUrl: './confirmation-mission-dialog.component.html',
  styleUrls: ['./confirmation-mission-dialog.component.scss']
})
export class ConfirmationMissionDialogComponent {
  constructor(private router: Router, private route: ActivatedRoute,public dialogRef: MatDialogRef<ConfirmationMissionDialogComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,) { }
  formMotif: FormGroup | any;
  typeConfirmation: any
  codeProduit: any
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  ngOnInit(): void {
 
    this.typeConfirmation = this.data.type
    this.formMotif = this.formBuilder.group({
      motif: ['', [Validators.required]],
    });

    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })

    if(!roleExist) this.router.navigate(['/dashboard'])
  }
  submitResponse() {
    if (this.formMotif.valid && this.typeConfirmation == "S11") {

      this.dialogRef.close({ data: { "type": this.typeConfirmation, "data": this.formMotif.get('motif').value } })

    } else if (this.typeConfirmation != "S11")
      this.dialogRef.close({ data: { "type": this.typeConfirmation, "data": "" } })

  }
}
