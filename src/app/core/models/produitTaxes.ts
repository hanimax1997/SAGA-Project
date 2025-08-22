import { Taxe } from "./taxe";

export class produitTaxes {
    idCodeProduitTaxe: string|undefined
    idTaxe: string | undefined;
    dateDebut: Date |undefined;
    dateFin: Date |undefined;
    auditDate: Date |undefined;
    taxe: Taxe|undefined;
}
