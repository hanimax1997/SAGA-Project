import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ContratService } from 'src/app/core/services/contrat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-migration-automobile',
  templateUrl: './migration-automobile.component.html',
  styleUrls: ['./migration-automobile.component.scss']
})
export class MigrationAutomobileComponent {
  formMigration: FormGroup | any;
  constructor(private formBuilder: FormBuilder, private contratService:ContratService,
              private router: Router){}

  ngOnInit(): void {
    this.formMigration = this.formBuilder.group({
      police: [null]
    });
  }

  submitMigration(){
      this.contratService.Migration(this.formMigration.get("police").value).subscribe({
        next: (data: any) => {
          console.log("data ", data);
          Swal.fire(
            `Migration de la police ${this.formMigration.get("police").value} a été éffectué avec succées`,
            '',
            'success'
          )
        },
        error: (error) => {
  
          console.log(error);
          Swal.fire(
            error,
            '',
            'error'
          )
  
        }
      });
    }
}
