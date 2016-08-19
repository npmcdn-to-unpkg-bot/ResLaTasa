import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
import { RFC } from '../utilities/RFC';
import { Validations } from '../utilities/validations';
import { I18n } from '../utilities/pipes/internationalization';
import { UpLoadImages } from './tasa_upload_images';
import { SetModelPrestatarioAlta } from '../services/model_prestatario_alta';
import { CreatePersonalInformation } from '../services/createPrestatarioPersonalInformation';
import { HeaderService } from '../services/header_service';
import { CatalogOrigin } from '../services/catalogOrigin';
import { CatalogCivilStatus } from '../services/catalogCivilStatus';
import { PrestatarioAltaModel } from '../models/prestatario_alta';
import { UpLoadFileParametersModel } from '../models/upload_file_parameters';
import { PrestatarioSender } from '../models/prestatario_sender';
import { PrestatarioIdentificacionModel } from '../models/prestatario_identificacion'
import { TasaFileModel } from '../models/tasa_file';
import { HeaderParameters } from '../models/header_parameters';
import { ControlMessages } from './tasa_control_messages';
import { Loading } from './tasa_loading';
import { TasaTooltip } from './tasa_tooltip';

@Component({
  selector: 'prestatario-personal-information',
  templateUrl: 'components/prestatario_personal_information.html',
  directives: [UpLoadImages,Loading,ControlMessages,TasaTooltip],
  providers: [CreatePersonalInformation,CatalogOrigin,CatalogCivilStatus],
  pipes: [I18n]
})

export class PrestatarioPersonalInformation implements OnInit{

  title: string;
  closeLoading: boolean = false;
  subscriptionModel: Subscription;
  prestatario_alta: PrestatarioAltaModel;
  frenteYReverso : boolean;
  isValid: boolean= false;
  isIfe: boolean;
  private userName: string= "";  
  @ViewChildren(UpLoadImages) archivos: QueryList<UpLoadImages>;
  private filesCreated;
  private modelo: PrestatarioIdentificacionModel;  
  private lugarNacimiento: Array<any>;  
  private estadoCivil: Array<any>;
  private aniosLst;
  private mesLst: Array<any>;
  private diasLst;
  private personalInformationForm: ControlGroup;
  private anio: string='';
  private mes: string='';
  private dia: string='';
  prestatario_sender: PrestatarioSender;
  private parametersImage;

  constructor(
    private headerService: HeaderService,
    private setModelService: SetModelPrestatarioAlta,
    private router: Router,
    private formBuilder: FormBuilder,
    private catalogoDondeNaciste: CatalogOrigin,
    private catalogoEstadoCivil: CatalogCivilStatus,
    private personalInformationService: CreatePersonalInformation
  ) {
    this.prestatario_alta=this.setModelService.getModel();
    this.title = '¡Llenemos tu expediente!';
    this.frenteYReverso = false;

    let dia: string = '';
    let mes: string = '';
    let anio: string = '';
    this.getAnios();
    this.prestatario_alta= this.setModelService.getModel();      
    this.userName = this.prestatario_alta.perfil.username;
    if(this.prestatario_alta!=null && this.prestatario_alta.hasOwnProperty('identificacion')){
      this.modelo= this.prestatario_alta.identificacion;      
      var cad= (this.modelo.fecha_nacimiento).split("/");
      this.anio= cad[0];
      this.dia= cad[2];
      this.onSelectDays(this.anio, cad[1]);
      if(this.modelo.type_id=="IFE"){
        this.isIfe=true;
      }else{
        this.isIfe=false;
      }
      this.isValid=true;
      
    }else{
      this.modelo= new PrestatarioIdentificacionModel('','','','','','','');  
    } 

    this.setImageParameters();


    this.personalInformationForm = this.formBuilder.group({
      'dondeNaciste':['',Validators.required],
      'fechaNacimiento': formBuilder.group({
        'fechaNacimiento.dia':[dia],
        'fechaNacimiento.mes':[mes],
        'fechaNacimiento.anio':[anio],
      }, { validator: Validations.dateValidator('fechaNacimiento.dia', 'fechaNacimiento.mes' ,'fechaNacimiento.anio') }),
      'RFC':['', Validators.compose([Validators.required, Validations.RFCValidatorHomoclave])],
      'estadoCivil':['',Validators.required],
      'telFijo':['', Validators.compose([Validators.required, Validations.telephoneValidator])],
      'telCelular':['', Validators.compose([Validators.required, Validations.telephoneValidator])]
    })
    
  }

  ngOnInit() {
    //TODO: Agregar validaciones para tokens
    this.headerService.setParameters(new HeaderParameters(this.title, true, true));
    this.getLugarNacimiento();
    this.getEstadoCivil();
  
  } 

  getLugarNacimiento(){
    this.catalogoDondeNaciste.get()
    .subscribe(
        catalogo =>{
            this.lugarNacimiento = <[{'estado':string, 'id':number}]>catalogo.sort((a,b) => a.id - b.id);
        },
        error => {
          this.personalInformationForm.controls['dondeNaciste'].setErrors({
            "ServiceError": true
          });
        }
    );
  }
  
  getEstadoCivil(){
    this.catalogoEstadoCivil.get()
    .subscribe(
        catalogo =>{
            this.estadoCivil = catalogo;
        },
        error => {
          this.personalInformationForm.controls['estadoCivil'].setErrors({
            "ServiceError": true
          });
        }
    );
  }
    
  imageSelected(img){
    this.recoverImages();
    var data;
    if(this.isIfe){
      data="IFE";
    }else{
      data="Passport";
    }
    
    if(this.archivos && !this.verificaModeloImages()){
    this.isValid = true;
    this.archivos.forEach(item => {
        this.saves3URL(item.s3URL, item.parameters.type, img.type);
        if(!item.isValid){
          this.isValid = false;
          return;
        }
    });
    }
  }

  private saves3URL(s3URL, type, typeImgSelect){
    for (var i=0; i<this.filesCreated.length; i++){
      if(type==this.filesCreated[i].description && (s3URL!='' && s3URL!=null)){ 
        this.filesCreated[i].url=s3URL;
      }
    }
  }

  private recoverImages(){
    for(var i=0; i<this.parametersImage.length; i++){
      this.parametersImage[i].s3URL= this.recoverURLFilesCreated(this.parametersImage[i].type);
    }
  }

  private recoverURLFilesCreated(type){
    for(var i=0; i<this.filesCreated.length; i++){
      if(this.filesCreated[i].description==type){
        return this.filesCreated[i].url;
      }
    }
  }

  private imageVerifica(type){
    var frente;
    var reverso;
    var identificacion;
    var Selfie;
    var cantIFE=0;
    
    this.archivos.forEach(item=>{
      if(type=="IFE" && this.frenteYReverso==false ){
        if(item.parameters.type=="Selfie" && item.parameters.s3URL!=""){
          Selfie=true;
        }
        if(item.parameters.type=="identificacion"  && item.parameters.s3URL!=""){
          identificacion=true;
        }
      }
    });

    if((type==="IFE" && this.frenteYReverso===false) && (Selfie==true && identificacion==true)){
      this.isValid=true;
    }
  }
  
  identificactionChange(data){
    if(data == "Passport"){
      this.modelo.type_id=data;
      this.isIfe= false;
    } else if (data == "IFE" ){
      this.modelo.type_id=data;
      this.isIfe= true;
    }
      this.recoverImages();
      this.verificaModeloImages();
  }

  frenteReversoChange(data){
    if(data=== "frente"){
      this.frenteYReverso = false;

    } else if (data === "frenteReverso"){
      this.frenteYReverso = true;
    }
      this.recoverImages();
      this.verificaModeloImages();
  }
  
  next(){
     this.showModalCarga();
    if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
      this.prestatario_alta = this.setModelService.getModel();
    }

    var filesImages= Array<TasaFileModel>();
    var image;
    
    this.archivos.forEach(item => {
        image= new TasaFileModel(item.parameters.type, item.s3URL);
        filesImages.push(image);
    });
    this.modelo.files=filesImages;

    this.modelo.fecha_nacimiento= this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.anio').value + "/" +
    this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.mes').value + "/" + this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.dia').value;

    if(this.prestatario_alta===undefined || this.prestatario_alta===null){
      this.prestatario_alta=this.setModelService.getModel();
    }

    this.prestatario_alta.identificacion=this.modelo;
    this.prestatario_sender= new PrestatarioSender(this.prestatario_alta);
    this.prestatario_sender.username= this.prestatario_alta.perfil.username;
    this.prestatario_sender.token="";

    this.personalInformationService.createPersonalInformation(this.prestatario_sender).subscribe(
      respuesta=>{
          this.setModelService.setModel(this.prestatario_alta);
          this.router.navigate(['/PrestatarioDomicilio']);
      },error=>{
        this.closeModelCarga();
        alert(Validations.getValidatorErrorMessage('ServiceError'));
      }
    );
  }

  getAnios(){
    this.aniosLst=[];
    this.diasLst=[];    
    var fecha= new Date();
    var anio=fecha.getFullYear()-18;
    var contador=1;

    for(var i=anio; i>= 1900; i--){
      this.aniosLst.push(i);
      contador++;
    }

    this.mesLst=[{"id": 1, "mes":"ENERO"},{"id": 2, "mes": "FEBRERO"},{"id": 3, "mes": "MARZO"},{"id": 4, "mes": "ABRIL"},{"id": 5, "mes": "MAYO"},{"id": 6, "mes": "JUNIO"},{"id": 7, "mes": "JULIO"},{"id": 8, "mes": "AGOSTO"},{"id": 9, "mes": "SEPTIEMBRE"},{"id": 10, "mes": "OCTUBRE"},{"id": 11, "mes": "NOVIEMBRE"},{"id": 12, "mes": "DICIEMBRE"}];
  }

  onSelectDays(year, month){
    let controlYear;
    let controlMonth;

    if(month!="" && year != ""){
      controlYear= parseInt(year);
      controlMonth=parseInt(month);
      this.mes= controlMonth; 

    }else{  
      controlYear = (<Control>this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.anio')).value;
      controlMonth = (<Control>this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.mes')).value;
    }

    var numberDays;

    if(controlYear!="" && controlMonth!=""){
      this.diasLst=[];
      numberDays=this.daysInMonth(controlMonth, controlYear);
      for(var day=1; day<=numberDays; day++){
        this.diasLst.push(day);
      }
    }

  }

  private daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
  }


   calcularRFC($event, data){
    
    if(data=='anio'){
      this.anio=$event.target.value;
    }else if(data=='mes'){
      this.mes=$event.target.value;
    }

     this.onSelectDays(this.anio, this.mes);


    this.modelo.fecha_nacimiento = null;
    this.modelo.rfc_homoclave = '';

    if(data=='dia'){
      this.dia=$event.target.value;
    }

    this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.anio').value + "/" +
    this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.mes').value + "/" + this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.dia').value;

    if (this.anio!='' && this.mes!='' && this.dia!=''){
      this.modelo.fecha_nacimiento = this.anio + '/' + this.mes+ '/' +this.dia;
      let rfc = new RFC(this.prestatario_alta.perfil.nombres,
      this.prestatario_alta.perfil.apaterno, this.prestatario_alta.perfil.amaterno, new Date(this.modelo.fecha_nacimiento));     
      this.modelo.rfc_homoclave = rfc.calcularRFCCompleta();
      this.validateRFC(); 
      let r_f_c= this.personalInformationForm.controls['RFC'];
      r_f_c.markAsDirty();
      r_f_c.markAsTouched();
    }

  }

  validateRFC() {
    if(this.modelo.rfc_homoclave!=''){
      window.setTimeout(()=>{
        let controlRFC = <Control>this.personalInformationForm.find('RFC');      
        Validations.asyncValidator(controlRFC, 'RFC', this.userName);
      });
    }
  }


  private createFiles(type, s3URL){
    var file= new TasaFileModel(type, s3URL);
    this.filesCreated.push(file);
  }

  private setImageParameters(){
    this.filesCreated= Array<TasaFileModel>();

    var parameters;
    this.parametersImage= new Array(5);
    var cantArch;

    parameters = new UpLoadFileParametersModel();
    parameters.rol = "prestatario";
    parameters.userName = this.userName;
    parameters.context = "identificacion";
    parameters.type = "identificacion";
    parameters.imgSrc = "/images/prestatario_identificacion/identificacion.svg";
    parameters.imgSrcActive = "/images/prestatario_identificacion/frenteYreverso1-01.svg";
    parameters.orientation = 'vertical';
    parameters.title = 'Frente y reverso';
    parameters.s3URL= this.obtieneS3URL(parameters.type);
    if(parameters.s3URL!=""){
      this.frenteYReverso=false;
    }
    this.createFiles(parameters.type,parameters.s3URL);
    this.parametersImage[0]=parameters;

    parameters = new UpLoadFileParametersModel();
    parameters.rol = "prestatario";
    parameters.userName = this.userName;
    parameters.context = "identificacion";
    parameters.type = "frente";
    parameters.imgSrc = "/images/prestatario_identificacion/identificacion-Frente.svg";
    parameters.imgSrcActive = "/images/prestatario_identificacion/frenteActive.svg";
    parameters.orientation = 'horizontal';
    parameters.title = 'Frente';
    parameters.s3URL= this.obtieneS3URL(parameters.type);
    if(parameters.s3URL!=""){
      this.frenteYReverso=true;
    }
    this.createFiles(parameters.type,parameters.s3URL);
    this.parametersImage[1]=parameters;

    parameters = new UpLoadFileParametersModel();
    parameters.rol = "prestatario";
    parameters.userName = this.userName;
    parameters.context = "identificacion";
    parameters.type = "reverso";
    parameters.imgSrc = "/images/prestatario_identificacion/identificacion-Reverso.svg";
    parameters.imgSrcActive = "/images/prestatario_identificacion/reverso.svg";
    parameters.orientation = 'horizontal';
    parameters.title = 'Reverso';
    parameters.s3URL= this.obtieneS3URL(parameters.type);
    if(parameters.s3URL!=""){
      this.frenteYReverso=true;
    }
    this.createFiles(parameters.type,parameters.s3URL);
    this.parametersImage[2]=parameters;

    parameters= new UpLoadFileParametersModel();
    parameters.rol = "prestatario";
    parameters.userName = this.userName;
    parameters.context = "identificacion";
    parameters.type = "pasaporte";
    parameters.imgSrc = "/images/prestatario_identificacion/pasaporte.svg";
    parameters.imgSrcActive = "/images/prestatario_identificacion/pasaporteActive.svg";
    parameters.orientation = 'vertical';
    parameters.title = 'Pasaporte';
    parameters.s3URL= this.obtieneS3URL(parameters.type);
    this.createFiles(parameters.type,parameters.s3URL);    
    this.parametersImage[3]=parameters;

    parameters= new UpLoadFileParametersModel();
    parameters.rol = "prestatario";
    parameters.userName = this.userName;
    parameters.context = "identificacion";
    parameters.type = "Selfie";
    parameters.imgSrc = "/images/prestatario_identificacion/selfie.svg";
    parameters.imgSrcActive = "/images/prestatario_identificacion/selfieActive.svg";
    parameters.orientation = 'vertical';
    parameters.title = 'Foto con tu identificación';   
    parameters.s3URL= this.obtieneS3URL(parameters.type);
    this.createFiles(parameters.type,parameters.s3URL);
    this.parametersImage[4]=parameters;

  }
  private showModalCarga(){
      this.closeLoading = true;
   }

  private closeModelCarga(){
        this.closeLoading = false;
  }  

  private obtieneS3URL(type){
    if(this.modelo.files){
      for(var i=0; i<this.modelo.files.length; i++){
        if(type==this.modelo.files[i].description){
          return this.modelo.files[i].url;
        }
      }
    }
    return "";
  }

  private verificaModeloImages(){
    var description="";
    var url="";
    var reverso=false;
    var frente=false;
    var identificacion=false;
    var pasaporte=false;
    var selfie=false;
    var exist=false;
    if(this.filesCreated){
      for(var i=0; i<this.filesCreated.length; i++){
        description= this.filesCreated[i].description;
        url= this.filesCreated[i].url;
        if(description=="frente" && url!=""){
          frente=true;
        }else if(description=="reverso" && url!=""){
          reverso=true;
        }else if(description=="identificacion" && url!=""){
          identificacion=true;
        }else if(description=="pasaporte" && url!=""){
          pasaporte=true;
        }else if(description=="Selfie" && url!=""){
          selfie=true;
        }
      }
      if(this.isIfe){
        if((identificacion && selfie && !this.frenteYReverso) || ((this.frenteYReverso && frente) && (reverso && selfie))){
          exist=true;          
        }        
      }else if(!this.isIfe){
        if(pasaporte && selfie){
          exist=true;
        }
      }
    }
    this.isValid=exist;
    return exist;
  }

}