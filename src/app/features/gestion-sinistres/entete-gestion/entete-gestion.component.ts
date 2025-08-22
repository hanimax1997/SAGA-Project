import { Component } from '@angular/core';

@Component({
  selector: 'app-entete-gestion',
  templateUrl: './entete-gestion.component.html',
  styleUrls: ['./entete-gestion.component.scss']
})
export class EnteteGestionComponent {
  infoSinistre=JSON.parse(sessionStorage.getItem('infoSinistre') || '{}');
  ngOnInit(): void {

  }

}
