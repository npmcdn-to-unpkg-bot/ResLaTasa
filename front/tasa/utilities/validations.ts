import { ControlGroup, Control } from '@angular/common'
import {Injector, ReflectiveInjector} from '@angular/core';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import { ValidateExist } from '../services/validateExist';

import {ServiceResponse} from '../models/service_response';

export class Validations {


  //The endpoint's name should be the same that error message's last part (repeat + Name)
  //Example: Enpoint = UserName  => Error = repeatUserName
  static getEndPoints(code: string) {
    let endPoints = {
      'UserName': 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/getverificausuario/{value}',
      'Email': 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/getverificacorreo/{value}',
      'RFC': 'https://urmdamghr3.execute-api.us-east-1.amazonaws.com/development/verificarfc'
    };
    return endPoints[code];
  }

  static getValidatorErrorMessage(code: string) {
    let messages = {
      'required': '¡Ooops! es necesario llenar este campo',
      'invalidEmailAddress': 'Por favor escribe correctamente tu mail.',
      'invalidPassword': 'La contraseña debe de tener una longitud mínima de 8 caracteres.',
      'noSamePassword': 'El password no coincide, hagámoslo nuevamente.',
      'repeatUserName': '¡Ups! Alguien te ganó el nombre; elige otro diferente.',
      'repeatEmail': 'Parece que este mail ya está registrado, inicia sesión o utiliza un mail diferente',
      'repeatRFC': 'Este RFC ya está registrado',
      'ServiceError': 'Existen problemas con el servidor, intenta más tarde',
      'invalidOnlyLetters': 'Inténtalo otra vez, escribe solamente con letras',
      'invalidNoWhiteSpace': 'El nombre de usuario no debe tener espacios.', //TODO Crear un funcion cuando haya mas campos
      'onlyNumeric': 'Inténtalo otra vez, escribe solamente con números',
      'aNumber': '¡Ooops! por lo menos debe introducir un número',
      'fileOverSize': 'La imágen parece ser demasiado grande; utiliza imágenes de hasta 10 mb.',
      'invalidZipCodeNumber': 'El código postal debe tener 5 dígitos',
      'choseOne': 'Debe introducir al menos un número',
      'invalidHomoclave': 'La Homoclave consta de 3 Caracteres',
      'noRecords': 'No existen registros para este código postal',
      'invalidRFC': 'El RFC no tiene un formato valido',
      'invalidTelephone': 'El telefono no tiene un formato valido',
      'invalidDate': 'No es una fecha valida',
      'maxlength':'El maximo de longitud son 50 caracteres',
      'maxlengthAniosEmpleo':'El maximo de longitud son 2 caracteres',
      'rankTerm': 'El rango permitido es de 6 a 36 meses. Sólo se aceptan números enteros.',
      'rankMonth': 'El rango permitido es de 30,000 a 350,000. Sólo se aceptan números enteros en multiplos de 5,000.',
      'invalidCIEC':'La CIEC debe contener una longitud mínima de 8 caracteres, una letra minuscula, una letra mayuscula y un número.',
      'zero':'Tu ingreso debe ser mayor a 0'
    };

    return messages[code];
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  static errorCorreo(control) {
      return { 'invalidEmailAddress': true };
  }




  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    if (control.value.match(/^[a-zA-Z0-9!@#$%^& _*]{8,100}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

  static samePasswordValidator(elementOne: string, elementTwo: string) {
    return (group: ControlGroup) => {
      let elOne = group.controls[elementOne];
      let elTwo = group.controls[elementTwo];
      if (elOne.value === elTwo.value) {
        var error = null
        if (elTwo.value.length < 1) {
          error = { 'required': true }
        }
        return elTwo.setErrors(error);
      } else {
        return elTwo.setErrors({ noSamePassword: true });
      }
    }
  }

  static chekboxRequiredValidator(control) {
    if (control.value) {
      return null;
    } else {
      return { 'requiered': true };
    }
  }

  static onlyLettersValidator(control) {
    if ( control.value != null && control.value.match(/^[A-zÀ-ÿ _]+$/)) {
      return null;
    } else {
      return { 'invalidOnlyLetters': true };
    }
  }

  static noWhiteSpaceValidator(control) {
    if (control.value != null && control.value.match(/^[^\s]*$/)) {
      return null;
    } else {
      return { 'invalidNoWhiteSpace': true };
    }
  }

  static asyncValidator(control: Control, service: string, userName: string) {
    var injector = ReflectiveInjector.resolveAndCreate([HTTP_PROVIDERS]);
    let http = injector.get(Http);
    var serviceExist = new ValidateExist(http);
    var errores: any;
    errores = control.errors;
    if (control.value.length > 0 && errores === null) {
      serviceExist.Exist(control.value,userName, this.getEndPoints(service)).subscribe(
        data => {
          control.setErrors(data);
        },
        error => {
          if (error.message === 'repeat') {
            error.message += service;
          }
          control.setErrors({ [error.message]: true });
        }
      );
    }
  }

  static onlyNumericValidator(control) {
    if ((control.value=="" || control.value==null)||
     control.value.match(/^[0-9]*\.?[0-9]*$/)) {
      return null;
    } else {
      return { 'onlyNumeric': true };
    }
  }
  
  static zeroValidator(control:any) {
    if ((control.value=="" || control.value==null)||
     control.value > 0) {
     return null
    } else {
      return { 'zero': true };
    }
  }

  static maxlength(control){
    if ( control.value != null && control.value.match(/^[\s\S]{0,2}$/)) {
      return null;
    } else {
      return { 'maxlengthAniosEmpleo': true };
    }
  }
  static zipCodeValidator(control){
    if (control.value.match( /^\d{5}$/ )){
      return null;
    }else{
      return { 'invalidZipCodeNumber': true };
    }
  }

  static verifyexterior(control){
    if (control.value ){
      return null;
    }else{
      return { 'choseOne': true };
    }
  }

  static fileSizeValidator(size: number, maxSixe: number){
    if(size <= maxSixe){
      return null;
    }else{
      return this.getValidatorErrorMessage('fileOverSize');
    }
  }

  static numberValidator(controlOne: string, controlTwo: string) {
    var valid = false;
    return (group: ControlGroup) => {
      let elOne = group.controls[controlOne];
      let elTwo = group.controls[controlTwo];

      if (elOne.value.length >= 1) {
        return elTwo.setErrors(null);
      } else if (elOne.value.length < 1 && elTwo.value.length < 1) {
        return elOne.setErrors({ 'choseOne': true })
      }

      if (elTwo.value.length >= 1) {
        return elOne.setErrors(null)
      } else if (elTwo.value.length < 1 && elOne.value.length < 1) {
        return elTwo.setErrors({ 'choseOne': true })
      }
    }
  }
  
  static RFCValidator(control){
    if  ((control.value=="" || control.value==null) || control.value.match(/^[A-Za-z]{4}\d{6}$/)) {
      return null;
    } else {
      return { 'invalidRFC': true };
    }
  }

  static telephoneValidator(control){
    if ((control.value=="" || control.value==null) || control.value.match(/^\d{10}$/)) {
      return null;
    } else {
      return { 'invalidTelephone': true };
    }
  }

  static dateValidator(controlDay: string, controlMonth: string, controlYear: string){
     return (group: ControlGroup) => {
      let day = group.controls[controlDay];
      let month = group.controls[controlMonth];
      let year = group.controls[controlYear];
      
      if(day.value != "" && month.value != "" && year.value != ""){
        day.setErrors(null);
        month.setErrors(null);
        year.setErrors(null);
        return;
      }
      
      day.setErrors({ 'invalidDate': true });
      month.setErrors({ 'invalidDate': true });
      year.setErrors({ 'invalidDate': true });
      return;
    }
      
  }

  static homoclaveValidator(control){
    if ((control.value == "" || control.value == null) || control.value.match(/^[A-Za-z0-9]{3}$/)) {
      return null;
    } else {
      return { 'invalidHomoclave': true };
    }
  }

  static rankTermValidator(control: Control, listData: any[], month){
    if(month.match(/^\d*$/)){
      if (listData) {
        for (var i = 0; i < listData.length; i++) {
          if(listData[i].plazo==parseInt(month)){
            return control.setErrors(null);          
          }
        }
      }
    }
    return control.setErrors ({ 'rankTerm': true });
  }

  static rankMonthValidator(control: Control, listData: any[], valueSinFiltros){
    if(valueSinFiltros.match(/^\d*$/)){
      if(listData){
        for(var i=0; i < listData.length; i++){
          if(listData[i].monto==parseInt(valueSinFiltros)){
            return control.setErrors(null);
          }
        }
      }
    }  
    return control.setErrors({'rankMonth': true});
  }

  static RFCValidatorHomoclave(control){
    if(control.value!=null && control.value.match(/^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/)) {
      return null;
    } else {
      return { 'invalidRFC': true };
    }
  }
  static ciecValidator(control:any){
    if(control.value != null && control.value.match(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)){
      return null;  
    }else{
      return {'invalidCIEC':true}
    }
  }
  static maskNumberValidator(control){
     if (control.value!=null && control.value!=""){
      var cad=(control.value).replace('$','');
      cad=cad.replace(/,/g,'');
      if((cad!=null && cad!="") && cad.match(/^[0-9]*\.?[0-9]*$/)){
        return null;
      }else{
        return { 'onlyNumeric': true };
      }
    }
  }
}
