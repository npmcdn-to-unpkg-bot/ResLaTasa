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
var tasa_control_messages_1 = require('./tasa_control_messages');
var RecuperaPass_1 = require('../services/RecuperaPass');
var router_1 = require('@angular/router');
var internationalization_1 = require('../utilities/pipes/internationalization');
var RecuperaRespuesta = (function () {
    function RecuperaRespuesta(router, formBuilder) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.prestatarioUrl = "/prestatario_alta_page";
        this.show = false;
        this.autenticacionForm = this.formBuilder.group({});
    }
    RecuperaRespuesta.prototype.back = function () {
        this.router.navigate(['/']);
    };
    RecuperaRespuesta.prototype.ngAfterViewInit = function () {
        window.Waves.init(); // Para agregar los efectos a los botones
    };
    RecuperaRespuesta = __decorate([
        core_1.Component({
            selector: 'tasa_recuperar_respuesta',
            templateUrl: 'components/tasa_recuperar_respuesta.html',
            directives: [tasa_control_messages_1.ControlMessages],
            providers: [RecuperaPass_1.RecuperaPass],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [router_1.Router, common_1.FormBuilder])
    ], RecuperaRespuesta);
    return RecuperaRespuesta;
}());
exports.RecuperaRespuesta = RecuperaRespuesta;
//# sourceMappingURL=tasa_recuperar_respuesta.js.map