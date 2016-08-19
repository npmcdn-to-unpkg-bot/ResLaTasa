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
var forms_1 = require('@angular/forms');
var tasa_tooltip_1 = require('./tasa_tooltip');
var tasa_upload_images_1 = require('./tasa_upload_images');
var upload_file_parameters_1 = require('../models/upload_file_parameters');
var UIKit = (function () {
    function UIKit(formBuilder) {
        this.formBuilder = formBuilder;
        this.model = { name: '' };
        this.disabledLabel = true;
        this.combo = '';
        this.opciones = new Array();
        this.opciones.push({ 'id': 1, 'texto': 'Uno' });
        this.opciones.push({ 'id': 2, 'texto': 'Dos' });
        this.opciones.push({ 'id': 3, 'texto': 'Tres' });
        this.imagen = 1;
        this.model.name = 'Gerardo';
        //Parametros necesarios para Subir imagen
        this.parametresIFE = new upload_file_parameters_1.UpLoadFileParametersModel();
        this.parametresIFE.rol = "prestatario";
        this.parametresIFE.userName = "Gerardo";
        this.parametresIFE.context = "identificacion";
        this.parametresIFE.type = "IFE";
        this.parametresIFE.imgSrc = "/images/prestatario_identificacion/pasaporte.svg";
        this.parametresIFE.imgSrcActive = "/images/prestatario_identificacion/pasaporteActive.svg";
        this.parametresIFE.orientation = 'vertical';
        this.parametresIFE.title = 'IFE';
        this.parametresIFE.s3URL = "/sdasd/asd";
        this.registerForm = this.formBuilder.group({
            firstname: ['', forms_1.Validators.required]
        });
    }
    UIKit.prototype.ngAfterViewChecked = function () {
        window.Waves.init(); // Para agregar los efectos a los botones
    };
    UIKit.prototype.imageSelected = function (respuesta) {
    };
    UIKit.prototype.eliminar = function (type) {
        var controlAEliminar;
        this.archivos.forEach(function (item) {
            if (item.parameters.type == type) {
                controlAEliminar = item;
            }
        });
        controlAEliminar.clearFile();
    };
    __decorate([
        core_1.ViewChildren(tasa_upload_images_1.UpLoadImages), 
        __metadata('design:type', core_1.QueryList)
    ], UIKit.prototype, "archivos", void 0);
    UIKit = __decorate([
        core_1.Component({
            selector: 'uikit',
            templateUrl: 'components/demouikit.html',
            directives: [tasa_tooltip_1.TasaTooltip, forms_1.REACTIVE_FORM_DIRECTIVES, tasa_upload_images_1.UpLoadImages]
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder])
    ], UIKit);
    return UIKit;
}());
exports.UIKit = UIKit;
//# sourceMappingURL=UIKit.js.map