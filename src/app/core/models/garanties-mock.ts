import { Garanties } from "./garanties";

export const garanties_liste: Garanties[] = [
    {
        id: 1,
        idNationnal: '1',
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
        idNationnal: '1',
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
        idNationnal: '1',
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
        idNationnal: '1',
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
        idNationnal: '1',
        description: 'Hospitalisation',
        valeurGarantie: 2300,
        valeurEnvloppe: 3500.51505,
        date_debut: new Date(),
        date_fin: new Date(),
        categorieGarantie: 'Vie',
        taxe: false
    }
] 