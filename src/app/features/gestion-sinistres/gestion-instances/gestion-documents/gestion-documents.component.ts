import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { GenericService } from 'src/app/core/services/generic.service';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gestion-documents',
  templateUrl: './gestion-documents.component.html',
  styleUrls: ['./gestion-documents.component.scss'],
})
export class GestionDocumentsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GestionDocumentsComponent>,
    private sinistresService: SinistresService,
    private genericService: GenericService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  formAddDoc: FormGroup | any;
  formEditDoc: FormGroup | any;
  documentArray: any = [];
  documentInstanceArray: any = [];
  typeInstancesArray: any = [];
  statuDocumentArray: any = [];
  LoaderInstance: any;
  codeProduit: any
  // roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  // sinistreRoles: any = {
  //   "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
  //   "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
  //   "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
  //   "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
  //   "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  // }

  ngOnInit(): void {

    this.LoaderInstance = false;

    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    // let roleExist = false;
    // this.roleUser.find((r: any) => {
    //   if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
    //     roleExist = true;
    //     return;
    //   }
    // })

    // if(!roleExist) this.router.navigate(['/dashboard'])

    this.getDictionnaire();

    this.initDocument();
    this.getDocInstance();
  }
  getDictionnaire() {
    // get type instances
    this.genericService
      .getParam(
        JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
          (parametre: any) => parametre.code == 'C70'
        ).idCategorie
      )
      .subscribe((data) => {
        this.typeInstancesArray = data;
      });
    // get statut documents
    this.genericService
      .getParam(
        JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
          (parametre: any) => parametre.code == 'C71'
        ).idCategorie
      )
      .subscribe((data) => {
        this.statuDocumentArray = data;
      });
  }
  getDocumentList(idTypeInstance:any) {
    this.sinistresService.getByLien(idTypeInstance).subscribe({
      next: (data: any) => {
        this.documentArray = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  initDocument(): FormGroup {
    return (this.formAddDoc = this.formBuilder.group({
      typeDocumentList: ['', [Validators.required]],
      statut: ['', [Validators.required]],
      description: ['', [Validators.required]],
      typeInstance: ['', [Validators.required]],
    }));
  }
  /* 
  createDocument(documentDesc: any): FormGroup {
    //
    return this.formBuilder.group({
      type: [{ value: documentDesc.description, disabled: true }],
      idType: [{ value: documentDesc.idParam, disabled: false }],
      statut: [this.statuDocumentArray.filter((statut: any) => statut.code == 'CP471')[0].idParam, [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
 
  addDocument(document: any): void {

    if (!this.documentsArray.some((doc: any) => doc.idParam === document.idParam)) {
 
      this.documentsArray.push(document)
      this.documents = this.formAddDoc.get('documents') as FormArray;
     // this.documents.push(this.createDocument(document));
    } else {

      this.documentsArray = this.documentsArray.filter((doc: any) => doc.idParam != document.idParam);
      this.documents.removeAt(this.documents.value.findIndex((doc: any) => doc.idType == document.idParam));
    }
   
  }
   */

  getDocInstance() {
    this.sinistresService
      .getInstanceById(this.data.idInstance)
      .subscribe({
        next: (data: any) => {
          this.documentInstanceArray = data.instanceDocument;

        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addDocument() {
    this.LoaderInstance = true;

    let body: any = {};
    body.document = {
      idParam: this.formAddDoc.get('typeDocumentList').value.idParam,
    };  
    body.statutDocument = { idParam: this.formAddDoc.get('statut').value };
    body.description = this.formAddDoc.get('description').value;
    body.typeInstance = { idParam: this.formAddDoc.get('typeInstance').value };
  
    this.dialogRef.close({ data: body });

  }
}
