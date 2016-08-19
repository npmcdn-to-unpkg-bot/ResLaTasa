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
var recuperar_password_1 = require('../models/recuperar_password');
var RecuperaPass_1 = require('../services/RecuperaPass');
var validations_1 = require('../utilities/validations');
var router_1 = require('@angular/router');
var tasa_loading_1 = require('./tasa_loading');
var internationalization_1 = require('../utilities/pipes/internationalization');
var RecuperaPassword = (function () {
    function RecuperaPassword(formBuilder, password, router) {
        this.formBuilder = formBuilder;
        this.password = password;
        this.router = router;
        this.prestatarioUrl = "/prestatario_alta_page";
        this.loginref = "/login";
        this.show = false;
        this.closeLoading = false;
        this.autenticacionForm = this.formBuilder.group({
            'password': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.emailValidator])]
        });
    }
    RecuperaPassword.prototype.SendEmail = function () {
        var _this = this;
        this.showModalCarga();
        if (this.autenticacionForm.dirty && this.autenticacionForm.valid) {
            var passwordModel = new recuperar_password_1.PasswordModel(this.autenticacionForm.value.password.trim());
            this.password.access(passwordModel).subscribe(function (respuesta) {
                if (respuesta) {
                    _this.router.navigate(['/EnvioCorreo']);
                }
            }, function (error) {
                _this.closeModelCarga();
                _this.show = true;
            });
        }
    };
    RecuperaPassword.prototype.handleEvent = function (event) {
        if (this.show)
            this.show = false;
    };
    RecuperaPassword.prototype.back = function () {
        this.router.navigate(['/']);
    };
    RecuperaPassword.prototype.showModalCarga = function () {
        this.closeLoading = true;
    };
    RecuperaPassword.prototype.closeModelCarga = function () {
        this.closeLoading = false;
    };
    RecuperaPassword.prototype.ngAfterViewInit = function () {
        window.Waves.init(); // Para agregar los efectos a los botones
    };
    RecuperaPassword = __decorate([
        core_1.Component({
            selector: 'tasa_recuperar_password',
            templateUrl: 'components/tasa_recuperar_password.html',
            directives: [tasa_control_messages_1.ControlMessages, tasa_loading_1.Loading],
            providers: [RecuperaPass_1.RecuperaPass],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, RecuperaPass_1.RecuperaPass, router_1.Router])
    ], RecuperaPassword);
    return RecuperaPassword;
}());
exports.RecuperaPassword = RecuperaPassword;
//# sourceMappingURL=tasa_recuperar_password.js.map