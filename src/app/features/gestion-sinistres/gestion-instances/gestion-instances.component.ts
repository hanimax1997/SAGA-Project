import {
  Component,
  ChangeDetectorRef,
  ViewChildren,
  ViewChild,
  QueryList,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GestionDocumentsComponent } from './gestion-documents/gestion-documents.component';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { EditDocumentDialogComponent } from './edit-document-dialog/edit-document-dialog.component';

@Component({
  selector: 'app-gestion-instances',
  templateUrl: './gestion-instances.component.html',
  styleUrls: ['./gestion-instances.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class GestionInstancesComponent {
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  displayedColumns: string[] = [
    'idInstance',
    'statut',
    'MontnatPV',
    'Garantie',
    'Reserve',
    'action',
    'more',
  ];
  innerDisplayedColumns = [
    'desc',
    'statut',
    'commentaire',
    'empty',
    'typeInstance',
    'action',
    'more',
  ];

  dataSource: any;
  status:any;

  //instancesData = ELEMENT_DATA;
  expandedElement: any;
  codeSinistre: any;
  loadInstance = false;
  currentIcon: any = [];
  idSinistreInstance: any;
  idSinistre: any;
  statusM: { [key: number]: boolean } = {};

  rolesJs=JSON.parse(sessionStorage.getItem("roles")??"")

  // isCdcDa= sessionStorage.getItem("roles")?.includes("CDC") || sessionStorage.getItem("roles")?.includes("DA") || sessionStorage.getItem("roles")?.includes("CONSULTATION") 
  isCdcDa= this.rolesJs?.includes("CDC") || this.rolesJs?.includes("DA") || this.rolesJs?.includes("CONSULTATION") || this.rolesJs.includes("COURTIER")
  codeProduit: any
  roleExist: any = false;
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sinistresService: SinistresService,
    private route: ActivatedRoute
  ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  ngOnInit() {
    this.codeSinistre = this.route.snapshot.paramMap.get('codeSinistre');
    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        this.roleExist = true;
        return;
      }
    })
    
    this.getAllInstanes();
    this.getSinistre();

  }
  getSinistre(){
    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {  
        
 
        this.status=data.statut.code;}
  
         });
  }
  checkDocumentStatus(documents: any[]): boolean {
    return documents.some(document => 
      document.statutDocument.description === 'En attente' ||
      document.statutDocument.description === 'rejeté'
    );
  }
  getAllInstanes() {
    this.sinistresService.getAllInstance(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.loadInstance = true;
        let instanceTab: any = [];


        data.forEach((instance: any) => {
          if (
            instance.instanceDocument &&
            Array.isArray(instance.instanceDocument) &&
            instance.instanceDocument.length
          ) {
            const hasPendingOrRejectedDocuments = this.checkDocumentStatus(instance.instanceDocument);

            instance.instanceDocument.idSinistreInstance =
              instance.idSinistreInstance;
            instanceTab = [
              ...instanceTab,
              {
                ...instance,
                instanceDocument: new MatTableDataSource(
                  instance.instanceDocument
                ),
              },
            ];
            this.statusM[instance.idInstance] = hasPendingOrRejectedDocuments;

          } else {
            instanceTab = [...instanceTab, instance];
            this.statusM[instance.idInstance] = false;

          }
        });
        this.dataSource = new MatTableDataSource(instanceTab);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  toggleRow(element: any) {

    this.dataSource.data.indexOf(element)

    this.idSinistreInstance = element.idInstance;
    element.instanceDocument && (element.instanceDocument as MatTableDataSource<any>).data.length
      ? (this.expandedElement = this.expandedElement === element ? null : element) : null;

    this.cd.detectChanges();
    this.innerTables.forEach(
      (table, index) =>
      ((table.dataSource as MatTableDataSource<any>).sort =
        this.innerSort.toArray()[index])
    );
  }
  openEditDialog(document: any) {

    let dialogRef = this.dialog.open(EditDocumentDialogComponent, {
      width: '40%',
      data: {
        documentInfo: document,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {


      if (result) {
        this.sinistresService.editDocument(document.idSinistreInstanceDoc, result.data).subscribe({
          next: (data: any) => {
            this.getAllInstanes();

            Swal.fire(`Document modifié avec succés.`, '', 'success');
          },
          error: (error) => {
            Swal.fire('error', '', 'error');
          },
        });
      }
    });
  }
  goToPaiement( element : any) {    

    this.sinistresService.getSinistreByCode(this.codeSinistre).subscribe({
      next: (data: any) => {
        this.idSinistre = data.idSinistre
      },
      error: (error) => {
        Swal.fire('error', '', 'error');
      },
    });


    this.sinistresService.getInstanceById(element.idInstance).subscribe({
      next: (data: any) => {

        if (data.decompteOp != null) {         
      
console.log("data.decompteOp");
console.log(data.decompteOp);
          this.router.navigate(['gestion-sinistre/' + this.route.snapshot.paramMap.get('codeProduit') +'/' + this.route.snapshot.paramMap.get('nameProduit') + '/gestionnaire-sinistre/' + this.codeSinistre + '/OP/'+ data.decompteOp.typeOp?.code + '/' + data.decompteOp.idDecompteOp + '/' + this.idSinistre + '/' + element.idInstance + '/paiement']);
        }
        else

          this.router.navigate(['gestion-sinistre/' + this.route.snapshot.paramMap.get('codeProduit') +'/' + this.route.snapshot.paramMap.get('nameProduit') + '/gestionnaire-sinistre/' + this.codeSinistre + 'PV/OPA/' + data.decomptePv.idSinistreDecompte + '/' +this.idSinistre + '/' + element.idInstance + '/paiement']);
      },
      error: (error) => {
        Swal.fire('error', '', 'error');
      },
    });


    /* switch (where) {
       case 'paiement':
          this.router.navigate(['gestion-sinistre-automobileMono/'+this.codeSinistre+'/gestionnaire-sinistre/:typeDecompte/:codeTypeDecompte/:idDecompte/paiement']);
          this.router.navigate(['gestion-sinistre-automobileMono/'+this.codeSinistre+'/gestionnaire-sinistre/'+element./:codeTypeDecompte/:idDecompte/paiement']);
         break;
 
       default:
         break;
     }
     */
  }
  openDialog(idInstance: any) {

    let dialogRef = this.dialog.open(GestionDocumentsComponent, {
      width: '40%',
      data: {
        idInstance: idInstance,

      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.sinistresService.addDocument(idInstance, result.data).subscribe({
          next: (data: any) => {
            this.getAllInstanes();

            Swal.fire(`Document ajouté avec succées.`, '', 'success');
          },
          error: (error) => {
            Swal.fire(error, '', 'error');
          },
        });
      }
    });
  }
}
