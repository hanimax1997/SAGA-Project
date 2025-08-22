import { Injectable } from '@angular/core';
import { constants } from 'fs/promises';
import { environment } from 'src/environments/environment';
//import { environment } from 'src/environments/environment.testing';
@Injectable()
// dev 

export class Constants {

  public static API_ENDPOINT_LOCAL: string = 'http://10.132.17.37'; //HIBA
  public static API_ENDPOINT_LOCAL_BAHIA: string = 'http://10.132.17.31'; //BAHIA 
  public static API_ENDPOINT_LOCAL_NESRINE: string = 'http://10.132.17.13'; //NESRINE 
  public static API_ENDPOINT_LOCAL_LATIF: string = 'http://10.132.17.3'; //LATIF 


  public static API_ENDPOINT_TEST: string = 'http://10.132.53.130';

  public static API_ENDPOINT_TAXE: string = environment.url + ':' + environment.portProduit + '/api/produit/taxe';
  public static API_ENDPOINT_FAMILLE_PRODUIT: string = environment.url + ':' + environment.portProduit + '/api/produit/familleproduit';
  public static API_ENDPOINT_TYPERISQUE: string = environment.url + ':' + environment.portProduit + '/api/produit/type-risque';
  public static API_ENDPOINT_GARANTIES: string = environment.url + ':' + environment.portProduit + '/api/produit/garantie';
  public static API_ENDPOINT_SOUSGARANTIES: string = environment.url + ':' + environment.portProduit + '/api/produit/sous-garantie';
  public static API_ENDPOINT_DUREE: string = environment.url + ':' + environment.portProduit + '/api/produit/duree';
  public static API_ENDPOINT_DUREE_BY_PRODUIT: string = environment.url + ':' + environment.portProduit + '/api/produit/ProduitDuree/getProduitDureeByProduit';

  public static API_ENDPOINT_Formule: string = environment.url + ':' + environment.portProduit + '/api/produit/formule';
  public static API_ENDPOINT_Questionnaires: string = environment.url + ':' + environment.portProduit + '/api/produit/questionnaire';
  public static API_ENDPOINT_Questions: string = environment.url + ':' + environment.portProduit + '/api/produit/question';
  public static API_ENDPOINT_reponses: string = environment.url + ':' + environment.portProduit + '/api/produit/reponse';
  public static API_ENDPOINT_param_risque: string = environment.url + ':' + environment.portProduit + '/api/produit/risqueParametre';
  public static API_ENDPOINT_param_risque_parent: string = environment.url + ':' + environment.portProduit + '/api/produit/risqueParametre/getparents';
  public static API_ENDPOINT_param_risque_list: string = environment.url + ':' + environment.portProduit + '/api/produit/risqueParametre/listparam';
  public static API_ENDPOINT_details_param_risque_list: string = environment.url + ':' + environment.portProduit + '/api/produit/risqueParametre/details';

  public static API_ENDPOINT_param_risque_all: string = environment.url + ':' + environment.portProduit + '/api/produit/risqueParametre/all';
  public static API_ENDPOINT_param_risque_devis_workflow: string = environment.url + ':' + environment.portProduit + '/api/produit/risqueParametre/workflow';
  public static API_ENDPOINT_param_risque_relation: string = environment.url + ':' + environment.portProduit + '/api/produit/risqueParametre/byParentParamRisque';
  public static API_ENDPOINT_param_risque_TABLE_PARENT: string = environment.url + ':' + environment.portProduit + '/api/produit/risqueParametre/fromtable';
  public static API_ENDPOINT_param_risque_activite_professionnel: string = environment.url + ':' + environment.portGeneric + '/api/generic/activite/professionel';

  //users        
  public static API_ENDPOINT_USERS: string = environment.url + ':' + environment.portUser + '/api/authentification/users'
  public static API_ENDPOINT_USERS_FILTER: string = environment.url + ':' + environment.portUser + '/api/authentification/filter'
  public static API_ENDPOINT_USERS_ROLES: string = environment.url + ':' + environment.portUser + '/api/authentification/roleslist'
  public static API_ENDPOINT_USERS_BY_ID: string = environment.url + ':' + environment.portUser + '/api/authentification/user'
  public static API_ENDPOINT_ADD_USER: string = environment.url + ':' + environment.portUser + '/api/authentification/createuser'
  public static API_ENDPOINT_UPDATE_USER: string = environment.url + ':' + environment.portUser + '/api/authentification/updateuser'
  public static API_ENDPOINT_CHANGE_PASSWORD: string = environment.url + ':' + environment.portUser + '/api/authentification/changePassword'
  public static API_ENDPOINT_FORGET_PASSWORD: string = environment.url + ':' + environment.portUser + '/api/authentification/forgetpassword'
  public static API_ENDPOINT_RESET_PASSWORD: string = environment.url + ':' + environment.portUser + '/api/authentification/resetPassword/'



  public static API_ENDPOINT_dictionnaire: string = environment.url + ':' + environment.portGeneric + '/api/generic/parametre/dictionnaire';
  public static API_ENDPOINT_PARAMETRE: string = environment.url + ':' + environment.portGeneric + '/api/generic/parametre/categorie';
  public static API_ENDPOINT_PRODUIT_CODE: string = environment.url + ':' + environment.portProduit + '/api/produit/reduit';
  public static API_ENDPOINT_PRODUIT_BY_ID: string = environment.url + ':' + environment.portProduit + '/api/produit';
  public static API_ENDPOINT_GET_ALL_TABLES: string = environment.url + ':' + environment.portGeneric + '/api/generic/corpssystemetable/allgeneriqtable';
  public static API_ENDPOINT_parametre: string = environment.url + ':' + environment.portGeneric + '/api/generic/parametre';
  //public static API_ENDPOINT_pays: string = environment.url + ':' + environment.portGeneric + '/api/generic/pays';
  public static API_ENDPOINT_pays: string = environment.url + ':' + environment.portGeneric + '/api/generic/pays';
  public static API_ENDPOINT_wilaya: string = environment.url + ':' + environment.portGeneric + '/api/generic/pays/wilaya';
  public static API_ENDPOINT_communes: string = environment.url + ':' + environment.portGeneric + '/api/generic/wilaya/commune';
  public static API_ENDPOINT_code_postal: string = environment.url + ':' + environment.portGeneric + '/api/generic/commune/code-postal';
  public static API_ENDPOINT_profesion: string = environment.url + ':' + environment.portGeneric + '/api/generic/profesion'
  public static API_ENDPOINT_secteur: string = environment.url + ':' + environment.portGeneric + '/api/generic/secteur-activite'
  public static API_ENDPOINT_produit: string = environment.url + ':' + environment.portProduit + '/api/produit'
  public static API_ENDPOINT_pack0: string = environment.url + ':' + environment.portProduit + '/api/produit/pack0'
  public static API_ENDPOINT_fractionnement: string = environment.url + ':' + environment.portProduit + '/api/produit/TypeFractionnement'
  public static API_ENDPOINT_TYPE_AVENANT: string = environment.url + ':' + environment.portProduit + '/api/produit/TypeAvenant'
  public static API_ENDPOINT_avenants: string = environment.url + ':' + environment.portContrat + '/api/contrat/avenant'
  public static API_ENDPOINT_AVENANT_EXPIRATIONDATE: string = environment.url + ':' + environment.portContrat + '/api/contrat/dateExpiration'

  public static API_ENDPOINT_avenant_tarification: string = environment.url + ':' + environment.portTarification + '/api/tarification/avenant/prime'

  // public static API_ENDPOINT_type_avenant: string = environment.url + ':' + environment.portProduit + '/api/produit/TypeAvenant'

  public static API_ENDPOINT_personne: string = environment.url + ':' + environment.portPersonne + '/api/personne';
  public static API_ENDPOINT_personne_morale: string = environment.url + ':' + environment.portPersonne + '/api/personne/personne-morale ';
  // public static API_ENDPOINT_CANAL: string = environment.url + ':'+environment.portGeneric+'/api/generic/parametre/dictionnaire/25 ';

  public static API_ENDPOINT_vehicule: string = environment.url + ':' + environment.portGeneric + '/api/generic/vehicule';
  public static API_ENDPOINT_marque: string = environment.url + ':' + environment.portGeneric + '/api/generic/vehicule/marque';
// vehicule
public static API_ENDPOINT_vehicule_modifier: string = environment.url + ':' + environment.portGeneric + '/api/generic/vehicule/modification';

public static API_ENDPOINT_vehicule_filtre: string = environment.url + ':' + environment.portGeneric + '/api/generic/vehicule/filtre';
public static API_ENDPOINT_modele: string = environment.url + ':' + environment.portGeneric + '/api/generic/vehicule/modele';

public static API_ENDPOINT_marque_save: string = environment.url + ':' + environment.portGeneric + '/api/generic/vehicule/marque/save';
public static API_ENDPOINT_modele_save: string = environment.url + ':' + environment.portGeneric + '/api/generic/vehicule/modele/save';



  //generic 
  public static API_ENDPOINT_GENERIC: string = environment.url + ':' + environment.portGeneric + '/api/generic'
  public static API_ENDPOINT_GENERIC_CONTACT: string = Constants.API_ENDPOINT_GENERIC + "/parametre/dictionnaire/3"
  public static API_ENDPOINT_GENERIC_WILAYA: string = Constants.API_ENDPOINT_GENERIC + "/pays/wilaya-by-pays" // 2 dans test  1 dans dev
  public static API_ENDPOINT_GENERIC_PAYS: string = Constants.API_ENDPOINT_GENERIC + "/pays"
  public static API_ENDPOINT_GENERIC_COMMUNE: string = Constants.API_ENDPOINT_GENERIC + "/pays/wilaya/commune-by-wilaya"
  public static API_ENDPOINT_GENERIC_ZONE: string = Constants.API_ENDPOINT_GENERIC + "/parametre/dictionnaire/11"
  public static API_ENDPOINT_GENERIC_CODES_POSTAL: string = Constants.API_ENDPOINT_GENERIC + "/commune/code-postal"
  public static API_ENDPOINT_RESEAUDISTRIBUTION: string = environment.url + ":" + environment.portAgence + "/api/agence/reseau-distribution"
  // public static API_ENDPOINT_GENERIC_CATEGORIE_RISQUE: string = environment.url + ":'+environment.portGeneric+'/api/generic/parametre/dictionnaire/72"
  // public static API_ENDPOINT_GENERIC_All_Status: string = environment.url + ":'+environment.portGeneric+'/api/generic/parametre/dictionnaire/28"

  //agence 
  public static API_ENDPOINT_AGENCE: string = environment.url + ":" + environment.portAgence + "/api/agence"
  public static API_ENDPOINT_GETALL_AGENCE: string = Constants.API_ENDPOINT_AGENCE + "/all"
  public static API_ENDPOINT_DETAIL_AGENCE: string = Constants.API_ENDPOINT_AGENCE + "/all-details"
  public static API_ENDPOINT_DESACTIVE_AGENCE: string = Constants.API_ENDPOINT_AGENCE + "/desactive"
  public static API_ENDPOINT_FILTRE_AGENCE: string = Constants.API_ENDPOINT_AGENCE + "/filtre"
  public static API_ENDPOINT_AGENCE_SAP_BP :string = Constants.API_ENDPOINT_AGENCE + "/generate-bp"
  public static API_ENDPOINT_AGENCE_SAP_CC :string = Constants.API_ENDPOINT_AGENCE + "/generate-cc"
  public static API_ENDPOINT_AGENCE_SAP_CO :string = Constants.API_ENDPOINT_AGENCE + "/generate-co"

  public static API_ENDPOINT_GET_PACK_VOYAGE: string = environment.url + ':' + environment.portProduit + '/api/controle/pack'; // TEST

    public static API_ENDPOINT_Extraire_Excel: string = environment.url + ":" + environment.portControles + "/api/controle/generate-excel"; //

  public static API_ENDPOINT_PACK: string = environment.url + ':' + environment.portProduit + '/api/produit/packComplet'; // TEST
  public static API_ENDPOINT_PACK_BY_PRODUIT: string = environment.url + ':' + environment.portProduit + '/api/produit/pack0/getPack0ByIdProduit'; // TEST
  public static API_ENDPOINT_PACK_BY_PRODUIT_PARAM: string = environment.url + ':' + environment.portProduit + '/api/produit/pack0/produit'; // TEST
  public static API_ENDPOINT_TARIF_PROPRIETAIRE: string = environment.url + ":" + environment.portTarification + "/api/tarification/avenant/carte-orange"; //
  public static API_ENDPOINT_PACK_DESC: string = environment.url + ':' + environment.portProduit + '/api/produit/packComplet/description';// TEST
  public static API_ENDPOINT_GET_PACK: string = environment.url + ':' + environment.portProduit + '/api/produit/pack0'; // TEST
  public static API_ENDPOINT_CATEGORY: string = environment.url + ':' + environment.portGeneric + '/api/generic/parametre/categoriePack/1';
  public static API_ENDPOINT_SOUS_CATEGORY: string = environment.url + ':' + environment.portGeneric + '/api/generic/parametre/categorie';
  // public static API_ENDPOINT_TYPE_VALEUR: string = environment.url + ':'+environment.portGeneric+'/api/generic/parametre/dictionnaire/20';
  //tarif 
  public static API_ENDPOINT_TARIF_RENOUVELLEMENT: string = environment.url + ":" + environment.portTarification + "/api/tarification/avenant/renouvellement"; // 
  public static API_ENDPOINT_TARIF: string = environment.url + ":" + environment.portTarification + "/api/tarification/prime"; // 
  public static API_ENDPOINT_DECOTE: string = environment.url + ":" + environment.portTarification + "/api/tarification/decote"; // 
  public static API_ENDPOINT_CONTROLE: string = environment.url + ":" + environment.portControles + "/api/controle/produit"; // 
  public static API_ENDPOINT_CONTROLE_FILE: string = environment.url + ":" + environment.portControles + "/api/controle/file/produit"; //
  public static API_ENDPOINT_CONTROLE_DESTINATION: string = environment.url + ":" + environment.portControles + "/api/controle/pack";  
  //devis 
  public static API_ENDPOINT_DEVIS: string = environment.url + ":" + environment.portDevis + "/api/devis" // 
  
  public static API_ENDPOINT_TARIF_REMPLISSAGE: string = environment.url + ":" + environment.portTarification + "/api/tarification/remplissage" // http://localhost:9095
  //devis 
  public static API_ENDPOINT_DEVIS_GET_ALL: string = Constants.API_ENDPOINT_DEVIS + "/all"
  public static API_ENDPOINT_DEVIS_BY_PRODUIT: string = Constants.API_ENDPOINT_DEVIS + "/code"
  public static API_ENDPOINT_DEVIS_FILTER: string = Constants.API_ENDPOINT_DEVIS + "/filtre"
  public static API_ENDPOINT_DEVIS_ACCESS: string = Constants.API_ENDPOINT_DEVIS + "/access"
  public static API_ENDPOINT_DEVIS_APPROUVAL: string = Constants.API_ENDPOINT_DEVIS + "/update"
  //user/
  public static API_ENDPOINT_GENERIC_ALL_USERS: string = environment.url + ":" + environment.portUser + "/api/authentification/users"

  // auth 
  public static API_ENDPOINT_AUTH: string = environment.url + ":" + environment.portUser + "/api/authentification/login" // 
  public static API_ENDPOINT_REFRESH_TOKEN: string = environment.url + ":" + environment.portUser + "/api/authentification/token/refresh" // 
  public static API_ENDPOINT_GET_USERID: string = environment.url + ":" + environment.portUser + "/api/authentification/get" // 
  public static API_ENDPOINT_GET_BY_USERID: string = environment.url + ":" + environment.portUser + "/api/authentification/user" // 
  //   http://localhost:'+environment.portPersonne+'/api/authentification/login?username=hiba.zouane@axa.dz&password=1234
  //test
  //contrat 

  public static API_ENDPOINT_MIGRATION: string = environment.url + ':' + environment.portContrat + "/api/migration" // 
  public static API_ENDPOINT_CONTRAT: string = environment.url + ':' + environment.portContrat + "/api/contrat" // 
  public static API_ENDPOINT_CONTRAT_BY_PRODUIT: string = environment.url + ':' + environment.portContrat + "/api/contrat/code" // 
  public static API_ENDPOINT_CONTRAT_GET_ALL: string = environment.url + "/all"
  public static API_ENDPOINT_CONTRAT_FILTRE: string = environment.url + ':' + environment.portContrat + '/api/contrat/filtre';
  public static API_ENDPOINT_CONTRAT_HISTO: string = environment.url + ':' + environment.portContrat + '/api/contrat/historique/last';
  public static API_ENDPOINT_CONTRAT_HISTO_RISQUE: string = environment.url + ':' + environment.portContrat + '/api/contrat/historique/last/risque';
  public static API_ENDPOINT_CONTRAT_ADD_GROUPE: string = environment.url + ':' + environment.portContrat + '/api/contrat/groupe';
  public static API_ENDPOINT_CONTRAT_HISTORIQUE: string = environment.url + ':' + environment.portContrat + '/api/contrat/historique';

  public static API_ENDPOINT_CONTRAT_COMEMRCIAL_LINE: string = environment.url + ':' + environment.portContrat + "/api/contrat/commercialLine" // 
  public static API_ENDPOINT_CONTRAT_COMEMRCIAL_LINE_SITE: string = environment.url + ':' + environment.portContrat + "/api/contrat/site" // 
  public static API_ENDPOINT_CONTRAT_PARAM_FLOTTE: string = environment.url + ':' + environment.portContrat + '/api/contrat/groupe';

  public static API_ENDPOINT_QUITTANCE: string = environment.url + ':' + environment.portContrat + "/api/contrat/quittance" // 

  //test
  //category
  public static API_ENDPOINT_TEST_CATEGORY: string = environment.url + ':' + environment.portGeneric + '/api/generic/parametre/categoriePack/1';
  public static API_ENDPOINT_TEST_SOUS_CATEGORY: string = environment.url + ':' + environment.portGeneric + '/api/generic/parametre/categorie';
  //garantie sous garantie 
  public static API_ENDPOINT_TEST_GARANTIES: string = environment.url + ':' + environment.portProduit + '/api/produit/garantie';
  public static API_ENDPOINT_TEST_SOUSGARANTIES: string = environment.url + ':' + environment.portProduit + '/api/produit/sous-garantie';
  //reduction
  public static API_ENDPOINT_TEST_REDUCTION: string = environment.url + ':' + environment.portProduit +'/api/produit/reduction';
  public static API_ENDPOINT_TEST_REDUCTION_BY_CONVENTION: string = environment.url + ':' + environment.portProduit + '/api/produit/reduction/convention';
  public static API_ENDPOINT_TEST_REDUCTION_FILTRE: string = environment.url + ':' + environment.portProduit + '/api/produit/reduction/filtre';
  public static API_ENDPOINT_TEST_REDUCTION_DEVIS: string = environment.url + ':' + environment.portTarification + '/api/tarification/reduction';

  //convention 
  public static API_ENDPOINT_TEST_CONVENTION: string = environment.url + ':' + environment.portProduit + '/api/produit/convention';
  public static API_ENDPOINT_TEST_CONVENTION_MODIF: string = environment.url + ':' + environment.portProduit + '/api/produit/convention/modification';
  public static API_ENDPOINT_TEST_CONVENTION_FILTER: string = environment.url + ':' + environment.portProduit + '/api/produit/convention/filtre';

  //sinistre
  public static API_ENDPOINT_TEST_SINISTRE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre';
  public static API_ENDPOINT_TEST_SINISTRE_BY_CODE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/getSinistreByCode';
  public static API_ENDPOINT_TEST_SINISTRE_BY_ID: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/getSinistreById';
  public static API_ENDPOINT_TEST_SINISTRE_NATURE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/getNatureDomage';
  public static API_ENDPOINT_TEST_SINISTRE_FILTER: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/filtre';
  public static API_ENDPOINT_TEST_SINISTRE_DOUBLONS_ZONE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/existDoublonByZone';
  public static API_ENDPOINT_TEST_SINISTRE_DOUBLONS: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/verifierExisteDoublon';
  public static API_ENDPOINT_TEST_GET_BY_LIEN: string = environment.url + ':' + environment.portGeneric + '/api/generic/parametre/dictionnaire/getbyLien';
  public static API_ENDPOINT_RECOUR_SINISTRE:string= environment.url + ':' + environment.portSinistre+ '/api/sinistre/TrasnfererRecour'

  // modif sinistre
  public static API_ENDPOINT_TEST_SINISTRE_UPDATE_INFOS: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/update';
  public static API_ENDPOINT_TEST_SINISTRE_UPDATE_PERSONNE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/personne/update';
  public static API_ENDPOINT_TEST_SINISTRE_ADD_PERSONNE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/personne';
  public static API_ENDPOINT_TEST_SINISTRE_DESISTER_SINISTRE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/desisterSinistre';
  public static API_ENDPOINT_TEST_SINISTRE_FRAUDE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/fraudeSinistre';
  public static API_ENDPOINT_TEST_SINISTRE_UPDATE_FRAUDE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/updateFraude';
  public static API_ENDPOINT_TEST_SINISTRE_EDIT_ASSISTEUR: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/assistance/update';
  public static API_ENDPOINT_TEST_SINISTRE_ADD_ASSISTEUR: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/assistance';
  public static API_ENDPOINT_TEST_SINISTRE_CANCEL: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/annulerSinistre';
  public static API_ENDPOINT_TEST_SINISTRE_REOPEN: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reouvertureSinistre';
  public static API_ENDPOINT_TEST_SINISTRE_CLOTURER: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/cloturer';
  public static API_ENDPOINT_TEST_SINISTRE_GET_INFOMODIF: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reserve/getInformationReserveOpOr';


  //gestionnaire
  public static API_ENDPOINT_TEST_SINISTRE_GET_RESERVE_PAIEMENT: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reserve/list';
  public static API_ENDPOINT_TEST_SINISTRE_GET_RESERVE_BYID: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reserve';
  public static API_ENDPOINT_TEST_SINISTRE_CANCEL_RESERVE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reserve/annuler';
  public static API_ENDPOINT_TEST_SINISTRE_MODIFIER_RESERVE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reserve/modifierReserve';
  public static API_ENDPOINT_TEST_SINISTRE_GET_RESERVE_RECOURS_TAB: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/recours/reserves';
  public static API_ENDPOINT_TEST_SINISTRE_RESERVE_RECOURS_CREATE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/recours/create';
  public static API_ENDPOINT_TEST_SINISTRE_RESERVE_GET_RECOURS: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/recours';
  public static API_ENDPOINT_TEST_SINISTRE_RESERVE_CREATE_OR: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/recours/ordreReglement';
  public static API_ENDPOINT_TEST_SINISTRE_RESERVE_RECOURS_UPDATE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/recours/update';
  public static API_ENDPOINT_TEST_SINISTRE_RESERVE_RECOURS_ADDBENEF: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/recours/addBeneficiaires';
  public static API_ENDPOINT_TEST_SINISTRE_RESERVE_RECOURS_ALLBENEF: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/recours/beneficiaires';

  // mission expertise
  public static API_ENDPOINT_TEST_CAPITAL_BDG: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/missionExpertise/EligibiliteBDG';
  public static API_ENDPOINT_TEST_EXPERTS_ALL: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/expert';
  public static API_ENDPOINT_TEST_EXPERTISE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/missionExpertise';
  public static API_ENDPOINT_TEST_MISSIONS_EXPERTISES_ALL: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/missionExpertise/GetSinistre';
  public static API_ENDPOINT_TEST_MISSIONS_EXPERTISES_ALL_BY_CODE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/missionExpertise/GetMissionExpertise';
  public static API_ENDPOINT_TEST_MISSIONS_EXPERTISES_OPERATION: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/missionExpertise/OperationOnME';


  // OP
  public static API_ENDPOINT_TEST_SINISTRE_RESERVE_CALCULATEUR: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/decomptepv';
  public static API_ENDPOINT_TEST_SINISTRE_RESERVE_CALCULATEUR_SAVE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/decomptepv';

  //instance

  public static API_ENDPOINT_TEST_SINISTRE_CREATE_INSTANCE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/op/instance';
  public static API_ENDPOINT_TEST_SINISTRE_CHECK_PAIEMENT: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/check';
  public static API_ENDPOINT_TEST_SINISTRE_PAIEMENT: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/op';

  //OP        
  public static API_ENDPOINT_TEST_CREATE_OP: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/op';
  public static API_ENDPOINT_TEST_LIST_EXPERT: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/expert/bySinistre';

  public static API_ENDPOINT_TEST_OP_FILTER: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/filtre';
  public static API_ENDPOINT_TEST_OP_BY_SINISTRE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/list';
  public static API_ENDPOINT_TEST_OP_LIST_BLESSE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/personne/blesse';
  public static API_ENDPOINT_TEST_OP_LIST_TIERS: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/personne/tier';
  public static API_ENDPOINT_TEST_OP_BY_ID: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement';
  public static API_ENDPOINT_TEST_OP_APPROUVE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/approuver';
  public static API_ENDPOINT_TEST_OP_ANNULATION: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/annulerOp';

  public static API_ENDPOINT_TEST_SINISTRE_GET_ALL_INSTANCE: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/instance/sinistre';
  public static API_ENDPOINT_TEST_SINISTRE_GET_INSTANCE_ID: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/instance';
  public static API_ENDPOINT_TEST_SINISTRE_ADD_DOCUMENT: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/instance/documenttoinstance';
  public static API_ENDPOINT_TEST_SINISTRE_EDIT_DOCUMENT: string = environment.url + ':' + environment.portSinistre + '/api/sinistre/reglement/instance/document';




}


