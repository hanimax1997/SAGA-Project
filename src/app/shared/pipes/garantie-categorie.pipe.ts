import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'garantieCategorie',
})
export class GarantieCategoriePipe implements PipeTransform {
    transform(idCategorie: number): string {
        let categorie: string='';
        switch (idCategorie) {
          case 589: // actif
            categorie = 'Vie'
            break;
          case 590: // actif
            categorie = 'Dommage'
            break;
          case 591: // en attente
            categorie = 'Vie & Dommage'
            break;
          
        }
    
        return categorie ;
      }
}