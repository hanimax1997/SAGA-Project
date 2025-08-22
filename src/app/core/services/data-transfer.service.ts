import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  constructor() { }
  private dataArray: any[] = [];

  setDataRisquesArray(data: any[]): void {

    sessionStorage.setItem("dataArray", JSON.stringify(data))
  }

  getDataRisquesArray(): any[] {
    const storedData = sessionStorage.getItem("dataArray");
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      return []; // or any other default value
    }
  }
  emptyDataArray(){
    sessionStorage.removeItem("dataArray")
  }
}
