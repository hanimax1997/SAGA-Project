import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'obligatoireFormat',
})
export class ObligatoireFormatPipe implements PipeTransform {
    transform(value: any | null): any {
        if (JSON.parse(value) == true)
            return "Oui";
        if (JSON.parse(value) == false)
            return "Non";


    }
}