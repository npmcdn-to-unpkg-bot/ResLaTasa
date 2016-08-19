"use strict";
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var validateExist_1 = require('../services/validateExist');
var Validations = (function () {
    function Validations() {
    }
    //The endpoint's name should be the same that error message's last part (repeat + Name)
    //Example: Enpoint = UserName  => Error = repeatUserName
    Validations.getEndPoints = function (code) {
        var endPoints = {
            'UserName': 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/getverificausuario/{value}',
            'Email': 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/getverificacorreo/{value}',
            'RFC': 'https://urmdamghr3.execute-api.us-east-1.amazonaws.com/development/verificarfc'
        };
        return endPoints[code];
    };
    Validations.getValidatorErrorMessage = function (code) {
        var messages = {
            'required': '¡Ooops! es necesario llenar este campo',
            'invalidEmailAddress': 'Por favor escribe correctamente tu mail.',
            'invalidPassword': 'La contraseña debe de tener una longitud mínima de 8 caracteres.',
            'noSamePassword': 'El password no coincide, hagámoslo nuevamente.',
            'repeatUserName': '¡Ups! Alguien te ganó el nombre; elige otro diferente.',
            'repeatEmail': 'Parece que este mail ya está registrado, inicia sesión o utiliza un mail diferente',
            'repeatRFC': 'Este RFC ya está registrado',
            'ServiceError': 'Existen problemas con el servidor, intenta más tarde',
            'invalidOnlyLetters': 'Inténtalo otra vez, escribe solamente con letras',
            'invalidNoWhiteSpace': 'El nombre de usuario no debe tener espacios.',
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
            'maxlength': 'El maximo de longitud son 50 caracteres',
            'maxlengthAniosEmpleo': 'El maximo de longitud son 2 caracteres',
            'rankTerm': 'El rango permitido es de 6 a 36 meses. Sólo se aceptan números enteros.',
            'rankMonth': 'El rango permitido es de 30,000 a 350,000. Sólo se aceptan números enteros en multiplos de 5,000.',
            'invalidCIEC': 'La CIEC debe contener una longitud mínima de 8 caracteres, una letra minuscula, una letra mayuscula y un número.',
            'zero': 'Tu ingreso debe ser mayor a 0'
        };
        return messages[code];
    };
    Validations.emailValidator = function (control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        }
        else {
            return { 'invalidEmailAddress': true };
        }
    };
    Validations.errorCorreo = function (control) {
        return { 'invalidEmailAddress': true };
    };
    Validations.passwordValidator = function (control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        if (control.value.match(/^[a-zA-Z0-9!@#$%^& _*]{8,100}$/)) {
            return null;
        }
        else {
            return { 'invalidPassword': true };
        }
    };
    Validations.samePasswordValidator = function (elementOne, elementTwo) {
        return function (group) {
            var elOne = group.controls[elementOne];
            var elTwo = group.controls[elementTwo];
            if (elOne.value === elTwo.value) {
                var error = null;
                if (elTwo.value.length < 1) {
                    error = { 'required': true };
                }
                return elTwo.setErrors(error);
            }
            else {
                return elTwo.setErrors({ noSamePassword: true });
            }
        };
    };
    Validations.chekboxRequiredValidator = function (control) {
        if (control.value) {
            return null;
        }
        else {
            return { 'requiered': true };
        }
    };
    Validations.onlyLettersValidator = function (control) {
        if (control.value != null && control.value.match(/^[A-zÀ-ÿ _]+$/)) {
            return null;
        }
        else {
            return { 'invalidOnlyLetters': true };
        }
    };
    Validations.noWhiteSpaceValidator = function (control) {
        if (control.value != null && control.value.match(/^[^\s]*$/)) {
            return null;
        }
        else {
            return { 'invalidNoWhiteSpace': true };
        }
    };
    Validations.asyncValidator = function (control, service, userName) {
        var injector = core_1.ReflectiveInjector.resolveAndCreate([http_1.HTTP_PROVIDERS]);
        var http = injector.get(http_1.Http);
        var serviceExist = new validateExist_1.ValidateExist(http);
        var errores;
        errores = control.errors;
        if (control.value.length > 0 && errores === null) {
            serviceExist.Exist(control.value, userName, this.getEndPoints(service)).subscribe(function (data) {
                control.setErrors(data);
            }, function (error) {
                if (error.message === 'repeat') {
                    error.message += service;
                }
                control.setErrors((_a = {}, _a[error.message] = true, _a));
                var _a;
            });
        }
    };
    Validations.onlyNumericValidator = function (control) {
        if ((control.value == "" || control.value == null) ||
            control.value.match(/^[0-9]*\.?[0-9]*$/)) {
            return null;
        }
        else {
            return { 'onlyNumeric': true };
        }
    };
    Validations.zeroValidator = function (control) {
        if ((control.value == "" || control.value == null) ||
            control.value > 0) {
            return null;
        }
        else {
            return { 'zero': true };
        }
    };
    Validations.maxlength = function (control) {
        if (control.value != null && control.value.match(/^[\s\S]{0,2}$/)) {
            return null;
        }
        else {
            return { 'maxlengthAniosEmpleo': true };
        }
    };
    Validations.zipCodeValidator = function (control) {
        if (control.value.match(/^\d{5}$/)) {
            return null;
        }
        else {
            return { 'invalidZipCodeNumber': true };
        }
    };
    Validations.verifyexterior = function (control) {
        if (control.value) {
            return null;
        }
        else {
            return { 'choseOne': true };
        }
    };
    Validations.fileSizeValidator = function (size, maxSixe) {
        if (size <= maxSixe) {
            return null;
        }
        else {
            return this.getValidatorErrorMessage('fileOverSize');
        }
    };
    Validations.numberValidator = function (controlOne, controlTwo) {
        var valid = false;
        return function (group) {
            var elOne = group.controls[controlOne];
            var elTwo = group.controls[controlTwo];
            if (elOne.value.length >= 1) {
                return elTwo.setErrors(null);
            }
            else if (elOne.value.length < 1 && elTwo.value.length < 1) {
                return elOne.setErrors({ 'choseOne': true });
            }
            if (elTwo.value.length >= 1) {
                return elOne.setErrors(null);
            }
            else if (elTwo.value.length < 1 && elOne.value.length < 1) {
                return elTwo.setErrors({ 'choseOne': true });
            }
        };
    };
    Validations.RFCValidator = function (control) {
        if ((control.value == "" || control.value == null) || control.value.match(/^[A-Za-z]{4}\d{6}$/)) {
            return null;
        }
        else {
            return { 'invalidRFC': true };
        }
    };
    Validations.telephoneValidator = function (control) {
        if ((control.value == "" || control.value == null) || control.value.match(/^\d{10}$/)) {
            return null;
        }
        else {
            return { 'invalidTelephone': true };
        }
    };
    Validations.dateValidator = function (controlDay, controlMonth, controlYear) {
        return function (group) {
            var day = group.controls[controlDay];
            var month = group.controls[controlMonth];
            var year = group.controls[controlYear];
            if (day.value != "" && month.value != "" && year.value != "") {
                day.setErrors(null);
                month.setErrors(null);
                year.setErrors(null);
                return;
            }
            day.setErrors({ 'invalidDate': true });
            month.setErrors({ 'invalidDate': true });
            year.setErrors({ 'invalidDate': true });
            return;
        };
    };
    Validations.homoclaveValidator = function (control) {
        if ((control.value == "" || control.value == null) || control.value.match(/^[A-Za-z0-9]{3}$/)) {
            return null;
        }
        else {
            return { 'invalidHomoclave': true };
        }
    };
    Validations.rankTermValidator = function (control, listData, month) {
        if (month.match(/^\d*$/)) {
            if (listData) {
                for (var i = 0; i < listData.length; i++) {
                    if (listData[i].plazo == parseInt(month)) {
                        return control.setErrors(null);
                    }
                }
            }
        }
        return control.setErrors({ 'rankTerm': true });
    };
    Validations.rankMonthValidator = function (control, listData, valueSinFiltros) {
        if (valueSinFiltros.match(/^\d*$/)) {
            if (listData) {
                for (var i = 0; i < listData.length; i++) {
                    if (listData[i].monto == parseInt(valueSinFiltros)) {
                        return control.setErrors(null);
                    }
                }
            }
        }
        return control.setErrors({ 'rankMonth': true });
    };
    Validations.RFCValidatorHomoclave = function (control) {
        if (control.value != null && control.value.match(/^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/)) {
            return null;
        }
        else {
            return { 'invalidRFC': true };
        }
    };
    Validations.ciecValidator = function (control) {
        if (control.value != null && control.value.match(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)) {
            return null;
        }
        else {
            return { 'invalidCIEC': true };
        }
    };
    Validations.maskNumberValidator = function (control) {
        if (control.value != null && control.value != "") {
            var cad = (control.value).replace('$', '');
            cad = cad.replace(/,/g, '');
            if ((cad != null && cad != "") && cad.match(/^[0-9]*\.?[0-9]*$/)) {
                return null;
            }
            else {
                return { 'onlyNumeric': true };
            }
        }
    };
    return Validations;
}());
exports.Validations = Validations;
//# sourceMappingURL=validations.js.map