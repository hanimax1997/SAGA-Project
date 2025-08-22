import { PersonneContrat } from "./personneContrat";

export class Contrat {
  devis: Number;
  agence: Number;
  dateEffet: String;
  dateExpiration: String;
  personnes: PersonneContrat[];
  risqueList: any;
  auditUser: any;
  list: any;
  groupes: { description: string; groupeList: any; }[];
}

export let contratJson = {
  devis: 0,
  agence: 0,
  dateEffet: '',
  dateExpiration: '',
  auditUser: '',
  personnes: [],
  risqueList: [],
  groupes: [],
  list: []
}