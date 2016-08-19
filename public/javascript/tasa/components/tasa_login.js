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
var login_1 = require('../models/login');
var loginAccess_1 = require('../services/loginAccess');
var validations_1 = require('../utilities/validations');
var internationalization_1 = require('../utilities/pipes/internationalization');
var router_1 = require('@angular/router');
var tasa_loading_1 = require('./tasa_loading');
var Login = (function () {
    function Login(router, formBuilder, login) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.login = login;
        this.show = false;
        this.showMessageError = false;
        this.prestatarioUrl = "/prestatario_alta_page";
        this.closeLoading = false;
        this.autenticacionForm = this.formBuilder.group({
            'nameuser': ['', common_1.Validators.required],
            'password': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.passwordValidator])]
        });
    }
    Login.prototype.loginAccess = function () {
        var _this = this;
        this.showMessageError = false;
        if (this.autenticacionForm.dirty && this.autenticacionForm.valid) {
            this.showModalCarga();
            var loginModel = new login_1.LoginModel(this.autenticacionForm.value.nameuser.trim(), this.autenticacionForm.value.password.trim());
            this.userPool = new window.UserPool(loginModel.user, loginModel.password);
            this.userPool.signin(function (res) {
                if (!res.isError) {
                    _this.login.access(loginModel).subscribe(function (respuesta) {
                        if (respuesta.hasOwnProperty('username') && respuesta.hasOwnProperty('correo')) {
                            sessionStorage.clear();
                            respuesta.token = res.accessToken.jwtToken;
                            sessionStorage["tasa_data"] = JSON.stringify(respuesta);
                            window.location.href = "/prestatario_alta_page";
                            _this.closeModelCarga();
                        }
                    }, function (error) {
                        _this.closeModelCarga();
                        _this.showMessageError = true;
                    });
                }
                else {
                    _this.closeModelCarga();
                    _this.showMessageError = true;
                }
            });
        }
    };
    Login.prototype.next = function () {
        this.router.navigate(['/RecuperarPassword']);
    };
    Login.prototype.handleEvent = function (event) {
        var keyCode = event.which;
        var shiftKey = false;
        if (keyCode == 16) {
            shiftKey = true;
        }
        if (((keyCode >= 65 && keyCode <= 90) && !shiftKey) || ((keyCode >= 97 && keyCode <= 122) && shiftKey)) {
            this.show = true;
        }
        else {
            this.show = false;
        }
    };
    Login.prototype.changeMessage = function () {
        if (this.showMessageError) {
            this.showMessageError = false;
        }
    };
    Login.prototype.showModalCarga = function () {
        this.closeLoading = true;
    };
    Login.prototype.closeModelCarga = function () {
        this.closeLoading = false;
    };
    Login.prototype.ngAfterViewInit = function () {
        window.Waves.init(); // Para agregar los efectos a los botones
    };
    Login.prototype.ngOnInit = function () { };
    Login = __decorate([
        core_1.Component({
            selector: 'tasa-login',
            templateUrl: 'components/tasa_login.html',
            directives: [tasa_control_messages_1.ControlMessages, tasa_loading_1.Loading],
            providers: [loginAccess_1.loginAccess],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [router_1.Router, common_1.FormBuilder, loginAccess_1.loginAccess])
    ], Login);
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=tasa_login.js.map