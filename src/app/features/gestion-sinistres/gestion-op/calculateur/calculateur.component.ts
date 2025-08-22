import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn, ValidationErrors, AbstractControl, PatternValidator } from '@angular/forms';
import { Calculateur, Decompte } from 'src/app/core/models/sinistre';
import { GenericService } from 'src/app/core/services/generic.service';
import { SinistresService } from 'src/app/core/services/sinistres.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MissionExpertiseService } from 'src/app/core/services/mission-expertise.service';
import { MatPaginator } from '@angular/material/paginator';
import { Patterns } from 'src/app/core/validiators/patterns';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
export function DecimalValidator(control: FormControl) {
  const decimalPattern = /^\d+(\.\d{1,2})?$/; // Regular expression pattern

  if (control.value && !decimalPattern.test(control.value)) {
    return { invalidDecimal: true };
  }

  return null; // Return null if the value is valid
}
export function maxHundred(control: FormControl) {
  //  const decimalPattern = /^\d+(\.\d{1,2})?$/; // Regular expression pattern

  if (control.value > 100) {
    return { invalidMax100: true };
  }

  return null; // Return null if the value is valid
}
export function supBrutValidator(brutValue: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    
    return (brutValue < control.value) ? { retenueValid: true } : null;
  }
}
@Component({
  selector: 'app-calculateur',
  templateUrl: './calculateur.component.html',
  styleUrls: ['./calculateur.component.scss']
})
export class CalculateurComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  idSinistre: any;
  nomProduit: any;
  missionExpertiseId: any;

  constructor(private missionExpertiseService: MissionExpertiseService, private router: Router, private route: ActivatedRoute, private sinistresService: SinistresService, private formBuilder: FormBuilder, private genericService: GenericService) { }
  @ViewChild('stepper') private stepper: MatStepper;

  formCalculator: FormGroup | any;
  dateExpertise = new Date()
  today = new Date()
  formInfoGenerale: FormGroup | any;
  typePerteArray: any = []
  visiteRisqueArray: any = []
  calculHTTTCArray: any = []
  avisPVCArray: any = []
  infoDecomptArray: any = []
  typeOpList: any = []
  controleUsageArray: any = []
  motifArray: any = []
  // idReserve: any
  calcultateur = new Calculateur()
  nomGarantie = ""
  nomReserve = ""
  usage = ""
  typeDecompte = this.route.snapshot.paramMap.get('typeDecompte')
  calculatorReady = false
  netObj: any = {}
  idDecompte: any
  jsonOp: any = {}
  LoaderCalculator = false
  missionSelected = false
  step3 = false
  step4 = false
  codeProduit:any;
  dataSourceMission = new MatTableDataSource()
  displayedColumns: string[] = ['numMission', 'typeExpertise', 'modeExpertise', 'expert', 'dateMission', 'statut', 'action'];
  roleUser: any = JSON.parse(sessionStorage.getItem("roles") || "");
  sinistreRoles: any = {
    "45A": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45F": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "45L": ["GESTIONNAIRE_SINISTRE", "RESPONSABLE_SINISTRE","DIRECTEUR", "CHEF_PROJET", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE", "GESTION_SINISTRE", "GESTIONNAIRE_JUNIOR"], 
    "95": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"], 
    "96": ["GESTION_SINISTRE_MRH_MRP", "RESPONSABLE_SINISTRE_MRH_MRP", "ADMIN","ROLE_SUPER_ADMIN", "ANALYSTE"]
  }
  ngOnInit(): void {
    this.getAllMissionExpertise()
    // this.calcultateur.sinistreReserve = { "idSinistreReserve": this.idReserve }
    this.getReserveNames(this.route.snapshot.paramMap.get('codeReserve'), this.route.snapshot.paramMap.get('codeGarantie'))
    this.getSinistreInfo()
    this.initFormCalculator()
    this.nomProduit = this.route.snapshot.paramMap.get('codeReserve')

    this.codeProduit = this.route.snapshot.paramMap.get('codeProduit')

    let roleExist = false;
    this.roleUser.find((r: any) => {
      if(this.sinistreRoles[this.codeProduit+""].includes(r)) {
        roleExist = true;
        return;
      }
    })

    if(!roleExist) this.router.navigate(['/dashboard'])

  }
  getAllMissionExpertise() {
    this.missionExpertiseService.getAllMissionsExpertisesByCode(this.route.snapshot.paramMap.get('codeSinistre')).subscribe({
      next: (data: any) => {
        data = data.filter((mission: any) => mission.statutMission.code == 'S10')
        this.dataSourceMission = new MatTableDataSource(data)
        this.dataSourceMission.paginator = this.paginator;
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  getReserveNames(codeReserve: any, codeGarantie: any) {
    this.sinistresService.getReserveNames(codeReserve, codeGarantie).subscribe({
      next: (data: any) => {
        this.nomGarantie = data.nomGarantie
        this.nomReserve = data.nomReserve
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  getSinistreInfo() {
    this.sinistresService.getSinistreByCode(this.route.snapshot.paramMap.get('codeSinistre')).subscribe({
      next: (data: any) => {
        this.usage = data.contratHistorique.risqueList.filter((rs: any) => rs.paramRisque.codeParam == 'P52')[0].idParamReponse.description
        this.idSinistre=data.idSinistre
      },
      error: (error) => {

        console.log(error);

      }
    })
  }
  selectTypePerte(typePerte: any) {
    if(typePerte.code != "CP446")
      {
        this.formCalculator.disable()
        this.formInfoGenerale.disable()
        this.formInfoGenerale.get("typePerte").enable()
      }
    else
      {
        this.formCalculator.enable()
        this.formInfoGenerale.enable()
      }
  }
  initFormCalculator() {
    this.formCalculator = this.formBuilder.group({
      brut_CP460: [null, [DecimalValidator, Validators.required]],
      brut_CP461: [null, [DecimalValidator, Validators.required]],
      brut_CP462: [null, [DecimalValidator, Validators.required]],
      brut_CP463: [null, [DecimalValidator]],
      brut_CP464: [null, [DecimalValidator]],

      //vetusté
      vetuste_CP462: [null, [DecimalValidator, Validators.max(100)]],
      vetuste_CP464: [null, [DecimalValidator, Validators.max(100)]],
      dommageNetVetuste: [{value: null, disabled: true}, [DecimalValidator]],
      franchise: [{value: null, disabled: true}, [DecimalValidator]],
      //retenue
      retenue_CP460: [null, [DecimalValidator,]],
      retenue_CP461: [null, [DecimalValidator]],
      retenue_CP462: [null, [DecimalValidator]],
      retenue_CP463: [null, [DecimalValidator]],
      retenue_CP464: [null, [DecimalValidator]],
      //motif
      motif_CP460: [null, []],
      motif_CP461: [null, []],
      motif_CP462: [null, []],
      motif_CP463: [null, []],
      motif_CP464: [null, []],

      nbImmobilisation: [null, [Validators.required, DecimalValidator]],
      capitalValeurExpert: [null, [DecimalValidator]],
      partCommerciale: [null, [DecimalValidator]],
    });
    this.formInfoGenerale = this.formBuilder.group({
      typePerte: [null, [Validators.required]],
      visiteRisque: [null, [Validators.required]],
      calculHTTTC: ["", [Validators.required]],
      referencePV: ["", [Validators.required]],
      avisPV: ["", [Validators.required]],
      controleUsage: ["", [Validators.required]],
      datePV: ["", [Validators.required]],
    });
    this.getDictionnaire()

    this.formInfoGenerale.valueChanges.subscribe(() => {
      this.calculatorReady = false
    });
    this.formCalculator.valueChanges.subscribe(() => {
      this.calculatorReady = false
    });
  }
  getDictionnaire() {
    //type perte
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C62").idCategorie).subscribe(data => {
      this.typePerteArray = data;
      // this.formInfoGenerale.get("typePerte").setValue(this.typePerteArray[0].idParam)
    })
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C63").idCategorie).subscribe(data => {
      this.visiteRisqueArray = data;
      //  this.formInfoGenerale.get("visiteRisque").setValue(this.visiteRisqueArray[0].idParam)
    })
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C64").idCategorie).subscribe(data => {
      this.calculHTTTCArray = data;
      //  this.formInfoGenerale.get("calculHTTTC").setValue(this.calculHTTTCArray[0].idParam)
    })
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C65").idCategorie).subscribe(data => {
      this.avisPVCArray =   data.reverse();
    
      //  this.formInfoGenerale.get("avisPV").setValue(this.avisPVCArray[0].idParam)
    })
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C19").idCategorie).subscribe(data => {
      this.controleUsageArray = data;
      //   this.formInfoGenerale.get("controleUsage").setValue(this.controleUsageArray[0].idParam)
    })
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C67").idCategorie).subscribe(data => {
      this.infoDecomptArray = data;
    })
    this.genericService.getParam(JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find((parametre: any) => parametre.code == "C66").idCategorie).subscribe(data => {
      this.motifArray = data;
    })
    //Get type OP
    this.genericService
      .getParam(
        JSON.parse(sessionStorage.getItem('dictionnaire') || '{}').find(
          (parametre: any) => parametre.code == 'C52'
        ).idCategorie
      )
      .subscribe((data) => {
        this.typeOpList = data

      });
  }
  get bruts(): FormArray {
    return this.formCalculator.get("bruts") as FormArray
  }
  newBruts(): FormGroup {
    return this.formBuilder.group({
      mainOeuvre: ["", []],
      peinture: ["", []],
      fourniture: ["", []],
      donGlaces: ["", []],
      donPneux: ["", []],
    })
  }
  submitCalculateur() {
    if (this.formInfoGenerale.valid && this.formCalculator.valid) {    //generale
      if (this.formCalculator.get("brut_CP463").value + this.formCalculator.get("brut_CP464").value <= this.formCalculator.get("brut_CP462").value) {
        this.calcultateur = new Calculateur()
        this.calcultateur.missionExpertise = { "idMissionExpertise": this.missionExpertiseId }

        this.calcultateur.typePerte = { "idParam": this.formInfoGenerale.get("typePerte").value.idParam }
        this.calcultateur.visiteRisque = { "idParam": this.formInfoGenerale.get("visiteRisque").value }
        this.calcultateur.calculHtTtc = { "idParam": this.formInfoGenerale.get("calculHTTTC").value }
        this.calcultateur.referencePV = this.formInfoGenerale.get("referencePV").value
        this.calcultateur.avisPv = { "idParam": this.formInfoGenerale.get("avisPV").value }
        this.calcultateur.controleUsage = { 
          "idParam": this.formInfoGenerale.get("controleUsage").value.idParam, 
          "code": this.formInfoGenerale.get("controleUsage").value.code, 
        }

        //decompte
        this.calcultateur.sinistreDecompteInfos = []
        let decompte: any
        this.infoDecomptArray.map((infoDecompte: any) => {
          decompte = new Decompte()
          decompte.typeInfoDecompte = {
            "idParam": infoDecompte.idParam,
            "code": infoDecompte.code
          }
          decompte.brut = this.formCalculator.get("brut_" + decompte.typeInfoDecompte.code)?.value;

          decompte.retenue = this.formCalculator.get("retenue_" + decompte.typeInfoDecompte.code)?.value;

          decompte.motif = this.formCalculator.get("motif_" + decompte.typeInfoDecompte.code).value == null ? null : { "idParam": this.formCalculator.get("motif_" + decompte.typeInfoDecompte.code).value }
          if (decompte.typeInfoDecompte.code == "CP462" || decompte.typeInfoDecompte.code == "CP464")
            decompte.pourcentageVetuste = this.formCalculator.get("vetuste_" + decompte.typeInfoDecompte.code)?.value;
          this.calcultateur.sinistreDecompteInfos.push(decompte)
        })


        this.calcultateur.valeurExpert = this.formCalculator.get("capitalValeurExpert")?.value
        this.calcultateur.nbImmobilisation = this.formCalculator.get("nbImmobilisation")?.value
        this.calcultateur.partCommeciale = this.formCalculator.get("partCommerciale")?.value
        this.calcultateur.dommageNetVetuste = this.formCalculator.get("dommageNetVetuste")?.value
        this.calcultateur.franchise = this.formCalculator.get("franchise")?.value

        this.sinistresService.calculateur(this.calcultateur, this.route.snapshot.paramMap.get('codeSinistre'), this.route.snapshot.paramMap.get('codeGarantie'), this.route.snapshot.paramMap.get('codeReserve')).subscribe({
          next: (data: any) => {
            this.calcultateur = data
            this.calcultateur.datePv = moment(this.formInfoGenerale.get("datePV")?.value).format('YYYY-MM-DD')

            this.formCalculator.get("dommageNetVetuste").enable()
            this.formCalculator.get("dommageNetVetuste").setValue(this.calcultateur.dommageNetVetuste)
            
            this.formCalculator.get("franchise").enable()
            this.formCalculator.get("franchise").setValue(this.calcultateur.franchise)
            
            this.calcultateur.sinistreDecompteInfos.map((decompte: any) => {
              Object.assign(this.netObj, { [decompte.typeInfoDecompte.code]: decompte.net });
              
            })
            //this.idSinistre = this.calcultateur.sinistreReserve.sinistre.idSinistre
            this.calculatorReady = true
            console.log(this.calcultateur)
          },
          error: (error) => {
            this.calculatorReady = false
            console.log(error);

          }
        })
      } else {
        Swal.fire(
          "La somme de don glaçe et don pneux doit etre inférieur à fourniture",
          '',
          'error'
        )
      }
    } else {
      this.formInfoGenerale.markAllAsTouched();
    }
  }

  emitOp(jsonOp: any) {
    this.jsonOp = jsonOp
    Swal.fire({
      title: 'Décompte enregistré avec succès',
      showDenyButton: true,
      icon: 'success',
      allowOutsideClick: false,
      confirmButtonText: `Passer au paiement`,
      denyButtonText: `Passer en instance`,
      denyButtonColor: "#4942E4",
    }).then((result) => {
      if (result.isConfirmed) {
        this.step3 = true;
        this.stepper.next();
      } else if (result.isDenied) {
        this.step4 = true;
        this.stepper.next();
      }
    })
  }

  saveCalculateur() {
    // this.calcultateur.sinistreReserve = { "idSinistreReserve": this.calcultateur.sinistreReserve.idSinistreReserve }
    this.stepper.next();
    //this.router.navigate(['../../../../../'+ this.route.snapshot.paramMap.get('codeStatut') + '/reserve-paiement' + '/create-op-assure/' + this.route.snapshot.paramMap.get('codeReserve') + '/' + this.route.snapshot.paramMap.get('codeGarantie')], { relativeTo: this.route });
    // this.sinistresService.saveCalculateur(this.calcultateur).subscribe({
    //   next: (data: any) => {
    //     this.idDecompte = data.idSinistreDecompte
    //     Swal.fire({
    //       title: 'Décompte enregistré avec succès',
    //       showDenyButton: true,
    //       icon: 'success',
    //       allowOutsideClick: false,
    //       confirmButtonText: `Passer au paiement`,
    //       denyButtonText: `Passer en instance`,
    //       denyButtonColor: "#4942E4",
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //       //  this.router.navigate(['gestion-sinistre-automobileMono/' + this.route.snapshot.paramMap.get('codeSinistre') + '/gestionnaire-sinistre/' + '/PV' + '/OPA' + '/' + this.idDecompte + '/' + this.idSinistre + '/paiement']);
    //         this.router.navigate(['../../../../../'+'/PV/'+ '/OPA' + '/' + this.idDecompte + '/' + this.idSinistre + '/paiement'], { relativeTo: this.route });
    //       } else if (result.isDenied) {
    //         this.router.navigate(['../../../../../'+'/PV/'+ this.idDecompte + '/creation-instance'], { relativeTo: this.route });
    //       //  this.router.navigate(['gestion-sinistre-automobileMono/' + this.route.snapshot.paramMap.get('codeSinistre') + '/gestionnaire-sinistre' + '/PV/' + this.idDecompte + '/creation-instance']);
    //       }
    //     })
    //   },
    //   error: (error) => {
    //     console.log(error);

    //   }
    // })
  }
  onRetenueInput(value: any, code: any) {

    if (value > 0)
      this.formCalculator.get("motif_" + code).setValidators([Validators.required])
    else
      this.formCalculator.get("motif_" + code).setValidators([])

    this.formCalculator.get("motif_" + code).updateValueAndValidity();

  }
  onBrutInput(value: any, code: any) {
    //supBrutValidator(value)
    this.formCalculator.get("retenue_" + code).setValue(null)
    this.formCalculator.get("retenue_" + code).setValidators([Validators.max(value), DecimalValidator])

    if ((code == 'CP464' || code == 'CP462') && value > 0) {

      this.formCalculator.get("vetuste_" + code).setValidators([Validators.required, DecimalValidator, Validators.max(100)])
      this.formCalculator.get("vetuste_" + code).updateValueAndValidity();
    } else if ((code == 'CP464' || code == 'CP462') && (value == 0 || value == null)) {
      this.formCalculator.get("vetuste_" + code).setValidators([DecimalValidator, Validators.max(100)])
      this.formCalculator.get("vetuste_" + code).updateValueAndValidity();

    }
  }
  selectMission(idMission: any, dateExpertise: any) {
    this.dateExpertise = dateExpertise
    this.missionSelected = true
    this.missionExpertiseId = idMission

  }
  goTo(where: string) {
    switch (where) {
      case "instance":
        this.router.navigate(['../../../../../'+'/PV/'+ this.idDecompte + '/creation-instance'], { relativeTo: this.route });
   
        // gestion-sinistre-automobileMono/:codeSinistre/gestionnaire-sinistre/creation-instance
        break;
      case "paiment":
        let code = this.typeOpList.filter((type: any) => type.code == 'OPA')[0].code
        //this.router.navigate(['../../../../../'+'/PV/'+ code + '/' + this.idDecompte + '/' + this.calcultateur.sinistreReserve.sinistre.idSinistre + '/paiement'], { relativeTo: this.route });
        break;
      case "expertise":
        const url = '/gestion-missionsExpertise/gestion-mission-expertise/'+this.idSinistre+'/'+this.nomProduit+'/creation-mission-expertise'
        // open link in new tab
        window.open(url, '_blank');
        break;
      default:
        break;
    }
  }
  addExpertise() {

  }
}
