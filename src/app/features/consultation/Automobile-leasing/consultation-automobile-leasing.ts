
import { Consultation } from "../consultation";

export const consultation_leasing: Consultation[] = [
    {libelle: 'Status', formName: 'status', type: 'select', ifselect: ["option 1", "option 2", "option 3"],position: 'col-md-3', required: false},
    {libelle: 'N° police', formName: 'police', type: 'string', ifselect: [], position: 'col-md-3', required: false},
    {libelle: 'Date debut', formName: 'dateDebut', type: 'date', ifselect: [], position: 'col-md-3', required: false},
    {libelle: 'Date fin', formName: 'dateFin', type: 'date', ifselect: [], position: 'col-md-3', required: false}
  ]
