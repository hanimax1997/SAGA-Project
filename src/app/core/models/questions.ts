import { Reponses } from "./reponses";
export class Questions {
    id: number | undefined;
    idQuestion: string | undefined;
    idQuestionnaire: number | undefined;
    reponseList: Reponses[] | undefined;
    description: string | undefined;
    numeroOrdre: number | undefined;
    dateDebut: Date | undefined;
    dateFin: Date | undefined;
    auditUser: string| undefined;
}