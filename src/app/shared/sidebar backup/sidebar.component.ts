import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare interface navInfo {
  path: string;
  title: string;
  name: string;
  icon: string;
  class: string;
  children: navInfo[]
}
export const NAV: navInfo[] = [
  { path: '/dashboard', title: 'Dashboard', name: 'dashboard', icon: 'space_dashboard', class: '', children: [] },
  {
    path: '/', title: 'Produit', name: 'produit', icon: '', class: '', children: [
      {
        path: '/', title: 'Véhircules', name: 'vehircules', icon: 'directions_car', class: '', children: [
          { path: '/', title: 'Automobile mono', name: 'automobileMono', icon: 'directions_car', class: '', children: [] },
          { path: '/', title: 'Automobile flotte', name: 'automobilFlotte', icon: 'directions_car', class: '', children: [] },
          { path: '/', title: 'Automobile leasing', name: 'automobileLeasing', icon: 'directions_car', class: '', children: [] },

        ]
      },
      {
        path: '/', title: 'Accidents individuels', name: 'accidentsIndividuels', icon: 'emergency', class: '', children: [
          { path: '/', title: 'Voyage', name: 'voyage', icon: 'travel_explore', class: '', children: [] },
          { path: '/', title: 'GAV', name: 'gAV', icon: 'travel_explore', class: '', children: [] },
        ]
      },
      { path: '/', title: 'Santé', name: 'sante', icon: 'nightlight', class: '', children: [] },
      { path: '/', title: 'Entreprises et professionnels', name: 'entreprisesProfessionnels', icon: 'apartment', class: '', children: [] },
      { path: '/', title: 'Habitations', name: 'habitations', icon: 'other_houses', class: '', children: [] },
      { path: '/', title: 'Prévoyance', name: 'preoyance', icon: 'account_balance', class: '', children: [
        { path: '/', title: 'Automobile flotte', name: 'automobilFlotte', icon: 'directions_car', class: '', children: [] },
        { path: '/', title: 'Automobile leasing', name: 'automobileLeasing', icon: 'directions_car', class: '', children: [] },
      ] },
    ]
  },

  {
    path: '/', title: 'CRM', name: 'crm', icon: '', class: '', children: [
      { path: '/', title: 'Clients', name: 'clients', icon: 'group', class: '', children: [] },
      { path: '/', title: 'Agences', name: 'agences', icon: 'store', class: '', children: [] },
    ]
  },
  {
    path: '/', title: 'Administration', name: 'administration', icon: '', class: '', children: [
      { path: '/', title: 'Utilisateurs', name: 'utilisateurs', icon: 'assignment_ind', class: '', children: [] },
      { path: '/', title: 'Produit', name: 'produit', icon: 'shopping_cart', class: '', children: [] },
      { path: '/', title: 'Référentiels', name: 'reférentiels', icon: 'health_and_safety', class: '', children: [] },
      { path: '/', title: 'Agences', name: 'agences', icon: 'store', class: '', children: [] },
      { path: '/', title: 'Agences', name: 'agences', icon: 'store', class: '', children: [] },
      { path: '/', title: 'Agences', name: 'agences', icon: 'store', class: '', children: [] },
    ]
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: any[] = [];
  sidebarState: string = '';
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.menuItems = NAV.filter(menuItem => menuItem);
    $(document).ready(function () {
    //   $('.lvl2').click(function() {
    //     $('.child1').css({
    //         'background-color': 'red',

    //     });
    // });
      //   var dropdown = document.getElementsByClassName("dropdown-btn");

      //   var i;

      //   for (i = 0; i < dropdown.length; i++) {
      //     dropdown[i].addEventListener("click", function (this: any) {

      //       this.classList.toggle("active");
      //       var dropdownContent = this.nextElementSibling;
      //       if (dropdownContent.style.display === "block") {

      //         dropdownContent.style.display = "none";
      //       } else {
      //         dropdownContent.style.display = "block";
      //       }
      //     });
      //   }
    });


  }

}