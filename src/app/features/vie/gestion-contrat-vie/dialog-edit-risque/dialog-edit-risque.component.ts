import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericService } from 'src/app/core/services/generic.service';
import { ParamRisqueService } from 'src/app/core/services/param-risque.service';
import { Patterns } from 'src/app/core/validiators/patterns';


const todayDate: Date = new Date;
export function ageValidator(control: AbstractControl): { [key: string]: boolean } | null {

  var birthday: Date = new Date(control.value);

  if ((todayDate.getFullYear() - birthday.getFullYear()) < 18) {
    return {
      'ageInf18': true
    };
  }

  return null;
}

@Component({
  selector: 'app-dialog-edit-risque',
  templateUrl: './dialog-edit-risque.component.html',
  styleUrls: ['./dialog-edit-risque.component.scss']
})
export class DialogEditRisqueComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
              public dialogRef: MatDialogRef<DialogEditRisqueComponent>,
              private formBuilder: FormBuilder,
              private genericService: GenericService,
              private paramRisqueService: ParamRisqueService) { }
             
  
  risqueInfo=this.data.risque
  infoEditRisque=this.data.infoEditRisque
  paramRisqueAssure = this.data.paramRisqueAssure
  formEditRisque: FormGroup | any;




  now = new Date()
  paraRisqueProduit :any =[]

  ngOnInit(): void {     
  

    this.formEditRisque = this.formBuilder.group({});    
    this.paramRisqueAssure.map((param: any) => {   
   //  if(param.codeParam !="P173")  {
      if (param.sizeChamp != 0 && param.sizeChamp != undefined)
      this.formEditRisque.addControl(param.formName, new FormControl(param.defaultValue, [Validators.required, Validators.minLength(param.sizeChamp), Validators.maxLength(param.sizeChamp)]));
    else
      if (param.obligatoire){
        this.formEditRisque.addControl(param.formName, new FormControl(param.defaultValue, [Validators.required]));
      }  else{
        this.formEditRisque.addControl(param.formName, new FormControl(param.defaultValue));
      }          
      if (param.parent != null && this.infoEditRisque.length == 0) {          
        this.formEditRisque.get(param.formName).disable();
      }   

          
              if(param.codeParam =="P182" || param.codeParam =="P179" ||  param.codeParam =="P183"|| param.codeParam =="P211"|| param.codeParam =="P212" && this.infoEditRisque.length == 0){
             
                this.formEditRisque.get(param.formName).disable();
              }

            //parent
            let valeur =  this.risqueInfo?.find((risque: any) => risque.codeRisque == param.codeParam)
            let valeurEdit =  this.infoEditRisque?.find((risque: any) => risque.paramList[0].codeRisque == param.codeParam)
         
         
            if (param.typeChamp.code == "L08" && param?.paramRisqueParent == null) {


              //EXP EN ATTENTE NOM TABLE EN RETOUR               

              this.paramRisqueService.getTableParamParent(param?.idParamRisque).subscribe({
                next: (data: any) => {

              
                  if (valeur != undefined) {
                    this.getChild(param?.idParamRisque, valeur?.reponse?.valeur)
                  }
                  else if(this.infoEditRisque.length != 0 && valeurEdit != undefined)
                  {
                   
                    this.getChild(param?.idParamRisque, valeurEdit?.paramList.reponse?.description)
                  }

                },
                error: (error) => {
                  console.log(error);
                } 
              })
            }
            this.paraRisqueProduit.push(param)

           
     
     
          if(this.infoEditRisque.some((risque: any) => risque.idRisque == this.data.idRisque) ){

                this.infoEditRisque.filter((risque: any) =>{

                    risque.paramList.forEach((elt:any) => {                    
                      if(risque.idRisque == this.data.idRisque && elt.codeRisque == param.codeParam){
                        
                        switch(param.typeChamp.code){                  
                          case 'L01': 
                          this.formEditRisque.get(param.formName).setValue(+elt.reponse.idParamReponse.idParam);
                          break;
                          case 'L08': 
                            this.formEditRisque.get(param.formName).setValue(+elt.reponse.valeur);
                          break;
                          default:
                            this.formEditRisque.get(param.formName).setValue(elt.reponse?.valeur);
                          break;
                        }               
                      
                      }
                    
                    });
                 
                })
        

                 
          }else{
              this.risqueInfo.forEach((elt:any) => {
              if(elt.codeRisque == param.codeParam){
                switch(param.typeChamp.code){                  
                  case 'L01': 
                   this.formEditRisque.get(param.formName).setValue(elt.reponse.idParamReponse.idParam);
                  break;
                  case 'L08': 
                    this.formEditRisque.get(param.formName).setValue(elt.reponse.valeur);
                  break;
                  default:
                    this.formEditRisque.get(param.formName).setValue(elt.reponse?.valeur);
                  break;
                }               
              
              }
            
            });
          }

       
    })
  
    
  }

  getChild(idParamRisque: any, idReponse: any) {

    let idRisqueChild = this.paraRisqueProduit.filter((rs: any) => rs.parent?.idParamRisque == idParamRisque)[0].idParamRisque

    this.paramRisqueService.getTableParamChild(idRisqueChild, idReponse).subscribe({
      next: (data: any) => {
        this.paraRisqueProduit.filter((param: any) => {
          if (param?.idParamRisque == idRisqueChild) {
            param.reponses = data
            // this.formCreationRisque.controls[param.formName].enable()
          }

        })      

      },
      error: (error) => {
        console.log(error);0
      }
    })
  }

  getRelation(typeChamp: any, isParent: boolean, idParamRisque: number, idReponse: number, formName: any) {

     
    if (isParent == true)
      if (typeChamp == 'L01') {

        this.paramRisqueService.getParamRelation(idParamRisque, idReponse).subscribe({
          next: (data: any) => {

            this.paraRisqueProduit.filter((param: any) => {
              if (param.idParamRisque == data[0].idParamRisque) {

                param.reponses = data[0].categorie.paramDictionnaires
                 this.formEditRisque.controls[param.formName].enable()
              }
            })
          },
          error: (error) => {
            console.log(error);
          }
        })
      } else {
        let idRisqueChild = this.paraRisqueProduit.find((rs: any) => rs.parent?.idParamRisque == idParamRisque)?.idParamRisque
        if (idRisqueChild)
          this.paramRisqueService.getTableParamChild(idRisqueChild, idReponse).subscribe({
            next: (data: any) => {
              this.paraRisqueProduit.filter((param: any) => {
                if (param.idParamRisque == idRisqueChild) {
                  param.reponses = data
                   this.formEditRisque.controls[param.formName].enable()
                }
              })            

            },
            error: (error) => {

              console.log(error);

            }
          })
      }
   
  }

  

  submitEditRisque(){ 
   
    let retourList : any =[]
    let retour : any ={}
    let idparam : any 
    let codeParam : any 
    let idreponse : any 
    let description : any 
    if(this.formEditRisque.valid){
     
      this.paraRisqueProduit.map((parmRisque:any)=>{
        codeParam = parmRisque.codeParam
        idparam =parmRisque.idParamRisque
        if (parmRisque.typeChamp?.description == 'Liste of values') {

          idreponse = this.formEditRisque.get(parmRisque.formName)?.value
          description = ''
        } else {

          idreponse = null,
            description = this.formEditRisque.get(parmRisque.formName)?.value
        }
        retour = {
          "idParam": idparam,
          "codeRisque": codeParam,
          "reponse": {
            "idReponse": idreponse,
            "description": description
          }
        }

       
        retourList.push(retour)
      
    
      })
      this.formEditRisque.reset();
      this.dialogRef.close(retourList);
     
    }
  }
}
