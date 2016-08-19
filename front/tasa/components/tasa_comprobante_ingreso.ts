import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit} from '@angular/core';

import {NgClass} from '@angular/common';

import {UpLoadImages} from './tasa_upload_images';

import { UpLoadFileModel } from '../models/upload_file';
import { UpLoadFileParametersModel } from '../models/upload_file_parameters';

import { Validations } from '../utilities/validations';
import { I18n } from '../utilities/pipes/internationalization';

import { catalogEmploymentStatus } from '../services/catalogEmploymentStatus';

@Component({
  selector: 'comprobante-ingresos',
  templateUrl: 'components/tasa_comprobante_ingreso.html',
  directives: [UpLoadImages],
  providers: [catalogEmploymentStatus],
  pipes: [I18n]
})

export class ComprobanteIngresos {

  errorMessage = null;

  isValid: boolean = false;
  file: string;


  //Boton elminar
  eliminar: boolean = false;

  private isValidImagen: boolean = false;
  private isValidSelect: boolean = false;


  tipo_comprobantes: Array<any>;

  comprobante: any = {};

  //parametros para cargar imagenes
  parametrosComprobante: UpLoadFileParametersModel;


  @Output()
  validaComprobante = new EventEmitter<boolean>();



  @Input()
  set estadolaboral(estadolaboral: string) {
    if (estadolaboral.length > 0) {
      this.getTipoComprobante(estadolaboral);
    }
    else {
      this.getTipoComprobante('empleado');
    }
  }
  @Input()
  set username(username: string) {
    this.parametrosComprobante.userName = username;
  }
  @Input()
  set imagen(imagen: string) {
    this.isValidSelect = true;
    this.archivos.forEach(item => {
      item.prevent = false;
      item.setFile(imagen);
    });
  }


  @ViewChildren(UpLoadImages) archivos: QueryList<UpLoadImages>;

  constructor(private stateLaborService: catalogEmploymentStatus) {
    this.parametrosComprobante = new UpLoadFileParametersModel();
    window.setTimeout(() => {
      this.comprobante.id = '';
      this.parametrosComprobante.rol = "prestatario";
      this.parametrosComprobante.context = "ComprobanteIngreso";
      this.parametrosComprobante.orientation = 'vertical';
      this.parametrosComprobante.title = 'Comprobante de ingresos';
      this.parametrosComprobante.imgSrc = "/images/comprobanteIngresos.svg";
      this.parametrosComprobante.imgSrcActive = "/images/comprobanteIngresosActive.svg";
    });
  }


  ngAfterViewInit() {
    this.archivos.forEach(item => {
      item.prevent = true;
    });
  }

  imageSelected(respuesta: boolean) {
    this.archivos.forEach(item => {
      if (!item.isValid) {
        this.isValidImagen = false;
        return;
      } else {
        this.isValidImagen = true;
        this.file = item.s3URL;
      }
    });
    this.validaSelectImagen();
  }

  getComprobante(event: any) {
    this.errorMessage = null;
    if (event.target.value != '' && event.target.value != null) {
      this.isValidSelect = true;
      this.parametrosComprobante.type = this.comprobante.id;
      this.archivos.forEach(item => {
        item.prevent = false;
      });
      window.setTimeout(() =>{
        document.querySelector('select').setAttribute('class', 'ng-valid selectedOption');
      });
    } else {
      this.isValidSelect = false;
      this.errorMessage = '¡Ooops! es necesario llenar este campo';
      this.archivos.forEach(item => {
        item.prevent = true;
      });
      window.setTimeout(() =>{
        document.querySelector('select').setAttribute('class', 'ng-invalid option-deafult');
      });
    }
    this.validaSelectImagen();
  }

  validaSelectImagen() {
    if (this.isValidImagen == true && this.isValidSelect == true) {
      this.eliminar = true;
      this.isValid = true;
    } else {
      this.eliminar = false;
      this.isValid = false;
    }
    this.validaComprobante.emit(this.isValid);
  }

  getTipoComprobante(estadolaboral: any) {
    this.stateLaborService.getTipoComprobante(estadolaboral)
      .subscribe(
      tipo_comprobantes => {
        this.tipo_comprobantes = tipo_comprobantes;
      },
      error => {
        console.error(error);
        alert(Validations.getValidatorErrorMessage('ServiceError'));
      }
      );
  }
  removeElement() {
    this.archivos.forEach(item => {
      item.clearFile();
    });
  }
}