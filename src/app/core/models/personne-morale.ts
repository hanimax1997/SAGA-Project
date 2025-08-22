import { Adresse } from "./adresse";
import { Contact } from "./contact";
import { Documents } from "./document";
import { DonneBancaire } from "./donnee-bancaire";

export class PersonneMorale {
    idPersonne: number | undefined;
    vip: boolean | undefined;
    auditUser: string | undefined;
    raisonSocial: string | undefined;
    nif: number | undefined;
    typeEntreprise: any | undefined;
    capitaleSocial: number | undefined;
    dateOuverture: Date | undefined;
    dateDebut: Date | undefined;
    dateFin: Date | undefined;
    chiffreAffaire: number | undefined;
    nombreSalarie: number | undefined;
    secteurActivite: any | undefined;
    payment: any | undefined;
    donneBancaireList: DonneBancaire[] | undefined;
    documentList: Documents[] | undefined;
    contactList: Contact[] | undefined;
    adressesList: Adresse[] | undefined;
    relationList: any;
}