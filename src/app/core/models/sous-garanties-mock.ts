import { SousGaranties } from "./sous-garanties" 

export const sous_garanties_liste: SousGaranties[] = [
    {
        id: 1,
        id_garantie: 1,
        codificationNationale: '03116',
        description: 'Assistance',
        valeurGarantie: 16000,
        valeurEnvloppe: 23000,
        date_debut: new Date(),
        date_fin: new Date(),
        categorieGarantie: 'Vie',
        taxe: true
    },
    {
        id: 2,
        id_garantie: 2,
        codificationNationale: '03116',
        description: 'Dommage tous accident',
        valeurGarantie: 20000,
        valeurEnvloppe: 223,
        date_debut: new Date(),
        date_fin: new Date(),
        categorieGarantie: 'Dommage',
        taxe: true
    },
    {
        id: 3,
        id_garantie: 3,
        codificationNationale: '03116',
        description: 'Consultation specialiste',
        valeurGarantie: 1000,
        valeurEnvloppe: 25,
        date_debut: new Date(),
        date_fin: new Date(),
        categorieGarantie: 'Dommage',
        taxe: false
    },
    {
        id: 4,
        id_garantie: 4,
        codificationNationale: '03116',
        description: 'Optique',
        valeurGarantie: 30000,
        valeurEnvloppe: 1000,
        date_debut: new Date(),
        date_fin: new Date(),
        categorieGarantie: 'Vie',
        taxe: true
    },
    {
        id: 5,
        id_garantie: 5,
        codificationNationale: '03116',
        description: 'Hospitalisation',
        valeurGarantie: 2300,
        valeurEnvloppe: 3500.51505,
        date_debut: new Date(),
        date_fin: new Date(),
        categorieGarantie: 'Vie',
        taxe: false
    },
    {
        id: 6,
        id_garantie: 5,
        codificationNationale: '03116',
        description: 'Consultation generaliste',
        valeurGarantie: 30000,
        valeurEnvloppe: 1000,
        date_debut: new Date(),
        date_fin: new Date(),
        categorieGarantie: 'Vie',
        taxe: true
    },
] 