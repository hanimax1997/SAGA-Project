import { Adresse } from "./adresse";
import { Contact } from "./contact";
import { Documents } from "./document";
import { DonneBancaire } from "./donnee-bancaire";
import { Modalite } from "./modalite";
import { ProfessionSecteur } from "./professionSecteur";

export class PersonnePhysique {
    idPersonne: number | undefined;
    vip: boolean | undefined;
    auditUser: string | undefined;
    nom: string | undefined;
    prenom1: string | undefined;
    prenom2: string | undefined;
    prenom3: string | undefined;
    nomJeuneFille: string | undefined;
    dateNaissance: Date | undefined;
    sexe: number | undefined;
    situationFamiliale: number | undefined;
    nin: number | undefined;
    pays: number | undefined;
    wilaya: number | undefined;
    commune: number | undefined;
    dateDebut: Date | undefined;
    dateFin: Date | undefined;
    nationalite: any;
    nationalitesList: any;
    professionSecteur: ProfessionSecteur[] | undefined;
    professionSecteurList: ProfessionSecteur[] | undefined;
    modaliteList: Modalite[] | undefined;
    payment: any | undefined;
    donneBancaireList: DonneBancaire[] | undefined;
    documentList: Documents[] | undefined;
    contactList: Contact[] | undefined;
    adressesList: Adresse[] | undefined;
    relationList: any;

}