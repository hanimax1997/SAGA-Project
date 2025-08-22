import { Component, ElementRef, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import * as script from '../../../../assets/scripts/scripts.bundle.js';
// import * as plugin from '../../../../assets/scripts/plugins.bundle.js';
declare class sideInfo {
  path: string;
  title: string;
  name: string;
  code: string;
  icon: string;
  class: string;
  type: string;
  children: sideInfo[];

  // constructor(path: string, title: string, name: string, class: string page: sideInfo[]) {
  //   this.children = page;
  // }
}

export const subNav =
  [
    { path: '/creation-devis', type:'dommage', title: 'Nouveau devis', name: 'devis', code: '45A', icon: 'add_circle', class: '', children: [] },
    { path: '/consultation', type:'dommage', title: 'Consultation des devis', code: '45A', name: 'consultation_devis', icon: 'manage_search', class: '', children: [] },
    { path: '/consultation-police', type:'dommage', title: 'Consultation polices', code: '45A', name: 'souscription', icon: 'manage_search', class: '', children: [] },
    { path: '/gestion-sinistre', type:'dommage', title: 'Sinistre', name: 'sinistre', code: '45A', icon: 'report', class: '', children: [] },
  ]
export const sideNav: sideInfo[] = [
  { path: '/dashboard',type:' ', title: 'Dashboard', name: 'dashboard', code: '45A', icon: 'space_dashboard', class: '', children: [] },

{
    path: '#', title: 'Véhicules', type:'dommage', name: 'vehircules', code: '45A', icon: 'directions_car', class: '', children: [
      { path: '/', type:'dommage', title: 'Automobile Mono', name: 'automobileMono', code: '45A', icon: 'directions_car', class: '', children: subNav },
      { path: '/', type:'dommage', title: 'Automobile Flotte', name: 'automobilFlotte', code: '45F', icon: 'directions_car', class: '', children: subNav },
      { path: '/', type:'dommage', title: 'Automobile Leasing', name: 'automobileLeasing', code: '45L', icon: 'directions_car', class: '', children: subNav },

    ]
  },
  {
    path: '#',type:'dommage', title: 'Accidents individuels', name: 'accidentsIndividuels', code: 'null', icon: 'emergency', class: '', children: [
      { path: '/', type:'vie', title: 'Voyage', name: 'voyage', icon: 'travel_explore', code: '20A', class: '', children: subNav },
      { path: '/', type:'vie', title: 'GAV', name: 'gav', icon: 'railway_alert', class: '', code: '20G', children: subNav },
    ]
  },
  {
    path: '#',type:'dommage', title: 'Santé', name: 'sante', code: 'null', icon: 'nightlight', class: '', children: [
      { path: '/',type:'dommage', title: 'Santé collective', code: 'null', name: 'santecollective', icon: 'personal_injury', class: '', children: subNav },
      { path: '/',type:'dommage', title: 'Santé individuelle', code: 'null', name: 'santeindividuelle', icon: 'personal_injury', class: '', children: subNav },
    ]
  },

  {
    path: '#',type:'dommage', title: 'Entreprises et professionnels', code: '95', name: 'entreprisesProfessionnels', icon: 'apartment', class: '', children: [
      { path: '/',type:'dommage', title: 'Incendie', code: 'null', name: 'incendie', icon: 'local_fire_department', class: '', children: subNav },
      { path: '/',type:'commercialLine', title: 'Engineering', code: 'En', name: 'engineering', icon: 'engineering', class: '', children: subNav },
      { path: '/',type:'commercialLine', title: 'Transport', code: 'T', name: 'transport', icon: 'directions_bus', class: '', children: subNav },
      { path: '/',type:'dommage', title: 'MRP', code: '95', name: 'mrp', icon: 'store', class: '', children: subNav },
      { path: '/',type:'dommage', title: 'CATNAT', code: '97', name: 'catnat', icon: 'flood', class: '', children: subNav },
    ]
  },
  {
    path: 'gestion-commercial-line',type:'dommage', title: 'Commercial line', code: '', name: 'commercialLine', icon: 'precision_manufacturing', class: '', children: [
    ]
  },
  {
    path: '#',type:'dommage', title: 'Habitations', code: 'null', name: 'habitations', icon: 'other_houses', class: '', children: [
      { path: '/',type:'dommage', title: 'MRH', code: '96', name: 'mrh', icon: 'real_estate_agent', class: '', children: subNav },
      // { path: '/',type:'dommage', title: 'CATNAT', code: 'null', name: 'catnat', icon: 'flood', class: '', children: subNav },
      { path: '/',type:'dommage', title: 'CATNAT', code: '97', name: 'catnat', icon: 'flood', class: '', children: subNav },
    ]
  },
  {
    path: '#',type:'dommage', title: 'Prévoyance', code: 'null', name: 'preoyance', icon: 'account_balance', class: '', children: [
      { path: '/',type:'dommage', title: 'DC entreprise', code: 'null', name: 'dcentreprise', icon: 'account_balance', class: '', children: subNav },
      { path: '/',type:'dommage', title: 'Prevoyance Individuelle', code: 'null', name: 'catnat.svg', icon: 'account_balance', class: '', children: subNav },
      { path: '/',type:'dommage', title: 'Prevoyance Collective', code: 'null', name: 'catnat.svg', icon: 'account_balance', class: '', children: subNav },
    ]
  },



  // {
  //   path: '/', title: 'CRM', name: 'crm', icon: '', class: '', children: [
  //     { path: '/', title: 'Clients', name: 'clients', icon: 'group', class: '', children: [] },
  //     { path: '/', title: 'Agences', name: 'agences', icon: 'store', class: '', children: [] },
  //   ]
  // },
  // {
  //   path: '/', title: 'Administration', name: 'administration', icon: '', class: '', children: [
  //     { path: '/', title: 'Utilisateurs', name: 'utilisateurs', icon: 'assignment_ind', class: '', children: [] },
  //     { path: '/', title: 'Produit', name: 'produit', icon: 'shopping_cart', class: '', children: [] },
  //     { path: 'gestion-referentiels', title: 'Référentiels', name: 'reférentiels', icon: 'health_and_safety', class: '', children: [] },
  //     { path: '/', title: 'Agences', name: 'agences', icon: 'store', class: '', children: [] },
  //   ]
  // },
];



////////////////////////////////////////
export const sideNavBEA: sideInfo[] = [
  { path: '/dashboard',type:' ', title: 'Dashboard', name: 'dashboard', code: '45A', icon: 'space_dashboard', class: '', children: [] },

// {
//     path: '#', title: 'Véhicules', type:'dommage', name: 'vehircules', code: '45A', icon: 'directions_car', class: '', children: [
//       { path: '/', type:'dommage', title: 'Automobile Mono', name: 'automobileMono', code: '45A', icon: 'directions_car', class: '', children: subNav },
//       { path: '/', type:'dommage', title: 'Automobile Flotte', name: 'automobilFlotte', code: '45F', icon: 'directions_car', class: '', children: subNav },
//       { path: '/', type:'dommage', title: 'Automobile Leasing', name: 'automobileLeasing', code: '45L', icon: 'directions_car', class: '', children: subNav },

//     ]
//   },
  {
    path: '#',type:'dommage', title: 'Accidents individuels', name: 'accidentsIndividuels', code: 'null', icon: 'emergency', class: '', children: [
      { path: '/', type:'vie', title: 'Voyage', name: 'voyage', icon: 'travel_explore', code: '20A', class: '', children: subNav },
      { path: '/', type:'vie', title: 'GAV', name: 'gav', icon: 'railway_alert', class: '', code: '20G', children: subNav },
    ]
  },
  // {
  //   path: '#',type:'dommage', title: 'Santé', name: 'sante', code: 'null', icon: 'nightlight', class: '', children: [
  //     { path: '/',type:'dommage', title: 'Santé collective', code: 'null', name: 'santecollective', icon: 'personal_injury', class: '', children: subNav },
  //     { path: '/',type:'dommage', title: 'Santé individuelle', code: 'null', name: 'santeindividuelle', icon: 'personal_injury', class: '', children: subNav },
  //   ]
  // },

  // {
  //   path: '#',type:'dommage', title: 'Entreprises et professionnels', code: '95', name: 'entreprisesProfessionnels', icon: 'apartment', class: '', children: [
  //     { path: '/',type:'dommage', title: 'Incendie', code: 'null', name: 'incendie', icon: 'local_fire_department', class: '', children: subNav },
  //     { path: '/',type:'dommage', title: 'Engineering', code: 'null', name: 'engineering', icon: 'engineering', class: '', children: subNav },
  //     { path: '/',type:'dommage', title: 'Transport', code: 'null', name: 'transport', icon: 'directions_bus', class: '', children: subNav },
  //     { path: '/',type:'dommage', title: 'MRP', code: '95', name: 'mrp', icon: 'store', class: '', children: subNav },
  //     { path: '/',type:'dommage', title: 'CATNAT', code: '97', name: 'catnat', icon: 'flood', class: '', children: subNav },
  //   ]
  // },
  // {
  //   path: 'gestion-commercial-line',type:'dommage', title: 'Commercial line', code: '', name: 'commercialLine', icon: 'precision_manufacturing', class: '', children: [
  //   ]
  // },
  {
    path: '#',type:'dommage', title: 'Habitations', code: 'null', name: 'habitations', icon: 'other_houses', class: '', children: [
      { path: '/',type:'dommage', title: 'MRH', code: '96', name: 'mrh', icon: 'real_estate_agent', class: '', children: subNav },
      // { path: '/',type:'dommage', title: 'CATNAT', code: 'null', name: 'catnat', icon: 'flood', class: '', children: subNav },
      { path: '/',type:'dommage', title: 'CATNAT', code: '97', name: 'catnat', icon: 'flood', class: '', children: subNav },
    ]
  },
  // {
  //   path: '#',type:'dommage', title: 'Prévoyance', code: 'null', name: 'preoyance', icon: 'account_balance', class: '', children: [
  //     { path: '/',type:'dommage', title: 'DC entreprise', code: 'null', name: 'dcentreprise', icon: 'account_balance', class: '', children: subNav },
  //     { path: '/',type:'dommage', title: 'Prevoyance Individuelle', code: 'null', name: 'catnat.svg', icon: 'account_balance', class: '', children: subNav },
  //     { path: '/',type:'dommage', title: 'Prevoyance Collective', code: 'null', name: 'catnat.svg', icon: 'account_balance', class: '', children: subNav },
  //   ]
  // },




  // {
  //   path: '/', title: 'CRM', name: 'crm', icon: '', class: '', children: [
  //     { path: '/', title: 'Clients', name: 'clients', icon: 'group', class: '', children: [] },
  //     { path: '/', title: 'Agences', name: 'agences', icon: 'store', class: '', children: [] },
  //   ]
  // },
  // {
  //   path: '/', title: 'Administration', name: 'administration', icon: '', class: '', children: [
  //     { path: '/', title: 'Utilisateurs', name: 'utilisateurs', icon: 'assignment_ind', class: '', children: [] },
  //     { path: '/', title: 'Produit', name: 'produit', icon: 'shopping_cart', class: '', children: [] },
  //     { path: 'gestion-referentiels', title: 'Référentiels', name: 'reférentiels', icon: 'health_and_safety', class: '', children: [] },
  //     { path: '/', title: 'Agences', name: 'agences', icon: 'store', class: '', children: [] },
  //   ]
  // },
];

//////////////////////////////////////
const vehiculeRoutesForCourtier={
  path: '#', title: 'Véhicules', type:'dommage', name: 'vehircules', code: '45A', icon: 'directions_car', class: '', children: [
    { path: '/', type:'dommage', title: 'Automobile Mono', name: 'automobileMono', code: '45A', icon: 'directions_car', class: '', children: subNav },
  ]
}
const vehiculeRoutesForBea={
 path: '#', class: '', children: [
    { path: '/', type:'dommage', title: 'Automobile Mono', name: 'automobileMono', code: '45A', icon: 'directions_car', class: '', children: subNav },
  ]
  
}

// const entreprisesProfessionnelsRoutesForBEA=
//  {
//     path: '#',type:'dommage', title: 'Entreprises et professionnels', code: '95', name: 'entreprisesProfessionnels', icon: 'apartment', class: '', children: [
    
//       { path: '/',type:'dommage', title: 'CATNAT', code: '97', name: 'catnat', icon: 'flood', class: '', children: subNav },
//     ]
//   }

  const accidentsIndividuelsRoutesForBEA=
{
    path: '#',type:'dommage', title: 'Accidents individuels', name: 'accidentsIndividuels', code: 'null', icon: 'emergency', class: '', children: [
      { path: '/', type:'vie', title: 'Voyage', name: 'voyage', icon: 'travel_explore', code: '20A', class: '', children: subNav },
      // { path: '/', type:'vie', title: 'GAV', name: 'gav', icon: 'railway_alert', class: '', code: '20G', children: subNav },
    ]
  }

  const HabitationsRoutesForBEA=
 {
    path: '#',type:'dommage', title: 'Habitations', code: 'null', name: 'habitations', icon: 'other_houses', class: '', children: [
      { path: '/',type:'dommage', title: 'MRH', code: '96', name: 'mrh', icon: 'real_estate_agent', class: '', children: subNav },
      // { path: '/',type:'dommage', title: 'CATNAT', code: 'null', name: 'catnat', icon: 'flood', class: '', children: subNav },
      { path: '/',type:'dommage', title: 'CATNAT', code: '97', name: 'catnat', icon: 'flood', class: '', children: subNav },
    ]
  }


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isExpanded: boolean;
  @Output() newItemEvent = new EventEmitter<any>();
  menuItems: sideInfo[] = [];
  status: boolean = false;
  isCourtier = sessionStorage.getItem('roles')?.includes("COURTIER");
  isBEA = sessionStorage.getItem('roles')?.includes("CDC_BEA");

  //  isExpanded=false
  // url = "../assets/scripts/plugins.bundle.js";
  // url2 = "../assets/scripts/scripts.bundle.js";
  constructor(public elRef: ElementRef, private router: Router) { }

  hide() {
    this.isExpanded = !this.isExpanded
    this.newItemEvent.emit(this.isExpanded);
  }

  ngOnInit(): void {
    if(this.isCourtier){
      const index = sideNav.findIndex(item => item.title === 'Véhicules');
      
      if (index !== -1) {
        sideNav[index] = vehiculeRoutesForCourtier;
      }
    }
    if(this.isBEA){
      const index = sideNavBEA.findIndex(item => item.title === 'Véhicules');

      // const index1 = sideNav.findIndex(item => item.title === 'Entreprises et professionnels');
      const index2 = sideNavBEA.findIndex(item => item.title === 'habitations');
      const index3 = sideNavBEA.findIndex(item => item.title === 'Accidents individuels');

      //HabitationsRoutesForBEA
      // accidentsIndividuelsRoutesForBEA
      //entreprisesProfessionnelsRoutesForBEA


      console.log('hgg',sideNav)
      
        // sideNavBEA[index] = vehiculeRoutesForBea;

        // sideNav[index1] = entreprisesProfessionnelsRoutesForBEA;
        sideNavBEA[index2] = HabitationsRoutesForBEA;
        sideNavBEA[index3] = accidentsIndividuelsRoutesForBEA;

      
    }
 if(this.isBEA){ 
     this.menuItems = sideNavBEA.filter(menuItem => menuItem);
    }else{
     this.menuItems = sideNav.filter(menuItem => menuItem);


 }
  }
  navigateDevis(path: any, code: any, name: any,type:any) {
    //this.router.navigateByUrl(url);
    
    if (code !=  "null") {
      if(type==="dommage"){
        this.router.navigate([path + '/'+ code + '/' + name]);

      }else{
        this.router.navigate([path + '/'+type+ '/'+ code + '/' + name]);

      }
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }
  }
}