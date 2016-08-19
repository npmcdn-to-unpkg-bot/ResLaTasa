
import {Component, AfterViewChecked, ViewChildren, QueryList } from '@angular/core';
import { FormControl, FormGroup, Validators, REACTIVE_FORM_DIRECTIVES, FormBuilder } from '@angular/forms';
import { TasaTooltip } from './tasa_tooltip';
import { UpLoadImages } from './tasa_upload_images';
import { UpLoadFileParametersModel } from '../models/upload_file_parameters'

@Component({
  selector: 'uikit',
  templateUrl: 'components/demouikit.html',
  directives: [TasaTooltip, REACTIVE_FORM_DIRECTIVES,UpLoadImages]
})
export class UIKit implements AfterViewChecked{

  private disabledLabel: boolean;
  private combo: any;
  private opciones: Array<{'id':number, 'texto': string}>;
  private imagen: number
  @ViewChildren(UpLoadImages) archivos: QueryList<UpLoadImages>;
  registerForm: FormGroup;
  model = {name: ''};
  parametresIFE: UpLoadFileParametersModel;

  constructor(private formBuilder: FormBuilder) { 
    this.disabledLabel = true;
    this.combo = '';
    this.opciones = new Array<{'id':number, 'texto': string}>();
    this.opciones.push({'id':1, 'texto': 'Uno'});
    this.opciones.push({'id':2, 'texto': 'Dos'});
    this.opciones.push({'id':3, 'texto': 'Tres'});
    this.imagen = 1;

    this.model.name = 'Gerardo'


    //Parametros necesarios para Subir imagen
    this.parametresIFE = new UpLoadFileParametersModel();
    this.parametresIFE.rol = "prestatario";
    this.parametresIFE.userName = "Gerardo";
    this.parametresIFE.context = "identificacion";
    this.parametresIFE.type = "IFE";
    this.parametresIFE.imgSrc = "/images/prestatario_identificacion/pasaporte.svg"
    this.parametresIFE.imgSrcActive = "/images/prestatario_identificacion/pasaporteActive.svg";
    this.parametresIFE.orientation = 'vertical';
    this.parametresIFE.title = 'IFE';
    this.parametresIFE.s3URL = "/sdasd/asd";
    
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required]
    });
  }
  ngAfterViewChecked(){
    
    (<any>window).Waves.init();// Para agregar los efectos a los botones
  }

  imageSelected(respuesta: boolean){
    
  }

  eliminar(type: string){
    let controlAEliminar : UpLoadImages;
    this.archivos.forEach(item => {
      if(item.parameters.type == type){
        controlAEliminar = item;
      }
    });
    controlAEliminar.clearFile();
  }
}