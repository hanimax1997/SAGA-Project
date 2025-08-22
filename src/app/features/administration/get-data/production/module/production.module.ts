export interface Avenant {
  idAvenant: number;
  nomAvenant?: string;
  // ✅ ajoute cette ligne :
  agence?: {
    idAgence: number;
    codeAgence: string;
    nomAgence?: string;
    [key: string]: any;
  };
}
