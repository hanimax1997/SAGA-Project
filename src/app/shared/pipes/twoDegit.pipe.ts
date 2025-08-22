import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'twoDegit',
})
export class TwoDegit implements PipeTransform {
    transform(value: number | null): any {
        if (value == null) {
            return ""
        } else
            return Math.floor(value * 100) / 100;


    }
}