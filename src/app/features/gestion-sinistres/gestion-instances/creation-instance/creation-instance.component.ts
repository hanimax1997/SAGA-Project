import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Instance, InstanceDocuments } from 'src/app/core/models/sinistre';
import { GenericService } from 'src/app/core/services/generic.service';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { GestionInstancesComponent } from '../gestion-instances.component';

@Component({
  selector: 'app-creation-instance',
  templateUrl: './creation-instance.component.html',
  styleUrls: ['./creation-instance.component.scss']
})
export class CreationInstanceComponent implements OnInit {
  @Input() jsonOp: any;
  @ViewChild(GestionInstancesComponent) child:GestionInstancesComponent;

  formInstance: FormGroup | any;
  documents: FormArray;
  typeInstancesArray: any = []
  documentArray: any = []
  statuDocumentArray: any = []
  LoaderInstance = false
  codeSinistre: any;
  codeProduit: any;
  instance = new Instance()
  typeDecompte: any
  idDecompte: any
  dataSourceDocuments = new MatTableDataSource()
  documentsArray: any = []
  addInstanceArray: any = []
  displayedColumns: string[] = ['typeInstance', 'typeDocument', 'statutDocument', 'descriptionDocument']
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  constructor(private router: Router, private route: ActivatedRoute, private sinistresService: SinistresService, private genericService: GenericService, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.addInstanceArray.instanceDocuments = []
    this.instance.instanceDocuments = []

    this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre')
    this.typeDecompte = this.route.snapshot.paramMap.get('typeDecompte')
    // this.idDecompte = this.route.snapshot.paramMap.get('idDecompte')
    this.initFormInstance()
    this.getDictionnaire()
    this.getCodeProduit();

  }

  getCodeProduit(){

    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => { 
  
        this.codeProduit= data.produit.codeProduit;
      
         let roleExist = false;
        this.roleUser.find((r: any) => {
          if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
            roleExist = true;
            return;
          }
        })

        if(!roleExist) this.router.navigate(['/dashboard'])
        
        },
         
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getDictionnaire() {
    // get type instances
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C70").idCategorie).subscribe(data => {
      this.typeInstancesArray = data;
    })
    // get statut documents
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C71").idCategorie).subscribe(data => {
      this.statuDocumentArray = data;
    })
  }
  initFormInstance() {
    this.formInstance = this.formBuilder.group({
      typeInstance: ['', [Validators.required]],     
      typeDocumentList: ['', [Validators.required]],     
      documents: new FormArray([]),
    });
  }
  createDocument(documentDesc: any): FormGroup {
    return this.formBuilder.group({
      type: [{ value: documentDesc.description, disabled: true }],
      idType: [{ value: documentDesc.idParam, disabled: false }],   
      description: ['', [Validators.required]],
    });
  }
  addDocument(document: any): void {


    if (!this.documentsArray.some((doc: any) => doc.idParam === document.idParam)) {
      this.documentsArray.push(document)
      this.documents = this.formInstance.get('documents') as FormArray;
      this.documents.push(this.createDocument(document));
    } else {      
      this.documentsArray = this.documentsArray.filter((doc: any) => doc.idParam != document.idParam);
      this.documents.removeAt(this.documents.value.findIndex((doc: any) => doc.idType == document.idParam));
    }
  }

  changeTypeInstance(typeInstance: any) {  
    this.sinistresService.getByLien(typeInstance.idParam).subscribe({
      next: (data: any) => {
        (this.formInstance.controls['documents'] as FormArray).clear()
        this.documentArray = data;
       if(this.codeProduit == '96' && typeInstance.idParam =='446'){
          const codesToKeep = ["CP493", "CP509", "CP493","CP502","CP495","CP497","CP499","CP496","CP492"];

// Filtrer les objets en fonction des codes spécifiés
 this.documentArray = this.documentArray.filter((item:any) => codesToKeep.includes(item.code));

        }
//on doit rajouter le code 
        if(this.codeProduit == '95' && typeInstance.idParam =='446'){
          const codesToKeep = ["CP493", "CP509", "CP493","CP502","CP495","CP497","CP499","CP496","CP492"];

// Filtrer les objets en fonction des codes spécifiés
 this.documentArray = this.documentArray.filter((item:any) => codesToKeep.includes(item.code));

        }


        if((this.codeProduit == '96'|| this.codeProduit == '95') && typeInstance.idParam =='447'){
          const codesToKeep = ["CP518", "CP519", "CP516","CP517","CP514","CP520","CP521"];

// Filtrer les objets en fonction des codes spécifiés
 this.documentArray = this.documentArray.filter((item:any) => codesToKeep.includes(item.code));

        }

        if((this.codeProduit == '96' || this.codeProduit == '95') && typeInstance.idParam =='448'){
          const codesToKeep = ["CP510", "CP513", "CP512"];

// Filtrer les objets en fonction des codes spécifiés
 this.documentArray = this.documentArray.filter((item:any) => codesToKeep.includes(item.code));

        }
  


      },
      error: (error) => {
        console.log(error);
      }
    })

  }
  addInstance(formDirective: any) {

    if (this.formInstance.valid) {
      this.LoaderInstance = true;
      let tabTemp = this.formInstance.get("typeDocumentList").value
      // this.addInstanceArray.instanceDocuments = []
      let documentsTemp: any
      this.documents.value.filter((docForm: any) => {
        documentsTemp = new InstanceDocuments()
        documentsTemp.typeInstance = this.formInstance.get("typeInstance").value;
        let descriptionTemp = ''


        tabTemp.map((typeDoc: any) => {
          if (typeDoc.idParam == docForm.idType)
            descriptionTemp = typeDoc.description
        })
        documentsTemp.document = {
          "idParam": docForm.idType,
          "description": descriptionTemp
        }
        documentsTemp.statutDocument = {
          "idParam": this.statuDocumentArray.filter((statut: any) => statut.code == 'CP471')[0].idParam,
          "description": this.statuDocumentArray.filter((statut: any) => statut.code == 'CP471')[0].description
        }
        documentsTemp.description = docForm.description
        documentsTemp.dateDebut = new Date()
        //EXP check 

        if (this.addInstanceArray.instanceDocuments.length != 0) {
          let typeInstanceExist = this.addInstanceArray.instanceDocuments.some((docTab: any) => docTab.typeInstance.idParam === documentsTemp.typeInstance.idParam);

          if (typeInstanceExist) {
            let documentExist = this.addInstanceArray.instanceDocuments.some((docTab: any) => docTab.document.idParam === docForm.idType);

            if (documentExist) {
              Swal.fire(
                `Document déjà existant`,
                '',
                'error'
              );
            } else {

              this.addInstanceArray.instanceDocuments.push(documentsTemp);
              this.documentsArray = [];
            }

          } else {
            this.addInstanceArray.instanceDocuments.push(documentsTemp)
            this.documentsArray = []
          }

        } else {

          this.addInstanceArray.instanceDocuments.push(documentsTemp)
          this.documentsArray = []
        }
      })
      this.dataSourceDocuments.data = this.addInstanceArray.instanceDocuments
      this.dataSourceDocuments.paginator = this.paginator;

      this.LoaderInstance = false;
      this.initFormInstance()
    } 
  }
  goBack() {
    let statutSinistre: any
    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {

        statutSinistre = data.statut.code
        this.router.navigate(['gestion-sinistre/' + this.route.snapshot.paramMap.get('codeSinistre')+'/'+statutSinistre+ '/reserve-paiement']);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  submitInstance() {
    if(this.dataSourceDocuments.data.length != 0)
    {
      this.LoaderInstance = true
  
      // this.instance.description = this.formInstance.get("description").value
      this.instance.dateOuverture = new Date()
      this.instance.auditUser = sessionStorage.getItem("userId")
      if (this.typeDecompte == 'PV') {
        this.instance.decompteOp = { 
          "typeOp": this.jsonOp.typeOp,
          "decomptePv": this.jsonOp.calculateur,
          "sinistrePersonne": this.jsonOp.sinistrePersonne,
          "typeBenificiaire": this.jsonOp.typeBenificiaire,
          "benificiaire": this.jsonOp.beneficiaire,
          "nom": this.jsonOp.nom,
          "prenom": this.jsonOp.prenom,
          "referenceDocument": this.jsonOp.referenceDocument,
          "montantTTC": this.jsonOp.montantTTC,
          "auditUser": sessionStorage.getItem('userId')
        }
      }
      else {
        this.instance.decompteOp = { 
          "typeOp": this.jsonOp.typeOp,
          "decomptePv": null,
          "sinistrePersonne": this.jsonOp.sinistrePersonne,
          "typeBenificiaire": this.jsonOp.typeBenificiaire,
          "benificiaire": this.jsonOp.beneficiaire,
          "nom": this.jsonOp.nom,
          "prenom": this.jsonOp.prenom,
          "referenceDocument": this.jsonOp.referenceDocument,
          "montantTTC": this.jsonOp.montantTTC,
          "auditUser": sessionStorage.getItem('userId')
        }
      }
  
  
      // this.instance.instanceDocuments = []
  
      // this.instance.instanceDocuments.typeInstance = { "idParam": this.formInstance.get("typeInstance").value.idParam }
      // let documentsTemp: any
      // this.documents.value.filter((docForm: any) => {
      //   documentsTemp = new InstanceDocuments()
      //   documentsTemp.document = { "idParam": docForm.idType }
      //   documentsTemp.statutDocument = { "idParam": docForm.statut }
      //   documentsTemp.description = docForm.description
      //   documentsTemp.dateDebut = new Date()
      //   documentsTemp.typeInstance = { "idParam": this.formInstance.get("typeInstance").value.idParam }
      //   this.instance.instanceDocuments.push(documentsTemp)
      // })
  
      this.instance.instanceDocuments = this.addInstanceArray.instanceDocuments
      this.instance.instanceDocuments.forEach((element: any) => {
        element.typeInstance.idParam = element.typeInstance.idParam
      });
  
      this.sinistresService.addInstance(this.instance, this.codeSinistre, this.route.snapshot.paramMap.get('codeGarantie'), this.route.snapshot.paramMap.get('codeReserve')).subscribe({
        next: (data: any) => {
          this.child.getAllInstanes();
          Swal.fire({
            title: "Instance créer avec succées",
            icon: 'success',
            allowOutsideClick: false,
            confirmButtonText: `OK`,
            width: 400
          }).then((result) => {
            if (result.isConfirmed) {
              
            }
          })
          this.LoaderInstance = false
        },
        error: (error) => {
          this.LoaderInstance = false
          Swal.fire(
            error.messageStatut,
            '',
            'error'
          )
          console.log(error);
        }
      })
    }
    else
    {
      Swal.fire(
        "Vous ne pouvez pas créer d'instance sans document",
        '',
        'error'
      )
    }
  }
}
