
import { Dictionnaire } from './dictionnaire';

export class  ParamRisqueProduit {

    idParamRisque: number;
    libelle: String | undefined;
    formName: String ;
    orderChamp: number ;
    position: String | undefined;
    typeChamp: Dictionnaire | undefined;
    sizeChamp: 0 | undefined;
    reponses: any[] | undefined;
    typeValeur: Dictionnaire | undefined;
    defaultValue: number;
    obligatoire: boolean | undefined;
    enable: boolean | undefined;
    category: any | undefined;
    codeCategory: any | undefined;
    parent: any | undefined;
    isParent: any | undefined;
    codeParam: any | undefined;
    valeurMin: any | undefined;
    valeurMax: any | undefined;
  sousProduit: any;
}
export class  ParamList {

        idParam: Number | undefined;
        reponse: {
            idReponse: Number | String,
            description: String | null
        }
    
}
