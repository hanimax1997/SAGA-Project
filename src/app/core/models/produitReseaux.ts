import { ReseauDistribution } from "./reseau-distribution";

export class produitReseaux {
    idCodeProduitReseau: string|undefined
    dateDebut: Date |undefined;
    dateFin: Date |undefined;
    auditUser: string|undefined
    auditDate: Date |undefined;
    reseau: ReseauDistribution|undefined;
}
