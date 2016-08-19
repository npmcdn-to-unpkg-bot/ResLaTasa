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
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var header_service_1 = require('../services/header_service');
var catalogDataDomicile_1 = require('../services/catalogDataDomicile');
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var createPrestatarioDomicile_1 = require('../services/createPrestatarioDomicile');
var validations_1 = require('../utilities/validations');
var internationalization_1 = require('../utilities/pipes/internationalization');
var tasa_control_messages_1 = require('./tasa_control_messages');
var prestatario_domicilio_1 = require('../models/prestatario_domicilio');
var header_parameters_1 = require('../models/header_parameters');
var prestatario_sender_1 = require('../models/prestatario_sender');
var tasa_upload_images_1 = require('./tasa_upload_images');
var tasa_loading_1 = require('./tasa_loading');
var PrestatarioDomicilio = (function () {
    function PrestatarioDomicilio(headerService, formBuilder, setModelService, catalogDomicileService, router, crearDomicile) {
        this.headerService = headerService;
        this.formBuilder = formBuilder;
        this.setModelService = setModelService;
        this.catalogDomicileService = catalogDomicileService;
        this.router = router;
        this.crearDomicile = crearDomicile;
        this.useVoucher = '';
        this.model = new prestatario_domicilio_1.PrestatarioDomicile("", "", "", "", "", "", "", "", "");
        this.validaFormDomi = false;
        this.closeLoading = false;
        this.permitirPeticion = true;
        this.numberHas = '';
        this.numexterior = false;
        this.file_srcs = [];
        this.routeFront = '';
        this.title = '¡Completa tu solicitud!';
        this.domicileService = catalogDomicileService;
        this.domicilioForm = this.formBuilder.group({
            'calle': ['', common_1.Validators.required],
            'codigoPostal': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.zipCodeValidator])],
            'estado': ['', common_1.Validators.required],
            'delegacion': ['', common_1.Validators.required],
            'colonia': ['', common_1.Validators.required],
            'numeros': formBuilder.group({
                'numeros.exterior': [''],
                'numeros.interior': ['']
            }, { validator: validations_1.Validations.numberValidator('numeros.exterior', 'numeros.interior') })
        });
        this.prestatario_alta = this.setModelService.getModel();
        if (this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('domicilio')) {
            this.showModalCarga();
            this.presPerfilModel = this.prestatario_alta.domicilio;
            this.getDataState({ target: { value: this.presPerfilModel.id_estado } });
            this.getDataColony({ target: { value: this.presPerfilModel.delegacion_municipio } });
            this.model = this.presPerfilModel;
            this.closeModelCarga();
        }
    }
    PrestatarioDomicilio.prototype.saveDomicilio = function () {
        var _this = this;
        this.showModalCarga();
        for (var o = 0; o < this.state.length; o++) {
            if (this.state[o].id_estado == this.model.estado) {
                this.model.id_estado = this.model.estado;
                this.model.estado = this.state[o].estado;
                break;
            }
        }
        if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
            this.prestatario_alta = this.setModelService.getModel();
        }
        this.prestatario_alta.domicilio = this.model;
        this.prestatario_sender = new prestatario_sender_1.PrestatarioSender(this.prestatario_alta);
        this.prestatario_sender.username = this.prestatario_alta.perfil.username;
        this.prestatario_sender.token = "";
        this.crearDomicile.createDomicile(this.prestatario_sender).subscribe(function (respuesta) {
            _this.permitirPeticion = true;
            if (respuesta) {
                _this.router.navigate(['/DatosLaborales']);
            }
        }, function (error) {
            _this.permitirPeticion = true;
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
            _this.closeModelCarga();
        });
    };
    PrestatarioDomicilio.prototype.ngOnInit = function () {
        //TODO: Agregar validaciones para tokens
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, true, true));
        this.getEstate();
    };
    PrestatarioDomicilio.prototype.back = function () {
        this.router.navigate(['/PersonalInformation']);
    };
    PrestatarioDomicilio.prototype.getEstate = function () {
        var _this = this;
        this.domicileService.getState()
            .subscribe(function (state) {
            _this.errorMessageState = '';
            _this.state = state.sort(function (a, b) { return a.id_estado - b.id_estado; });
        }, function (error) {
            _this.errorMessageState = error;
            _this.errorMessageState = 'La información no puede ser cargada. Intente más tarde.';
        });
    };
    PrestatarioDomicilio.prototype.cleanSelect = function (reference) {
        if (reference == "zipCode") {
            this.model.estado = "";
            this.domicilioForm.value.estado = "";
        }
        this.model.delegacion_municipio = "";
        this.domicilioForm.value.delegacion = "";
        this.model.colonia = "";
        this.domicilioForm.value.ciudad = "";
        this.model.ciudad = "";
        if (reference == "state") {
            this.model.codigo_postal = "";
        }
        this.delegations = [];
        this.colonies = [];
        this.cities = [];
    };
    PrestatarioDomicilio.prototype.getDataState = function (event) {
        var _this = this;
        if (event.target.value != '') {
            this.cleanSelect('state');
            this.domicileService.getDataState(event.target.value)
                .subscribe(function (response) {
                var ciudad = response.ciudad;
                var municipio = response.municipio;
                _this.cities = ciudad.sort(function (a, b) { return a.id_ciudad - b.id_ciudad; });
                _this.delegations = municipio.sort(function (a, b) { return a.id_municipio - b.id_municipio; });
                _this.model.estado = _this.domicilioForm.value.estado;
            }, function (error) {
                if (error.message == "1") {
                    _this.domicilioForm.controls['estado'].setErrors({
                        "noRecords": true
                    });
                }
                else {
                    _this.domicilioForm.controls['estado'].setErrors({
                        "ServiceError": true
                    });
                }
            });
        }
    };
    PrestatarioDomicilio.prototype.getDataZipCode = function (event) {
        var _this = this;
        if (this.domicilioForm.controls['codigoPostal'].valid) {
            this.cleanSelect('zipCode');
            this.domicileService.getDataZipCode(event.target.value)
                .subscribe(function (response) {
                _this.delegations = response.municipio;
                _this.colonies = response.colonia;
                if (_this.colonies.length == 1) {
                    _this.model.colonia = response.colonia[0].id_colonia;
                }
                _this.cities = response.ciudad;
                _this.model.ciudad = response.ciudad[0].id_ciudad;
                _this.model.id_estado = response.estado[0].id_estado;
                _this.model.delegacion_municipio = response.municipio[0].id_municipio;
            }, function (error) {
                _this.estableceError('codigoPostal', error);
            });
        }
        else {
            if (this.domicilioForm.value.codigoPostal != '') {
                this.cleanSelect('zipCode');
            }
        }
    };
    PrestatarioDomicilio.prototype.getDataColony = function (event) {
        var _this = this;
        if (event.target.value != '') {
            this.domicileService.getDataColony(event.target.value)
                .subscribe(function (response) {
                _this.colonies = response.colonia;
            }, function (error) {
                _this.estableceError('colonia', error);
            });
        }
    };
    PrestatarioDomicilio.prototype.getZipCodeByColony = function (event) {
        var _this = this;
        if (event.target.value != '') {
            this.domicileService.getZipCodeByColony(event.target.value)
                .subscribe(function (response) {
                _this.model.codigo_postal = response[0].cp;
            }, function (error) {
                _this.estableceError('codigoPostal', error);
            });
        }
    };
    PrestatarioDomicilio.prototype.estableceError = function (campo, err) {
        if (err.message == "1") {
            this.domicilioForm.controls[campo].setErrors({
                "noRecords": true
            });
        }
        else {
            this.domicilioForm.controls[campo].setErrors({
                "ServiceError": true
            });
        }
        this.domicilioForm.controls[campo].markAsTouched();
    };
    PrestatarioDomicilio.prototype.showModalCarga = function () {
        this.closeLoading = true;
    };
    PrestatarioDomicilio.prototype.closeModelCarga = function () {
        this.closeLoading = false;
    };
    PrestatarioDomicilio.prototype.ngAfterViewInit = function () {
        window.Waves.init();
    };
    __decorate([
        core_1.ViewChildren(tasa_upload_images_1.UpLoadImages), 
        __metadata('design:type', core_1.QueryList)
    ], PrestatarioDomicilio.prototype, "archivos", void 0);
    PrestatarioDomicilio = __decorate([
        core_1.Component({
            selector: 'prestatario-domicilio',
            templateUrl: 'components/prestatario_domicilio.html',
            directives: [tasa_control_messages_1.ControlMessages, tasa_upload_images_1.UpLoadImages, tasa_loading_1.Loading],
            providers: [catalogDataDomicile_1.CatalogDomicileService, createPrestatarioDomicile_1.CreatePrestatarioDomicile],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, common_1.FormBuilder, model_prestatario_alta_1.SetModelPrestatarioAlta, catalogDataDomicile_1.CatalogDomicileService, router_1.Router, createPrestatarioDomicile_1.CreatePrestatarioDomicile])
    ], PrestatarioDomicilio);
    return PrestatarioDomicilio;
}());
exports.PrestatarioDomicilio = PrestatarioDomicilio;
//# sourceMappingURL=prestatario_domicilio.js.map