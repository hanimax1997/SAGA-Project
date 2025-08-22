import { Garanties } from "./garanties";
export class SousGaranties {
    idSousGarantie: number | undefined;
    idGarantie: Garanties | undefined;
    idNationnal: string | undefined;
    description: string | undefined;
    valeurEnvloppe: number | undefined;
    dateDebut: Date | undefined;
    dateFin: Date | undefined;
    categorieGarantie: string | undefined;
}