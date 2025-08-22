import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';

@Injectable({
  providedIn: 'root'
})
export class OutputSinistreService {

  constructor() { }

  public export(): void {

    const docDefinition = {

      content: [
        {
          table: {
            widths: ['30%', '10%', '25%', '35%'],
            heights: [10, 10, 10, 10, 30, 10, 25],
            headerRows: 1,
            body: [
              [
                {
                  text:[ 
                    'Accident du : ',
                    {text: '30/12/2022', color: "#00008F", bold: true},
                  ],
                  colSpan: 3,
                  bold: true,
                  fontSize: 9
                },
                {
                },
                {
                },
                {
                  text:[ 
                    'A : ',
                    {text: 'Cité Ismail Yefsah, Bab Ezzouar, Alger, Algerie', color: "#00008F", bold: true},
                  ],
                  fontSize: 9,
                  rowSpan:3,
                  bold: true
                }
              ],
              [
                {
                  text:[ 
                    'Dossier Sinistre N° : ',
                    {text: '5160145A2300164', color: "#00008F", bold: true},
                  ],
                  colSpan: 3,
                  bold: true,
                  fontSize: 9
                },
                {
                },
                {
                },
                {
                }
              ],
              [
                {
                  text:[ 
                    "Police d'Assurance N° : ",
                    {text: '5160145A2300164', color: "#00008F", bold: true},
                  ],
                  colSpan: 3,
                  bold: true,
                  fontSize: 9
                },
                {
                  text: [
                    'Classificação do Efeito: ',
                    {
                      text: 'Leve',
                      bold: false
                    }
                  ],
                  colSpan: 3,
                  fontSize: 9,
                  bold: true
                },
                {
                },
                {
                }
              ],
              [
                {
                  text: 'Tempo de Exposição:',
                  colSpan: 2,
                  fontSize: 9,
                  bold: true
                },
                {
                },
                {
                  text: 'Medição:',
                  colSpan: 2,
                  fontSize: 9,
                  bold: true
                },
                {
                }
              ],
              [
                {
                  text: 'Fonte Geradora:',
                  border: [true, true, false, false],
                  colSpan: 2,
                  fontSize: 9,
                  bold: true
                },
                {
                },
                {
                  text: 'Téc. Utilizada:',
                  border: [false, true, true, false],
                  colSpan: 2,
                  fontSize: 9,
                  bold: true
                },
                {
                }
              ],
              [
                {
                  text: 'Conclusão:',
                  border: [true, false, true, true],
                  colSpan: 4,
                  fontSize: 9,
                  bold: true
                },
                {
                },
                {
                },
                {
                }
              ],
              [
                {
                  text: 'EPIs/EPCs:',
                  border: [true, true, false, true],
                  colSpan: 3,
                  fontSize: 9,
                  bold: true
                },
                {
                },
                {
                },
                {
                  text: 'CAs:',
                  border: [false, true, true, true],
                  fontSize: 9,
                  bold: true
                }
              ],
            ]
          }
        }
      ]
    };

    pdfMake.createPdf(docDefinition).download("test.pdf");
  }
}
