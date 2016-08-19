import {Component, OnInit, Input, Output, ElementRef, Inject, ViewChildren, QueryList} from '@angular/core';
import {FormBuilder, Validators, ControlGroup, Control, NgClass,NgForm} from '@angular/common';  
import {Slider} from './tasa_slider';
import { PrestatarioCotizadorModel } from '../models/prestatario_cotizador';
import {CotizadorService} from '../services/prestatarioCotizador'
import { Router } from '@angular/router';
import { Validations } from '../utilities/validations';
import { ControlMessages } from './tasa_control_messages';
import { FocusDirective } from './input_focus';
import { SetModelPrestatarioAlta } from '../services/model_prestatario_alta';
import { PrestatarioAltaModel } from '../models/prestatario_alta'
import { CurrencyString } from '../utilities/pipes/currencyString'
import { I18n } from '../utilities/pipes/internationalization';
import { DecimalPipe } from '@angular/common'
import { Loading } from './tasa_loading'
import { HeaderService } from '../services/header_service';
import { HeaderParameters } from '../models/header_parameters';

@Component({
	selector: 'prestatario-cotizador',
	templateUrl: 'components/prestatario_cotizador.html',
  directives: [Slider, ControlMessages,FocusDirective, Loading],
  providers: [CotizadorService],
  pipes: [CurrencyString, I18n]
})

export class  PrestatarioCotizador implements OnInit{
  title;
  usesCredit;  
  montoInicial: number;
  montoFinal: number;
  plazoInicial: number;
  plazoFinal: number;
  tasa_min: string='0';
  tasa_max: string='0';
  pagomensual_min: number=0;
  pagomensual_max: number=0;
  pagomensual_minshow: string = "$0";
  pagomensual_maxshow: string = "$0";
  factor_min: string = '0';
  factor_max: string = '0';
  closeLoading: boolean = false;

  aplica: string = '';
  model = new PrestatarioCotizadorModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  @Input()
  message: string= '';
  @Input()
  name: string="";
  @Input()
  activeButton: boolean= true;
  @Input()  
  desactiveButton: boolean= false;
  @Input()
  tieneDeuda: boolean = false;
  @Input()
  optionDeuda: boolean = false;
  @Input()
  hiddenImage: boolean = false;
  @Input()
  anotherHidden: boolean = true;
  @Input()
  hiddenPayDebts: boolean = true;
  _montos: Array<any>;
  _plazos: Array<any>;
  dataQuote;
  _cotizadorService;
  errorMessage: string;
  cotizadorForm: ControlGroup;
  errUseCredit: boolean = true;
  isMovil=false;
  isTablet=false;
  imagen;
  imagenFocus;

  prestatario_alta: PrestatarioAltaModel;


  constructor(
    private headerService: HeaderService,
    private element: ElementRef,   
    private cotizadorService:CotizadorService, 
    private router: Router, 
    private formBuilder: FormBuilder,
    private setModelService: SetModelPrestatarioAlta
    ) { 
    this.title ='¡Personaliza tu crédito!';
    this._cotizadorService = cotizadorService;

    if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|iPad/i)){
    this.isMovil = true;
    }else {
    this.isMovil = false;
    } 

    if(navigator.userAgent.match(/iPad/i)){
      this.isTablet= true;
    }

    this.cotizadorForm= this.formBuilder.group({
      'monto_deuda': [],
      'pago_mensual': [],      
      'aplica':['', Validators.required],
      'aplicado_en': [],
      'aplicado_otro':[],
      'monto': ['', Validators.required],
      'plazo': ['', Validators.required],
      'tasa_min': ['', Validators.required],
      'tasa_max': ['', Validators.required],
      'pago_mensual_min': ['', Validators.required],
      'pago_mensual_max': ['', Validators.required] 
  });

      if(!this.isMovil){    
      if (this.model.monto == null) {
        this.model.monto = 30000;
      }
      if(this.model.plazo==null){
        this.model.plazo = 6;
      }
      this.cotizadorForm.value.monto=this.model.monto;
      this.cotizadorForm.value.plazo=this.model.plazo;      
    }
}

  private onSelect(data) {
    this.name = data;
    this.imagen=data;
    if(this.cotizadorForm.value.monto_deuda == "" && 
      this.cotizadorForm.value.pago_mensual == "" && this.optionDeuda==true) {
      this.optionDeuda = false;
      this.tieneDeuda = false;
    }

   this.errUseCredit = true;
 
    let aplicadoEn= this.cotizadorForm.controls['aplicado_en'];
    this.model.aplicado_en="";

    if (data == 'other'){
      this.anotherHidden = false;
      this.hiddenPayDebts = true;      
      this.hiddenImage = true;
      this.marksAnother(true);
    }else{
      this.anotherHidden = true;
      this.hiddenPayDebts = true;
      this.hiddenImage = false 
      this.marksAnother(false);  
    }

    if (data == 'debts'){
      this.onSelectDeudas(true);
      aplicadoEn.validator= Validators.required;
      this.hiddenPayDebts = false;
      if (this.model.aplicado_en == 'Otro') {
        this.anotherHidden = false;
        this.marksAnother(true);
      } else {
        this.anotherHidden = true;
        this.marksAnother(false);
      }
      this.hiddenImage = true;
      this.optionDeuda = true;
      this.tieneDeuda= true;
    }else{
      aplicadoEn.validator=null;  
      this.model.aplicado_en=null;        
      if (aplicadoEn.touched) {
        aplicadoEn.markAsDirty();
      } 
    }
    this.onEquivalenciasAplica(data);
    aplicadoEn.updateValueAndValidity();
  }

  private marksAnother(indicate){
    let aplicadoOtro= this.cotizadorForm.controls['aplicado_otro'];

    if(indicate){
      aplicadoOtro.validator= Validators.required;
    }else{
      this.model.aplicado_otro=null;
      this.cotizadorForm.value.aplicado_otro=null;
      aplicadoOtro.validator=null;            
    }
    aplicadoOtro.updateValueAndValidity();
  }

  private onEquivalenciasAplica(data){
    switch (data) {
      case "debts":
        this.aplica = "Pagar deudas";
      break;
      case "negocio":
        this.aplica = "Iniciar negocio";
      break;
      case "hogar":
        this.aplica = "Mejoras al Hogar";
        break;
      case "viaje":
        this.aplica = "Viaje";
        break;
      case "estudios":
        this.aplica = "Estudios";
        break;
      case "other":
        this.aplica = "Otro";
        break;
      default:
        this.aplica = "";
        break;
    }
    this.cotizadorForm.value.aplica = this.aplica;  
    this.model.aplica= this.aplica;   

  }

  private onSelectDeudas(value){
    let montoDeuda= this.cotizadorForm.controls['monto_deuda'];
    let pagoMensual= this.cotizadorForm.controls['pago_mensual'];

    if (value) {    
      this.tieneDeuda = true;
      montoDeuda.validator= Validators.compose([Validators.required, Validations.maskNumberValidator]);
      pagoMensual.validator= Validators.compose([Validators.required, Validations.maskNumberValidator]);
    }
    else {
      this.tieneDeuda = false;
      this.model.monto_deuda = null;
      this.model.pago_mensual = null;
      montoDeuda.validator=null;
      pagoMensual.validator=null;         
       
      montoDeuda.updateValueAndValidity();
      pagoMensual.updateValueAndValidity();
    }

    montoDeuda.updateValueAndValidity();
    pagoMensual.updateValueAndValidity();

    this.optionDeuda =   this.tieneDeuda;
  }

  private onChange($event){
    if ($event.target.value=='Otro'){
      this.anotherHidden = false;
      this.marksAnother(true);      
    }else {
      this.anotherHidden = true;
      this.marksAnother(false);
      this.model.aplicado_otro=null;
    }
    this.model.aplicado_en = $event.target.value;
    this.cotizadorForm.value.aplicado_en = $event.target.value;
  }

  private onChangeSlider($event, element) {
    var data = $event.target.value;
    if (element == 'monto') {
      this.model.monto = data;
      this.cotizadorForm.value.monto = data;
    } else {
      this.model.plazo = data;
      this.cotizadorForm.value.plazo = data;
    }

    this.calculaMontos(this.model.plazo, this.model.monto);
  }


  private calculaMontos(plazo, monto){
    var factor_min;
    var factor_max;
    var pago_mensual_min;
    var pago_mensual_max;
    if (this.dataQuote && (plazo && monto)) {
      for (var i = 0; i < this.dataQuote.length; i++) {
        if (this.dataQuote[i].plazo == plazo) {

          this.tasa_min = (this.dataQuote[i].tasa_min).toFixed(2);
          this.tasa_max = (this.dataQuote[i].tasa_max).toFixed(2);

          factor_min = this.dataQuote[i].factor_min;
          factor_max = this.dataQuote[i].factor_max;

          this.factor_min = factor_min.toString();
          this.factor_max = factor_max.toString();

          pago_mensual_min = monto * factor_min;
          pago_mensual_max = monto * factor_max;         

          this.pagomensual_min = this.redondeCentena(pago_mensual_min);
          this.pagomensual_max = this.redondeCentena(pago_mensual_max);


          this.pagomensual_minshow = new CurrencyString().transform(this.pagomensual_min.toString(), 'USD', true, '.0-2');

          this.pagomensual_maxshow = new CurrencyString().transform(this.pagomensual_max.toString(), 'USD', true, '.0-2');

          this.estableceTasasPagosInModel(this.dataQuote[i].tasa_min,this.dataQuote[i].tasa_max, this.pagomensual_minshow, this.pagomensual_maxshow, this.factor_min, this.factor_max);

        }
      }
    }
  }

  private estableceTasasPagosInModel(tasa_min, tasa_max, pago_min, pago_max,factor_min, factor_max){
      this.cotizadorForm.value.tasa_min= tasa_min;
      this.cotizadorForm.value.tasa_max= tasa_max;
      this.cotizadorForm.value.pago_mensual_min= pago_min;
      this.cotizadorForm.value.pago_mensual_max= pago_max;
      this.model.tasa_min=tasa_min;
      this.model.tasa_max=tasa_max;
      this.model.pago_mensual_min=pago_min;
      this.model.pago_mensual_max=pago_max;
      this.model.factor_min_pago=factor_min;
      this.model.factor_max_pago=factor_max;
  }

   private redondeCentena(value){

    var value_faltante= 0;
    var dataCentena = (value.toString()).substring(0, 3);
    var dataDecena = parseInt(dataCentena.substring(0,1));
    var dataRedondeo = parseInt(dataCentena.substring(1,2));
    var dataUltimoDigito = parseInt(dataCentena.substring(2,3));

    if(dataUltimoDigito>=5){
      if (dataRedondeo == 9) {
        value_faltante = 1;
        dataRedondeo = 0;
      } else {
        dataRedondeo = dataRedondeo + 1;
      }
    }

    dataUltimoDigito = 0;
    dataDecena = dataDecena + value_faltante;


    var valorEntero=Math.floor(value);

    var cade = valorEntero.toString().substring(3, valorEntero.toString().length);

    var conversion = "";

    for (var i = 0; i < cade.length; i++){
      conversion = conversion + "0";
    }

    cade = dataDecena.toString() + dataRedondeo.toString() + dataUltimoDigito.toString() + conversion;

    return parseInt(cade);
  }


  getCotizacionQuoteDataTable() {
    this._cotizadorService.getQuoteDataTable().subscribe(
      response=>{
    if(response){     
      this.dataQuote = response;      
      this.calculaMontos(this.model.plazo, this.model.monto);     
        if(this._montos && this._plazos && this.usesCredit){
          this.closeModalCarga();
        }
      }
    },
      error=>{
        this.closeModalCarga();
      this.errorMessage = 'Por el momento el servicio no esta disponible...';
      }
    );
  }

  getMontos(){
    this._cotizadorService.getMontos()
      .subscribe(
      montos => {
        this._montos = montos;
        this.montoInicial = Math.min.apply(Math, this._montos.map(function(item) { return item.monto; }));
        this.montoFinal = Math.max.apply(Math, this._montos.map(function(item) { return item.monto; }));
        if(this._plazos && this.dataQuote && this.usesCredit){
          this.closeModalCarga();
        }
      },
      error => {
        this.errorMessage = 'Por el momento el servicio no esta disponible...';
        this.closeModalCarga();
      });
  }

  getPlazos() {
      this._cotizadorService.getPlazos()
      .subscribe(
          plazos => {
        this._plazos = plazos;
        this.plazoInicial = Math.min.apply(Math, this._plazos.map(function(item) { return item.plazo; }));
        this.plazoFinal = Math.max.apply(Math, this._plazos.map(function(item) { return item.plazo; }));
        if(this._montos && this.dataQuote && this.usesCredit){
          this.closeModalCarga();
        }
      },
      error => {
        this.errorMessage = 'Por el momento el servicio no esta disponible...';
        this.closeModalCarga();
      });
  }

  getDataAppliedOn(){
    this._cotizadorService.getDataAppliedOn()
    .subscribe(
      data => {        
        this.usesCredit=data;

        this.usesCredit.sort(function(a,b){ 
          var letterOne=a.nombre.toLowerCase();
          var letterTwo=b.nombre.toLowerCase();

          a.nombre=letterOne.charAt(0).toUpperCase() + letterOne.slice(1);
          b.nombre=letterTwo.charAt(0).toUpperCase() + letterTwo.slice(1);
                    
          if(a.nombre>b.nombre){
            return 1;
          }
        });
        
       if(this._montos && this.dataQuote && this._plazos){
         this.closeModalCarga();
       }      
      },
      error => {
        this.errorMessage = 'Por el momento el servicio no esta disponible...';        
        this.closeModalCarga();
      }
    );
  }

  ngOnInit() {
   this.headerService.setParameters(new HeaderParameters(this.title, false, false));
   this.showModalCarga();   
   this.getMontos();
   this.getPlazos();
   this.getCotizacionQuoteDataTable();
   this.getDataAppliedOn();
  }

  showFormControls(form: NgForm) {

   return form && form.controls['name'] &&
    form.controls['name'].value; 
  }

  private equivalenciaTieneDeuda(optionDeuda){
    if(optionDeuda){
      return 1;
    }else{
      return 0;
    }
  }
  
  setCurrency(event: any, data){
    if((event.target.value!=null && event.target.value!="")){
      var numberFormat=this.filterStringToNumber(event.target.value);
      if(!isNaN(numberFormat)){
        event.target.value=numberFormat;
        if(data=='montos'){                  
          let month = this.cotizadorForm.controls['monto'];
          Validations.rankMonthValidator(<Control>month, this._montos, event.target.value);
          if(this.cotizadorForm.controls['monto'].valid){
            event.target.value = new CurrencyString().transform(event.target.value, 'USD', true, '.2-2');
            this.calculaMontos(this.model.plazo, this.model.monto);     
          }          
        }else{
          event.target.value = new CurrencyString().transform(event.target.value, 'USD', true, '.2-2');  
        }
      }else{
        if(data=='montos'){
        let monto =this.cotizadorForm.controls['monto'];
        monto.validator= Validators.compose([Validators.required, Validations.maskNumberValidator]);          
        monto.markAsDirty();
        monto.markAsTouched();
        monto.updateValueAndValidity();   
      }

      }
    }
  }
  selectAll(event: any){
    event.target.select();
  }

  private filterStringToNumber(data){
    var cad;
    if(data){
      cad= (data.toString()).trim();
      cad= cad.replace("$", "");
      cad=cad.replace(/,/g,"");
      if(!isNaN(cad)){
        cad= parseInt(cad);
      }
    } 
    return cad;
  }

  private filterStringToMonths(data){
    var cad= (data.toString().toLowerCase()).trim();
    cad= cad.replace("meses", "");

    if(!isNaN(cad)){
      cad=parseInt(cad);
    }
    return cad;
  }

  setMonths(event: any){    
    if(event.target.value){
      var monthNumber=this.filterStringToMonths(event.target.value);
      if(!isNaN(monthNumber)){
        event.target.value=monthNumber;
        let term = this.cotizadorForm.controls['plazo'];
        Validations.rankTermValidator(<Control>term, this._plazos,event.target.value);
        if(this.cotizadorForm.controls['plazo'].valid){          
          event.target.value= event.target.value + " meses";
          this.calculaMontos(this.model.plazo, this.model.monto);              
        }
      }else{
          let plazo =this.cotizadorForm.controls['plazo'];
          plazo.validator= Validators.compose([Validators.required, Validations.onlyNumericValidator]);          
          plazo.markAsDirty();
          plazo.markAsTouched();
          plazo.updateValueAndValidity(); 
      }
    }
  }

  next() {

      var prestatarioCotizador = new PrestatarioCotizadorModel(
      this.filterStringToNumber(this.model.monto),
      this.filterStringToMonths(this.model.plazo),
      this.aplica,
      this.tasa_min.toString(),
      this.tasa_max.toString(),
      this.factor_min,
      this.factor_max,
      this.pagomensual_min,
      this.pagomensual_max,
      this.equivalenciaTieneDeuda(this.optionDeuda),
      this.filterStringToNumber(this.cotizadorForm.value.monto_deuda),
      this.filterStringToNumber(this.cotizadorForm.value.pago_mensual),
      this.cotizadorForm.value.aplicado_en,
      this.cotizadorForm.value.aplicado_otro
    )      

      if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
          this.prestatario_alta = new PrestatarioAltaModel();
      }
      this.prestatario_alta.cotizador = prestatarioCotizador;
      this.setModelService.setModel(this.prestatario_alta);
      
      this.router.navigate(['/Perfil']);

  }

  private showModalCarga(){
    this.closeLoading = true;
  }

  private closeModalCarga(){
    this.closeLoading = false;
  }

  private overButton(data){
    if(data==='viaje'){
      this.imagenFocus='viajeOver';
    }else if(data==='negocio'){
      this.imagenFocus='negocioOver';
    }else if(data==='debts'){
      this.imagenFocus='debtsOver';
    }else if(data==='other'){
      this.imagenFocus= 'otherOver';
    }else if(data==='hogar'){
      this.imagenFocus='hogarOver';
    }else if(data==='estudios'){
      this.imagenFocus='estudiosOver';
    }
    
  }

  private quitFocus(){
    this.imagenFocus='';
  }

}

