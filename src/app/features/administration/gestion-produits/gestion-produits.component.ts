import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

export interface Referentiel {
  name: string;
  description: string;
  path: string;
}

const Referentiels: Referentiel[] = [
  {description: 'Ce réferentiels permet d’acceder aux Produit existants d’en ajouter ou de modifier l’existant', name: 'Produits', path: 'gestion-produit-risque'},
  {description: 'Ce réferentiels permet d’acceder aux familles de produit, d’ajouter de nouvelles et de les modifier', name: 'Famille de produits', path: 'gestion-famille-produit'},
  {description: 'Ce réferentiels permet d’acceder aux packs, d’ajouter de nouveaux et de les modifier selon le produit ', name: 'Packs', path: 'gestion-pack'},
  {description: 'Ce réferentiels permet d’acceder aux questionnaires, d’ajouter de nouveaux et de les modifier ', name: 'Questionnaires', path: 'gestion-questionnaires'},
  {description: 'Ce réferentiels permet d’acceder aux types de risques, d’ajouter de nouveaux et de les modifier selon le produit ', name: 'Type de risques', path: 'gestion-type-risque'},
  {description: 'Ce réferentiels permet d’acceder aux sous garanties, d’ajouter de nouvelles et de les modifier selon le produit', name: 'Garanties', path: 'gestion-garanties'},
  {description: 'Ce réferentiels permet d’acceder aux Taxes, d’ajouter de nouvelles et de les modifier selon le produit', name: 'Taxes', path: 'gestion-taxes'},
  {description: 'Ce réferentiels permet d’acceder aux réseaux de distribution, d’ajouter de nouvelles et de les modifier selon le produit', name: 'Réseau de distribution', path: 'gestion-reseaux-distribution'},
  // {description: 'Ce réferentiels permet d’acceder aux sous garanties, d’ajouter de nouvelles et de les modifier selon la garantie', name: 'Sous garanties', path: 'gestion-sous-garanties'},
  {description: 'Ce réferentiels permet d’acceder aux formule, d’ajouter de nouveaux et de les modifier selon le produit ', name: 'Formules', path: 'gestion-formule'},
  {description: 'Ce réferentiels permet d’acceder aux duree, d’ajouter de nouveaux et de les modifier selon le produit ', name: 'Durees', path: 'gestion-duree'},
];

@Component({
  selector: 'app-produits',
  templateUrl: 'gestion-produits.component.html',
  styleUrls: ['gestion-produits.component.scss']
})
export class GestionProduitsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description'];
  dataSource = new MatTableDataSource(Referentiels);

  constructor(private router : Router) { }

  ngOnInit(): void {
  
  }

  GoDetails(path: string){
    
    this.router.navigate([`/${path}/`]);
  }

}