import { Questions } from "./questions";
export class Questionnaires {
    idQuestionnaire: number | undefined;
    description: string | undefined;
    questions: Questions[] | undefined;
    dateDebut: Date | undefined;
    dateFin: Date | undefined;
    auditUser: string| undefined;
}