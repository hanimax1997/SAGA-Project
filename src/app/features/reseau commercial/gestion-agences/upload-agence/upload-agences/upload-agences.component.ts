import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AgencesService } from 'src/app/core/services/agences.service';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-agences',
  templateUrl: './upload-agences.component.html',
  styleUrls: ['./upload-agences.component.scss']
})
export class UploadAgencesComponent {
  constructor(private vehiculeService:VehiculeService,private agencesService:AgencesService,private router: Router ,private formBuilder:FormBuilder,public dialogRef: MatDialogRef<UploadAgencesComponent>) { }
  formUploadSap: FormGroup | any;
  listAgence:any;
  header: string
  ngOnInit(): void {
    this.getAllAgence()
    this.formUploadSap = this.formBuilder.group({
      agences:["",[Validators.required]]
    });
  }
  getAllAgence() {
    this.agencesService.getAllAgenceDetails().subscribe({
      next: (data: any) => {
        this.listAgence = data
      },

      error: (error) => {
        console.log(error);
      },
    });
  }
 
  submitForm() :void {
    const agences = this.formUploadSap.controls.agences.value
    const transformedObject = {
      agenceid: Object.values(agences)
  };
    this.agencesService.uploadAgenceToSapBP(transformedObject).subscribe({
      next: (response: Blob) => {
        // Créer un URL Blob pour télécharger le fichier
        const blob = new Blob([response], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sap_bp_${new Date().toISOString().slice(0, 10)}.txt`; // Nom du fichier
        a.click();
        window.URL.revokeObjectURL(url); // Libérer l'URL Blob
    
        // Swal.fire('Les agences ont été créées avec succès', '', 'success');
        this.dialogRef.close();
      },
      error: (error) => {
        Swal.fire("Une erreur s'est produite lors de la création", '', 'error');
        console.log(error);
      },
    });
    this.agencesService.uploadAgenceToSapCC(transformedObject).subscribe({
      next: (response: Blob) => {
        // Créer un URL Blob pour télécharger le fichier
        const blob = new Blob([response], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sap_cc_${new Date().toISOString().slice(0, 10)}.txt`; // Nom du fichier
        a.click();
        window.URL.revokeObjectURL(url); // Libérer l'URL Blob
    
        // Swal.fire('Les agences ont été créées avec succès', '', 'success');
        this.dialogRef.close();
      },
      error: (error) => {
        Swal.fire("Une erreur s'est produite lors de la création", '', 'error');
        console.log(error);
      },
    });
    this.agencesService.uploadAgenceToSapCO(transformedObject).subscribe({
      next: (response: Blob) => {
        // Créer un URL Blob pour télécharger le fichier
        const blob = new Blob([response], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sap_co_${new Date().toISOString().slice(0, 10)}.txt`; // Nom du fichier
        a.click();
        window.URL.revokeObjectURL(url); // Libérer l'URL Blob
    
        Swal.fire('Les agences ont été créées avec succès', '', 'success');
        this.dialogRef.close();
      },
      error: (error) => {
        Swal.fire("Une erreur s'est produite lors de la création", '', 'error');
        console.log(error);
      },
    });
}

}