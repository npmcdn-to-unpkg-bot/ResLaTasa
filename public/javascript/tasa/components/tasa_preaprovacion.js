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
var internationalization_1 = require('../utilities/pipes/internationalization');
var header_parameters_1 = require('../models/header_parameters');
var header_service_1 = require('../services/header_service');
var validations_1 = require('../utilities/validations');
var Preaprobacion = (function () {
    function Preaprobacion(headerService, formBuilder) {
        this.headerService = headerService;
        this.formBuilder = formBuilder;
        this.title = 'Un último detalle...';
        this.identificacionForm = this.formBuilder.group({
            'terminos': ['true', validations_1.Validations.chekboxRequiredValidator]
        });
    }
    Preaprobacion.prototype.ngOnInit = function () {
        //TODO: Agregar validaciones para tokens
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, true, true));
    };
    Preaprobacion.prototype.next = function () {
        window.location.href = "/";
    };
    Preaprobacion.prototype.showModal = function () {
        var currentLocation = window.location.pathname;
        window.location.href = currentLocation + "#modal";
    };
    Preaprobacion = __decorate([
        core_1.Component({
            selector: 'aviso-animado-privacy',
            templateUrl: 'components/tasa_preaprovacion.html',
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, common_1.FormBuilder])
    ], Preaprobacion);
    return Preaprobacion;
}());
exports.Preaprobacion = Preaprobacion;
//# sourceMappingURL=tasa_preaprovacion.js.map