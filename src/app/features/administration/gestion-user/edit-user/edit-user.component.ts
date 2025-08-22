import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { AgencesService } from 'src/app/core/services/agences.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Patterns } from 'src/app/core/validiators/patterns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  formModifier: FormGroup | any;
  agences: any = []
  roles: any = []
  selectedRole: any = []
  selectedAgence: any = []
  selectedEtat: any = [] 
  user: any
  jsonUpdate : any={}  
  id:any;
  errorHandler = {
    "error": false,
    "msg": ""
  }
  constructor(private formBuilder: FormBuilder, 
              private agencesService: AgencesService, 
              private router: Router,  
              private route: ActivatedRoute,
              private usersService:UsersService){}

  ngOnInit(): void {
   
    this.getAllAgences()
    this.getAllRoles()
    if (this.id !== null) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getUserById(this.id)
    }
    this.initFormCreation()
   
  }
  getAllRoles(){
    this.usersService.getAllRole().subscribe({
      next: (data: any) => {
        this.roles = data

    
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  initFormCreation(){
    this.formModifier = this.formBuilder.group({
      nom: ['', [Validators.required, this.customNameValidator]],
      prenom: ['', [Validators.required, this.customLastNameValidator]],
      email: ['', [Validators.required,Validators.pattern(Patterns.email),Validators.email, this.customEmailValidator]],
      agence: ['', Validators.required],
      role: ['', Validators.required],
      etat: ['', Validators.required],
     
    })
  }
  customEmailValidator(control: any) {
    const email = control.value;
  
    if (email && !email.includes('@')) {
      return { 'invalidEmail': { message: 'Adresse e-mail invalide' } };
    }
  
    return null;
  }

  customLastNameValidator(control: any) {
    const name = control.value;
  
    // Check if the name contains numbers or symbols
    if (/[!@#$%^&*()+,.?":{}|<>]/.test(name)) {
      return { 'invalidName': { message: 'Le prénom ne peut pas contenir contain symboles' } };
    }
  
    return null;
  }

  customNameValidator(control: any) {
    const name = control.value;
  
    // Check if the name contains numbers or symbols
    if (/[0-9!@#$%^&*()+,.?":{}|<>]/.test(name)) {
      return { 'invalidName': { message: 'Le nom et le prénom ne peuvent pas contenir contain nombres  ou symboles' } };
    }
  
    return null;
  }
  getAllAgences(){
    this.agencesService.getAllAgence().subscribe({
      next: (data: any) => {
        this.agences = data
       
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getUserById(id : any){
    this.usersService.getUserById(id).subscribe({
      next: (data: any) => {
       this.user =  data
       this.formModifier.controls['nom'].setValue(this.user.nom);
       this.formModifier.controls['prenom'].setValue(this.user.prenom);
       this.formModifier.controls['email'].setValue(this.user.email);    
       this.selectedEtat =this.user.accountStatus
       this.selectedRole = this.user.role?.map((element: any) => element.idRole) || [];   
       this.selectedAgence = this.user.agence?.map((element: any) => element.idAgence) || [];   
       this.formModifier.get('agence').setValue(this.selectedAgence)      
       this.formModifier.get('role').setValue(this.selectedRole)
       this.formModifier.get('etat').setValue(this.selectedEtat?this.selectedEtat.toString(): "2")
    
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  toggleAllSelection(matSelect: MatSelect) {
    const isSelected: boolean = matSelect.options
      // The "Select All" item has the value 0
      .filter((item: MatOption) => item.value === null)
      // Get the selected property (this tells us whether Select All is selected or not)
      .map((item: MatOption) => item.selected)[0];
    // Get the first element (there should only be 1 option with the value 0 in the select)

    if (isSelected) {
      matSelect.options.forEach((item: MatOption) => item.select()
      );
       
    } else {
      matSelect.options.forEach((item: MatOption) => item.deselect());
    }

  }
  toggleAllSelectionRole(matSelect: MatSelect) {
    const isSelected: boolean = matSelect.options
      // The "Select All" item has the value 0
      .filter((item: MatOption) => item.value === null)
      // Get the selected property (this tells us whether Select All is selected or not)
      .map((item: MatOption) => item.selected)[0];
    // Get the first element (there should only be 1 option with the value 0 in the select)

    if (isSelected) {
      matSelect.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      matSelect.options.forEach((item: MatOption) => item.deselect());
    }

  }


  submit(){
    this.jsonUpdate = {};
    if (this.formModifier.valid) {

      this.jsonUpdate = {};
      this.jsonUpdate.nom = this.formModifier.get("nom").value; 
      this.jsonUpdate.prenom = this.formModifier.get("prenom").value; 
      this.jsonUpdate.mail = this.formModifier.get("email").value; 
      this.jsonUpdate.agence = this.formModifier.get("agence").value.filter((element:any) => element !== null);       
      this.jsonUpdate.roles =    this.formModifier.get("role").value.filter((element:any) => element !== null);
      this.jsonUpdate.etat  = this.formModifier.get("etat").value;   

      this.usersService.updateUser(this.jsonUpdate).subscribe({
        next: (data: any) => {

          Swal.fire({
            title: data,
            icon: 'info',
            allowOutsideClick: false,           
            confirmButtonText: `Ok`,           
            width: 600
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['gestion-user']);
            }
          })
        },
        error: (error) => {
  
          console.log(error);
          Swal.fire({
            title: error.text,
            icon: 'info',
            allowOutsideClick: false,           
            confirmButtonText: `Ok`,           
            width: 600
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['gestion-user']);
            }
          })
  
        }
      });
      
    }

  }
}
