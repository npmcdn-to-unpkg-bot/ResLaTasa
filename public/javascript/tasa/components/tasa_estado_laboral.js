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
var common_1 = require('@angular/common');
var prestatario_laboral_otro_1 = require('../models/prestatario_laboral_otro');
var prestatario_laboral_empleado_1 = require('../models/prestatario_laboral_empleado');
var prestatario_laboral_empresario_1 = require('../models/prestatario_laboral_empresario');
var header_parameters_1 = require('../models/header_parameters');
var header_service_1 = require('../services/header_service');
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var internationalization_1 = require('../utilities/pipes/internationalization');
var EstadoLaboral = (function () {
    function EstadoLaboral(headerService, router, setModelService) {
        this.headerService = headerService;
        this.router = router;
        this.setModelService = setModelService;
        this.puesto = '';
        this.title = '¡Llenemos tu expediente!';
    }
    EstadoLaboral.prototype.ngOnInit = function () {
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, false, false));
    };
    EstadoLaboral.prototype.next = function () {
        var laboral;
        switch (this.puesto) {
            case 'empleado':
                laboral = new prestatario_laboral_empleado_1.PrestatarioLaboralEmpleado();
                break;
            case 'empresario':
                laboral = new prestatario_laboral_empresario_1.PrestatarioLaboralEmpresario();
                break;
            case 'otro':
                laboral = new prestatario_laboral_otro_1.PrestatarioLaboralOtro();
                break;
        }
        laboral.ocupacion = this.puesto;
        this.prestatario_alta = this.setModelService.getModel();
        this.prestatario_alta.laboral = laboral;
        this.setModelService.setModel(this.prestatario_alta);
        this.router.navigate(['/EstadoLaboralOcupacion']);
    };
    EstadoLaboral.prototype.back = function () {
        this.router.navigate(['/Procedencia']);
    };
    EstadoLaboral = __decorate([
        core_1.Component({
            selector: 'estado-laboral',
            templateUrl: 'components/tasa_estado_laboral.html',
            directives: [common_1.NgSwitch, common_1.NgSwitchCase, common_1.NgSwitchDefault],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, router_1.Router, model_prestatario_alta_1.SetModelPrestatarioAlta])
    ], EstadoLaboral);
    return EstadoLaboral;
}());
exports.EstadoLaboral = EstadoLaboral;
//# sourceMappingURL=tasa_estado_laboral.js.map