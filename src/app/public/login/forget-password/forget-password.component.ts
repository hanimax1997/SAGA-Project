import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { Patterns } from 'src/app/core/validiators/patterns';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  formchangePass : FormGroup | any;
  bodyForget : any ={}
  constructor(     private formBuilder: FormBuilder,
          private authentificationService: AuthentificationService,        
          private router: Router){}


  
  ngOnInit(): void {
    this.initformchagePass()
  }


  initformchagePass(){
    this.formchangePass = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Patterns.email),Validators.email, this.customEmailValidator]],
    
    });

  }  


  customEmailValidator(control: any) {
    const email = control.value;
  
    if (email && !email.includes('@')) {
      return { 'invalidEmail': { message: 'Adresse e-mail invalide' } };
    }
  
    return null;
  }

  submit(){
   // this.bodyForget = {};
   
    if (this.formchangePass.valid) {
     
    /*  this.bodyForget = {};
      this.bodyForget.mail = this.formchangePass.get("email").value; 
      */
      let email = this.formchangePass.get("email").value; 
     
       this.authentificationService.ForgetPass(email).subscribe({

        next: (data: any) => {        

          Swal.fire({
            title: data,
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
          console.log(error);
          Swal.fire({
            title: error.text,
            icon: 'info',
            allowOutsideClick: false,           
            confirmButtonText: `Ok`,          
           
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['']);
            }
          })
      
  
        }
      });
    }  
  }
}
