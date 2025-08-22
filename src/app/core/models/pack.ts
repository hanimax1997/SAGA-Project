export let Pack = {
    "description": "",
    "dateDebut": new Date(),
    "dateFin": new Date(),
    "categorieList": [
        {
            "idcaracteristique": 1,
            "typeValeur": "pourcentage",
            "categorieValeur": "2",
            "SousCategorieValeur": "2",
            "valeur": 50
        },
        {
            "idcaracteristique": 2,
            "typeValeur": "valeur maximal",
            "categorieValeur": "2",
            "SousCategorieValeur": "2",
            "valeur": 500
        },
    ],
    "garantie": [
        {
            "idGarantie": "",
            "obligatoire": false,
            "categorie": [
                {
                    "idcaracteristique": 1,
                    "typeValeur": "",
                    "categorieValeur": "",
                    "sousCategorieValeur": "",
                    "valeur": 0
                }
            ],
            "sousGarantie": [
                {
                    "idSousGarantie": "",
                    "categorie": [
                        {
                            "idcaracteristique": 1,
                            "typeValeur": "",
                            "categorieValeur": "",
                            "sousCategorieValeur": "",
                            "valeur": 0
                        }
                    ]
                }
            ]
        }
    ]
}
export let PackExample =
{
    "description": "test pack complet",
    "dateDebut": "2022-12-12T23:00:00.000Z",
    "dateFin": "2022-12-29T23:00:00.000Z",
    "categorie": [
        {
            "idcaracteristique": 1,
            "typeValeur": 1,
            "categorieValeur": 1,
            "sousCategorieValeur": 1,
            "valeur": "15"
        },
        
    ],
    "garantie": [
        {
            "idGarantie": 58,
            "description": 'garantie 2',
            "obligatoire": "true",
            "categorie": [
                {
                    "idcaracteristique": 1,
                    "typeValeur": 1,
                    "categorieValeur": 1,
                    "sousCategorieValeur": 1,
                    "valeur": "20"
                },
                {
                    "idcaracteristique": 2,
                    "typeValeur": 3,
                    "categorieValeur": 2,
                    "sousCategorieValeur": 1,
                    "valeur": "0"
                }
            ],
            "sousGarantie": [
                {
                    "idSousGarantie": 195,
                    "description": 'sous garantie 2',
                    "idGarantie": 58,
                    "obligatoire": "true",
                    "categorie": [
                        {
                            "idcaracteristique": 1,
                            "typeValeur": 1,
                            "categorieValeur": 1,
                            "sousCategorieValeur": 1,
                            "valeur": "20"
                        },
                        {
                            "idcaracteristique": 2,
                            "typeValeur": 3,
                            "categorieValeur": 2,
                            "sousCategorieValeur": 1,
                            "valeur": "0"
                        }
                    ]
                }
            ]
        },
        {
            "idGarantie": 59,
            "description": 'garantie 5',
            "obligatoire": "false",
            "categorie": [
                {
                    "idcaracteristique": 1,
                    "typeValeur": 3,
                    "categorieValeur": 2,
                    "sousCategorieValeur": 1,
                    "valeur": "154000"
                }
            ],
            "sousGarantie": []
        }
    ]
}

