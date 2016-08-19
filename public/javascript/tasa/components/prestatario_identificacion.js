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
var router_1 = require('@angular/router');
var tasa_upload_images_1 = require('./tasa_upload_images');
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var header_service_1 = require('../services/header_service');
var prestatarioIdentificaion_1 = require('../services/prestatarioIdentificaion');
var upload_file_1 = require('../models/upload_file');
var prestatario_identificacion_1 = require('../models/prestatario_identificacion');
var header_parameters_1 = require('../models/header_parameters');
var internationalization_1 = require('../utilities/pipes/internationalization');
var validations_1 = require('../utilities/validations');
var PrestatarioIdentificacion = (function () {
    function PrestatarioIdentificacion(headerService, setModelService, router, uploadService) {
        this.headerService = headerService;
        this.setModelService = setModelService;
        this.router = router;
        this.uploadService = uploadService;
        this.permitirPeticion = true;
        this.NOMBRE_PANTALLA = 'Identificacion';
        this.title = '¡Llenemos tu expediente!';
        this.frenteYReverso = false;
        this.isValid = false;
        this.isIfe = true;
        var mql = window.matchMedia('(min-width: 48em)');
        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
            this.isMovil = true;
        }
        else {
            this.isMovil = false;
        }
        this.showButtons = !this.isMovil;
    }
    PrestatarioIdentificacion.prototype.ngOnInit = function () {
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, false, false));
    };
    PrestatarioIdentificacion.prototype.imageSelected = function (respuesta) {
        var _this = this;
        this.isValid = true;
        this.archivos.forEach(function (item) {
            if (!item.isValid) {
                _this.isValid = false;
                return;
            }
        });
    };
    PrestatarioIdentificacion.prototype.identificactionChange = function (event) {
        if (event.target.id == "Passport") {
            this.isIfe = false;
            this.frenteYReverso = true;
            this.showButtons = false;
        }
        else if (event.target.id == "IFE") {
            this.isIfe = true;
            this.frenteYReverso = false;
            this.showButtons = !this.isMovil;
        }
        this.isValid = false;
    };
    PrestatarioIdentificacion.prototype.frenteReversoChange = function (event) {
        if (event.target.id == "frente") {
            this.frenteYReverso = false;
        }
        else if (event.target.id == "frenteReverso") {
            this.frenteYReverso = true;
        }
        this.isValid = false;
    };
    PrestatarioIdentificacion.prototype.next = function () {
        var _this = this;
        this.permitirPeticion = false;
        if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
            this.prestatario_alta = this.setModelService.getModel();
        }
        var archivosAEnvar = new upload_file_1.UpLoadFileModel();
        archivosAEnvar.username = this.prestatario_alta.perfil.username;
        archivosAEnvar.page = this.NOMBRE_PANTALLA;
        this.archivos.forEach(function (item) {
            if (!_this.frenteYReverso) {
            }
        });
        this.uploadService.upload(archivosAEnvar).subscribe(function (respuesta) {
            _this.permitirPeticion = true;
            if (respuesta) {
                var identificacionModel = new prestatario_identificacion_1.PrestatarioIdentificacionModel('', '', '', '', '', '', '');
                _this.prestatario_alta.identificacion = identificacionModel;
                _this.setModelService.setModel(_this.prestatario_alta);
                _this.router.navigate(['/Domicilio']);
            }
        }, function (error) {
            _this.permitirPeticion = true;
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    __decorate([
        core_1.ViewChildren(tasa_upload_images_1.UpLoadImages), 
        __metadata('design:type', core_1.QueryList)
    ], PrestatarioIdentificacion.prototype, "archivos", void 0);
    PrestatarioIdentificacion = __decorate([
        core_1.Component({
            selector: 'prestatario-identificacion',
            templateUrl: 'components/prestatario_identificacion.html',
            directives: [tasa_upload_images_1.UpLoadImages],
            providers: [prestatarioIdentificaion_1.PrestatarioIdentificaion],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, model_prestatario_alta_1.SetModelPrestatarioAlta, router_1.Router, prestatarioIdentificaion_1.PrestatarioIdentificaion])
    ], PrestatarioIdentificacion);
    return PrestatarioIdentificacion;
}());
exports.PrestatarioIdentificacion = PrestatarioIdentificacion;
//# sourceMappingURL=prestatario_identificacion.js.map