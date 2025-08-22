import {FamilleProduit} from "./famille-produit"
import {TYPERISQUE} from "./type-risque"
import {Taxe} from "./taxe"
import {ReseauDistribution} from "./reseau-distribution"
import {Duree} from "./duree"
import { ParamRisqueProduit } from "./param_risque_produit"
import { Questionnaires } from "./questionnaires"
import { pack0 } from "./pack0"
import { produitTaxes } from "./produitTaxes"
import { produitReseaux } from "./produitReseaux"
import { produitDurees } from "./produitDurees"
import { produitTypeAvenants } from "./produitTypeAvenants"
import { Fractionnement } from "./fractionnement"
import { produitTypeFractionnements } from "./produitTypeFractionnements"


export class Produit {
    codeProduit: string | undefined;
    description: string | undefined;
    idFamilleProduit: FamilleProduit | undefined;
    idTypeRisqueProduit: TYPERISQUE | undefined;
    paramRisqueProduit: ParamRisqueProduit[] | undefined;
    codificationNationale: string | undefined;
    multirisque: string | undefined;
    devis : string | undefined;
    convetion: string | undefined;
    devisEnLigne : string | undefined;
    souscriptionEnLigne : string | undefined;
    payPrint : string | undefined;
    gestionDeSinistre: string | undefined;
    gestionDeSinistreLigne : string | undefined;
    capping: string | undefined;
    bonusMalus: string| undefined;
    prunning: string| undefined;
    dateDebut: string| undefined;
    dateFin: string| undefined;
    auditUser: string| undefined;
    auditDate: string| undefined;
    idTaxes : Taxe[]| undefined;
    produitTaxes: produitTaxes[]| undefined;
    idReseaux : ReseauDistribution[]| undefined;
    produitReseaux: produitReseaux[]|undefined;
    idDurees : Duree[]| undefined;
    produitDurees : produitDurees[]|undefined;
    idQuestionnaires: Questionnaires[]|undefined;
    questionnaires: Questionnaires[]|undefined;
    idTypeAvenants : string[]| undefined;
    produitTypeAvenants: produitTypeAvenants[]|undefined;
    idTypeFractionnements : Fractionnement[]| undefined;
    produitTypeFractionnements: produitTypeFractionnements[]| undefined;
    packs : pack0[]| undefined;
    produitPacks:pack0[]| undefined;
    paramProduit: any| undefined;
    param_Produit_Reponses: any | undefined;
    paramRisqueProduits: any;
    paramRisqueWorkflows: any;
}