import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Avenant } from 'src/app/core/models/avenant';
import { Duree } from 'src/app/core/models/duree';
import { FamilleProduit } from 'src/app/core/models/famille-produit';
import { Fractionnement } from 'src/app/core/models/fractionnement';
import { pack0 } from 'src/app/core/models/pack0';
import { ParamRisque } from 'src/app/core/models/param-risque';
import { ParamRisqueProduit } from 'src/app/core/models/param_risque_produit';
import { Produit } from 'src/app/core/models/produit';
import { Questionnaires } from 'src/app/core/models/questionnaires';
import { ReseauDistribution } from 'src/app/core/models/reseau-distribution';
import { Taxe } from 'src/app/core/models/taxe';
import { TYPERISQUE } from 'src/app/core/models/type-risque';
import { AvenantService } from 'src/app/core/services/avenant.service';
import { DureeService } from 'src/app/core/services/duree.service';
import { FamilleProduitService } from 'src/app/core/services/famille-produit.service';
import { FractionnementService } from 'src/app/core/services/fractionnement.service';
import { PackService } from 'src/app/core/services/pack.service';
import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
import { ProduitService } from 'src/app/core/services/produit.service';
import { QuestionnairesService } from 'src/app/core/services/questionnaires.service';
import { ReseauDistributionService } from 'src/app/core/services/reseau-distribution.service';
import { TaxeService } from 'src/app/core/services/taxe.service';
import { TypeRisqueService } from 'src/app/core/services/type-risque.service';
import { Consultation } from 'src/app/features/consultation/consultation';
import { produitConsultation } from '../model-produit';
import { param_produit } from '../param-risque-produit';
import { EditParmRisqueDialogComponent } from './edit-parm-risque-dialog/edit-parm-risque-dialog.component';
import { paramDetailProduitNumerique,paramDetailProduitString } from '../param-risque-detail-produit';
import { ShowParamRisqueDialogComponent } from './show-param-risque-dialog/show-param-risque-dialog.component';
import Swal from 'sweetalert2'
import * as moment from 'moment';

@Component({
  selector: 'app-create-new-product',
  templateUrl: './create-new-product.component.html',
  styleUrls: ['./create-new-product.component.scss']
})
export class CreateNewProductComponent implements OnInit {


  formCreationProduit: FormGroup|any;

  ProduitCreationSuccess=false;
  minDate = new Date();
  fractionnement = 'Non'
  idCodeProduit: number | undefined;
  ProduitCreationError=false;
  choixParamProduit : string[]= ['Oui','Non'];
  messageError: string;
  displayedColumns: string[] = ['actif', 'libelle', 'description', 'dateDebut', 'action'];
  displayedColumnsTaxes: string[] = ['id', 'description', 'Valeur'];
  dataSource: MatTableDataSource<Produit>|any;
  dataSourceFamilleProduit: MatTableDataSource<FamilleProduit>|any;
  dataSourceTypeRisque: MatTableDataSource<TYPERISQUE>|any;
  dataSourceParamRisque: MatTableDataSource<ParamRisque>|any;
  dataSourceReseauDistribution: MatTableDataSource<ReseauDistribution>|any;
  dataSourceDureeQuestionnaire: MatTableDataSource<Questionnaires>|any;
  dataSourceAvenant: MatTableDataSource<Avenant>|any;
  dataSourcePack: MatTableDataSource<pack0>|any;
  dataSourceDuree: MatTableDataSource<Duree>|any;
  dataSourceTaxes : MatTableDataSource<Taxe>|any;
  dataSourceFractionnement: MatTableDataSource<Fractionnement>|any;
  lengthColumns = this.displayedColumns.length;
  boolenFractionnement: boolean = false;
  produits: Produit[] = [];
  produit: Produit;
  step: boolean = true;
  questionnaire: Produit;
  idTypeRisque : number|null;
  paramTypeRisque: ParamRisque|undefined;
  consultations: produitConsultation[] = param_produit;
  selectedReseau: number[];
  selectedTaxes: number[];
  listeReseauSelected : ReseauDistribution[]|any;
  tableAremplirReseau : ReseauDistribution[]|any;
  elementDistribution : ReseauDistribution |undefined
  detailRisqueProduit: ParamRisqueProduit[] =[]
  dictionnaireValeur: produitConsultation[] = paramDetailProduitString;
  listetaxes : Taxe[]|any;
  tableAremplirTaxe : Taxe[]|any;
  elementtaxe : Taxe |undefined
  ProduitJson: Produit


  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;


  constructor(
    private formBuilderAuth: FormBuilder,
    private produitService: ProduitService,
    private router: Router,
    private familleProduitService: FamilleProduitService,
    private typeRisqueService : TypeRisqueService,
    private paramRisqueService : ParamRisqueService,
    private  reseauDistributionService:ReseauDistributionService,
    private taxeService : TaxeService,
    private dureeService : DureeService,
    private questionnaireService : QuestionnairesService,
    private packService: PackService,
    private fractionnementService: FractionnementService,
    private avenantService: AvenantService,
    
    
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.formCreationProduit = this.formBuilderAuth.group({
      codeProduit:['', [Validators.required]],
      description: ['', [Validators.required]],
      dateDebut: [new Date, [Validators.required]],
      dateFin: [''],
      auditUser: ['test'],
      idFamilleProduit:[''],
      multirisque:[51, [Validators.required]],
      devis:[51, [Validators.required]],
      devisEnLigne:[51, [Validators.required]],
      souscriptionEnLigne:[51, [Validators.required]],
      payPrint:[51, [Validators.required]],
      gestionDeSinistre:[51, [Validators.required]],
      bonusMalus:[51, [Validators.required]],
      prunning:[51, [Validators.required]],
      capping:[51, [Validators.required]],
      gestionDeSinistreLigne:[51, [Validators.required]],
      convetion:[51, [Validators.required]],
      fractionnement:[51, [Validators.required]],
      codificationNationale:['', [Validators.required]],
      multiRisque:[''],
      idTypeRisqueProduit:[[], [Validators.required]],
      idTypeFractionnements:[[]],
      idReseaux:[[], [Validators.required]],
      idTaxes:[[], [Validators.required]],
      idDurees:[[], [Validators.required]],
      idQuestionnaires: [[]],
      idPacks:[[], [Validators.required]],
      idTypeAvenants:[[], [Validators.required]],
      paramProduit: [[]],
      paramRisqueWorkflows: [[]],
      paramRisqueProduits: [[]],
    });

    this.getAllFamilleProduit();
    this.getAllTypeRisque();
    this.getAllReseauDistribution();
    this.getAllTaxes();
    this.getAllDuree();
    this.getAllQuestionnaires();
    this.getAllPacks();
    this.getAllFractionnement();
    this.getAllAvenant();
  }

  changeFractionnement() {

    if(this.formCreationProduit.value.fractionnement == 50){
      this.formCreationProduit.get('idTypeFractionnements').setValidators(Validators.required);    
    } else {
      this.formCreationProduit.get('idTypeFractionnements').clearValidators();   
    }
    this.formCreationProduit.get('idTypeFractionnements').updateValueAndValidity();
  }

  back() {
    this.router.navigateByUrl("gestion-produits/gestion-produit-risque");
  }

  debutDateChange(value: any) {
    this.minDate = value

  }

  getAllFamilleProduit()
  {
    this.familleProduitService.getFamilleProduitsList().subscribe({
      next: (data: any) => {
        this.dataSourceFamilleProduit = new MatTableDataSource(data);

        console.table(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getAllPacks()
  {
    this.packService.getAllPack().subscribe({
      next: (data: any) => {
        this.dataSourcePack = new MatTableDataSource(data);
        console.table(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getAllTypeRisque()
  {
    this.typeRisqueService.getTypeRisqueList().subscribe({
      next: (data: any) => {
        this.dataSourceTypeRisque = new MatTableDataSource(data);
        console.table(`Hello world : ${data}`);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getAllReseauDistribution()
  {
    this.reseauDistributionService.getAllReseauDistribution().subscribe({
      next: (data: any) => {
        this.listeReseauSelected=data
        this.dataSourceReseauDistribution = new MatTableDataSource(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getAllTaxes()
  {
    this.taxeService.getTaxesList().subscribe({
      next: (data: any) => {
        this.listetaxes=data
        this.dataSourceTaxes = new MatTableDataSource(data);
        this.paginateTaxe();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  
  getAllFractionnement()
  {
    this.fractionnementService.getAllFractionnement().subscribe({
      next: (data: any) => {
        this.dataSourceFractionnement = new MatTableDataSource(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  getAllAvenant()
  {
    this.avenantService.getTypeAvenant().subscribe({
      next: (data: any) => {
        this.dataSourceAvenant = new MatTableDataSource(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getAllDuree()
  {
    this.dureeService.getAllDuree().subscribe({
      next: (data: any) => {
        this.dataSourceDuree = new MatTableDataSource(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getAllQuestionnaires()
  {
    this.questionnaireService.getAllQuestionnaires().subscribe({
      next: (data: any) => {
        this.dataSourceDureeQuestionnaire = new MatTableDataSource(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  getParamRisqueById(idParam:number){
    this.paramRisqueService.getParamRisqueByTypeRisque(idParam).subscribe({
      next: (data: any) => {
        this.dataSourceParamRisque = new MatTableDataSource(data);
        this.detailRisqueProduit=[]
        this.dataSourceParamRisque.data?.forEach((element : ParamRisque) => {
          this.detailRisqueProduit.push({
            idParam: element.idParamRisque,
            paramRisqueWorkflows: [],
            paramRisqueProduits: []
          })
        });
        this.paginateParamRisque();
      },
      error: (error) => {
        console.log(error);
      }
    });
    
  }
  
  onChangeEvent(event: any){
    if(event.value==1) {
      this.boolenFractionnement=true
    }else{
      this.boolenFractionnement=false
    }
  }

  onChangeEventTypeRisque(event : any){
      this.idTypeRisque=event.value
      this.getParamRisqueById(event.value)
  }

  onChangeEventReseauDistribution(event : any){
    this.selectedReseau=event.value
    this.tableAremplirReseau=[];
    for(let i=0;i<this.selectedReseau.length ;i++)
    {
      this.elementDistribution = this.listeReseauSelected.find( (element: any)  => element.idReseau ===this.selectedReseau[i])
      this.tableAremplirReseau.push(this.elementDistribution)
    }
    
  }

  onChangeEventTaxes(event : any){
    this.selectedTaxes=event.value
    this.tableAremplirTaxe=[];
    for(let i=0;i<this.selectedTaxes.length ;i++)
    {
      this.elementtaxe = this.listetaxes.find( (element: any)  => element.idTaxe ===this.selectedTaxes[i])
      this.tableAremplirTaxe.push(this.elementtaxe)
    }
    
  }

  condition(element: any): boolean {
    if(this.formCreationProduit.value.paramRisqueProduits?.filter((produit: any) => produit.paramRisque.idParamRisque == element.idParamRisque).length != 0) return true; else return false;
  }

  openDialogViewParam(idParam :any){
    const dialogRef = this.dialog.open(ShowParamRisqueDialogComponent, {
      width: '60%',
      data: {
        paramRisqueProduit: this.formCreationProduit.value.paramRisqueProduits.filter((produit: any) => produit.paramRisque.idParamRisque == idParam.idParamRisque && produit.valeur != ""),
        paramRisqueWorkflows: this.formCreationProduit.value.paramRisqueWorkflows.filter((workflow: any) => workflow.paramRisque.idParamRisque == idParam.idParamRisque)
      }
    })
     dialogRef.afterClosed().subscribe(
      data => {
      }
     ); 
  }

  openDialogEditParam(idParam :any){
    if(idParam.typeChamp.code=='L03'){
      this.dictionnaireValeur=paramDetailProduitNumerique
    }
    const dialogRef = this.dialog.open(EditParmRisqueDialogComponent, {
      width: '60%',
      data: {
        idParam: idParam,
      }
    })
     dialogRef.afterClosed().subscribe(
      data => {
        this.detailRisqueProduit.forEach((element:any, index:number) => {
          if(element.idParam == data.paramRisque.idParamRisque) {
            this.dictionnaireValeur.forEach(dict => {
              this.formCreationProduit.value.paramRisqueProduits.push({
                paramRisque: data.paramRisque,
                iddictionnaire: dict,
                valeur: data[dict.libelle]
              })
            })

            data.workflows.forEach((work: any) => {
              this.formCreationProduit.value.paramRisqueWorkflows.push({
                paramRisque: data.paramRisque,
                dictionnaire: work,
                obligatoire: data.mondatory.includes(work.idParam),
                enabled: true
              })
            });
          }
        });        
      }
     ); 
  }

  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  paginateTaxe(){
    this.dataSourceTaxes.paginator = this.paginator;
    this.dataSourceTaxes.sort = this.sort;
  }

  paginateParamRisque() {
    this.dataSourceParamRisque.paginator = this.paginator;
    this.dataSourceParamRisque.sort = this.sort;
  }
  
  submit(){
    this.formCreationProduit.get("dateDebut").setValue(moment(this.formCreationProduit.get("dateDebut").value).format('YYYY-MM-DD'))

    this.ProduitJson=this.formCreationProduit.value
    this.consultations.forEach((element : produitConsultation) => {
      this.ProduitJson.paramProduit.push({
        idParamProduit: element.idParamProduit,
        reponse: this.formCreationProduit.value[element.libelle]
      })
    });
    this.produitService.addProduit(this.ProduitJson).subscribe(
      (data: any) => {
        if(data.idCodeProduit != undefined)
        {
          console.table(data);
          Swal.fire(
            `Produit N°${data.idCodeProduit} créé avec succés`,
            '',
            'success'
          )
          this.back();
        }
        else
        {
          data.ErreurMessage ? this.messageError = data.ErreurMessage : this.messageError = data.message;
          Swal.fire(
            this.messageError,
            '',
            'error'
          )
        }
      },
      
    )
  }

  

}
