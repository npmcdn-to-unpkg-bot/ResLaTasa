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
var currencyString_1 = require('../utilities/pipes/currencyString');
var validations_1 = require('../utilities/validations');
var internationalization_1 = require('../utilities/pipes/internationalization');
var tasa_control_messages_1 = require('./tasa_control_messages');
var prestatario_laboral_otro_1 = require('../models/prestatario_laboral_otro');
var prestatario_laboral_empleado_1 = require('../models/prestatario_laboral_empleado');
var prestatario_laboral_empresario_1 = require('../models/prestatario_laboral_empresario');
var comprobantes_ingresos_1 = require('../models/comprobantes_ingresos');
var header_parameters_1 = require('../models/header_parameters');
var prestatario_sender_1 = require('../models/prestatario_sender');
var tasa_comprobante_ingreso_1 = require('./tasa_comprobante_ingreso');
var header_service_1 = require('../services/header_service');
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var catalogEmploymentStatus_1 = require('../services/catalogEmploymentStatus');
var tasa_loading_1 = require('./tasa_loading');
var DatosEstadoLaboral = (function () {
    function DatosEstadoLaboral(headerService, router, setModelService, stateLaborService, formBuilder) {
        this.headerService = headerService;
        this.router = router;
        this.setModelService = setModelService;
        this.stateLaborService = stateLaborService;
        this.formBuilder = formBuilder;
        this.closeLoading = false;
        this.puestoFinal = '';
        this.existeComprobante = false;
        this.itemsTipoComprobante = [1];
        this.count = 1;
        this.isValidForm = true;
        this.isValid = false;
        this.subirDespues = false;
        this.prestatario_alta = this.setModelService.getModel();
        this.title = '¡Completa tu solicitud!';
        this.username = this.prestatario_alta.perfil.username;
        this.datosLaboralesForm = this.formBuilder.group({});
        this.modelDatosLaborales = new prestatario_laboral_empleado_1.PrestatarioLaboralEmpleado();
        this.datosLaboralesForm.addControl('ingreso', new common_1.Control(this.modelDatosLaborales.ingreso_mensual_libre, common_1.Validators.compose([
            common_1.Validators.required,
            validations_1.Validations.onlyNumericValidator,
            validations_1.Validations.zeroValidator
        ])));
        this.datosLaboralesForm.addControl('nivelEstudio', new common_1.Control(this.modelDatosLaborales.nivelestudios, common_1.Validators.required));
        this.datosLaboralesForm.addControl('clave_ciec', new common_1.Control(this.modelDatosLaborales.clave_ciec, common_1.Validators.compose([
            common_1.Validators.required,
            validations_1.Validations.ciecValidator
        ])));
        if (this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('laboral')) {
            this.modelDatosLaborales = this.prestatario_alta.laboral;
            this.como_compruebas = (this.modelDatosLaborales.clave_ciec != null) ? 1 : 2;
            this.subirDespuesDocumentos({ checked: this.modelDatosLaborales.subir_despues });
            this.comoCompruebas(this.como_compruebas);
            if (this.modelDatosLaborales.comprobante.length > 0) {
                this.existeComprobante = true;
                for (var i = 1; i < this.modelDatosLaborales.comprobante.length; i++) {
                    this.itemsTipoComprobante.push(i);
                }
            }
            this.changeOcupation(this.prestatario_alta.laboral.ocupacion);
        }
        else {
            this.modelDatosLaborales.subir_despues = false;
            this.modelDatosLaborales.nivelestudios = '';
        }
    }
    DatosEstadoLaboral.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.existeComprobante) {
            window.setTimeout(function () {
                var cont = 0;
                _this.comprobantes.forEach(function (comprobante) {
                    comprobante.imagen = _this.modelDatosLaborales.comprobante[cont].img_comprobante_ingresos;
                    comprobante.comprobante.id = _this.modelDatosLaborales.comprobante[cont].tipo_comprobante;
                });
                cont++;
            });
        }
    };
    DatosEstadoLaboral.prototype.ngOnInit = function () {
        //TODO:verificar tokens
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, true, true));
        this.getNivelEstudios();
        this.getSector();
        this.getTipoContratacion();
        this.getActividadProfesional();
        this.getGastosMensuales();
    };
    DatosEstadoLaboral.prototype.getSector = function () {
        var _this = this;
        this.stateLaborService.getSector()
            .subscribe(function (sector) {
            _this.sector = sector;
            _this.sector.forEach(function (cadena) {
                cadena.sector = _this.primeraMayuscula(cadena.sector.toLocaleLowerCase());
            });
        }, function (error) {
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    DatosEstadoLaboral.prototype.getNivelEstudios = function () {
        var _this = this;
        this.stateLaborService.getNivelEstudios()
            .subscribe(function (nivelEstudio) {
            _this.nivelEstudio = nivelEstudio;
            _this.nivelEstudio.forEach(function (cadena) {
                cadena.nivel = _this.primeraMayuscula(cadena.nivel.toLocaleLowerCase());
            });
        }, function (error) {
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    DatosEstadoLaboral.prototype.getTipoContratacion = function () {
        var _this = this;
        this.stateLaborService.getTipoContratacion()
            .subscribe(function (tipoContrataciones) {
            _this.tipoContrataciones = tipoContrataciones;
            _this.tipoContrataciones.forEach(function (cadena) {
                cadena.contratacion = _this.primeraMayuscula(cadena.contratacion.toLocaleLowerCase());
            });
        }, function (error) {
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    DatosEstadoLaboral.prototype.getActividadProfesional = function () {
        var _this = this;
        this.stateLaborService.getActividadProfe()
            .subscribe(function (actividadProfesionales) {
            _this.actividadProfesionales = actividadProfesionales;
            _this.actividadProfesionales.forEach(function (cadena) {
                cadena.actividad = _this.primeraMayuscula(cadena.actividad.toLocaleLowerCase());
            });
        }, function (error) {
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    DatosEstadoLaboral.prototype.getGastosMensuales = function () {
        var _this = this;
        this.stateLaborService.getGastosMensuales()
            .subscribe(function (gastosMensuales) {
            _this.gastosMensuales = gastosMensuales;
        }, function (error) {
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    DatosEstadoLaboral.prototype.setCurrency = function (event) {
        event.target.value = new currencyString_1.CurrencyString().transform(event.target.value, 'USD', true, '.2-2');
    };
    DatosEstadoLaboral.prototype.back = function () {
        this.router.navigate(['/PrestatarioDomicilio']);
    };
    DatosEstadoLaboral.prototype.saveDatosLaborales = function (modelDatosLaborales) {
        var _this = this;
        this.showModalCarga();
        if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
            this.prestatario_alta = this.setModelService.getModel();
        }
        modelDatosLaborales.comprobante = [];
        modelDatosLaborales.ocupacion = this.puestoFinal;
        if (this.tipoComprobante == 2) {
            modelDatosLaborales.clave_ciec = null;
            if (!this.subirDespues) {
                this.comprobantes.forEach(function (comprobante) {
                    if (comprobante.isValid) {
                        modelDatosLaborales.comprobante.push(new comprobantes_ingresos_1.ComprobantesIngreso(comprobante.comprobante.id, comprobante.file));
                    }
                });
            }
        }
        this.prestatario_alta.laboral = this.modelDatosLaborales;
        this.prestatario_sender = new prestatario_sender_1.PrestatarioSender(this.prestatario_alta);
        this.prestatario_sender.username = this.prestatario_alta.perfil.username;
        this.prestatario_sender.token = "";
        this.stateLaborService.saveDatosLaborales(this.prestatario_sender).subscribe(function (respuesta) {
            if (respuesta) {
                _this.prestatario_alta.laboral = respuesta;
                _this.setModelService.setModel(_this.prestatario_alta);
                _this.router.navigate(['/PreAprobacion']);
            }
        }, function (error) {
            _this.closeModelCarga();
            console.error(error);
            alert(validations_1.Validations.getValidatorErrorMessage('ServiceError'));
        });
    };
    DatosEstadoLaboral.prototype.addElement = function () {
        if (this.itemsTipoComprobante.length <= 20) {
            this.itemsTipoComprobante.push(++this.count);
        }
        else {
            return;
        }
    };
    DatosEstadoLaboral.prototype.validaComprobante = function (respuesta) {
        var _this = this;
        this.isValid = false;
        this.comprobantes;
        this.comprobantes.forEach(function (item) {
            if (item.isValid) {
                _this.isValid = true;
                return;
            }
        });
        if (!this.subirDespues) {
            this.isValidForm = this.isValid;
        }
    };
    DatosEstadoLaboral.prototype.changeOcupation = function (puesto) {
        this.puestoFinal = puesto;
        var res_ingreso = this.modelDatosLaborales.ingreso_mensual_libre;
        var res_ciec = this.modelDatosLaborales.clave_ciec;
        var res_nivelestudios = this.modelDatosLaborales.nivelestudios;
        var res_subier = this.modelDatosLaborales.subir_despues;
        this.clearForm();
        switch (this.puestoFinal) {
            case 'empleado':
                this.modelDatosLaborales = new prestatario_laboral_empleado_1.PrestatarioLaboralEmpleado();
                this.datosLaboralesForm.addControl('sector', new common_1.Control('', common_1.Validators.required));
                this.datosLaboralesForm.addControl('tipocontra', new common_1.Control('', common_1.Validators.required));
                this.datosLaboralesForm.addControl('aniosempleo', new common_1.Control('', common_1.Validators.compose([
                    common_1.Validators.required,
                    validations_1.Validations.onlyNumericValidator,
                    validations_1.Validations.maxlength
                ])));
                this.datosLaboralesForm.addControl('actividadprofe', new common_1.Control('', common_1.Validators.compose([
                    common_1.Validators.required,
                    validations_1.Validations.onlyLettersValidator,
                    common_1.Validators.maxLength(50)
                ])));
                this.modelDatosLaborales.sector = '';
                this.modelDatosLaborales.tipo_contratacion = '';
                break;
            case 'empresario':
                this.modelDatosLaborales = new prestatario_laboral_empresario_1.PrestatarioLaboralEmpresario();
                this.datosLaboralesForm.addControl('actividadProfeEmpresario', new common_1.Control('', common_1.Validators.required));
                this.datosLaboralesForm.addControl('aniosActiEmpre', new common_1.Control('', common_1.Validators.compose([
                    common_1.Validators.required,
                    validations_1.Validations.onlyNumericValidator,
                    validations_1.Validations.maxlength
                ])));
                this.datosLaboralesForm.addControl('gastoMensual', new common_1.Control('', common_1.Validators.required));
                this.modelDatosLaborales.actividad_profesional = '';
                this.modelDatosLaborales.gastos_mensuales = '';
                break;
            case 'otro':
                this.modelDatosLaborales = new prestatario_laboral_otro_1.PrestatarioLaboralOtro();
                this.datosLaboralesForm.addControl('recibesIngresos', new common_1.Control('', common_1.Validators.compose([
                    common_1.Validators.required,
                    validations_1.Validations.onlyLettersValidator,
                    common_1.Validators.maxLength(50)
                ])));
                break;
        }
        //TODO:setear modelos nuevamente
        if (this.prestatario_alta != undefined && this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('laboral')) {
            if (this.puestoFinal == this.prestatario_alta.laboral.ocupacion) {
                this.modelDatosLaborales = this.prestatario_alta.laboral;
            }
        }
        if (res_ciec !== undefined) {
            this.modelDatosLaborales.clave_ciec = res_ciec;
        }
        if (res_ingreso !== undefined) {
            this.modelDatosLaborales.ingreso_mensual_libre = res_ingreso;
        }
        if (res_nivelestudios !== undefined) {
            this.modelDatosLaborales.nivelestudios = res_nivelestudios;
        }
        if (res_subier !== undefined) {
            this.modelDatosLaborales.subir_despues = res_subier;
        }
    };
    DatosEstadoLaboral.prototype.comoCompruebas = function (tipoComprobante) {
        if (tipoComprobante == 1) {
            this.como_compruebas = tipoComprobante;
            this.tipoComprobante = tipoComprobante;
            this.isValidForm = true;
        }
        else if (tipoComprobante == 2) {
            if (this.itemsTipoComprobante.length == 0) {
                this.itemsTipoComprobante.push(this.count);
            }
            else {
                this.count = 1;
                this.itemsTipoComprobante = [];
                this.itemsTipoComprobante.push(this.count);
            }
            this.datosLaboralesForm.controls['clave_ciec'].setErrors(null);
            this.isValidForm = false;
            this.como_compruebas = tipoComprobante;
            this.tipoComprobante = tipoComprobante;
        }
    };
    DatosEstadoLaboral.prototype.clearForm = function () {
        for (var control in this.datosLaboralesForm.controls) {
            if (control != 'ingreso' && control != 'nivelEstudio' && control != 'clave_ciec') {
                this.datosLaboralesForm.removeControl(control);
            }
        }
    };
    DatosEstadoLaboral.prototype.subirDespuesDocumentos = function (event) {
        if (event.checked) {
            this.isValidForm = true;
            this.subirDespues = true;
            this.modelDatosLaborales.subir_despues = true;
        }
        else {
            this.modelDatosLaborales.subir_despues = false;
            if (!this.isValid) {
                this.isValidForm = false;
            }
            this.subirDespues = false;
        }
    };
    DatosEstadoLaboral.prototype.primeraMayuscula = function (cadena) {
        return cadena.charAt(0).toLocaleUpperCase() + cadena.slice(1);
    };
    DatosEstadoLaboral.prototype.showModalCarga = function () {
        this.closeLoading = true;
    };
    DatosEstadoLaboral.prototype.closeModelCarga = function () {
        this.closeLoading = false;
    };
    __decorate([
        core_1.ViewChildren(tasa_comprobante_ingreso_1.ComprobanteIngresos), 
        __metadata('design:type', core_1.QueryList)
    ], DatosEstadoLaboral.prototype, "comprobantes", void 0);
    DatosEstadoLaboral = __decorate([
        core_1.Component({
            selector: 'datos-estado-laboral',
            templateUrl: 'components/datos_estado_laboral.html',
            directives: [tasa_control_messages_1.ControlMessages, tasa_loading_1.Loading, tasa_comprobante_ingreso_1.ComprobanteIngresos],
            providers: [catalogEmploymentStatus_1.catalogEmploymentStatus],
            pipes: [currencyString_1.CurrencyString, internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, router_1.Router, model_prestatario_alta_1.SetModelPrestatarioAlta, catalogEmploymentStatus_1.catalogEmploymentStatus, common_1.FormBuilder])
    ], DatosEstadoLaboral);
    return DatosEstadoLaboral;
}());
exports.DatosEstadoLaboral = DatosEstadoLaboral;
//# sourceMappingURL=datos_estado_laboral.js.map