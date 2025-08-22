import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { Router } from '@angular/router';
import { Pattern } from 'pdfmake/interfaces';
import { Patterns } from 'src/app/core/validiators/patterns';
import { first } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formAuthentification: FormGroup;

  message: boolean = false;
  hide: boolean = true;
  submitted = false
  loading = false
  errorAuth: Boolean;

  constructor(
    private formBuilderAuth: FormBuilder,
    private authentificationService: AuthentificationService,
    private router: Router) {
    // redirect to home if already logged in
    if (this.authentificationService.userValue) {
      this.router.navigate(['/dashboard']);
    }

  }

  ngOnInit(): void {

    this.formAuthentification = this.formBuilderAuth.group({
      username: ['', [Validators.required, Validators.pattern(Patterns.email)]],
      password: ['', [Validators.required, Validators.minLength(0)]],
    });
  }
  submitAuth() {
    if (this.formAuthentification.valid) {


      this.submitted = true;

      this.loading = true;
      let formData: FormData = new FormData();
      this.authentificationService.authBody.username = this.formAuthentification.get('username')?.value
      this.authentificationService.authBody.password = this.formAuthentification.get('password')?.value
      this.authentificationService.login().pipe(first())
      .subscribe({
        next: (data: any) => {

          this.authentificationService.setLoggedIn(true);
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
    
          sessionStorage.setItem('error_auth', "true");
          if (error.status == 403)
            this.errorAuth = true;

          if(error.status== 401 && error.error.error){
            console.log("error",error)
            Swal.fire(
              error.error.error,
              '',
              'error'
            )
          }
        }
      });
      // this.authentificationService.login().subscribe({
      //   next: (data: any) => {
      //     sessionStorage.setItem('access_token', data.access_token);

      //     this.authentificationService.setLoggedIn(true);
      //     this.router.navigate(['/dashboard']);
      //     this.authentificationService.startRefreshTokenTimer()

      //   },
      //   error: (error) => {

      //     sessionStorage.setItem('error_auth', "true")
      //     if (error.status == 403)
      //       this.errorAuth = true

      //   }
      // });
      // this.errorAuth=Boolean(sessionStorage.getItem("error_auth"))
      // this.authentificationService.login().subscribe({
      //   next: (data: any) => {
      //     this.router.navigate([""]);
      //   },
      //   error: (error) => {

      //     this.error = error;
      //     this.loading = false;
      //   }
      // });


    }

  }
}
