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
var tasa_footer_1 = require('./tasa_footer');
var internationalization_1 = require('../utilities/pipes/internationalization');
var LoginR = (function () {
    function LoginR() {
        this.title = 'inicioSesion';
    }
    LoginR.prototype.ngOnDestroy = function () {
        this.subscriptionTitle.unsubscribe();
        this.subscriptionModel.unsubscribe();
    };
    LoginR = __decorate([
        core_1.Component({
            selector: 'tasa-inicio-session-prestatario',
            templateUrl: 'components/tasa_inicio_session_prestatario.html',
            directives: [tasa_footer_1.Footer, router_1.ROUTER_DIRECTIVES],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [])
    ], LoginR);
    return LoginR;
}());
exports.LoginR = LoginR;
//# sourceMappingURL=tasa_inicio_session_prestatario.js.map