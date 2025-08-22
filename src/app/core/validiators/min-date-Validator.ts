import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";

/**
 * Check if control value is inferior to date in parameter
 * @export
 */
export function minDateValidator(control: AbstractControl,minDate: Date): { [key: string]: boolean } | null {
    var dateFin: Date = new Date(control.value);
  
    if(minDate < dateFin) {
      return {
        'errorMinDate': true
      };
        return {
          'errorMinDate': false
        };
      }

    return null;
}


  