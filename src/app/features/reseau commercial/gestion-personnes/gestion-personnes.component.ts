import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PersonneService } from 'src/app/core/services/personne.service';
import { CreationPersonneComponent } from './creation-personne/creation-personne.component';
import { EditPersonneComponent } from './edit-personne/edit-personne.component';

import { MatDialog } from '@angular/material/dialog';
import { Consultation } from '../../consultation/consultation';
import { consultation_personne_moral, consultation_personne_physique } from './consultation-personne';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { GenericService } from 'src/app/core/services/generic.service';

@Component({
  selector: 'app-gestion-personnes',
  templateUrl: './gestion-personnes.component.html',
  styleUrls: ['./gestion-personnes.component.scss']
})
export class GestionPersonnesComponent implements OnInit {

  displayedColumns: string[] = ['idClient', 'assure', 'typePersonne', 'date', 'numero', 'action'];
  dataSource: MatTableDataSource<Object> | any;
  lengthColumns = this.displayedColumns.length;

  consultations: Consultation[] = consultation_personne_moral; //champs du filtre personne
  formFilter: FormGroup | any;
  typePersonne: string = "";

  title: string = "Personnes";
  devis: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | any;
  personneTable: any;

  constructor(private router: Router, private personneService: PersonneService, public dialog: MatDialog, private formBuilderAuth: FormBuilder) { }

  changeClient(typePersonne: any) {
    this.typePersonne = typePersonne.value
    if (typePersonne.value == "moral") {
      this.consultations = consultation_personne_moral;
    }
    else {
      this.consultations = consultation_personne_physique;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //debut output devis
  buildTableBody(data: any, columns: any) {
    var body = [];

    if (columns.includes("text1"))
      body.push(["", "", ""])
    else {
      if (columns.includes("prime")) {
        columns = columns.map((col: any) => {
          col.text = col
          col.style = "headerTable"
        })
        body.push(columns);
      }
      else
        body.push(columns);
    }

    data.forEach(function (row: any) {
      const dataRow: any = [];

      columns.forEach(function (column: any) {
        dataRow.push(row[column]);
      })

      body.push(dataRow);
    });

    return body;
  }

  table(data: any, columns: any) {
    let pourcentage = 100 / columns.length;
    let width: any = []
    columns.map((col: any) => {
      width.push(pourcentage + "%")
    })


    return [{
      layout: columns.includes("text1") ? 'noBorders' : '',
      style: "table",
      table: {
        headerRows: 1,
        widths: width,
        margin: [5, 5, 5, 5],
        body: this.buildTableBody(data, columns)
      }
    }];
  }

  telecharger(devis: any) {
    let index = 0;
    let risque: any = [];
    let garanties: any = [];
    let primes: any = [];
    let champs: any = ["Garanties"];
    let primeChamps: any = [];
    let widthChamp: any = [];
    let widthChampPrime: any = [];
    let primetotal = "";

    while (index < devis?.risqueList?.length) {
      risque.push({
        text1: [
          { text: devis?.risqueList[index].paramRisque.libelle + ": ", bold: true, fontSize: "10" },
          { text: devis?.risqueList[index].valeur.split("T")[0], fontSize: "10" },
        ],
        text2: [
          { text: devis?.risqueList[index + 1].paramRisque.libelle + ": ", bold: true, fontSize: "10" },
          { text: devis?.risqueList[index + 1].valeur.split("T")[0], fontSize: "10" },
        ],
        text3: [
          { text: devis?.risqueList[index + 2].paramRisque.libelle + ": ", bold: true, fontSize: "10" },
          { text: devis?.risqueList[index + 2].valeur.split("T")[0], fontSize: "10" },
        ],
      })
      index = index + 3;
    }

    index = 0;
    while (index < devis?.paramDevisList?.length) {
      devis?.paramDevisList[index].categorieList?.map((element: any) => {
        champs.push(element?.description)
      });

      devis?.paramDevisList[index].sousGarantieList?.length != 0 ? champs.push("sousGaranties") : ""

      index++;
    }
    champs = champs.filter((x: any, i: any) => champs.indexOf(x) === i);

    champs.map((champ: string) => {
      widthChamp.push("*")
    })

    index = 0;
    while (index < devis?.paramDevisList?.length) {
      let tmp = {
        Garanties: [
          { text: devis?.paramDevisList[index].description, fontSize: "10" },
        ],
        sousGaranties: [
          { text: '', fontSize: "10" },
        ],
        plafond: [
          { text: '', fontSize: "10" },
        ],
        forumule: [
          { text: '', fontSize: "10" },
        ],
        franchise: [
          { text: '', fontSize: "10" },
        ],
      };

      devis?.paramDevisList[index].categorieList?.map((cat: any) => {
        switch (cat.description) {
          case "plafond":
            tmp.plafond[0].text = cat.valeur
            break;

          case "forumule":
            tmp.forumule[0].text = cat.valeur
            break;

          case "franchise":
            tmp.franchise[0].text = cat.valeur
            break;

          default:
            break;
        }
      })

      garanties.push(tmp);



      index++;
    }

    index = 0;
    while (index < devis?.primeList?.length) {
      if (devis?.primeList[index].typePrime?.description != 'Prime totale') {
        primeChamps.push(devis?.primeList[index].typePrime?.description)
        primes.push(devis?.primeList[index].prime)
      }
      else {
        primetotal = "Prime total : " + devis?.primeList[index].prime
      }

      index++;
    }
    index = 0;
    while (index < devis?.taxeList?.length) {
      primeChamps.push(devis?.taxeList[index].taxe?.description)
      primes.push(devis?.taxeList[index].prime)

      index++;
    }
    primeChamps.map((champ: string) => {
      widthChampPrime.push("*")
    })


    const docDefinition: any = {
      pageMargins: [35, 30, 35, 120],
      footer: (currentPage: number, pageCount: number) => {
        if (currentPage === pageCount) {
          return [
            {
              layout: 'noBorders',
              margin: [0, 0, 0, 50],
              table: {
                widths: ["*", "*"],
                alignment: "right",
                body: [
                  [
                    {
                      text: `Signature Assureur`,
                      alignment: 'center',
                      bold: true
                    },
                    {
                      text: `Signature Client`,
                      alignment: 'center',
                      bold: true
                    }
                  ],
                  [
                    {
                      text: `Alger le: 02/01/2023`,
                      alignment: 'center',
                    },
                    {
                      text: `Alger le: 02/01/2023`,
                      alignment: 'center',
                    }
                  ],
                ],
              },
            }
          ]
        }
      }, border: [false, false, false, false],
      content: [
        {
          text: 'Automobile Mono',
          style: 'sectionHeader'
        },
        {
          text: 'Devis',
          style: 'sectionHeader',
          color: 'black'
        },
        { text: "\n" },
        {
          columns: [
            {
              style: "table",
              marginRight: 5,
              table: {
                widths: ["*"],
                alignment: "left",
                body: [
                  [
                    {
                      text: `Agence`,
                      style: "headerTable"
                    },
                  ],
                ],
              }
            },
            {
              style: "table",
              marginLeft: 5,
              table: {
                widths: ["*"],
                alignment: "right",
                body: [
                  [
                    {
                      text: `Souscripteur`,
                      style: "headerTable"
                    },
                  ],
                ],
              },
            },
          ],
        },
        //Debut Agence
        {
          margin: [5, 5, 5, 5],
          columns: [
            //debut agence
            {
              width: "25%",
              text: [
                { text: `Code : `, bold: true, fontSize: "10" },
                { text: devis?.agence?.codeAgence, fontSize: "10" },
              ],
            },
            {
              width: "25%",
              marginRight: 5,
              text: [
                { text: `Nom Agence : `, bold: true, fontSize: "10" },
                { text: devis?.agence?.raisonSocial, fontSize: "10" },
              ],
            },
            //debut Souscripteur
            {
              width: "25%",
              marginLeft: 5,
              text: [
                { text: `Nom et Prénom : `, bold: true, fontSize: "10" },
                { text: devis?.nom + ' ' + devis?.prenom, fontSize: "10" },
              ],
            },
            {
              width: "25%",
              text: ' ',
            },
          ],
        },
        {
          margin: [5, 5, 5, 5],
          columns: [
            //debut agence
            {
              width: "25%",
              text: [
                { text: `Téléphone : `, bold: true, fontSize: "10" },
                { text: devis?.agence?.telephone, fontSize: "10" },
              ],
            },
            {
              width: "25%",
              marginRight: 5,
              text: [
                { text: `Email : `, bold: true, fontSize: "10" },
                { text: devis?.agence?.email, fontSize: "10" },
              ],
            },
            //Debut Souscripteur
            {
              width: "25%",
              marginLeft: 5,
              text: [
                { text: `Téléphone : `, bold: true, fontSize: "10" },
                { text: devis?.telephone, fontSize: "10" },
              ],
            },
            {
              width: "25%",
              text: [
                { text: `Email : `, bold: true, fontSize: "10" },
                { text: devis?.email, fontSize: "10" },
              ],
            },
          ],
        },
        {
          margin: [5, 5, 5, 5],
          columns: [
            {
              width: "50%",
              marginRight: 5,
              text: [
                { text: `Adresse : `, bold: true, fontSize: "10" },
                { text: devis?.agence?.adresse, fontSize: "10" },
              ],
            },
            {
              width: "50%",
              marginLeft: 5,
              text: ' ',
            }
          ],
        },
        //fin Souscripteur
        //Debut Contrat
        {
          style: "table",
          table: {
            widths: ["*"],
            alignment: "right",
            body: [
              [
                {
                  text: `Contrat`,
                  style: "headerTable"
                },
              ],
            ],
          },
        },
        {
          margin: [5, 5, 5, 5],
          columns: [
            {
              width: "33%",
              text: [
                { text: `N° devis : `, bold: true, fontSize: "10" },
                { text: devis?.idDevis, fontSize: "10" },
              ],
            },
            {
              width: "33%",
              text: [
                { text: `Date d'éffet : `, bold: true, fontSize: "10" },
                { text: devis?.auditDate.split("T")[0], fontSize: "10" },
              ],
            },
            {
              width: "33%",
              text: [
                { text: `Date d'écheance : `, bold: true, fontSize: "10" },
                { text: devis?.dateExpiration, fontSize: "10" },
              ],
            }
          ],
        },
        //fin Contrat
        //Debut Assuré
        {
          style: "table",
          table: {
            widths: ["*"],
            alignment: "right",
            body: [
              [
                {
                  text: `Assuré(e)`,
                  style: "headerTable"
                },
              ],
            ],
          },
        },
        this.table(risque, ['text1', 'text2', 'text3']),
        //Fin Risque Assuré
        //Debut Garanties et sous-garanties
        {
          style: "table",
          table: {
            widths: ["*"],
            alignment: "right",
            body: [
              [
                {
                  text: `Garanties`,
                  style: "headerTable"
                },
              ],
            ],
          },
        },
        this.table(garanties, champs),
        //fin Garanties et sous garanties
        //debut Prime
        {
          style: "table",
          table: {
            widths: widthChampPrime,
            body: [
              primeChamps.map((champ: string) => {
                return {
                  text: champ,
                  fontSize: 10,
                  style: "headerTable"
                }
              })
            ]
            ,
          },
        },
        {
          table: {
            widths: widthChampPrime,
            body: [
              primes.map((champ: string) => {
                return {
                  text: champ,
                  fontSize: 10,
                }
              })
            ]
            ,
          },
        },
        {
          table: {
            widths: ["*"],
            body: [
              {
                text: primetotal,
                fontSize: 10,
                alignment: "right"
              }
            ]
            ,
          },
        },
        //Fin prime
      ],
      styles: {
        sectionHeader: {
          bold: true,
          color: "#d14723",
          fontSize: 12,
          alignment: "right"
        },
        BG: {
          fontSize: 10
        },
        table: {
          margin: [0, 15, 0, 0]
        },
        headerTable: {
          alignment: "center",
          bold: true,
          fontSize: 12,
          color: "white",
          fillColor: "#00008F"
        }
      }
    }



    pdfMake.createPdf(docDefinition).open();
  }
  //fin output devis

  ngOnInit(): void {
    this.getAllPersonne(0, 10)

    this.formFilter = this.formBuilderAuth.group({
      idPersonne: [null],
      nom: [null],
      raisonSocial: [null],
      dateOuverture: [null],
      dateNaissance: [null],
      nif: [null],
      nin: [null],
    });

    this.typePersonne = "moral"
    // this.genericService.getDevis().subscribe(devis => {
    //   this.devis = devis
    // })
  }
  onPageChange(value: any) {
    console.log(value)
    this.getAllPersonne(value.pageIndex, value.pageSize)
  }
  //get Personne
  getAllPersonne(index: any, size: any) {
    this.personneService.getAllPersonneIndex(index, size).subscribe(personneList => {
      this.personneTable = personneList
      this.dataSource = new MatTableDataSource(personneList.content)
      if (this.paginator)
        this.paginator.length = personneList.totalElements;
      this.paginate();
    })
  }

  //Go to create personne
  openDialogAddPersonne() {
    this.router.navigateByUrl("gestion-personnes/create");
  }

  //Go to update personne
  openDialogEdit(idPersonne: any) {
    this.router.navigateByUrl("gestion-personnes/" + idPersonne + "/edit");
  }

  //pagination table personne
  paginate() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterPersonne() {
    this.formFilter.value.idPersonne == null ? this.formFilter.value.idPersonne = 0 : '';
    this.personneService.filterPersonne(this.formFilter.value).subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data)
        this.paginate();

        this.formFilter = this.formBuilderAuth.group({
          idPersonne: [null],
          nom: [null],
          raisonSocial: [null],
          dateOuverture: [null],
          dateNaissance: [null],
          nif: [null],
          nin: [null],
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
