import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SinistresService } from 'src/app/core/services/sinistres.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-gestion-sinistres',
  templateUrl: './gestion-sinistres.component.html',
  styleUrls: ['./gestion-sinistres.component.scss']
})
export class GestionSinistresComponent {
  displayedColumns: string[];
  dataSource: any;
  formFilterSinistre: FormGroup | any;
  messageSuccess = ""
  sinistreCreated = false
  codeProduit: any
  produit: any
  sinistreTable: any;
  filteredTable = false
  lengthElement: any;
  isCourtier = sessionStorage.getItem("roles")?.includes("COURTIER")
  AgenceCourtier=sessionStorage.getItem("agence")
  roleExist = false;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["WEB_HELP", "GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["WEB_HELP", "GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private sinistresService: SinistresService) {
    // const navigation = this.router.getCurrentNavigation();

    // const state = navigation?.extras.state;

    // if (state != undefined) {
    //   this.messageSuccess = state.data;
    //   this.sinistreCreated = true
    //   Swal.fire({
    //     title: "Voulez-vous crée une mission d'expertise pour le  sinistre N° " + state.codeSinistre,
    //     icon: 'info',
    //     showCancelButton: true,
    //     cancelButtonText: "non",
    //     confirmButtonText: "oui",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.router.navigate(["gestion-missionsExpertise/gestion-mission-expertise/" + state.idSinistre + "/creation-mission-expertise"])
    //     }
    //   })

    //   setTimeout(() => {
    //     this.messageSuccess = ""
    //     this.sinistreCreated = false
    //   }, 30000);

    // }
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngOnInit(): void {
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')
    this.produit = this.route.snapshot.paramMap.get('produit')
    // this.data.currentMessage.subscribe(message => this.messageSuccess = message)

    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        this.roleExist = true;
        return;
      }
    })
    
    if (this.codeProduit == '45A' || this.codeProduit == '45F' || this.codeProduit == '45L')
      this.displayedColumns = ['numSinistre', 'numPolice', 'assure', 'dateSurvenance', 'immatriculation', 'causeSinistre', 'typeSinistre', 'situationSinistre', 'action']
    else if (this.codeProduit == '95' || this.codeProduit == '96')
      this.displayedColumns = ['numSinistre', 'numPolice', 'assure', 'dateSurvenance', 'garantie', 'wilaya', 'commune', 'typeSinistre','situationSinistre', 'action']

    // this.getAllSinistre(0, 10)
    this.initFormFilter()
    if(this.isCourtier){
      this.submitFilter(0,10)
    }else{
      this.getAllSinistre(0, 10)
    
    }

  }
  initFormFilter() {
    this.formFilterSinistre = this.formBuilder.group({
      numPolice: [null],
      prenomConducteurAssure: [null],
      nomConducteurAssure: [null],
      nomAssure: [null],
      prenomAssure: [null],
      dateSurvenance: [null],
      numSinistre: [null],
      immatriculationAssure: [null],
      codeRisque: [null],
      nomAdversaire: [null],
      prenomAdversaire: [null],
      //en ca       idAgence:this.isCourtier?[sessionStorage.getItem("agence")?.[0]]:[null],

      // idAgence:this.isCourtier?[sessionStorage.getItem("agence")!= "undefined" ? sessionStorage.getItem("agence")?.[0]:null]:[null],
      idAgence:this.isCourtier?[sessionStorage.getItem("agence")!= "undefined" ? this.AgenceCourtier:null]:[null],

      immatriculationAdversaire: [null],
      numChassis: [null],
      raisonSociale: [null],
      adresse: [null],
      codeProduit: [null],
      idClient: [null],
      numContrat: [null],
    });

  }
  onPageChange(value: any) {
    if (!this.filteredTable){
      this.getAllSinistre(value.pageIndex, value.pageSize)
    }
    else{
      this.submitFilter(value.pageIndex, value.pageSize)
    }
  
  
  }
  getAllSinistre(index: any, size: any) {
    this.sinistresService.getAllSinistres(this.codeProduit, size, index).subscribe({
      next: (data: any) => {
        this.isCourtier ? data.content=data.content.filter((el:any)=>el.agence==this.AgenceCourtier) : data.content = data.content;
        this.sinistreTable = data
        this.dataSource = new MatTableDataSource(data.content);

        if (this.paginator)
          this.paginator.length = data.totalElements;
        this.dataSource.paginator = this.paginator
        
        this.lengthElement =  this.sinistreTable.totalElements

      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  addSinistre() {

    this.router.navigate(['creation-sinistre'], { relativeTo: this.route });
  }
  // submitFilter(index: any, size: any) {
  //   let bodyFilter = {
  //     "nom": this.formFilterSinistre.get("nomAssure").value,
  //     "prenom": this.formFilterSinistre.get("prenomAssure").value,
  //     "raisonSocial": this.formFilterSinistre.get("raisonSociale").value,
  //     "dateSurvenance": this.formFilterSinistre.get("dateSurvenance").value,
  //     "codeSinistre": this.formFilterSinistre.get("numSinistre").value,
  //     "idContrat": this.formFilterSinistre.get("numPolice").value,
  //     "risque": this.formFilterSinistre.get("codeRisque").value,
  //     "nomAdversaire": this.formFilterSinistre.get("nomAdversaire").value,
  //     "prenomAdversaire": this.formFilterSinistre.get("prenomAdversaire").value,
  //     "immatriculation": this.formFilterSinistre.get("immatriculationAssure").value,
  //     "numeroChassis": this.formFilterSinistre.get("numChassis").value,
  //     "adresse": this.formFilterSinistre.get("adresse").value,
  //     "codeProduit": this.codeProduit,
  //     //new
  //     "nomConducteur": this.formFilterSinistre.get("nomConducteurAssure").value,
  //     "prenomConducteur": this.formFilterSinistre.get("prenomConducteurAssure").value,
  //     // "immatriculationConducteur": this.formFilterSinistre.get("immatriculationAssure").value,
  //     "idClient": this.formFilterSinistre.get("idClient").value,
  //     "numContrat": this.formFilterSinistre.get("numContrat").value,
  //   }
  //   this.sinistresService.filterSinistre(bodyFilter,index, size).subscribe({
  //     next: (data: any) => {
  //       this.filteredTable = true
  //       this.sinistreTable = data

  //       this.dataSource = new MatTableDataSource(data?.content);
  //       if (this.paginator)
  //         this.paginator.length = data?.totalElements;
  //       this.dataSource.paginator = this.paginator
  //       this.lengthElement =  this.sinistreTable.totalElements
  //     },
  //     error: (error) => {

  //       console.log(error);

  //     }
  //   })
  // }

  submitFilter(index: any, size: any) {
    

    
    let bodyFilter:any = {
    
  
      "nom": this.formFilterSinistre.get("nomAssure").value,
      "prenom": this.formFilterSinistre.get("prenomAssure").value,
      "raisonSocial": this.formFilterSinistre.get("raisonSociale").value,
      "dateSurvenance": this.formFilterSinistre.get("dateSurvenance").value,
      "codeSinistre": this.formFilterSinistre.get("numSinistre").value,
      "idContrat": this.formFilterSinistre.get("numPolice").value,
      "risque": this.formFilterSinistre.get("codeRisque").value,
      "nomAdversaire": this.formFilterSinistre.get("nomAdversaire").value,
      "prenomAdversaire": this.formFilterSinistre.get("prenomAdversaire").value,
      "immatriculation": this.formFilterSinistre.get("immatriculationAssure").value,
      "numeroChassis": this.formFilterSinistre.get("numChassis").value,
      "adresse": this.formFilterSinistre.get("adresse").value,
      "codeProduit": this.codeProduit,
      "idAgence":this.isCourtier?this.AgenceCourtier :this.formFilterSinistre.get("idAgence").value,
      //new
      "nomConducteur": this.formFilterSinistre.get("nomConducteurAssure").value,
      "prenomConducteur": this.formFilterSinistre.get("prenomConducteurAssure").value,
      "immatriculationConducteur": this.formFilterSinistre.get("immatriculationAdversaire").value,
      "idClient": this.formFilterSinistre.get("idClient").value,
      "numContrat": this.formFilterSinistre.get("numContrat").value,
    }
  
  
  this.getAllSinistre
  this.sinistresService.filterSinistre(bodyFilter,index, size).subscribe({
    next: (data: any) => {
      
      this.filteredTable = true
      this.sinistreTable = data
      this.dataSource = new MatTableDataSource(data?.content);
  
      console.log("this.dataSourcesdsdsdsdsd",data);
  
      if (this.paginator)
        this.paginator.length = data?.totalElements;
      this.dataSource.paginator = this.paginator     
      this.lengthElement =  this.sinistreTable.totalElements
    },
    error: (error) => {
  
      console.log(error);
  
    }
  })
  }
  
  resetTable(formDirective: any) {
    this.filteredTable = false
    formDirective.resetForm();
    this.formFilterSinistre.reset();
    if(this.isCourtier){
      this.submitFilter(0,10)
    }else{
    this.getAllSinistre(0, 10)
    }

  }
  goTo(value: any, id: any) {
    let immatriculations ;

    // Parcourir le tableau des sinistres
    for (let i = 0; i < this.sinistreTable.content.length; i++) {
        // Récupérer le sinistre courant
        let sinistre = this.sinistreTable.content[i];
        
if(sinistre.idSinistre==id && value=='expertise'){

  //lert(sinistre.codeSinistre);
}



        // Vérifier si idSinistre est égal à codeSinistre
        if (id === sinistre.codeSinistre) {

            // Si c'est le cas, ajouter l'immatriculation à notre tableau
            immatriculations=sinistre.immatriculation;
        }
    }


    switch (value) {
      case 'police':
        // this.router.navigateByUrl("consultation-police-automobileMono/" + id);
        this.router.navigateByUrl('consultation-police/' + this.codeProduit + '/' + this.produit + '/' + id);
        break;
      case 'sinistre':
        this.router.navigate(['consultation-sinistre/' + id], { relativeTo: this.route, queryParams: { immatriculation: immatriculations } });
        break;
      case 'gestion':
        this.router.navigate(['gestionnaire-sinistre/' + id], { relativeTo: this.route });

        break;
      // case 'gestion':
      //   this.router.navigateByUrl("gestion-sinistre-automobileMono/" + id + "/gestionnaire-sinistre");

      //   break;
      case 'expertise':
        this.router.navigateByUrl("gestion-missionsExpertise/gestion-mission-expertise/" + id + '/' + this.produit);
        break;
      default:
        break;
    }
  }
}
