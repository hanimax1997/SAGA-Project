
import { Consultation } from "../../consultation/consultation"

export const consultation_personne_moral: Consultation[] = [
  {libelle: 'N° Client', formName: 'idPersonne', type: 'string', ifselect: [], position: '', required: false},
  {libelle: 'Raison Social', formName: 'raisonSocial', type: 'string', ifselect: [],position: '', required: false},
  {libelle: 'Date Ouverture', formName: 'dateOuverture', type: 'date', ifselect: [], position: '', required: false},
  {libelle: 'NIF', formName: 'nif', type: 'string', ifselect: [], position: '', required: false}
]
export const consultation_personne_physique: Consultation[] = [
  {libelle: 'N° Client', formName: 'idPersonne', type: 'string', ifselect: [], position: '', required: false},
  {libelle: 'Nom Personne', formName: 'nom', type: 'string', ifselect: [],position: '', required: false},
  {libelle: 'Date Naissance', formName: 'dateNaissance', type: 'date', ifselect: [], position: '', required: false},
  {libelle: 'NIN', formName: 'nin', type: 'string', ifselect: [], position: '', required: false},
]
