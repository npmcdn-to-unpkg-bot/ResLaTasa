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
var internationalization_1 = require('../utilities/pipes/internationalization');
var header_parameters_1 = require('../models/header_parameters');
var header_service_1 = require('../services/header_service');
var AvisoAnimadoCuenta = (function () {
    function AvisoAnimadoCuenta(headerService, router) {
        this.headerService = headerService;
        this.router = router;
        this.title = '¡Así de rápido!';
    }
    AvisoAnimadoCuenta.prototype.ngOnInit = function () {
        //TODO: Agregar validaciones para tokens
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, true, true));
    };
    AvisoAnimadoCuenta.prototype.next = function () {
        this.router.navigate(['/PersonalInformation']);
    };
    AvisoAnimadoCuenta = __decorate([
        core_1.Component({
            selector: 'aviso_animado_cuenta',
            templateUrl: 'components/tasa_aviso_animado_cuenta.html',
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, router_1.Router])
    ], AvisoAnimadoCuenta);
    return AvisoAnimadoCuenta;
}());
exports.AvisoAnimadoCuenta = AvisoAnimadoCuenta;
//# sourceMappingURL=tasa_aviso_animado_cuenta.js.map