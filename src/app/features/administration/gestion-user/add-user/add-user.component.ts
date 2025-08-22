import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { AgencesService } from 'src/app/core/services/agences.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Patterns } from 'src/app/core/validiators/patterns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit{
  formCreation: FormGroup | any;
  agences: any = []
  roles: any = []
  jsonUser:any = {}
  errorHandler = {
    "error": false,
    "msg": ""
  }
  constructor(private formBuilder: FormBuilder, 
              private agencesService: AgencesService,
              private usersService:UsersService,
              private router: Router){}

  ngOnInit(): void {
    this.initFormCreation()
    this.getAllAgences()
    this.getAllRoles()
   
  }

  initFormCreation(){
    this.formCreation = this.formBuilder.group({
      nom: ['',  [Validators.required, this.customNameValidator] ],
      prenom: ['', [Validators.required, this.customLastNameValidator]],
      email: ['',[Validators.required,Validators.pattern(Patterns.email),Validators.email, this.customEmailValidator] ],
      agence: ['', Validators.required],
      role: ['', Validators.required],
     
    })
  }
  customEmailValidator(control: any) {
    const email = control.value;
  
    if (email && !email.includes('@')) {
      return { 'invalidEmail': { message: 'Adresse e-mail invalide' } };
    }
  
    return null;
  }

  customNameValidator(control: any) {
    const name = control.value;
  
    // Check if the name contains numbers or symbols
    if (/[0-9!@#$%^&*()+,.?":{}|<>]/.test(name)) {
      return { 'invalidName': { message: 'Le nom ne peut pas contenir contain nombres  ou symboles' } };
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


  submitUser(){
    this.jsonUser = {};
    
    if (this.formCreation.valid) {
     
      this.jsonUser = {};
      this.jsonUser.nom = this.formCreation.get("nom").value; 
      this.jsonUser.prenom = this.formCreation.get("prenom").value; 
      this.jsonUser.email = this.formCreation.get("email").value; 
      this.jsonUser.agence = this.formCreation.get("agence").value.filter((element:any) => element !== null);       
      this.jsonUser.roles =    this.formCreation.get("role").value.filter((element:any) => element !== null);

     

      this.usersService.addUser(this.jsonUser).subscribe({
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
