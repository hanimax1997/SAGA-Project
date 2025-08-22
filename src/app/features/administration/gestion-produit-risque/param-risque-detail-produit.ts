
import { produitConsultation } from "./model-produit";

export const paramDetailProduitNumerique: any = [
    {idParam: 67, libelle: 'defaultValue', description:'Valeur par defaut', type: 'number', ifselect: [],position: 'col-md-6', required: true},
    {idParam: 68, libelle: 'pourcentage', description:'pourcentage', type: 'number', ifselect: [],position: 'col-md-6', required: true},
    {idParam: 69, libelle: 'valeurMin',description:'Valeur min', type: 'number', ifselect: [],position: 'col-md-6', required: true},
    {idParam: 70, libelle: 'valeurMax', description:'Valeur max', type: 'number', ifselect: [],position: 'col-md-6', required: true},
]

export const paramDetailProduitString: any = [
    {idParam: 67, libelle: 'defaultValue', description:'Valeur par defaut', type: 'string', ifselect: [],position: 'col-md-6', required: true},
]