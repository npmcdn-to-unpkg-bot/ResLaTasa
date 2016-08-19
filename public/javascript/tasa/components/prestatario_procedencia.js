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
var tasa_control_messages_1 = require('./tasa_control_messages');
var validations_1 = require('../utilities/validations');
var RFC_1 = require('../utilities/RFC');
var internationalization_1 = require('../utilities/pipes/internationalization');
var prestatario_procedencia_1 = require('../models/prestatario_procedencia');
var header_parameters_1 = require('../models/header_parameters');
var header_service_1 = require('../services/header_service');
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var createPrestatarioProcedencia_1 = require('../services/createPrestatarioProcedencia');
var catalogOrigin_1 = require('../services/catalogOrigin');
var catalogCivilStatus_1 = require('../services/catalogCivilStatus');
var PrestatarioProcedencia = (function () {
    function PrestatarioProcedencia(headerService, formBuilder, router, altaModelService, crearProcedencia, catalogoDondeNaciste, catalogoEstadoCivil) {
        this.headerService = headerService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.altaModelService = altaModelService;
        this.crearProcedencia = crearProcedencia;
        this.catalogoDondeNaciste = catalogoDondeNaciste;
        this.catalogoEstadoCivil = catalogoEstadoCivil;
        this.title = '¡Llenemos tu expediente!';
        this.modelo = new prestatario_procedencia_1.PrestatarioProcedenciaModel();
        this.modelo.conoce_homoclave = '0';
        this.modelo.nacionalidad = '';
        this.modelo.estado_civil = '';
        this.isValidateRFC = false;
        this.permitirPeticion = true;
        var dia = '';
        var mes = '';
        var anio = '';
        this.prestatario_alta = this.altaModelService.getModel();
        if (this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('procedencia')) {
            //this.modelo = this.prestatario_alta.procedencia;
            anio = this.modelo.fecha_nacimiento.split('-')[0];
            mes = this.modelo.fecha_nacimiento.split('-')[1];
            dia = this.modelo.fecha_nacimiento.split('-')[2];
        }
        else {
            this.modelo.username = ''; //this.prestatario_alta.perfil.username;
            this.modelo.rfc = '';
            this.modelo.homoclave = '';
        }
        this.procedenciaForm = this.formBuilder.group({
            'dondeNaciste': ['', common_1.Validators.required],
            'fechaNacimiento': formBuilder.group({
                'fechaNacimiento.dia': [dia],
                'fechaNacimiento.mes': [mes],
                'fechaNacimiento.anio': [anio],
            }, { validator: validations_1.Validations.dateValidator('fechaNacimiento.dia', 'fechaNacimiento.mes', 'fechaNacimiento.anio') }),
            'RFC': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.RFCValidator])],
            'conocesHomoclave': [],
            'homoclave': [],
            'estadoCivil': ['', common_1.Validators.required],
            'telFijo': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.telephoneValidator])],
            'telCelular': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.telephoneValidator])]
        });
    }
    PrestatarioProcedencia.prototype.ngOnInit = function () {
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, false, false));
        this.getLugarNacimiento();
        this.getEstadoCivil();
    };
    PrestatarioProcedencia.prototype.ngAfterViewChecked = function () {
        if (this.isValidateRFC) {
            this.isValidateRFC = false;
            this.validateRFC();
        }
    };
    PrestatarioProcedencia.prototype.getLugarNacimiento = function () {
        var _this = this;
        this.catalogoDondeNaciste.get()
            .subscribe(function (catalogo) {
            _this.lugarNacimiento = catalogo.sort(function (a, b) { return a.id - b.id; });
        }, function (error) {
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    PrestatarioProcedencia.prototype.getEstadoCivil = function () {
        var _this = this;
        this.catalogoEstadoCivil.get()
            .subscribe(function (catalogo) {
            _this.estadoCivil = catalogo;
        }, function (error) {
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    PrestatarioProcedencia.prototype.ordernarLugarNacimiento = function (catalogo) {
        catalogo.sort();
    };
    PrestatarioProcedencia.prototype.calcularRFC = function () {
        this.modelo.fecha_nacimiento = null;
        this.modelo.rfc = '';
        var controlDay = this.procedenciaForm.find('fechaNacimiento').find('fechaNacimiento.dia');
        var controlMonth = this.procedenciaForm.find('fechaNacimiento').find('fechaNacimiento.mes');
        var controlYear = this.procedenciaForm.find('fechaNacimiento').find('fechaNacimiento.anio');
        if (controlDay.valid && controlMonth.valid && controlYear.valid) {
            this.modelo.fecha_nacimiento = controlYear.value + '/' + controlMonth.value + '/' + controlDay.value;
            var rfc = new RFC_1.RFC(this.prestatario_alta.perfil.nombres, this.prestatario_alta.perfil.apaterno, this.prestatario_alta.perfil.amaterno, new Date(this.modelo.fecha_nacimiento));
            this.modelo.rfc = rfc.calcularRFCCompleta();
            this.isValidateRFC = true;
        }
    };
    PrestatarioProcedencia.prototype.validateRFC = function () {
        var controlRFC = this.procedenciaForm.find('RFC');
        var grupoParaErrores = new Array(controlRFC);
        if (!document.getElementById('homoclave').hasAttribute('disabled')) {
            var controlHomoclave = this.procedenciaForm.find('homoclave');
            grupoParaErrores.push(controlHomoclave);
        }
        var fullRFC = this.modelo.rfc + this.modelo.homoclave;
        validations_1.Validations.asyncValidatorRFC('RFC', fullRFC, grupoParaErrores);
    };
    PrestatarioProcedencia.prototype.requiredHomoclave = function (event) {
        var homoclave = this.procedenciaForm.controls["homoclave"];
        if (event.target.id == "homoclaveSi") {
            this.modelo.conoce_homoclave = "1";
            homoclave.validator = common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.homoclaveValidator]);
            homoclave.markAsDirty();
            homoclave.markAsTouched();
        }
        else if (event.target.id == "homoclaveNo") {
            this.modelo.conoce_homoclave = "0";
            homoclave.validator = null;
        }
        this.modelo.homoclave = '';
        homoclave.updateValueAndValidity();
    };
    PrestatarioProcedencia.prototype.back = function () {
        this.router.navigate(['/Domicilio']);
    };
    PrestatarioProcedencia.prototype.next = function () {
        var _this = this;
        if (this.permitirPeticion) {
            this.permitirPeticion = false;
            if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
                console.error('No existia el modelo');
                this.prestatario_alta = this.altaModelService.getModel();
            }
            //this.prestatario_alta.procedencia = this.modelo;
            this.altaModelService.setModel(this.prestatario_alta);
            this.crearProcedencia.create(this.modelo).subscribe(function (respuesta) {
                _this.permitirPeticion = true;
                if (respuesta) {
                    _this.router.navigate(['/EstadoLaboral']);
                }
            }, function (error) {
                _this.permitirPeticion = true;
                console.error(error);
                alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
            });
        }
    };
    PrestatarioProcedencia = __decorate([
        core_1.Component({
            selector: 'prestatario-procedencia',
            templateUrl: 'components/prestatario_procedencia.html',
            directives: [tasa_control_messages_1.ControlMessages],
            providers: [createPrestatarioProcedencia_1.CreatePrestatarioProcedencia, catalogOrigin_1.CatalogOrigin, catalogCivilStatus_1.CatalogCivilStatus],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, common_1.FormBuilder, router_1.Router, model_prestatario_alta_1.SetModelPrestatarioAlta, createPrestatarioProcedencia_1.CreatePrestatarioProcedencia, catalogOrigin_1.CatalogOrigin, catalogCivilStatus_1.CatalogCivilStatus])
    ], PrestatarioProcedencia);
    return PrestatarioProcedencia;
}());
exports.PrestatarioProcedencia = PrestatarioProcedencia;
//# sourceMappingURL=prestatario_procedencia.js.map