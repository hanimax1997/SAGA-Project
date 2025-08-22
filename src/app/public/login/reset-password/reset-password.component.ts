import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Patterns } from 'src/app/core/validiators/patterns';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  formPass : FormGroup | any;
  bodyChange : any ={}
  hide: boolean = true;
  key: any
  setError = 'Les mots de passe ne correspondent pas';
  constructor(private formBuilder: FormBuilder,
              private authentificationService: AuthentificationService, 
              private route: ActivatedRoute,
              private router: Router){}
  
  ngOnInit(): void {
    this.initformchagePass()
    if (this.key !== null) {
      this.key = this.route.snapshot.paramMap.get('key');   
    }
   
  }

  initformchagePass(){
    this.formPass = this.formBuilder.group({      
      newPass: ['', [Validators.required,  this.customPasswordValidator]],
      confirmNewPass: ['', [Validators.required]],
    
    });
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

  submit(){
   
    this.bodyChange = {};    
   
    if (this.formPass.valid) {
      let newPass = this.formPass.get("newPass").value;
      let confirmPass = this.formPass.get("confirmNewPass").value;

     
      if(newPass === confirmPass){
      
        this.bodyChange = {};           
        this.bodyChange.password = newPass; 
        this.bodyChange.key = this.key; 
        

         this.authentificationService.resetPass(this.bodyChange).subscribe({
          next: (data: any) => {
           
            Swal.fire({
              title: data.statusText,
              icon: 'success',
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
        this.formPass.get('confirmNewPass').setErrors({ 'customError': 'Wrong password' });
      }
    }
  }
  
}
