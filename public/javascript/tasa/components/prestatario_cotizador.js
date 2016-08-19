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
var tasa_slider_1 = require('./tasa_slider');
var prestatario_cotizador_1 = require('../models/prestatario_cotizador');
var prestatarioCotizador_1 = require('../services/prestatarioCotizador');
var router_1 = require('@angular/router');
var validations_1 = require('../utilities/validations');
var tasa_control_messages_1 = require('./tasa_control_messages');
var input_focus_1 = require('./input_focus');
var model_prestatario_alta_1 = require('../services/model_prestatario_alta');
var prestatario_alta_1 = require('../models/prestatario_alta');
var currencyString_1 = require('../utilities/pipes/currencyString');
var internationalization_1 = require('../utilities/pipes/internationalization');
var tasa_loading_1 = require('./tasa_loading');
var header_service_1 = require('../services/header_service');
var header_parameters_1 = require('../models/header_parameters');
var PrestatarioCotizador = (function () {
    function PrestatarioCotizador(headerService, element, cotizadorService, router, formBuilder, setModelService) {
        this.headerService = headerService;
        this.element = element;
        this.cotizadorService = cotizadorService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.setModelService = setModelService;
        this.tasa_min = '0';
        this.tasa_max = '0';
        this.pagomensual_min = 0;
        this.pagomensual_max = 0;
        this.pagomensual_minshow = "$0";
        this.pagomensual_maxshow = "$0";
        this.factor_min = '0';
        this.factor_max = '0';
        this.closeLoading = false;
        this.aplica = '';
        this.model = new prestatario_cotizador_1.PrestatarioCotizadorModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        this.message = '';
        this.name = "";
        this.activeButton = true;
        this.desactiveButton = false;
        this.tieneDeuda = false;
        this.optionDeuda = false;
        this.hiddenImage = false;
        this.anotherHidden = true;
        this.hiddenPayDebts = true;
        this.errUseCredit = true;
        this.isMovil = false;
        this.isTablet = false;
        this.title = '¡Personaliza tu crédito!';
        this._cotizadorService = cotizadorService;
        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|iPad/i)) {
            this.isMovil = true;
        }
        else {
            this.isMovil = false;
        }
        if (navigator.userAgent.match(/iPad/i)) {
            this.isTablet = true;
        }
        this.cotizadorForm = this.formBuilder.group({
            'monto_deuda': [],
            'pago_mensual': [],
            'aplica': ['', common_1.Validators.required],
            'aplicado_en': [],
            'aplicado_otro': [],
            'monto': ['', common_1.Validators.required],
            'plazo': ['', common_1.Validators.required],
            'tasa_min': ['', common_1.Validators.required],
            'tasa_max': ['', common_1.Validators.required],
            'pago_mensual_min': ['', common_1.Validators.required],
            'pago_mensual_max': ['', common_1.Validators.required]
        });
        if (!this.isMovil) {
            if (this.model.monto == null) {
                this.model.monto = 30000;
            }
            if (this.model.plazo == null) {
                this.model.plazo = 6;
            }
            this.cotizadorForm.value.monto = this.model.monto;
            this.cotizadorForm.value.plazo = this.model.plazo;
        }
    }
    PrestatarioCotizador.prototype.onSelect = function (data) {
        this.name = data;
        this.imagen = data;
        if (this.cotizadorForm.value.monto_deuda == "" &&
            this.cotizadorForm.value.pago_mensual == "" && this.optionDeuda == true) {
            this.optionDeuda = false;
            this.tieneDeuda = false;
        }
        this.errUseCredit = true;
        var aplicadoEn = this.cotizadorForm.controls['aplicado_en'];
        this.model.aplicado_en = "";
        if (data == 'other') {
            this.anotherHidden = false;
            this.hiddenPayDebts = true;
            this.hiddenImage = true;
            this.marksAnother(true);
        }
        else {
            this.anotherHidden = true;
            this.hiddenPayDebts = true;
            this.hiddenImage = false;
            this.marksAnother(false);
        }
        if (data == 'debts') {
            this.onSelectDeudas(true);
            aplicadoEn.validator = common_1.Validators.required;
            this.hiddenPayDebts = false;
            if (this.model.aplicado_en == 'Otro') {
                this.anotherHidden = false;
                this.marksAnother(true);
            }
            else {
                this.anotherHidden = true;
                this.marksAnother(false);
            }
            this.hiddenImage = true;
            this.optionDeuda = true;
            this.tieneDeuda = true;
        }
        else {
            aplicadoEn.validator = null;
            this.model.aplicado_en = null;
            if (aplicadoEn.touched) {
                aplicadoEn.markAsDirty();
            }
        }
        this.onEquivalenciasAplica(data);
        aplicadoEn.updateValueAndValidity();
    };
    PrestatarioCotizador.prototype.marksAnother = function (indicate) {
        var aplicadoOtro = this.cotizadorForm.controls['aplicado_otro'];
        if (indicate) {
            aplicadoOtro.validator = common_1.Validators.required;
        }
        else {
            this.model.aplicado_otro = null;
            this.cotizadorForm.value.aplicado_otro = null;
            aplicadoOtro.validator = null;
        }
        aplicadoOtro.updateValueAndValidity();
    };
    PrestatarioCotizador.prototype.onEquivalenciasAplica = function (data) {
        switch (data) {
            case "debts":
                this.aplica = "Pagar deudas";
                break;
            case "negocio":
                this.aplica = "Iniciar negocio";
                break;
            case "hogar":
                this.aplica = "Mejoras al Hogar";
                break;
            case "viaje":
                this.aplica = "Viaje";
                break;
            case "estudios":
                this.aplica = "Estudios";
                break;
            case "other":
                this.aplica = "Otro";
                break;
            default:
                this.aplica = "";
                break;
        }
        this.cotizadorForm.value.aplica = this.aplica;
        this.model.aplica = this.aplica;
    };
    PrestatarioCotizador.prototype.onSelectDeudas = function (value) {
        var montoDeuda = this.cotizadorForm.controls['monto_deuda'];
        var pagoMensual = this.cotizadorForm.controls['pago_mensual'];
        if (value) {
            this.tieneDeuda = true;
            montoDeuda.validator = common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.maskNumberValidator]);
            pagoMensual.validator = common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.maskNumberValidator]);
        }
        else {
            this.tieneDeuda = false;
            this.model.monto_deuda = null;
            this.model.pago_mensual = null;
            montoDeuda.validator = null;
            pagoMensual.validator = null;
            montoDeuda.updateValueAndValidity();
            pagoMensual.updateValueAndValidity();
        }
        montoDeuda.updateValueAndValidity();
        pagoMensual.updateValueAndValidity();
        this.optionDeuda = this.tieneDeuda;
    };
    PrestatarioCotizador.prototype.onChange = function ($event) {
        if ($event.target.value == 'Otro') {
            this.anotherHidden = false;
            this.marksAnother(true);
        }
        else {
            this.anotherHidden = true;
            this.marksAnother(false);
            this.model.aplicado_otro = null;
        }
        this.model.aplicado_en = $event.target.value;
        this.cotizadorForm.value.aplicado_en = $event.target.value;
    };
    PrestatarioCotizador.prototype.onChangeSlider = function ($event, element) {
        var data = $event.target.value;
        if (element == 'monto') {
            this.model.monto = data;
            this.cotizadorForm.value.monto = data;
        }
        else {
            this.model.plazo = data;
            this.cotizadorForm.value.plazo = data;
        }
        this.calculaMontos(this.model.plazo, this.model.monto);
    };
    PrestatarioCotizador.prototype.calculaMontos = function (plazo, monto) {
        var factor_min;
        var factor_max;
        var pago_mensual_min;
        var pago_mensual_max;
        if (this.dataQuote && (plazo && monto)) {
            for (var i = 0; i < this.dataQuote.length; i++) {
                if (this.dataQuote[i].plazo == plazo) {
                    this.tasa_min = (this.dataQuote[i].tasa_min).toFixed(2);
                    this.tasa_max = (this.dataQuote[i].tasa_max).toFixed(2);
                    factor_min = this.dataQuote[i].factor_min;
                    factor_max = this.dataQuote[i].factor_max;
                    this.factor_min = factor_min.toString();
                    this.factor_max = factor_max.toString();
                    pago_mensual_min = monto * factor_min;
                    pago_mensual_max = monto * factor_max;
                    this.pagomensual_min = this.redondeCentena(pago_mensual_min);
                    this.pagomensual_max = this.redondeCentena(pago_mensual_max);
                    this.pagomensual_minshow = new currencyString_1.CurrencyString().transform(this.pagomensual_min.toString(), 'USD', true, '.0-2');
                    this.pagomensual_maxshow = new currencyString_1.CurrencyString().transform(this.pagomensual_max.toString(), 'USD', true, '.0-2');
                    this.estableceTasasPagosInModel(this.dataQuote[i].tasa_min, this.dataQuote[i].tasa_max, this.pagomensual_minshow, this.pagomensual_maxshow, this.factor_min, this.factor_max);
                }
            }
        }
    };
    PrestatarioCotizador.prototype.estableceTasasPagosInModel = function (tasa_min, tasa_max, pago_min, pago_max, factor_min, factor_max) {
        this.cotizadorForm.value.tasa_min = tasa_min;
        this.cotizadorForm.value.tasa_max = tasa_max;
        this.cotizadorForm.value.pago_mensual_min = pago_min;
        this.cotizadorForm.value.pago_mensual_max = pago_max;
        this.model.tasa_min = tasa_min;
        this.model.tasa_max = tasa_max;
        this.model.pago_mensual_min = pago_min;
        this.model.pago_mensual_max = pago_max;
        this.model.factor_min_pago = factor_min;
        this.model.factor_max_pago = factor_max;
    };
    PrestatarioCotizador.prototype.redondeCentena = function (value) {
        var value_faltante = 0;
        var dataCentena = (value.toString()).substring(0, 3);
        var dataDecena = parseInt(dataCentena.substring(0, 1));
        var dataRedondeo = parseInt(dataCentena.substring(1, 2));
        var dataUltimoDigito = parseInt(dataCentena.substring(2, 3));
        if (dataUltimoDigito >= 5) {
            if (dataRedondeo == 9) {
                value_faltante = 1;
                dataRedondeo = 0;
            }
            else {
                dataRedondeo = dataRedondeo + 1;
            }
        }
        dataUltimoDigito = 0;
        dataDecena = dataDecena + value_faltante;
        var valorEntero = Math.floor(value);
        var cade = valorEntero.toString().substring(3, valorEntero.toString().length);
        var conversion = "";
        for (var i = 0; i < cade.length; i++) {
            conversion = conversion + "0";
        }
        cade = dataDecena.toString() + dataRedondeo.toString() + dataUltimoDigito.toString() + conversion;
        return parseInt(cade);
    };
    PrestatarioCotizador.prototype.getCotizacionQuoteDataTable = function () {
        var _this = this;
        this._cotizadorService.getQuoteDataTable().subscribe(function (response) {
            if (response) {
                _this.dataQuote = response;
                _this.calculaMontos(_this.model.plazo, _this.model.monto);
                if (_this._montos && _this._plazos && _this.usesCredit) {
                    _this.closeModalCarga();
                }
            }
        }, function (error) {
            _this.closeModalCarga();
            _this.errorMessage = 'Por el momento el servicio no esta disponible...';
        });
    };
    PrestatarioCotizador.prototype.getMontos = function () {
        var _this = this;
        this._cotizadorService.getMontos()
            .subscribe(function (montos) {
            _this._montos = montos;
            _this.montoInicial = Math.min.apply(Math, _this._montos.map(function (item) { return item.monto; }));
            _this.montoFinal = Math.max.apply(Math, _this._montos.map(function (item) { return item.monto; }));
            if (_this._plazos && _this.dataQuote && _this.usesCredit) {
                _this.closeModalCarga();
            }
        }, function (error) {
            _this.errorMessage = 'Por el momento el servicio no esta disponible...';
            _this.closeModalCarga();
        });
    };
    PrestatarioCotizador.prototype.getPlazos = function () {
        var _this = this;
        this._cotizadorService.getPlazos()
            .subscribe(function (plazos) {
            _this._plazos = plazos;
            _this.plazoInicial = Math.min.apply(Math, _this._plazos.map(function (item) { return item.plazo; }));
            _this.plazoFinal = Math.max.apply(Math, _this._plazos.map(function (item) { return item.plazo; }));
            if (_this._montos && _this.dataQuote && _this.usesCredit) {
                _this.closeModalCarga();
            }
        }, function (error) {
            _this.errorMessage = 'Por el momento el servicio no esta disponible...';
            _this.closeModalCarga();
        });
    };
    PrestatarioCotizador.prototype.getDataAppliedOn = function () {
        var _this = this;
        this._cotizadorService.getDataAppliedOn()
            .subscribe(function (data) {
            _this.usesCredit = data;
            _this.usesCredit.sort(function (a, b) {
                var letterOne = a.nombre.toLowerCase();
                var letterTwo = b.nombre.toLowerCase();
                a.nombre = letterOne.charAt(0).toUpperCase() + letterOne.slice(1);
                b.nombre = letterTwo.charAt(0).toUpperCase() + letterTwo.slice(1);
                if (a.nombre > b.nombre) {
                    return 1;
                }
            });
            if (_this._montos && _this.dataQuote && _this._plazos) {
                _this.closeModalCarga();
            }
        }, function (error) {
            _this.errorMessage = 'Por el momento el servicio no esta disponible...';
            _this.closeModalCarga();
        });
    };
    PrestatarioCotizador.prototype.ngOnInit = function () {
        this.headerService.setParameters(new header_parameters_1.HeaderParameters(this.title, false, false));
        this.showModalCarga();
        this.getMontos();
        this.getPlazos();
        this.getCotizacionQuoteDataTable();
        this.getDataAppliedOn();
    };
    PrestatarioCotizador.prototype.showFormControls = function (form) {
        return form && form.controls['name'] &&
            form.controls['name'].value;
    };
    PrestatarioCotizador.prototype.equivalenciaTieneDeuda = function (optionDeuda) {
        if (optionDeuda) {
            return 1;
        }
        else {
            return 0;
        }
    };
    PrestatarioCotizador.prototype.setCurrency = function (event, data) {
        if ((event.target.value != null && event.target.value != "")) {
            var numberFormat = this.filterStringToNumber(event.target.value);
            if (!isNaN(numberFormat)) {
                event.target.value = numberFormat;
                if (data == 'montos') {
                    var month = this.cotizadorForm.controls['monto'];
                    validations_1.Validations.rankMonthValidator(month, this._montos, event.target.value);
                    if (this.cotizadorForm.controls['monto'].valid) {
                        event.target.value = new currencyString_1.CurrencyString().transform(event.target.value, 'USD', true, '.2-2');
                        this.calculaMontos(this.model.plazo, this.model.monto);
                    }
                }
                else {
                    event.target.value = new currencyString_1.CurrencyString().transform(event.target.value, 'USD', true, '.2-2');
                }
            }
            else {
                if (data == 'montos') {
                    var monto = this.cotizadorForm.controls['monto'];
                    monto.validator = common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.maskNumberValidator]);
                    monto.markAsDirty();
                    monto.markAsTouched();
                    monto.updateValueAndValidity();
                }
            }
        }
    };
    PrestatarioCotizador.prototype.selectAll = function (event) {
        event.target.select();
    };
    PrestatarioCotizador.prototype.filterStringToNumber = function (data) {
        var cad;
        if (data) {
            cad = (data.toString()).trim();
            cad = cad.replace("$", "");
            cad = cad.replace(/,/g, "");
            if (!isNaN(cad)) {
                cad = parseInt(cad);
            }
        }
        return cad;
    };
    PrestatarioCotizador.prototype.filterStringToMonths = function (data) {
        var cad = (data.toString().toLowerCase()).trim();
        cad = cad.replace("meses", "");
        if (!isNaN(cad)) {
            cad = parseInt(cad);
        }
        return cad;
    };
    PrestatarioCotizador.prototype.setMonths = function (event) {
        if (event.target.value) {
            var monthNumber = this.filterStringToMonths(event.target.value);
            if (!isNaN(monthNumber)) {
                event.target.value = monthNumber;
                var term = this.cotizadorForm.controls['plazo'];
                validations_1.Validations.rankTermValidator(term, this._plazos, event.target.value);
                if (this.cotizadorForm.controls['plazo'].valid) {
                    event.target.value = event.target.value + " meses";
                    this.calculaMontos(this.model.plazo, this.model.monto);
                }
            }
            else {
                var plazo = this.cotizadorForm.controls['plazo'];
                plazo.validator = common_1.Validators.compose([common_1.Validators.required, validations_1.Validations.onlyNumericValidator]);
                plazo.markAsDirty();
                plazo.markAsTouched();
                plazo.updateValueAndValidity();
            }
        }
    };
    PrestatarioCotizador.prototype.next = function () {
        var prestatarioCotizador = new prestatario_cotizador_1.PrestatarioCotizadorModel(this.filterStringToNumber(this.model.monto), this.filterStringToMonths(this.model.plazo), this.aplica, this.tasa_min.toString(), this.tasa_max.toString(), this.factor_min, this.factor_max, this.pagomensual_min, this.pagomensual_max, this.equivalenciaTieneDeuda(this.optionDeuda), this.filterStringToNumber(this.cotizadorForm.value.monto_deuda), this.filterStringToNumber(this.cotizadorForm.value.pago_mensual), this.cotizadorForm.value.aplicado_en, this.cotizadorForm.value.aplicado_otro);
        if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
            this.prestatario_alta = new prestatario_alta_1.PrestatarioAltaModel();
        }
        this.prestatario_alta.cotizador = prestatarioCotizador;
        this.setModelService.setModel(this.prestatario_alta);
        this.router.navigate(['/Perfil']);
    };
    PrestatarioCotizador.prototype.showModalCarga = function () {
        this.closeLoading = true;
    };
    PrestatarioCotizador.prototype.closeModalCarga = function () {
        this.closeLoading = false;
    };
    PrestatarioCotizador.prototype.overButton = function (data) {
        if (data === 'viaje') {
            this.imagenFocus = 'viajeOver';
        }
        else if (data === 'negocio') {
            this.imagenFocus = 'negocioOver';
        }
        else if (data === 'debts') {
            this.imagenFocus = 'debtsOver';
        }
        else if (data === 'other') {
            this.imagenFocus = 'otherOver';
        }
        else if (data === 'hogar') {
            this.imagenFocus = 'hogarOver';
        }
        else if (data === 'estudios') {
            this.imagenFocus = 'estudiosOver';
        }
    };
    PrestatarioCotizador.prototype.quitFocus = function () {
        this.imagenFocus = '';
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PrestatarioCotizador.prototype, "message", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PrestatarioCotizador.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PrestatarioCotizador.prototype, "activeButton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PrestatarioCotizador.prototype, "desactiveButton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PrestatarioCotizador.prototype, "tieneDeuda", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PrestatarioCotizador.prototype, "optionDeuda", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PrestatarioCotizador.prototype, "hiddenImage", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PrestatarioCotizador.prototype, "anotherHidden", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PrestatarioCotizador.prototype, "hiddenPayDebts", void 0);
    PrestatarioCotizador = __decorate([
        core_1.Component({
            selector: 'prestatario-cotizador',
            templateUrl: 'components/prestatario_cotizador.html',
            directives: [tasa_slider_1.Slider, tasa_control_messages_1.ControlMessages, input_focus_1.FocusDirective, tasa_loading_1.Loading],
            providers: [prestatarioCotizador_1.CotizadorService],
            pipes: [currencyString_1.CurrencyString, internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [header_service_1.HeaderService, core_1.ElementRef, prestatarioCotizador_1.CotizadorService, router_1.Router, common_1.FormBuilder, model_prestatario_alta_1.SetModelPrestatarioAlta])
    ], PrestatarioCotizador);
    return PrestatarioCotizador;
}());
exports.PrestatarioCotizador = PrestatarioCotizador;
//# sourceMappingURL=prestatario_cotizador.js.map