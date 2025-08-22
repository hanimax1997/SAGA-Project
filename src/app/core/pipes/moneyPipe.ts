import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'money'
})
export class moneyPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    if (value !== undefined && value !== null) {
      // here we just remove the commas from value
      return value.toString().replace(/,/g, ".");
    } else {
      return "";
    }  }

  
}