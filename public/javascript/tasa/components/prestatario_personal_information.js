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
var RFC_1 = require('../utilities/RFC');
var validations_1 = require('../utilities/validations');
var internationalization_1 = require('../utilities/pipes/internationalization');
var tasa_upload_images_1 = require('./tasa_upload_images');
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var createPrestatarioPersonalInformation_1 = require('../services/createPrestatarioPersonalInformation');
var header_service_1 = require('../services/header_service');
var catalogOrigin_1 = require('../services/catalogOrigin');
var catalogCivilStatus_1 = require('../services/catalogCivilStatus');
var upload_file_parameters_1 = require('../models/upload_file_parameters');
var prestatario_sender_1 = require('../models/prestatario_sender');
var prestatario_identificacion_1 = require('../models/prestatario_identificacion');
var tasa_file_1 = require('../models/tasa_file');
var header_parameters_1 = require('../models/header_parameters');
var tasa_control_messages_1 = require('./tasa_control_messages');
var tasa_loading_1 = require('./tasa_loading');
var tasa_tooltip_1 = require('./tasa_tooltip');
var PrestatarioPersonalInformation = (function () {
    function PrestatarioPersonalInformation(headerService, setModelService, router, formBuilder, catalogoDondeNaciste, catalogoEstadoCivil, personalInformationService) {
        this.headerService = headerService;
        this.setModelService = setModelService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.catalogoDondeNaciste = catalogoDondeNaciste;
        this.catalogoEstadoCivil = catalogoEstadoCivil;
        this.personalInformationService = personalInformationService;
        this.closeLoading = false;
        this.isValid = false;
        this.userName = "";
        this.anio = '';
        this.mes = '';
        this.dia = '';
        this.prestatario_alta = this.setModelService.getModel();
        this.title = '¡Llenemos tu expediente!';
        this.frenteYReverso = false;
        var dia = '';
        var mes = '';
        var anio = '';
        this.getAnios();
        this.prestatario_alta = this.setModelService.getModel();
        this.userName = this.prestatario_alta.perfil.username;
        if (this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('identificacion')) {
            this.modelo = this.prestatario_alta.identificacion;
            var cad = (this.modelo.fecha_nacimiento).split("/");
            this.anio = cad[0];
            this.dia = cad[2];
            this.onSelectDays(this.anio, cad[1]);
            if (this.modelo.type_id == "IFE") {
                this.isIfe = true;
            }
            else {
                this.isIfe = false;
            }
            this.isValid = true;
        }
        else {
            this.modelo = new prestatario_identificacion_1.PrestatarioIdentificacionModel('', '', '', '', '', '', '');
        }
        this.setImageParameters();
        this.personalInformationForm = this.formBuilder.group({
            'dondeNaciste': ['', common_1.Validators.required],
            'fechaNacimiento': formBuilder.group({
                'fechaNacimiento.dia': [dia],
                'fechaNacimiento.mes': [mes],
                'fechaNacimiento.anio': [anio],
            }, { validator: validations_1.Validations.dateValidator('fechaNacimiento.dia', 'fechaNacimiento.mes', 'fechaNacimiento.anio') }),
            'RFC': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.RFCValidatorHomoclave])],
            'estadoCivil': ['', common_1.Validators.required],
            'telFijo': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.telephoneValidator])],
            'telCelular': ['', common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.telephoneValidator])]
        });
    }
    PrestatarioPersonalInformation.prototype.ngOnInit = function () {
        //TODO: Agregar validaciones para tokens
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, true, true));
        this.getLugarNacimiento();
        this.getEstadoCivil();
    };
    PrestatarioPersonalInformation.prototype.getLugarNacimiento = function () {
        var _this = this;
        this.catalogoDondeNaciste.get()
            .subscribe(function (catalogo) {
            _this.lugarNacimiento = catalogo.sort(function (a, b) { return a.id - b.id; });
        }, function (error) {
            _this.personalInformationForm.controls['dondeNaciste'].setErrors({
                "ServiceError": true
            });
        });
    };
    PrestatarioPersonalInformation.prototype.getEstadoCivil = function () {
        var _this = this;
        this.catalogoEstadoCivil.get()
            .subscribe(function (catalogo) {
            _this.estadoCivil = catalogo;
        }, function (error) {
            _this.personalInformationForm.controls['estadoCivil'].setErrors({
                "ServiceError": true
            });
        });
    };
    PrestatarioPersonalInformation.prototype.imageSelected = function (img) {
        var _this = this;
        this.recoverImages();
        var data;
        if (this.isIfe) {
            data = "IFE";
        }
        else {
            data = "Passport";
        }
        if (this.archivos && !this.verificaModeloImages()) {
            this.isValid = true;
            this.archivos.forEach(function (item) {
                _this.saves3URL(item.s3URL, item.parameters.type, img.type);
                if (!item.isValid) {
                    _this.isValid = false;
                    return;
                }
            });
        }
    };
    PrestatarioPersonalInformation.prototype.saves3URL = function (s3URL, type, typeImgSelect) {
        for (var i = 0; i < this.filesCreated.length; i++) {
            if (type == this.filesCreated[i].description && (s3URL != '' && s3URL != null)) {
                this.filesCreated[i].url = s3URL;
            }
        }
    };
    PrestatarioPersonalInformation.prototype.recoverImages = function () {
        for (var i = 0; i < this.parametersImage.length; i++) {
            this.parametersImage[i].s3URL = this.recoverURLFilesCreated(this.parametersImage[i].type);
        }
    };
    PrestatarioPersonalInformation.prototype.recoverURLFilesCreated = function (type) {
        for (var i = 0; i < this.filesCreated.length; i++) {
            if (this.filesCreated[i].description == type) {
                return this.filesCreated[i].url;
            }
        }
    };
    PrestatarioPersonalInformation.prototype.imageVerifica = function (type) {
        var _this = this;
        var frente;
        var reverso;
        var identificacion;
        var Selfie;
        var cantIFE = 0;
        this.archivos.forEach(function (item) {
            if (type == "IFE" && _this.frenteYReverso == false) {
                if (item.parameters.type == "Selfie" && item.parameters.s3URL != "") {
                    Selfie = true;
                }
                if (item.parameters.type == "identificacion" && item.parameters.s3URL != "") {
                    identificacion = true;
                }
            }
        });
        if ((type === "IFE" && this.frenteYReverso === false) && (Selfie == true && identificacion == true)) {
            this.isValid = true;
        }
    };
    PrestatarioPersonalInformation.prototype.identificactionChange = function (data) {
        if (data == "Passport") {
            this.modelo.type_id = data;
            this.isIfe = false;
        }
        else if (data == "IFE") {
            this.modelo.type_id = data;
            this.isIfe = true;
        }
        this.recoverImages();
        this.verificaModeloImages();
    };
    PrestatarioPersonalInformation.prototype.frenteReversoChange = function (data) {
        if (data === "frente") {
            this.frenteYReverso = false;
        }
        else if (data === "frenteReverso") {
            this.frenteYReverso = true;
        }
        this.recoverImages();
        this.verificaModeloImages();
    };
    PrestatarioPersonalInformation.prototype.next = function () {
        var _this = this;
        this.showModalCarga();
        if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
            this.prestatario_alta = this.setModelService.getModel();
        }
        var filesImages = Array();
        var image;
        this.archivos.forEach(function (item) {
            image = new tasa_file_1.TasaFileModel(item.parameters.type, item.s3URL);
            filesImages.push(image);
        });
        this.modelo.files = filesImages;
        this.modelo.fecha_nacimiento = this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.anio').value + "/" +
            this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.mes').value + "/" + this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.dia').value;
        if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
            this.prestatario_alta = this.setModelService.getModel();
        }
        this.prestatario_alta.identificacion = this.modelo;
        this.prestatario_sender = new prestatario_sender_1.PrestatarioSender(this.prestatario_alta);
        this.prestatario_sender.username = this.prestatario_alta.perfil.username;
        this.prestatario_sender.token = "";
        this.personalInformationService.createPersonalInformation(this.prestatario_sender).subscribe(function (respuesta) {
            _this.setModelService.setModel(_this.prestatario_alta);
            _this.router.navigate(['/PrestatarioDomicilio']);
        }, function (error) {
            _this.closeModelCarga();
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    PrestatarioPersonalInformation.prototype.getAnios = function () {
        this.aniosLst = [];
        this.diasLst = [];
        var fecha = new Date();
        var anio = fecha.getFullYear() - 18;
        var contador = 1;
        for (var i = anio; i >= 1900; i--) {
            this.aniosLst.push(i);
            contador++;
        }
        this.mesLst = [{ "id": 1, "mes": "ENERO" }, { "id": 2, "mes": "FEBRERO" }, { "id": 3, "mes": "MARZO" }, { "id": 4, "mes": "ABRIL" }, { "id": 5, "mes": "MAYO" }, { "id": 6, "mes": "JUNIO" }, { "id": 7, "mes": "JULIO" }, { "id": 8, "mes": "AGOSTO" }, { "id": 9, "mes": "SEPTIEMBRE" }, { "id": 10, "mes": "OCTUBRE" }, { "id": 11, "mes": "NOVIEMBRE" }, { "id": 12, "mes": "DICIEMBRE" }];
    };
    PrestatarioPersonalInformation.prototype.onSelectDays = function (year, month) {
        var controlYear;
        var controlMonth;
        if (month != "" && year != "") {
            controlYear = parseInt(year);
            controlMonth = parseInt(month);
            this.mes = controlMonth;
        }
        else {
            controlYear = this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.anio').value;
            controlMonth = this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.mes').value;
        }
        var numberDays;
        if (controlYear != "" && controlMonth != "") {
            this.diasLst = [];
            numberDays = this.daysInMonth(controlMonth, controlYear);
            for (var day = 1; day <= numberDays; day++) {
                this.diasLst.push(day);
            }
        }
    };
    PrestatarioPersonalInformation.prototype.daysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    };
    PrestatarioPersonalInformation.prototype.calcularRFC = function ($event, data) {
        if (data == 'anio') {
            this.anio = $event.target.value;
        }
        else if (data == 'mes') {
            this.mes = $event.target.value;
        }
        this.onSelectDays(this.anio, this.mes);
        this.modelo.fecha_nacimiento = null;
        this.modelo.rfc_homoclave = '';
        if (data == 'dia') {
            this.dia = $event.target.value;
        }
        this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.anio').value + "/" +
            this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.mes').value + "/" + this.personalInformationForm.find('fechaNacimiento').find('fechaNacimiento.dia').value;
        if (this.anio != '' && this.mes != '' && this.dia != '') {
            this.modelo.fecha_nacimiento = this.anio + '/' + this.mes + '/' + this.dia;
            var rfc = new RFC_1.RFC(this.prestatario_alta.perfil.nombres, this.prestatario_alta.perfil.apaterno, this.prestatario_alta.perfil.amaterno, new Date(this.modelo.fecha_nacimiento));
            this.modelo.rfc_homoclave = rfc.calcularRFCCompleta();
            this.validateRFC();
            var r_f_c = this.personalInformationForm.controls['RFC'];
            r_f_c.markAsDirty();
            r_f_c.markAsTouched();
        }
    };
    PrestatarioPersonalInformation.prototype.validateRFC = function () {
        var _this = this;
        if (this.modelo.rfc_homoclave != '') {
            window.setTimeout(function () {
                var controlRFC = _this.personalInformationForm.find('RFC');
                validations_1.Validations.asyncValidator(controlRFC, 'RFC', _this.userName);
            });
        }
    };
    PrestatarioPersonalInformation.prototype.createFiles = function (type, s3URL) {
        var file = new tasa_file_1.TasaFileModel(type, s3URL);
        this.filesCreated.push(file);
    };
    PrestatarioPersonalInformation.prototype.setImageParameters = function () {
        this.filesCreated = Array();
        var parameters;
        this.parametersImage = new Array(5);
        var cantArch;
        parameters = new upload_file_parameters_1.UpLoadFileParametersModel();
        parameters.rol = "prestatario";
        parameters.userName = this.userName;
        parameters.context = "identificacion";
        parameters.type = "identificacion";
        parameters.imgSrc = "/images/prestatario_identificacion/identificacion.svg";
        parameters.imgSrcActive = "/images/prestatario_identificacion/frenteYreverso1-01.svg";
        parameters.orientation = 'vertical';
        parameters.title = 'Frente y reverso';
        parameters.s3URL = this.obtieneS3URL(parameters.type);
        if (parameters.s3URL != "") {
            this.frenteYReverso = false;
        }
        this.createFiles(parameters.type, parameters.s3URL);
        this.parametersImage[0] = parameters;
        parameters = new upload_file_parameters_1.UpLoadFileParametersModel();
        parameters.rol = "prestatario";
        parameters.userName = this.userName;
        parameters.context = "identificacion";
        parameters.type = "frente";
        parameters.imgSrc = "/images/prestatario_identificacion/identificacion-Frente.svg";
        parameters.imgSrcActive = "/images/prestatario_identificacion/frenteActive.svg";
        parameters.orientation = 'horizontal';
        parameters.title = 'Frente';
        parameters.s3URL = this.obtieneS3URL(parameters.type);
        if (parameters.s3URL != "") {
            this.frenteYReverso = true;
        }
        this.createFiles(parameters.type, parameters.s3URL);
        this.parametersImage[1] = parameters;
        parameters = new upload_file_parameters_1.UpLoadFileParametersModel();
        parameters.rol = "prestatario";
        parameters.userName = this.userName;
        parameters.context = "identificacion";
        parameters.type = "reverso";
        parameters.imgSrc = "/images/prestatario_identificacion/identificacion-Reverso.svg";
        parameters.imgSrcActive = "/images/prestatario_identificacion/reverso.svg";
        parameters.orientation = 'horizontal';
        parameters.title = 'Reverso';
        parameters.s3URL = this.obtieneS3URL(parameters.type);
        if (parameters.s3URL != "") {
            this.frenteYReverso = true;
        }
        this.createFiles(parameters.type, parameters.s3URL);
        this.parametersImage[2] = parameters;
        parameters = new upload_file_parameters_1.UpLoadFileParametersModel();
        parameters.rol = "prestatario";
        parameters.userName = this.userName;
        parameters.context = "identificacion";
        parameters.type = "pasaporte";
        parameters.imgSrc = "/images/prestatario_identificacion/pasaporte.svg";
        parameters.imgSrcActive = "/images/prestatario_identificacion/pasaporteActive.svg";
        parameters.orientation = 'vertical';
        parameters.title = 'Pasaporte';
        parameters.s3URL = this.obtieneS3URL(parameters.type);
        this.createFiles(parameters.type, parameters.s3URL);
        this.parametersImage[3] = parameters;
        parameters = new upload_file_parameters_1.UpLoadFileParametersModel();
        parameters.rol = "prestatario";
        parameters.userName = this.userName;
        parameters.context = "identificacion";
        parameters.type = "Selfie";
        parameters.imgSrc = "/images/prestatario_identificacion/selfie.svg";
        parameters.imgSrcActive = "/images/prestatario_identificacion/selfieActive.svg";
        parameters.orientation = 'vertical';
        parameters.title = 'Foto con tu identificación';
        parameters.s3URL = this.obtieneS3URL(parameters.type);
        this.createFiles(parameters.type, parameters.s3URL);
        this.parametersImage[4] = parameters;
    };
    PrestatarioPersonalInformation.prototype.showModalCarga = function () {
        this.closeLoading = true;
    };
    PrestatarioPersonalInformation.prototype.closeModelCarga = function () {
        this.closeLoading = false;
    };
    PrestatarioPersonalInformation.prototype.obtieneS3URL = function (type) {
        if (this.modelo.files) {
            for (var i = 0; i < this.modelo.files.length; i++) {
                if (type == this.modelo.files[i].description) {
                    return this.modelo.files[i].url;
                }
            }
        }
        return "";
    };
    PrestatarioPersonalInformation.prototype.verificaModeloImages = function () {
        var description = "";
        var url = "";
        var reverso = false;
        var frente = false;
        var identificacion = false;
        var pasaporte = false;
        var selfie = false;
        var exist = false;
        if (this.filesCreated) {
            for (var i = 0; i < this.filesCreated.length; i++) {
                description = this.filesCreated[i].description;
                url = this.filesCreated[i].url;
                if (description == "frente" && url != "") {
                    frente = true;
                }
                else if (description == "reverso" && url != "") {
                    reverso = true;
                }
                else if (description == "identificacion" && url != "") {
                    identificacion = true;
                }
                else if (description == "pasaporte" && url != "") {
                    pasaporte = true;
                }
                else if (description == "Selfie" && url != "") {
                    selfie = true;
                }
            }
            if (this.isIfe) {
                if ((identificacion && selfie && !this.frenteYReverso) || ((this.frenteYReverso && frente) && (reverso && selfie))) {
                    exist = true;
                }
            }
            else if (!this.isIfe) {
                if (pasaporte && selfie) {
                    exist = true;
                }
            }
        }
        this.isValid = exist;
        return exist;
    };
    __decorate([
        core_1.ViewChildren(tasa_upload_images_1.UpLoadImages), 
        __metadata('design:type', core_1.QueryList)
    ], PrestatarioPersonalInformation.prototype, "archivos", void 0);
    PrestatarioPersonalInformation = __decorate([
        core_1.Component({
            selector: 'prestatario-personal-information',
            templateUrl: 'components/prestatario_personal_information.html',
            directives: [tasa_upload_images_1.UpLoadImages, tasa_loading_1.Loading, tasa_control_messages_1.ControlMessages, tasa_tooltip_1.TasaTooltip],
            providers: [createPrestatarioPersonalInformation_1.CreatePersonalInformation, catalogOrigin_1.CatalogOrigin, catalogCivilStatus_1.CatalogCivilStatus],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, model_prestatario_alta_1.SetModelPrestatarioAlta, router_1.Router, common_1.FormBuilder, catalogOrigin_1.CatalogOrigin, catalogCivilStatus_1.CatalogCivilStatus, createPrestatarioPersonalInformation_1.CreatePersonalInformation])
    ], PrestatarioPersonalInformation);
    return PrestatarioPersonalInformation;
}());
exports.PrestatarioPersonalInformation = PrestatarioPersonalInformation;
//# sourceMappingURL=prestatario_personal_information.js.map