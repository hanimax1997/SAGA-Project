import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestionnaire-sinistre',
  templateUrl: './gestionnaire-sinistre.component.html',
  styleUrls: ['./gestionnaire-sinistre.component.scss']
})
export class GestionnaireSinistreComponent {
  constructor(private route: ActivatedRoute, private router: Router) { }

  codeSinistre = this.route.snapshot.paramMap.get('codeSinistre')
  goTo(type: string) {
    switch (type) {
      case 'reservePaiement':

        this.router.navigate(['reserve-paiement'], { relativeTo: this.route });

        break;
      case 'reserveRecours':
        this.router.navigate(['reserve-recours'], { relativeTo: this.route });
        break;
      default:
        break;
    }
  }
}