import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'consultationStatutColor'
})
export class ConsultationStatutColorPipe implements PipeTransform {

  transform(statut: string): string {
    let color: string;
    switch (statut) {
      case 'Succés':
        color='green'
        break;
      case 'En attente BO':
        color='#00008F'
        break;
      case 'Refusé':
        color='red'
        break;
      default:
        color = 'grey';
        break;
    }

    return 'background: '+color+'; color: white;';
  }

}
