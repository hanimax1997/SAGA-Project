import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ShowParamRisqueDialogComponent } from '../create-new-product/show-param-risque-dialog/show-param-risque-dialog.component';
import { produitConsultation } from '../model-produit';
import { param_produit } from '../param-risque-produit';

@Component({
  selector: 'app-consultation-produit',
  templateUrl: './consultation-produit.component.html',
  styleUrls: ['./consultation-produit.component.scss']
})
export class ConsultationProduitComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator| any;
  @ViewChild(MatSort) sort: MatSort| any;
  constructor(
    private formBuilderAuth: FormBuilder,
    private produitService : ProduitService,
    private familleProduitService: FamilleProduitService,
    private taxeService: TaxeService,
    private reseauDistributionService : ReseauDistributionService,
    private questionnaireService: QuestionnairesService,
    private dureeService : DureeService,
    private avenantService : AvenantService,
    private fractionnementService: FractionnementService,
    private packService : PackService,
    private paramRisqueService : ParamRisqueService,
    private typeRisqueService: TypeRisqueService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  formConsulationProduit: FormGroup|any;
  selectedProduct : Produit|undefined
  dataSourceFamilleProduit: MatTableDataSource<FamilleProduit>|any;
  dataSourceReseauDistribution: MatTableDataSource<ReseauDistribution>|any;
  dataSourceAvenant: MatTableDataSource<Avenant>|any;
  dataSourceFractionnement: MatTableDataSource<Fractionnement>|any;
  dataSourceDureeQuestionnaire:MatTableDataSource<Questionnaires>|any;
  dataSourcePack:MatTableDataSource<pack0>|any;
  dataSourceDuree:MatTableDataSource<Duree>|any;
  dataSourceParamRisque: MatTableDataSource<ParamRisque>|any;
  dataSourceTypeRisque: MatTableDataSource<TYPERISQUE>|any;
  consultations: produitConsultation[] = param_produit;
  listetaxes : Taxe[]|any;
  dataSourceTaxes : MatTableDataSource<Taxe>|any;
  selectedTaxes: number[];
  tableAremplirTaxe : Taxe[]|any=[];
  elementtaxe : Taxe |undefined;
  listeTaxe: number[]|any=[];
  listeReseau: number[]|any=[];
  listeQuestionnaire: number[]|any=[];
  listeDuree: number[]|any=[];
  listePack: number[]|any=[];
  listeAvenant: number[]|any=[];
  idTypeRisque : number|null;
  listeFractionnement: number[]|any=[];
  listeReseauSelected : ReseauDistribution[]|any;
  displayedColumnsTaxes: string[] = ['id', 'description', 'Valeur'];
  displayedColumnsParam: string[] = ['actif' ,'libelle', 'description', 'dateDebut', 'action'];
  lengthColumns = this.displayedColumnsParam.length;
  lengthColumnsTaxe = this.displayedColumnsTaxes.length;
  detailRisqueProduit: ParamRisqueProduit[] =[];
  

  paramTypeRisque: ParamRisque|undefined;

  ngOnInit(): void {
    let idProduit = this.route.snapshot.paramMap.get('idProduitRisque');
    this.getAllQuestionnaires();
    this.getAllFamilleProduit();
    this.getAllFractionnement();
    this.getAllPacks();
    this.getAllDuree();
    this.getAllTaxes();
    this.getAllAvenant();
    this.getAllReseauDistribution();
    this.getAllTypeRisque();
    this.getProduitById(idProduit);  
}
condition(element: any): boolean {
  if(this.selectedProduct?.paramRisqueProduits?.filter((produit: any) => produit?.paramRisque?.idParamRisque == element?.idParamRisque).length != 0) return true; else return false;
}

openDialogViewParam(idParam :any){
  const dialogRef = this.dialog.open(ShowParamRisqueDialogComponent, {
    width: '60%',
    data: {
      paramRisqueProduit: this.selectedProduct?.paramRisqueProduits.filter((produit: any) => produit.paramRisque.idParamRisque == idParam.idParamRisque && produit.valeur != ""),
      paramRisqueWorkflows: this.selectedProduct?.paramRisqueWorkflows.filter((workflow: any) => workflow.paramRisque.idParamRisque == idParam.idParamRisque)
    }
  })
   dialogRef.afterClosed().subscribe(
    data => {
    }
   ); 
}

back() {
  this.router.navigateByUrl("gestion-produits/gestion-produit-risque");
}

  getProduitById(id : string|null){
    this.produitService.getProduitById(id).subscribe({
      next: (data: any) => {
        this.selectedProduct =data;

        this.selectedProduct?.produitTaxes?.forEach(element => {
          this.listeTaxe.push(element.taxe?.idTaxe) 
          this.tableAremplirTaxe.push(element.taxe)
        });

        this.selectedProduct?.produitReseaux?.forEach(element => {
          this.listeReseau.push(element.reseau?.idReseau) 
        });

        this.selectedProduct?.questionnaires?.forEach(element => {
          this.listeQuestionnaire.push(element.idQuestionnaire) 
        });

        this.selectedProduct?.produitDurees?.forEach(element => {
          this.listeDuree.push(element.duree?.id_duree) 
        });

        this.selectedProduct?.produitTypeAvenants?.forEach(element => {
          this.listeAvenant.push(element.typeAvenant?.idCodeTypeAvenant) 
        });

        this.selectedProduct?.produitTypeFractionnements?.forEach(element => {
          this.listeFractionnement.push(element.typeFractionnement?.idCodeTypeFractionnement) 
        });
        
        this.selectedProduct?.produitPacks?.forEach(element => {
          this.listePack.push(element.idPack0) 
        });

        this.getParamRisqueById(Number (this.selectedProduct?.idTypeRisqueProduit?.idTypeRisque))
        // if (this.selectedProduct?.idTypeRisqueProduit)
        // this.dataSourceParamRisque=new MatTableDataSource(this.selectedProduct?.idTypeRisqueProduit)

        this.selectedProduct?.param_Produit_Reponses.forEach((paramProduitReponse: any) => {
          this.selectedProduct? this.selectedProduct[paramProduitReponse.idParamProduit.libelle as keyof typeof this.selectedProduct] = paramProduitReponse.reponse.idParam:''
        });


        this.formConsulationProduit = this.formBuilderAuth.group({
          codeProduit:[this.selectedProduct?.codeProduit, [Validators.required]],
          codificationNationale:[this.selectedProduct?.codificationNationale, [Validators.required]],
          description: [this.selectedProduct?.description, [Validators.required]],
          idFamilleProduit:[this.selectedProduct?.idFamilleProduit?.id_famille, [Validators.required]],
          dateDebut: [new Date, [Validators.required]],
          dateFin: [''],
          multirisque:[this.selectedProduct?.multirisque, [Validators.required]],
          devis:[this.selectedProduct?.devis, [Validators.required]],
          devisEnLigne:[this.selectedProduct?.devisEnLigne, [Validators.required]],
          souscriptionEnLigne:[this.selectedProduct?.souscriptionEnLigne, [Validators.required]],
          payPrint:[this.selectedProduct?.payPrint, [Validators.required]],
          gestionDeSinistre:[this.selectedProduct?.gestionDeSinistre, [Validators.required]],
          bonusMalus:[this.selectedProduct?.bonusMalus, [Validators.required]],
          prunning:[this.selectedProduct?.prunning, [Validators.required]],
          capping:[this.selectedProduct?.capping, [Validators.required]],
          convetion:[this.selectedProduct?.convetion, [Validators.required]],
          gestionDeSinistreLigne:[this.selectedProduct?.gestionDeSinistreLigne, [Validators.required]],
          fractionnement:['', [Validators.required]],
          multiRisque:['', [Validators.required]],
          produitTaxes: [this.listeTaxe, [Validators.required]],
          produitReseaux: [this.listeReseau, [Validators.required]],
          questionnaires:[this.listeQuestionnaire, [Validators.required]],
          produitDurees:[this.listeDuree, [Validators.required]],
          produitTypeAvenants:[this.listeAvenant, [Validators.required]],
          produitTypeFractionnements:[this.listeFractionnement, [Validators.required]],
          produitPacks:[this.listePack, [Validators.required]],
          idTypeRisqueProduit:[this.selectedProduct?.idTypeRisqueProduit?.idTypeRisque, [Validators.required]],
          
        })

        this.formConsulationProduit.disable()

      },
      error: (error) => {
        console.log(error);
      }
    })
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

  paginateTaxe(){
    this.dataSourceTaxes.paginator = this.paginator;
    this.dataSourceTaxes.sort = this.sort;
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
  paginateParamRisque() {
    this.dataSourceParamRisque.paginator = this.paginator;
    this.dataSourceParamRisque.sort = this.sort;
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

  onChangeEventTypeRisque(event : any){
    this.idTypeRisque=event.value
    this.getParamRisqueById(event.value)
}

}

