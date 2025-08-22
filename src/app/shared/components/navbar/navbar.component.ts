import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { OutputSinistreService } from 'src/app/core/services/output-sinistre.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private outputSinistreService:OutputSinistreService,private authentificationService:AuthentificationService) { }
  @Input() isExpanded: boolean;
  @Output() newItemEvent = new EventEmitter<any>();
  userEmail= sessionStorage.getItem("userEmail")
  ngOnInit(): void {
    
  }

  hide() {
    this.isExpanded = !this.isExpanded
    this.newItemEvent.emit(this.isExpanded);
  }

  logOut(){
   this.authentificationService.logout()
  }
  pdfGenerator(){
    this.outputSinistreService.export()
  }
  goToSesame(url: string){
    window.open(url, "_blank");
}
}
