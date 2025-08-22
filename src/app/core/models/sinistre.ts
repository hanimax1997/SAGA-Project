
export class SinistrePostJson {
    "natureDommage": any;
    "numPolice": any;
    "agenceContrat": any;
    "dateDeclaration": any;
    "dateSurvenance": any;
    "adresse": any;
    "commune": any;
    "wilaya": any;
    "communeSurvenance": any;
    "wilayaSurvenance": any;
    "paysSurvenance": any;
    "idHistorique": any;
    "produit": any;
    "causeSinistre": {
        "idParam": any
    };
    "origineSinistre": {
        "idParam": any
    } | null;
    "contactOrigine": any;
    "autorite": any;
    "descriptionSinistre": any;
    "auditUser": any;
    "agence": {
        "idParam": any
    };;
    "codeRisque": any;
    "tauxResponsabilite": any;
    "zoneAffecte": {
        "idParam": any
    };
    "canCirculate": any;
    "assisteurExist": any;
    "idAssisteur": any;
    "appelAssisteur": boolean;
    "immatriculation": {
        "idParam": any;
        "valeur": any;
    };

    "personnes": any[];
    "paramContratList": any[]
}
export class PersonneSinistre {
    "typePersonne": any;
    "isFamilly": any;
    "tauxResponsabilite": any;
    "idPersonne": any;
    "nom": any;
    "prenom": any;
    "adresse": any;
    "contact": any;
    "companyAdverse": {
        "idParam": any
    };
    "dateDelivrance": any;
    "agenceAdverse": {
        "idParam": any
    } | null;
    "numPoliceAdverse": any;
    "nomConducteur": any;
    "prenomConducteur": any;
    "dateNaissance": any;
    "etatSinistre": {
        "idParam": any
    };
    "raisonSociale": any
    "numeroPermis": any;
    "paramRisque": any[];
    "auditUser": any
}

export class Calculateur {
    //"sinistreReserve": any;
    "missionExpertise": any
    "typePerte": {
        "idParam": any
    };
    "visiteRisque": {
        "idParam": any
    };
    "calculHtTtc": {
        "idParam": any
    };
    "referencePV": any;
    "avisPv": {
        "idParam": any
    };
    "controleUsage": {
        "idParam": any,
        "code": any,
    };
    "sinistreDecompteInfos": Decompte[]
    "dommageBrut": any;
    "vetuste": any;
    "dommageNetVetuste": any;
    "capitalAssure": any;
    "capitalExpert": any;
    "valeurExpert": any;
    "rpcapitaux": any;
    "rcpayee": any;
    "rcdue": any;
    "rcrp": any;
    "reglePropotionnel": any;
    "dommageNetRp": any;
    "nbImmobilisation": any;
    "immobilisation": any;
    "franchise": any;
    "partTechnique": any;
    "partCommeciale": any;
    "totalRegle": any;
    "datePv": any;
}
export class Decompte {
    "typeInfoDecompte": {
        "idParam": any,
        "code": any
    };
    "brut": any;
    "pourcentageVetuste": any;
    "vetuste": any;
    "retenue": any;
    "net": any;
    "motif": any;
}
export class Instance {
    "auditUser": any;
    "typeInstance": {
        "idParam": any
    };
    "description": string;
    "dateOuverture": any;
    "decompteOp": any;
    "instanceDocuments": InstanceDocuments[]

}
export class InstanceDocuments {
    "typeInstance": {
        "idParam": any
    };
    "document": {
        "idParam": any
    };
    "statutDocument": {
        "idParam": any
    };
    "dateDebut": any;
    "dateFin": any;
    "auditUser": any

}
export class PaiementSinistre {

    "typeOp": {
        "idParam": any,
        "code": any
    };
    "modeRecouvrement": {
        "idParam": any,
        "code": any
    };
    "referencePaiement": string;
    "partAssure": any;
    "sinistre": any;
    "statut": { "idParam": any };
    "decompteOp": any;
    "instance": { "idSinistreInstance": any };
    "sinistreRecours": any;
    "montant": any;
    "agence": any;
    "referencePayement": any;
    "auditUser": any
}
