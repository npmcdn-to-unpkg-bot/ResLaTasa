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
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var header_service_1 = require('../services/header_service');
var createPrestatarioPerfil_1 = require('../services/createPrestatarioPerfil');
var prestatario_perfil_1 = require('../models/prestatario_perfil');
var prestatario_sender_1 = require('../models/prestatario_sender');
var header_parameters_1 = require('../models/header_parameters');
var validations_1 = require('../utilities/validations');
var internationalization_1 = require('../utilities/pipes/internationalization');
var tasa_loading_1 = require('./tasa_loading');
var tasa_tooltip_1 = require('./tasa_tooltip');
var PrestatarioPerfil = (function () {
    function PrestatarioPerfil(headerService, formBuilder, setModelService, crearPerfil, router) {
        this.headerService = headerService;
        this.formBuilder = formBuilder;
        this.setModelService = setModelService;
        this.crearPerfil = crearPerfil;
        this.router = router;
        this.permitirPeticion = true;
        this.closeLoading = false;
        this.title = '¡Vamos a crear tu perfil!';
        this.prestatario_alta = this.setModelService.getModel();
        if (this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('perfil')) {
            this.presPerfilModel = this.prestatario_alta.perfil;
        }
        else {
            this.presPerfilModel = new prestatario_perfil_1.PrestatarioPerfilModel('', '', '', '', '', '');
        }
        this.identificacionForm = this.formBuilder.group({
            'nombres': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.onlyLettersValidator])],
            'apaterno': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.onlyLettersValidator])],
            'amaterno': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.onlyLettersValidator])],
            'username': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.noWhiteSpaceValidator])],
            'correo': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.emailValidator])],
            'passwords': formBuilder.group({
                'passwords.password': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.passwordValidator])],
                'passwords.repeatPass': ['', common_1.Validators.required]
            }, { validator: validations_1.Validations.samePasswordValidator('passwords.password', 'passwords.repeatPass') }),
            'terminos': ['true', validations_1.Validations.chekboxRequiredValidator]
        });
    }
    PrestatarioPerfil.prototype.ngOnInit = function () {
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, false, false));
    };
    PrestatarioPerfil.prototype.validateUser = function () {
        var controlUserName = this.identificacionForm.find('username');
        validations_1.Validations.asyncValidator(controlUserName, 'UserName', null);
    };
    PrestatarioPerfil.prototype.validateEmail = function () {
        var controlUserName = this.identificacionForm.find('correo');
        validations_1.Validations.asyncValidator(controlUserName, 'Email', null);
    };
    PrestatarioPerfil.prototype.saveUser = function () {
        var _this = this;
        if (this.identificacionForm.dirty && this.identificacionForm.valid && this.permitirPeticion) {
            this.showModalCarga();
            this.permitirPeticion = false;
            if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
                this.prestatario_alta = this.setModelService.getModel();
            }
            this.prestatario_alta.perfil = this.presPerfilModel;
            this.prestatario_sender = new prestatario_sender_1.PrestatarioSender(this.prestatario_alta);
            this.prestatario_sender.username = this.presPerfilModel.username;
            this.prestatario_sender.token = "";
            this.crearPerfil.createPerfil(this.prestatario_sender).subscribe(function (respuesta) {
                _this.permitirPeticion = true;
                if (respuesta) {
                    _this.setModelService.setModel(_this.prestatario_alta);
                    _this.router.navigate(['/CuentaCreada']);
                }
            }, function (error) {
                _this.closeModelCarga();
                _this.permitirPeticion = true;
                alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
            });
        }
    };
    PrestatarioPerfil.prototype.showModal = function () {
        var currentLocation = window.location.pathname;
        window.location.href = currentLocation + "#modal";
    };
    PrestatarioPerfil.prototype.showModalCarga = function () {
        this.closeLoading = true;
    };
    PrestatarioPerfil.prototype.closeModelCarga = function () {
        this.closeLoading = false;
    };
    PrestatarioPerfil = __decorate([
        core_1.Component({
            selector: 'prestatario-perfil',
            templateUrl: 'components/prestatario_perfil.html',
            directives: [tasa_control_messages_1.ControlMessages, tasa_loading_1.Loading, tasa_tooltip_1.TasaTooltip],
            providers: [createPrestatarioPerfil_1.CreatePrestatarioPerfil],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, common_1.FormBuilder, model_prestatario_alta_1.SetModelPrestatarioAlta, createPrestatarioPerfil_1.CreatePrestatarioPerfil, router_1.Router])
    ], PrestatarioPerfil);
    return PrestatarioPerfil;
}());
exports.PrestatarioPerfil = PrestatarioPerfil;
//# sourceMappingURL=prestatario_perfil.js.map