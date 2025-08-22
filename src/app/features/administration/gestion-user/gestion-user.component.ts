
import { Component, ViewChild, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-user',
  templateUrl: './gestion-user.component.html',
  styleUrls: ['./gestion-user.component.scss']
})


export class GestionUserComponent implements OnInit{
  displayedColumns: string[] = ['userid', 'nom', 'prenom', 'email','action'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  formFilter: FormGroup | any;
  dataSource = new MatTableDataSource()

  constructor(private usersService:UsersService,
              private formBuilder: FormBuilder, 
              private router: Router,){}

  ngOnInit(): void {
    this.getAllUsers() 
    this.initFormFilter()  
  }

  getAllUsers(){
    this.usersService.getAllUsers().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data)       
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  initFormFilter()  {
    this.formFilter = this.formBuilder.group({
      emailUser: [null],
      nomUser: [null],
    });
  }

  submitFilter(){
    let filter = this.formFilter.get("emailUser").value ?this.formFilter.get("emailUser").value :this.formFilter.get("nomUser").value 
    this.usersService.filterUser(filter).subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data)
        this.paginate();
      },
      error: (error) => {

        console.log(error);

      }
    });
  }
  navigateToCreation() {
    this.router.navigate(['gestion-user/add-user']);
  }

  updateUser(id:any){
    
    this.router.navigate(['gestion-user/edit-user/'+id]);
  }
  updatePassword(email:any){

  }
  resetTable(){
    this.getAllUsers()   
    this.formFilter.reset();
    this.initFormFilter()
  }
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
