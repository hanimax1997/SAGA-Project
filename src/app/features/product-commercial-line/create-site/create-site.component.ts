import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat.service';
import { GenericService } from 'src/app/core/services/generic.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-site',
  templateUrl: './create-site.component.html',
  styleUrls: ['./create-site.component.scss']
})
export class CreateSiteComponent implements OnInit {
  formCreation: FormGroup | any;
  idContrat: any;
  listValAssure: any;
  
  constructor( private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private genericService: GenericService,
                private contratService: ContratService  ) { }
  ngOnInit(): void {
    this.initForm();
    this.idContrat=this.route.snapshot.paramMap.get('idContrat')
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C104").idCategorie).subscribe(data => {
     
      this.listValAssure = data
    })
  }

  initForm() {
    this.formCreation = this.formBuilder.group({
      valAssure: ['', [Validators.required]],
      contenu: ['', [Validators.required]],
      contenant: ['', [Validators.required]],
      risqueLocatif: ['', [Validators.required]],
      bi: ['', [Validators.required]],
      smp: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      

    });
  }
 
  submitProduct(form:any){
    let body : any={}
    body.valAssure = this.formCreation.get('valAssure').value 
    body.contenu = this.formCreation.get('contenu').value 
    body.contenant = this.formCreation.get('contenant').value 
    body.risqueLocatif = this.formCreation.get('risqueLocatif').value 
    body.bi = this.formCreation.get('bi').value     
    body.commercialLineId = this.route.snapshot.paramMap.get('idContrat');
    body.smp =  this.formCreation.get('smp').value 
    body.adresse =  this.formCreation.get('adresse').value 
    body.longitude =  this.formCreation.get('longitude').value 
    body.latitude =  this.formCreation.get('latitude').value 


    this.contratService.createSiteComercial(body).subscribe({
      next: (data: any) => {
        
        Swal.fire({
          title: "Site crée avec succée",
          icon: 'success',
          allowOutsideClick: false,           
          confirmButtonText: `Ok`,           
          width: 600
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/gestion-commercial-line']);
          }
        })       
      },
      error: (error) => {

        console.log(error);

      }
    });
 
  }
}
