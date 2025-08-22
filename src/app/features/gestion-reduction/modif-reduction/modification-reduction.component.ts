import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PackService } from 'src/app/core/services/pack.service';
import { AgencesService } from 'src/app/core/services/agences.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReductionJson } from 'src/app/core/models/reduction';
import { PersonneService } from 'src/app/core/services/personne.service';
import { ReductionService } from 'src/app/core/services/reduction.service';
import { ProduitService } from 'src/app/core/services/produit.service';
import { ParamRisqueService } from '../../../core/services/param-risque.service'
import { ParamRisqueProduit } from 'src/app/core/models/param-risque-produit';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { MatStepper } from '@angular/material/stepper';
import { GenericService } from 'src/app/core/services/generic.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { T } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-modification-reduction',
  templateUrl: './modification-reduction.component.html',
  styleUrls: ['./modification-reduction.component.scss']
})
export class ModifReductionComponent implements OnInit {
  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('stepper') private stepper: MatStepper;
  idReduction:any
  reduction:any=[]
  reductionRisque:any=[]
  reductionPack:any=[]
  reductionReady=false
  displayedColumnsReduc: string[] = ['codeReduction', 'nomReduction', 'tauxReduction', 'action'];
  displayedColumns: string[] = ['garantie', 'franchise', 'pourcentage'];
  formInfoGeneral: FormGroup | any;
  infoProduit: FormGroup | any;
  infoVehicule: FormGroup | any;
  infoPack: FormGroup | any;
  VOFormGaranties: FormGroup;
  typeReduction = 0
  loadTablePack = false
  emptyTableReduction = true
  paramReady = false
  step = 0
  idProduit = 0
  idWorkFlow = 263
  garantiePart = false
  minDate = new Date()
  dataSourceGaranties: any = []
  dataSourcePacks = new MatTableDataSource<any>();
  displayedPackColumns: string[] = ['id', 'description', 'dateDebut', 'action'];
  displayedColumnsReductions: string[] = ['nomReduction', 'dateDebut', 'typeProduit', 'action'];
  packs: any = []
  personneMorales: any = []
  garantieTab: any = []
  packsTab: any = []
  paraRisqueProduit: ParamRisqueProduit[] = [];
  reductionList: any = []
  paramRisqueType: any = []
  agences: any = []
  dateDebut = new Date()
  dateFin = new Date()

    dataSourceReduction = new MatTableDataSource(this.reductionList)
  reductionJson = ReductionJson
  typeValeurRisque: any = []
  marques: any = []
  users: any = []
  valeurCategory = ""
  typeProduit: any
  paraRisqueProduitCategory: any[] = []
  mouvements: any[] = []
  typeProduits: any[] = []
  canalDistributions: any[] = []
  dateDebutConvention = new Date()
  errorHandler = {
    "error": false,
    "msg": ""
  }
  codeReduction: any
  dateFinConvention = new Date()
  typeValues = [{ "id": 1, "description": "Valeur" }, { "id": 2, "description": "Intervale" }]
  reductionSuccess: boolean = false;

  isAllCanalDistro: boolean= false;

  isAllUtilisateurs: boolean = false;
  isAllAgences: boolean = false;
  allSelected = false;
selectAllValue = 'ALL';
  packss: any;
  selectedPackss: any[]=[];
  myVals: any;
  checked: { checked: boolean; };
  selectedPacks: any;
  prevUsers: any;
  constructor( private route: ActivatedRoute,private genericService: GenericService, private produitService: ProduitService, private agencesService: AgencesService, private vehiculeService: VehiculeService, private paramRisqueService: ParamRisqueService, private reductionService: ReductionService, private personneService: PersonneService, private router: Router, private routerquery: ActivatedRoute, private packService: PackService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.idReduction = this.route.snapshot.paramMap.get('idReduction');
  
    if (this.router.url.includes('/modification-reduction') || (this.reduction?.typeReduction?.description != "Rétail")) {
      this.typeReduction = 261;
      this.reductionJson.typeReduction = 261;
      this.routerquery.queryParams.subscribe((params: any) => {
        this.dateDebutConvention = new Date(params['dateDebut']);
        this.dateFinConvention = new Date(params['dateFin']);
      });
   

    } else {
      this.typeReduction = 262;
      this.reductionJson.typeReduction = 262;
    

    }
  
    this.getAllProduits();
    this.getAllUsers();
    this.initInfoPack();
    this.getAllAgences();
    this.initInfoProduit();
    this.getMarques();
    this.getMouvements();
    this.canalDistribution();
  
    // ⚠️ Le bon endroit pour initFormGeneral
    this.reductionService.getReductionById(this.idReduction).subscribe({
      next: (datas: any) => {
        console.log('je suis info getreduction', datas);
        this.reductionReady = true;
        this.reduction = datas;
        this.prevUsers = datas.utilisateur;
        this.idProduit = datas?.produit.idCodeProduit
        // this.paraRisqueProduit= datas?.paramList

        this.reductionRisque = this.reduction.paramList;
        this.reductionPack = this.reduction.packList.reduce((x: any, y: any) => {
          (x[y.idPackComplet.idPack0.idPack0] = x[y.idPackComplet.idPack0.idPack0] || []).push(y);
          return x;
        }, {});
        this.reductionPack = Object.values(this.reductionPack);
  
        console.log('je suis users recupereedepuis dats', this.prevUsers);
  
        // ✅ Initialisation du formulaire une fois les données disponibles
        this.initFormGeneral();

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
  

  parseDate(dateString: string | null): Date | null {
    return dateString ? new Date(dateString) : null;
  }
  consultReduction(idReduction:any){
    this.router.navigate(['gestion-reduction/consultation-reduction/' + idReduction ]);

  }
  canalDistribution() {
    //get types champ
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C22").idCategorie).subscribe(data => {
      this.canalDistributions = data;
    })
  }
  initFormGeneral() {
    console.log('ahha je suis le type reduction', this.reduction);
    // corporate
    // const selectedAgences = this.reduction.agences.map((a: any) => a.idAgence?.idAgence);
    const selectedAgences = this.reduction.agences
  .filter((a: any) => a.idAgence && a.idAgence.idAgence !== null && a.idAgence.idAgence !== undefined)
  .map((a: any) => a.idAgence.idAgence);
//pour les utilisateur tu recevanis iialment un tableau de {} et la c'est que les [noms users]only
    const selecteUsers = this.reduction.utilisateur.map((a: any) => a.userid);
    const selecteCanal = this.reduction.canalDistributions.map((a: any) => a.idCanal?.idParam);
    const selecteMove = this.reduction.mouvementPolice.map((a: any) => a.idMouvement?.idParam);

console.log("je suis les users selectionne",selecteUsers)


    if (this.typeReduction == 261) {
      this.formInfoGeneral = this.formBuilder.group({
        nomReduction: [{ value: this.reduction.nomReduction, disabled: true }],
        typeProduit: [{ value: this.reduction.produit?.description, disabled: true }],
        // dateDebut: [this.reduction.dateDebut ? new Date(this.reduction.dateDebut) : null],
        dateDebut: [
          { value: this.reduction.dateDebut ? new Date(this.reduction.dateDebut) : null, disabled: true }
        ],
        
        // dateFin: [this.reduction.dateFin ? new Date(this.reduction.dateFin) : null],
        dateFin: [
          { value: this.reduction.dateFin? new Date(this.reduction.dateFin) : null}
        ],
        // agences: this.reduction.agences?.map((a: any) => a.idAgence) || [],       
        agences: this.reduction.agences?.map((a: any) => a.idAgence).filter((id: any) => (id != null ||id !=undefined)) || [],
         appAutomatique: [this.reduction.appAutomatique],
        mouvementsPolice: [this.reduction.mouvementPolice || []],
        canalDistribution: [this.reduction.canalDistributions || []],
        utilisateurs: [this.reduction.utilisateur || []]
      });
    } else {
      // const selectedAgences = this.reduction.agences.map((a: any) => a.idAgence?.idAgence);
      this.formInfoGeneral = this.formBuilder.group({
        nomReduction: [{ value: this.reduction.nomReduction, disabled: true }],
        typeProduit: [{ value: this.reduction.produit?.description, disabled: true }],
        // dateDebut: [this.reduction.dateDebut ? new Date(this.reduction.dateDebut) : null],
        dateDebut: [
          { value: this.reduction.dateDebut ? new Date(this.reduction.dateDebut) : null, disabled: true }
        ]
,        
dateFin: [
  { value: this.reduction.dateFin? new Date(this.reduction.dateFin) : null}
],
        // dateFin: [this.reduction.dateFin ? new Date(this.reduction.dateFin) : null],
        appAutomatique: [this.reduction.appAutomatique],
        mouvementsPolice: [this.reduction.mouvementPolice || []],
        canalDistribution: [this.reduction.canalDistributions || []],
        utilisateurs: [this.reduction.utilisateur || []],
        // agences: this.reduction.agences?.map((a: any) => a.idAgence) || [],
        agences: this.reduction.agences?.map((a: any) => a.idAgence).filter((id: any) => (id != null ||id !=undefined)) || [],
      });
  
    
    }  
    this.formInfoGeneral.patchValue({
        nomReduction: this.reduction.nomReduction || '',
        dateDebut: this.reduction.dateDebut || '',
        // dateFin: this.dateFinConvention || '',
        dateFin: this.reduction.dateFin || '',

        agences: selectedAgences,
        typeProduit: this.reduction?.produit?.description || '',
        appAutomatique: this.reduction?.appAutomatique || '',
        mouvementsPolice: selecteMove, 
        // this.reduction.mouvementPolice?.map((m: any) => m.idParam) || [],
        canalDistribution:selecteCanal ,
        // This.reduction.canalDistributions?.map((c: any) => c.idParam) || [],
        utilisateurs:selecteUsers
        //  this.reduction.utilisateur?.map((u: any) => u.idUtilisateur.userid) || [],
      });
    console.log('je suis me form apres initialisation', this.formInfoGeneral);
  }

  initInfoVehicule() {
    this.infoVehicule = this.formBuilder.group({

    }); 
    this.reduction.paramList.forEach((rs:any)=>{
      const champ=rs.idParam.libelle.split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.substring(1)).join('')
      if(rs.valeur!=null)
        this.myVals=rs
      console.log('je suis le rs',rs )
      console.log('lenghth de rs.idparam.responsellist',)
 let idparams:any=[]
      if(rs.idParam.reponseList.length!=0){
        rs.idParam.reponseList.forEach((res:any)=>{
          console.log("res ", res);
          idparams.push(res.idParam)
      })
  // const selectedparam = rs.idparam?.reponseList
      this.infoVehicule.addControl(champ, new FormControl(idparams));
      this.infoVehicule.patchValue(champ, (idparams));

      console.log("this.infoVehicule ", this.infoVehicule);

      
       } else{

    
      
        
        if(rs.valMax==0 && rs.valMin==0){
          
          let response1={ "id": 1, "description": "Valeur" } 
           
          this.infoVehicule.addControl("typeValeur"+champ,new FormControl(response1.id))
          this.infoVehicule.patchValue("typeValeur"+champ,(response1.id));
          this.infoVehicule.addControl("valeur",new FormControl(this.myVals))
          // this.infoVehicule.patchValue("valeur",(this.myVals))

     }
        else{
          if(this.myVals.valMax!=0){
            let response2= { "id": 2, "description": "Intervale" }
            console.log('je suis interval',this.myVals.valMax)
        
          this.infoVehicule.addControl("typeValeur"+champ,new FormControl(response2.id))
          this.infoVehicule.patchValue("typeValeur"+champ,(response2.id));
          this.infoVehicule.addControl("i",new FormControl(this.myVals))
          this.infoVehicule.patchValue("i",(this.myVals))
          // this.infoVehicule.patchValue("valMin",(this.myVals.valMin))


        }
       
          }





        
        // this.infoVehicule.addControl(champ,new FormControl(rs))
        // this.infoVehicule.patchValue(champ,(rs))

       } 

      
   
   
    })


      this.reduction.packList.forEach((element:any) => {
        
        this.selectedPackss.push(element.idPackComplet.idPack0)
  
 });

this.checked={checked: true}
this.selectedPacks=this.selectedPackss = this.selectedPackss.filter(
  (value, index, self) =>
    index === self.findIndex(v => v.description === value.description)
);
console.log('je suis les id de la reduction',this.selectedPacks)
this.selectedPacks.forEach((el:any)=>{
  this.onChangePack(el,this.checked)

})


     
   

   this.infoPack.addControl("pack",new FormControl(this.selectedPacks))
   this.infoPack.patchValue("pack",this.selectedPacks)
 this.infoPack.value.pack=this.selectedPacks
 this.infoPack.get("pack")?.disable();

   
   console.log("je suis le pack",this.selectedPacks)
 
    
  
    console.log('Formulaire infoVehicule après initialisation:', this.infoVehicule);
  }
  isPackChecked(pack: any): boolean {
    return this.reduction.packList?.some((p: any) => p.code === pack.code);
  }
  
  initInfoPack() {
    this.infoPack = this.formBuilder.group({
      pack: ['', ],
      VORowsPacks: this.formBuilder.array([]),
    });
  }
  // Méthode pour créer une ligne de pack
  createPackRow(pack: any): FormGroup {
    return this.formBuilder.group({
      description: [pack.idPackComplet?.idPack0.description],
      garanties: this.formBuilder.array(
        pack.garantie ? [this.createGarantieGroup(pack.garantie)] : []
      )
    });
  }
  
  // Méthode pour créer un groupe garantie
  createGarantieGroup(garantie: any): FormGroup {
    return this.formBuilder.group({
      garantie: [garantie.description],
      franchise: [garantie.valeurEnvloppe || ''],
      pourcentage: [garantie.taux],
      isEditable: [false]
    });
  }
  
  // Getter pour VORowsPacks
  // get VORowsPacks(): FormArray {
  //   return this.infoPack.get('VORowsPacks') as FormArray;
  // }
  // VORowsPacks(): FormArray {
  //   return this.infoPack.get("VORowsPacks") as FormArray
  // }
  
  
  
  
  // initInfoVehicule() {
  //   this.infoVehicule = this.formBuilder.group({

  //   });
  // }
  initInfoProduit() {
    this.infoProduit = this.formBuilder.group({
      agence: ['', Validators.required],
      utilisateur: ['', Validators.required],
      // canalDistribution: ['', Validators.required],
    });
  }
  // initInfoPack() {
  //   this.infoPack = this.formBuilder.group({
  //     pack: ['', Validators.required],
  //     VORowsPacks: this.formBuilder.array([]),
  //   });
  // }
  newPack(idPack: any, description: string): FormGroup {
    return this.formBuilder.group({
      idPack: idPack,
      description: description,
      garanties: this.formBuilder.array([])
    })
  }
  newGarantie(garantie: any): FormGroup {
    return this.formBuilder.group({
      idGarantie: new FormControl(garantie.idGarantie),
      idPackComplet: new FormControl(garantie.idPackComplet),
      garantie: new FormControl(garantie.description),
      franchise: new FormControl(garantie.franchise),
      pourcentage: new FormControl(garantie.pourcentage),
      isEditable: new FormControl(false),
      sousGaranties: new FormControl(garantie.sousGaranties),
    });

  }
  getMarques() {
    this.vehiculeService.getAllMarque().subscribe({
      next: (data: any) => {
        this.marques = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getMouvements() {

    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C35").idCategorie).subscribe({
      next: (data: any) => {
        this.mouvements = data

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllUsers() {
    this.genericService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  getAllProduits() {
    this.produitService.getAllProduits().subscribe({
      next: (data: any) => {
        this.typeProduits = data
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  addPackGaranties(packIndex: number, garantie: any) {
console.log('hello je suispackIndex et garantie ',packIndex,garantie )
    this.VORowsGaranties(packIndex).push(this.newGarantie(garantie));
  }
  VORowsPacks(): FormArray {
    return this.infoPack.get("VORowsPacks") as FormArray
  }
  VORowsGaranties(packIndex: number): FormArray {
    return this.VORowsPacks().at(packIndex).get("garanties") as FormArray
  }
  getAllPersonneMorale() {
    this.personneService.getAllPersonneMorale().subscribe({
      next: (data: any) => {
        this.personneMorales = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  // pack 
  getAllPack() {
    
    this.packService.getPackByProduit(this.idProduit).subscribe({
      next: (data: any) => {
        data.map((pack: any) => {
          this.packs.push(pack)

        })
console.log('je suis le pack insert',this.packs)

      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getPack(idPack: any, packIndex: any) {
console.log('tectectettec',idPack,packIndex)
    this.packService.getPackById(idPack).subscribe({
      next: (data: any) => {
        this.garantiePart = true
        this.loadTablePack = true
        this.garantieTab = []
        data.garantie.filter((garantie: any) => {
          let franchise: any = "0"
          garantie.categorieList.filter((category: any) => {
            if (category.description == "franchise") {
              franchise = category.valeur
            }
          })
          let oneGarantie = {
            "idGarantie": garantie.idGarantie,
            "idPackComplet": garantie.idPackComplet,
            "description": garantie.description,
            "franchise": franchise,
            "pourcentage": "0",
            "sousGaranties": garantie.sousGarantieList,
          }
          this.garantieTab.push(
            {
              "idGarantie": garantie.idGarantie,
              "idPackComplet": garantie.idPackComplet,
              "description": garantie.description,
              "franchise": franchise,
              "pourcentage": "0",
            }
          )

          this.addPackGaranties(packIndex, oneGarantie)
        })
        this.initFormGarantie(packIndex)
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  getAllAgences() {
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agences = data
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  initFormGarantie(packIndex: any) {

    // this.garantieTab.map((garantie: any) => {
    //   let garantieLigne = this.formBuilder.group({
    //     idGarantie: new FormControl(garantie.idGarantie),
    //     garantie: new FormControl(garantie.description),
    //     franchise: new FormControl(garantie.franchise),
    //     pourcentage: new FormControl(garantie.pourcentage),
    //     isEditable: new FormControl(false),
    //   });
    //   this.VORows.push(garantieLigne);
    // });

    this.dataSourceGaranties[packIndex] = new MatTableDataSource(this.VORowsGaranties(packIndex).controls);
    // this.form.get('albums') as FormArray
    this.dataSourceGaranties.paginator = this.paginator;
  }
  get VORows() {
    return this.infoPack.controls['VORows'] as FormArray;
  }
  EditGarantieLigne(form: any, index: number) {
    form.get('garanties').at(index).get('isEditable').patchValue(true);
  }
  SaveGarantieLigne(form: any, index: number) {
    form.get('garanties').at(index).get('isEditable').patchValue(false);

  }
  submitReduction() {
    // if (this.formInfoGeneral.valid && this.infoVehicule.valid && this.infoPack.valid && this.infoPack.value.VORowsPacks.length != 0) {
      // this.reductionJson.pack = []
      // this.reductionJson.pack = [this.reduction.packList]
      if (this.typeProduit.codeProduit != "95") {
        this.reductionJson.pack=[]
        this.infoPack.value.VORowsPacks.map((pack: any) => {
          console.log('ehjhgjhgjhvfj',pack)
          pack.garanties.map((garantie: any) => {
            let objectGarantie: any = {
              "idPackComplet": garantie.idPackComplet,
              "taux": garantie.pourcentage,
              "franchise": garantie.franchise
            }
            console.log('jkghllljkhj',this.reductionJson.pack)
            
            this.reductionJson.pack.push(objectGarantie);
          })
        })
      } else {
        this.infoPack.value.VORowsPacks.map((pack: any) => {
          pack.garanties.map((garantie: any) => {

            let tabSousGaranties: any = []
            garantie.sousGaranties.map((sg: any) => {
              tabSousGaranties.push({
                "idPackComplet": sg.idPackComplet
              })
            })

            let objectGarantie: any = {
              "idPackComplet": garantie.idPackComplet,
              "taux": garantie.pourcentage,
              "franchise": garantie.franchise,
              "sousGaranties": tabSousGaranties
            }
            this.reductionJson.pack.push(objectGarantie);
            this.reductionJson.idReduction=this.reduction.idReduction
          })
        })
      }

      this.reductionService.addReduction(this.reductionJson).subscribe({
        next: (data: any) => {
          this.reductionSuccess = true
          this.typeProduit = {}
          this.codeReduction = this.reduction.codeReduction


          if (this.typeReduction == 261) {
            this.resetForm()
            this.step = 0
          }
          // this.idReduction=
        },
        error: (error) => {
          this.handleError(error)
          console.log(error);

        }
      });
    // }


  }
  handleError(error: any) {

    switch (error.status) {
      case 500: // actif
        this.errorHandler.error = true
        this.errorHandler.msg = "Erreur systeme, veuillez contacter l'administrateur."
        break;
    }

  }
  onChangePack(pack: any, checked: any) {
console.log('he suis les info de onchangepack',pack,checked)

    if (checked.checked && this.packsTab.find((o: any) => o.idPack0 === pack.idPack0) == undefined) {
      this.packsTab.push(pack)
      this.VORowsPacks().push(this.newPack(pack.idPack0, pack.description));
      this.getPack(pack.idPack0, this.VORowsPacks().controls.findIndex((x: any) => x.value.idPack === pack.idPack0))

    }

    else if (!checked.checked && this.packsTab.find((o: any) => o.idPack0 === pack.idPack0) != undefined) {
      this.removePack(this.VORowsPacks().controls.findIndex((x: any) => x.value.idPack === pack.idPack0))
      this.packsTab.splice(this.packsTab.map((item: any) => item.idPack0).indexOf(pack.idPack0), 1);
    }



  }
  // removePack(packIndex: number, skillIndex: number) {
  //   this.VORowsPacks(empIndex).removeAt(skillIndex);
  // }
  removePack(packIndex: number) {
    this.VORowsPacks().removeAt(packIndex);
  }
  // end pack
  //param risque 
//   getAllParamRisque() {
//     let existInBoth = false
//     let validators: any = []

//     this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
//       next: (data: any) => {
//         this.paramRisqueService.getWorkFlowByProduit(this.idProduit, this.idWorkFlow).subscribe({
//           next: (dataWorkFlow: any) => {
//             data.map((param: any) => {
//               let paramRisque: ParamRisqueProduit = {} as any
//               let enabled: any = null
//               let obligatoire: any = null
// // console.log('je suis la donéee paramrisque',paramRisque)

//               dataWorkFlow.filter((paramWorkFlow: any) => {

//                 if (param.paramRisque.idParamRisque == paramWorkFlow.paramRisque.idParamRisque) {
//                   existInBoth = true
//                   enabled = paramWorkFlow.enabled
//                   obligatoire = paramWorkFlow.obligatoire
//                 }
//               })

//               if (this.paraRisqueProduit.find(o => param.paramRisque.idParamRisque === o.idParamRisque) == undefined && existInBoth) {

//                 paramRisque.idParamRisque = param.paramRisque.idParamRisque
//                 paramRisque.libelle = param.paramRisque.libelle[0].toUpperCase() + param.paramRisque.libelle.slice(1);
//                 paramRisque.formName = param.paramRisque.formName
//                 paramRisque.orderChamp = param.paramRisque.orderChamp
//                 paramRisque.position = param.paramRisque.position
//                 paramRisque.typeChamp = param.paramRisque.typeChamp
//                 paramRisque.sizeChamp = param.paramRisque.sizeChamp

//                 paramRisque.reponses = param.paramRisque.categorie?.paramDictionnaires
//                 paramRisque.typeValeur = param.iddictionnaire
//                 paramRisque.defaultValue = param.valeur
//                 paramRisque.obligatoire = obligatoire
//                 paramRisque.enable = enabled
//                 paramRisque.category = param.paramRisque.categorieParamRisque?.description

//                 // this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.idParamRisque));

//                 if ((paramRisque.typeChamp?.description == 'String' || paramRisque.typeChamp?.description == 'Number') && paramRisque.formName !="P25") {
//                   this.infoVehicule.addControl(paramRisque.formName, new FormArray([this.newValeur()]));
//                   this.infoVehicule.addControl('typeValeur' + paramRisque.formName, new FormControl(1, ));

//                 } else if (paramRisque.typeChamp?.description == "From Table" && param.paramRisque.paramRisqueParent == null) {

//                   //EXP EN ATTENTE NOM TABLE EN RETOUR 
//                   this.paramRisqueService.getTableParamParent(paramRisque.idParamRisque).subscribe({
//                     next: (data: any) => {
//                       paramRisque.reponses = data
//                       this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue));
//                     },
//                     error: (error) => {

//                       console.log(error);

//                     }
//                   })
//                 }
//                 else {
//                   this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue));
//                 }
//                 let objValeur = {
//                   "type": 1,
//                   "idParamRisque": paramRisque.idParamRisque
//                 }
//                 this.typeValeurRisque.push(objValeur)


//                 // if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != undefined)
//                 //   this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required, Validators.maxLength(paramRisque.sizeChamp)]));
//                 // else
//                 //   if (paramRisque.obligatoire)
//                 //     this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
//                 //   else
//                 //     this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue));


//                 this.paraRisqueProduit.push(paramRisque)



//               }
//               // console.log('jjhjhjhjihmuilgyfv',this.paraRisqueProduit)
//               existInBoth = false
//               validators = []
//             })


//             // this.paraRisqueProduitCategory = this.paraRisqueProduit.reduce((x: any, y: any) => {

//             //   (x[y.category] = x[y.category] || []).push(y);

//             //   return x;

//             // }, {});
//             // this.paraRisqueProduitCategory = Object.values(this.paraRisqueProduitCategory)

//             this.paraRisqueProduit = Object.values(this.paraRisqueProduit)
//             this.paraRisqueProduit.map(risqueCategory => {
//               // risqueCategory.sort((a: any, b: any) => (a.orderChamp < b.orderChamp ? -1 : 1));

//             })
        
//             this.paramReady = true
//           },
//           error: (error) => {

//             console.log(error);

//           }
//         })


//       },
//       error: (error) => {

//         console.log(error);

//       }
//     });
//     console.log('je suis pararisque produit',this.paraRisqueProduit)

//   }



getAllParamRisque() {
  let existInBoth = false
  let validators: any = []

  this.paramRisqueService.getParamByProduit(this.idProduit).subscribe({
    next: (data: any) => {
      this.paramRisqueService.getWorkFlowByProduit(this.idProduit, this.idWorkFlow).subscribe({
        next: (dataWorkFlow: any) => {
          data.map((param: any) => {

            let paramRisque: ParamRisqueProduit = {} as any
            let enabled: any = null
            let obligatoire: any = null
            dataWorkFlow.filter((paramWorkFlow: any) => {

              if (param.paramRisque.idParamRisque == paramWorkFlow.paramRisque.idParamRisque) {
                existInBoth = true
                enabled = paramWorkFlow.enabled
                obligatoire = paramWorkFlow.obligatoire
              }
            })

            if (this.paraRisqueProduit.find(o => param.paramRisque.idParamRisque === o.idParamRisque) == undefined && existInBoth) {

              paramRisque.idParamRisque = param.paramRisque.idParamRisque
              paramRisque.libelle = param.paramRisque.libelle[0].toUpperCase() + param.paramRisque.libelle.slice(1);
              paramRisque.formName = param.paramRisque.libelle.split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.substring(1)).join('')
              paramRisque.orderChamp = param.paramRisque.orderChamp
              paramRisque.position = param.paramRisque.position
              paramRisque.typeChamp = param.paramRisque.typeChamp
              paramRisque.sizeChamp = param.paramRisque.sizeChamp

              paramRisque.reponses = param.paramRisque.categorie?.paramDictionnaires
              paramRisque.typeValeur = param.iddictionnaire
              paramRisque.defaultValue = param.valeur
              paramRisque.obligatoire = obligatoire
              paramRisque.enable = enabled
              paramRisque.category = param.paramRisque.categorieParamRisque?.description

              // this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.idParamRisque));

              if ((paramRisque.typeChamp?.description == 'String' || paramRisque.typeChamp?.description == 'Number') && paramRisque.formName != 'Marque') {
                const paramReduction = this.reduction.paramList.find((param: any) => param?.idParam?.idParamRisque == paramRisque.idParamRisque)
                if(paramReduction.valMin == 0 && paramReduction.valMax == 0) {
                  this.infoVehicule.addControl(paramRisque.formName, new FormArray([this.newValeur(paramReduction.valeur)]));
                  this.infoVehicule.addControl('typeValeur' + paramRisque.formName, new FormControl(1, [Validators.required]));
                } else {
                  this.infoVehicule.addControl(paramRisque.formName, new FormArray([this.newValeur(paramReduction.valMin)]));
                  this.addValeur(paramRisque.formName, paramReduction.valMax);
                  // this.infoVehicule.addControl(paramRisque.formName, new FormArray([this.newValeur(paramReduction.valMax)]));
                  this.infoVehicule.addControl('typeValeur' + paramRisque.formName, new FormControl(2, [Validators.required]));
                }

              } else if (paramRisque.typeChamp?.description == "From Table" && param.paramRisque.paramRisqueParent == null) {

                //EXP EN ATTENTE NOM TABLE EN RETOUR 
                this.paramRisqueService.getTableParamParent(paramRisque.idParamRisque).subscribe({
                  next: (data: any) => {
                    paramRisque.reponses = data
                    this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
                  },
                  error: (error) => {

                    console.log(error);

                  }
                })
              }
              else {
                this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
              }
              let objValeur = {
                "type": 1,
                "idParamRisque": paramRisque.idParamRisque
              }
              this.typeValeurRisque.push(objValeur)


              // if (paramRisque.sizeChamp != 0 && paramRisque.sizeChamp != undefined)
              //   this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required, Validators.maxLength(paramRisque.sizeChamp)]));
              // else
              //   if (paramRisque.obligatoire)
              //     this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue, [Validators.required]));
              //   else
              //     this.infoVehicule.addControl(paramRisque.formName, new FormControl(paramRisque.defaultValue));


              this.paraRisqueProduit.push(paramRisque)



            }
            existInBoth = false
            validators = []
          })


          // this.paraRisqueProduitCategory = this.paraRisqueProduit.reduce((x: any, y: any) => {

          //   (x[y.category] = x[y.category] || []).push(y);

          //   return x;

          // }, {});
          // this.paraRisqueProduitCategory = Object.values(this.paraRisqueProduitCategory)

          this.paraRisqueProduit = Object.values(this.paraRisqueProduit)
          this.paraRisqueProduit.map(risqueCategory => {
            // risqueCategory.sort((a: any, b: any) => (a.orderChamp < b.orderChamp ? -1 : 1));

          })
      
          this.paramReady = true
        },
        error: (error) => {

          console.log(error);

        }
      })


    },
    error: (error) => {

      console.log(error);

    }
  });

}
  submitInfoGenerales() {
    // info generales 

    if (this.formInfoGeneral.valid) {
      this. changeTypeProduit(this.reduction.produit)

      this.reductionJson.nomReduction = this.formInfoGeneral.get("nomReduction").value
      this.reductionJson.codeReduction = this.reduction.codeReduction
      this.reductionJson.idReduction = this.reduction.idReduction
      // this.reductionJson.pack


      // this.reductionJson.idReduction = this.formInfoGeneral.get("nomReduction").value
      this.reductionJson.dateDebut = this.formInfoGeneral.get("dateDebut").value
      this.reductionJson.dateFin = this.formInfoGeneral.get("dateFin").value
      this.reductionJson.idProduit = this.reduction?.produit.idCodeProduit
      this.reductionJson.agences = this.formInfoGeneral.get("agences").value.filter((element: any) => (element !== null || element!== undefined));
      this.reductionJson.appAutomatique = this.formInfoGeneral.get("appAutomatique").value
      this.reductionJson.mouvementPolice = this.formInfoGeneral.get("mouvementsPolice").value.filter((element: any) => element !== null);
      this.reductionJson.canalDistributions = this.formInfoGeneral.get("canalDistribution").value.filter((element: any) => element !== null);
      this.reductionJson.utilisateurs = this.formInfoGeneral.get("utilisateurs").value.filter((element: any) => element !== null);
      this.reductionJson.isAllAgences = this.isAllAgences
      this.reductionJson.isAllUtilisateurs =this.isAllUtilisateurs
      this.reductionJson.isAllCanalDistro = this.isAllCanalDistro
      this.initInfoVehicule()
      this.stepper.next();
    
    }
  }
  submitInfoProduit() {

  }

  submitParamRisque() {

    if (this.infoVehicule.valid) {
      let idparam = 0
      let paramReducTemp: any = []
      this.paraRisqueProduit.map((param: any) => {
        let idReponse: any = []
        let valMin = 0
        let valMax = 0
        let valeur = 0

        Object.keys(this.infoVehicule.value).map((paramFormName: any) => {
          if (paramFormName == param.formName) {
            idparam = param.idParamRisque

            if ((param.typeChamp?.description == 'String' || param.typeChamp?.description == 'Number') && paramFormName != "Marque") {

              if (this.infoVehicule.get(paramFormName).length == 2) {
                valMin = (this.infoVehicule.get(paramFormName) as FormArray).at(0).value.valeur
                valMax = (this.infoVehicule.get(paramFormName) as FormArray).at(1).value.valeur
              } else if (this.infoVehicule.get(paramFormName).length == 1) {
                valeur = (this.infoVehicule.get(paramFormName) as FormArray).at(0).value.valeur
              }
            } else if (param.typeChamp?.description == "From Table") {
              idReponse = this.infoVehicule.get(paramFormName).value.filter((element: any) => element !== null);
            }
            else {

              idReponse = this.infoVehicule.get(paramFormName).value.filter((element: any) => element !== null);
            }
            paramReducTemp.push({
              "idParam": idparam,
              "valMin": valMin,
              "valMax": valMax,
              "idResponseParam": idReponse,
              "valeur": valeur
            })
          }
        })


      })

      this.reductionJson.param = paramReducTemp

      this.stepper.next()
    }
  }
  changeTypeValeur(type: any, idParamRisque: number) {

    let paramRisque: any
    paramRisque = this.paraRisqueProduit.filter(param => param.idParamRisque == idParamRisque)[0]
    const index = this.typeValeurRisque.findIndex((obj: any) => obj.idParamRisque === idParamRisque)
    let objValeur = {
      "type": type,
      "idParamRisque": idParamRisque
    }


    if (index === -1)
      this.typeValeurRisque.push(objValeur)
    else {
      this.typeValeurRisque[index] = objValeur

    }
console.log('je suis type valuer risque',this.typeValeurRisque)

    //interval
    if (type == 2) {

      this.addValeur(paramRisque.formName, '')
    } else if (type == 1) { // valeur unique
      {

        this.removeValeur(0, paramRisque.formName)

      }

    }
  }
  changeTypeProduit(value: any) {
console.log('jyyyys suis ',value)
    // this.step = 1
    //
    this.typeProduit = value
    this.packs=[]
    this.infoPack.reset()
    this.dataSourceGaranties=[]
    while (this.infoPack.get("VORowsPacks").length !== 0) {
      this.infoPack.get("VORowsPacks").removeAt(0)
    }
    this.idProduit = this.typeProduit?.idCodeProduit
    this.getAllParamRisque()
    this.getAllPack()

    this.typeValeurRisque = []
    this.paraRisqueProduit = []
  }
  resetForm() {
    this.formInfoGeneral.reset()

    //  (this.infoPack.get("VORowsPacks") as FormArray).clear()
    this.infoProduit.reset()
    this.infoVehicule.reset()

    this.infoPack.reset()
    this.infoPack.setControl('VORowsPacks', new FormArray([]));


    this.initFormGeneral()
    // this.dataSourceGaranties.data=[]
    // this.infoProduit.reset()
  }

  valeurs(formName: any): FormArray {

    return this.infoVehicule.get(formName) as FormArray
  }

  newValeur(valeur: any): FormGroup {
    return this.formBuilder.group({
      valeur: [valeur, [Validators.required]],
    })
  }

  addValeur(formName: any, valeur: any) {
    console.log('jhjhjhjhh',formName,this.newValeur(valeur))
    this.valeurs(formName).push(this.newValeur(valeur));
    console.log('this.valeurs',this.valeurs)
  }

  removeValeur(paramIndex: number, formName: any) {
    console.log('dagui',paramIndex  ,formName ,this.valeurs(formName))
    this.valeurs(formName).removeAt(paramIndex);
  }
  setDateDebut(dateDebut: any) {
    this.formInfoGeneral.get("dateFin").enable()
    this.dateDebut = dateDebut
  }
  setDateFin(dateFin: any) {
    this.formInfoGeneral.get("dateFin").enable(); // Active le champ dateFin
    this.dateFin = dateFin; // Met à jour la valeur de dateFin
  }

  
  toggleAllSelection(matSelect: MatSelect) {
    const isSelected: boolean = matSelect.options
      // The "Select All" item has the value 0
      .filter((item: MatOption) => item.value === null)
      // Get the selected property (this tells us whether Select All is selected or not)
      .map((item: MatOption) => item.selected)[0];
    // Get the first element (there should only be 1 option with the value 0 in the select)
    console.log('bonjour ines',isSelected ,matSelect.ngControl.name )
    if (isSelected ){
if(matSelect.ngControl.name=="canalDistribution")
      this.isAllCanalDistro=true

if(matSelect.ngControl.name=="utilisateurs")
      this.isAllUtilisateurs=true



if(matSelect.ngControl.name=="agences")
 this.isAllAgences=true
    }
   

    if (isSelected) {
      matSelect.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      matSelect.options.forEach((item: MatOption) => item.deselect());
    }

  }
}