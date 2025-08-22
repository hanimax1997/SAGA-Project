export class recours {

    "idRecours": any;
    "codeTypeRecours": any;
    "compagnyAdverse": { "idParam": any } | null;
    "codeSinistre": any;
    "codeGarantie": any;
    "codeReserve": any;
    "nomDebiteur": any;
    "prenomDebiteur": any;
    "montantPrevu": any;
    "modePaiement": { "idParam": any };
    "referenceRecouvrement": any;
    "adversaire": any
    "auditUser": any;
    "sinistreBeneficiaires": any[]
}

export class recoursOR {
    "idRecours": any;
    "idReglement": any;
    "montantRecu": any;
    "partAssureur": any;
    "partAssure": any;
    "modeRecouvrement": {
        "idParam": any
    };
    "referenceRecouvrement": any;
    "auditUser": any;
    "sinistreBeneficiaires": any
}

export class recoursCreate {
    "idRecours": null;
    "codeSinistre": string;
    "codeGarantie": string;
    "codeReserve": string;
    "montantPrevu": number;
    "montantRecu": null;
    "partAssureur": null;
    "partAssure": null;
    "modeRecouvrement": null;
    "referenceRecouvrement": null;
    "auditUser": null;
    "sinistreBeneficiaires": null
}
export class recoursUpdate {
    "idRecours": null;
    "codeSinistre": string;
    "codeGarantie": string;
    "codeTypeRecours": any;
    "codeReserve": string;
    "montantPrevu": number;
    "montantRecu": null;
    "partAssureur": null;
    "partAssure": null;
    "modeRecouvrement": { idParam: null };
    "referenceRecouvrement": null;
    "auditUser": null;
    "sinistreBeneficiaires": null;
    "prenomDebiteur": string;
    "nomDebiteur": string;
}

export class recoursBenef {
    "idRegelement": any;
    "nom": any;
    "prenom": any;
    "typeBeneficiaire": { "idParam": any };
    "pieceJustificatif": { "idParam": any };
    "typeMontant": { "idParam": any };
    "modePaiement": { "idParam": any };
    "montant": any;
    "reference": any;
    "auditUser": any;
    "dateNaissance":any

}
