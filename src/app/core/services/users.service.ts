import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../config/constants';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

const httpOption: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAllUsers(){
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_USERS}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
  );
  }

  filterUser(data:any){
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_USERS_FILTER}/${data}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
  );
  }
  getUserById(id:any){
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_USERS_BY_ID}/${id}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
  );
  }


  getAllRole(){
    return this.http.get<any[]>(`${Constants.API_ENDPOINT_USERS_ROLES}`).pipe(
      tap((response) => this.logs(response)),
      catchError((error) => this.handleEroor(error, error.error))
  );
  }

  addUser(data : any){
    return this.http.post<any>(`${Constants.API_ENDPOINT_ADD_USER}`, data, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }
  updateUser(data : any){
    return this.http.post<any>(`${Constants.API_ENDPOINT_UPDATE_USER}`, data, httpOption).pipe(
      tap((response) => response),
      catchError((error) => throwError(error.error))
    )
  }


  private logs(response: any) {

  }

  private handleEroor(error: Error, errorValue: any) {
      return of(errorValue);
  }

}
