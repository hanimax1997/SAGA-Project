import { produitConsultation } from "./model-produit";

export const param_produit: produitConsultation[] = [

    {idParamProduit: 1, libelle: 'devis', description:'Devis', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true}, 
    {idParamProduit: 2, libelle: 'devisEnLigne', description:'Devis en ligne', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true}, 
    {idParamProduit: 3, libelle: 'payPrint',description:'Pay and print', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true}, 
    {idParamProduit: 4, libelle: 'gestionDeSinistre',description:'Gestion des sinistres', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true}, 
    {idParamProduit: 5, libelle: 'gestionDeSinistreLigne',description:'Gestion des sinistres en ligne', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true}, 
    {idParamProduit: 6, libelle: 'capping',description:'Capping', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true}, 
    {idParamProduit: 7, libelle: 'convetion',description:'Convetion', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true}, 
    {idParamProduit: 8, libelle: 'bonusMalus',description:'Bonus & malus', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true}, 
    {idParamProduit: 9, libelle: 'prunning',description:'Prunning', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true},
    {idParamProduit: 10, libelle: 'souscriptionEnLigne', description:'Souscription en ligne', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true},
    {idParamProduit: 11, libelle: 'fractionnement',description:'Fractionnement', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true},
    {idParamProduit: 12, libelle: 'multirisque', description:'Multirisque', type: 'checkbox', ifselect: ["Oui", "Non"],position: 'col-md-6', required: true},
]