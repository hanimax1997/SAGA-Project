import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Patterns } from 'src/app/core/validiators/patterns';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  formPass : FormGroup | any;
  bodyChange : any ={}
  setError = 'Les mots de passe ne correspondent pas';

  hide: boolean = true;
  constructor(private formBuilder: FormBuilder,
              private authentificationService: AuthentificationService,
              private router: Router){}


  
  ngOnInit(): void {
    this.initformchagePass()
    
  }


  initformchagePass(){
    this.formPass = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Patterns.email),Validators.email, this.customEmailValidator]],
      lastPass: ['', [Validators.required]],
      newPass: ['', [Validators.required,  this.customPasswordValidator]],
      confirmNewPass: ['', [Validators.required]],
    
    })
    
  }
  
  customPasswordValidator(control: any){
    const password = control.value;

  if (!password) {
    // Handle empty password if needed
    return { 'required': true };
  }

  // Password must be at least 8 characters long
  if (password.length < 8) {
    return { 'minlength': true };
  }

  // Password must contain at least one number
  if (!/\d/.test(password)) {
    return { 'missingNumber': true };
  }

  // Password must contain at least one special character
  if (!/[A-Z]/.test(password)) {
    return { 'missingSpecialChar': true };
  }

  // Password is valid
  return null;

  }

  customEmailValidator(control: any) {
    const email = control.value;
  
    if (email && !email.includes('@')) {
      return { 'invalidEmail': { message: 'Adresse e-mail invalide' } };
    }
  
    return null;
  }

  submit(){
    this.bodyChange = {};
    
    if (this.formPass.valid) {
     let newPass = this.formPass.get("newPass").value;
     let confirmPass = this.formPass.get("confirmNewPass").value;
     let lastPass = this.formPass.get("lastPass").value;
    if(newPass !== lastPass){
      if(newPass === confirmPass){
        this.bodyChange = {};
        this.bodyChange.mail = this.formPass.get("email").value; 
        this.bodyChange.oldPassword = this.formPass.get("lastPass").value; 
        this.bodyChange.newPassword = newPass; 

        this.authentificationService.changePass(this.bodyChange).subscribe({
          next: (data: any) => {          
            Swal.fire({
              title:  data.statusText,
              icon: 'info',
              allowOutsideClick: false,           
              confirmButtonText: `Ok`,          
             
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/']);
              }
            })
          },
          error: (error) => {

          
            Swal.fire({
              title: error.statusText,
              icon: 'info',
              allowOutsideClick: false,           
              confirmButtonText: `Ok`,          
             
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/']);
              }
            })
          }
        });
      }else {
        console.log('Error');
        this.formPass.get('confirmNewPass').setErrors({ 'customError': 'Wrong password' });
      }      

    } else {
      Swal.fire({
        title: 'Le nouveau mot de passe doit être différent',
        icon: 'info',
        allowOutsideClick: false,           
        confirmButtonText: `Ok`,          
       
      })
    } 
  
  }
}
}
