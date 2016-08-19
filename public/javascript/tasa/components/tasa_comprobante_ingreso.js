"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var tasa_upload_images_1 = require('./tasa_upload_images');
var upload_file_parameters_1 = require('../models/upload_file_parameters');
var validations_1 = require('../utilities/validations');
var internationalization_1 = require('../utilities/pipes/internationalization');
var catalogEmploymentStatus_1 = require('../services/catalogEmploymentStatus');
var ComprobanteIngresos = (function () {
    function ComprobanteIngresos(stateLaborService) {
        var _this = this;
        this.stateLaborService = stateLaborService;
        this.errorMessage = null;
        this.isValid = false;
        //Boton elminar
        this.eliminar = false;
        this.isValidImagen = false;
        this.isValidSelect = false;
        this.comprobante = {};
        this.validaComprobante = new core_1.EventEmitter();
        this.parametrosComprobante = new upload_file_parameters_1.UpLoadFileParametersModel();
        window.setTimeout(function () {
            _this.comprobante.id = '';
            _this.parametrosComprobante.rol = "prestatario";
            _this.parametrosComprobante.context = "ComprobanteIngreso";
            _this.parametrosComprobante.orientation = 'vertical';
            _this.parametrosComprobante.title = 'Comprobante de ingresos';
            _this.parametrosComprobante.imgSrc = "/images/comprobanteIngresos.svg";
            _this.parametrosComprobante.imgSrcActive = "/images/comprobanteIngresosActive.svg";
        });
    }
    Object.defineProperty(ComprobanteIngresos.prototype, "estadolaboral", {
        set: function (estadolaboral) {
            if (estadolaboral.length > 0) {
                this.getTipoComprobante(estadolaboral);
            }
            else {
                this.getTipoComprobante('empleado');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComprobanteIngresos.prototype, "username", {
        set: function (username) {
            this.parametrosComprobante.userName = username;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComprobanteIngresos.prototype, "imagen", {
        set: function (imagen) {
            this.isValidSelect = true;
            this.archivos.forEach(function (item) {
                item.prevent = false;
                item.setFile(imagen);
            });
        },
        enumerable: true,
        configurable: true
    });
    ComprobanteIngresos.prototype.ngAfterViewInit = function () {
        this.archivos.forEach(function (item) {
            item.prevent = true;
        });
    };
    ComprobanteIngresos.prototype.imageSelected = function (respuesta) {
        var _this = this;
        this.archivos.forEach(function (item) {
            if (!item.isValid) {
                _this.isValidImagen = false;
                return;
            }
            else {
                _this.isValidImagen = true;
                _this.file = item.s3URL;
            }
        });
        this.validaSelectImagen();
    };
    ComprobanteIngresos.prototype.getComprobante = function (event) {
        this.errorMessage = null;
        if (event.target.value != '' && event.target.value != null) {
            this.isValidSelect = true;
            this.parametrosComprobante.type = this.comprobante.id;
            this.archivos.forEach(function (item) {
                item.prevent = false;
            });
            window.setTimeout(function () {
                document.querySelector('select').setAttribute('class', 'ng-valid selectedOption');
            });
        }
        else {
            this.isValidSelect = false;
            this.errorMessage = '¡Ooops! es necesario llenar este campo';
            this.archivos.forEach(function (item) {
                item.prevent = true;
            });
            window.setTimeout(function () {
                document.querySelector('select').setAttribute('class', 'ng-invalid option-deafult');
            });
        }
        this.validaSelectImagen();
    };
    ComprobanteIngresos.prototype.validaSelectImagen = function () {
        if (this.isValidImagen == true && this.isValidSelect == true) {
            this.eliminar = true;
            this.isValid = true;
        }
        else {
            this.eliminar = false;
            this.isValid = false;
        }
        this.validaComprobante.emit(this.isValid);
    };
    ComprobanteIngresos.prototype.getTipoComprobante = function (estadolaboral) {
        var _this = this;
        this.stateLaborService.getTipoComprobante(estadolaboral)
            .subscribe(function (tipo_comprobantes) {
            _this.tipo_comprobantes = tipo_comprobantes;
        }, function (error) {
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    ComprobanteIngresos.prototype.removeElement = function () {
        this.archivos.forEach(function (item) {
            item.clearFile();
        });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ComprobanteIngresos.prototype, "validaComprobante", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], ComprobanteIngresos.prototype, "estadolaboral", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], ComprobanteIngresos.prototype, "username", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], ComprobanteIngresos.prototype, "imagen", null);
    __decorate([
        core_1.ViewChildren(tasa_upload_images_1.UpLoadImages), 
        __metadata('design:type', core_1.QueryList)
    ], ComprobanteIngresos.prototype, "archivos", void 0);
    ComprobanteIngresos = __decorate([
        core_1.Component({
            selector: 'comprobante-ingresos',
            templateUrl: 'components/tasa_comprobante_ingreso.html',
            directives: [tasa_upload_images_1.UpLoadImages],
            providers: [catalogEmploymentStatus_1.catalogEmploymentStatus],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [catalogEmploymentStatus_1.catalogEmploymentStatus])
    ], ComprobanteIngresos);
    return ComprobanteIngresos;
}());
exports.ComprobanteIngresos = ComprobanteIngresos;
//# sourceMappingURL=tasa_comprobante_ingreso.js.map