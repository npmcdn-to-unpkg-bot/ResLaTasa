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
var tasa_header_1 = require('./tasa_header');
var tasa_footer_1 = require('./tasa_footer');
var header_service_1 = require('../services/header_service');
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var prestatario_alta_1 = require('../models/prestatario_alta');
var enumPage_1 = require('../utilities/enumPage');
var AltaPrestatario = (function () {
    function AltaPrestatario(headerService, setModelService, router) {
        var _this = this;
        this.headerService = headerService;
        this.setModelService = setModelService;
        this.title = 'Alta prestatario';
        this.showHeaderButton = false;
        this.isLogged = false;
        this.prestatario_alta = new prestatario_alta_1.PrestatarioAltaModel();
        this.page = enumPage_1.Page;
        this.subscriptionTitle = headerService.header$.subscribe(function (parameters) {
            window.setTimeout(function () {
                _this.title = parameters.title;
                _this.isLogged = parameters.isLogged;
                _this.showHeaderButton = parameters.showButton;
            });
        });
        window.setTimeout(function () {
            var ruta = '/';
            if (sessionStorage['tasa_data'] != null) {
                _this.data = JSON.parse(sessionStorage['tasa_data']);
                sessionStorage.clear();
                if (_this.data.hasOwnProperty('solicitud')) {
                    ruta = ruta + _this.page[_this.data.solicitud.pantalla];
                }
                if (_this.prestatario_alta != null) {
                    _this.prestatario_alta = _this.data;
                    _this.setModelService.setModel(_this.prestatario_alta);
                }
            }
            router.navigate(['' + ruta + '']);
        });
    }
    AltaPrestatario.prototype.loggout = function (event) {
        this.setModelService.setModel(null);
        window.location.href = "/";
    };
    AltaPrestatario = __decorate([
        core_1.Component({
            selector: 'tasa-prestatario-alta',
            templateUrl: 'components/tasa_prestatario_alta.html',
            directives: [router_1.ROUTER_DIRECTIVES, tasa_header_1.Header, tasa_footer_1.Footer],
            providers: [header_service_1.HeaderService, model_prestatario_alta_1.SetModelPrestatarioAlta]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, model_prestatario_alta_1.SetModelPrestatarioAlta, router_1.Router])
    ], AltaPrestatario);
    return AltaPrestatario;
}());
exports.AltaPrestatario = AltaPrestatario;
//# sourceMappingURL=tasa_prestatario_alta.js.map