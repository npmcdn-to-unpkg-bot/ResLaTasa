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
var currencyString_1 = require('../utilities/pipes/currencyString');
var Slider = (function () {
    function Slider(elementRef, renderer) {
        var _this = this;
        this.textoAMostar = this.value + 'meses';
        this.listenFuncInput = renderer.listen(elementRef.nativeElement, 'input', function () { return _this.moverEtiqueta(); });
        this.listenFuncResize = renderer.listenGlobal('window', 'resize', function () { return _this.moverEtiqueta(); });
    }
    Slider.prototype.ngOnInit = function () {
        this.inicalizarEtiqueta();
    };
    Slider.prototype.ngOnDestroy = function () {
        // eliminar listeners!
        this.listenFuncInput();
        this.listenFuncResize();
    };
    Slider.prototype.inicalizarEtiqueta = function () {
        var convertCurrency;
        if (this.nameComponent == "monto") {
            this.textoAMostar = new currencyString_1.CurrencyString().transform(this.value.toString(), 'USD', true);
        }
        else {
            this.textoAMostar = this.value.toString() + " meses";
        }
    };
    Slider.prototype.moverEtiqueta = function () {
        var etiqueta = document.querySelector('#' + this.idElement);
        var slider = document.querySelector('#' + this.idComponent);
        var box = document.querySelector('#' + 'box' + this.idComponent);
        var posicion = 0;
        if (slider.name == "monto") {
            this.textoAMostar = new currencyString_1.CurrencyString().transform(slider.value, 'USD', true);
            ;
        }
        else {
            this.textoAMostar = slider.value + ' meses';
        }
        var pasosTotales = (this.max - this.min) / this.step;
        var sliderWidth = parseFloat(window.getComputedStyle(slider, null).getPropertyValue('width'));
        var pxls = sliderWidth / pasosTotales;
        var pasosReales = (parseInt(slider.value) - this.min) / this.step;
        posicion = pasosReales * pxls;
        posicion = posicion - (30 * (pasosReales / pasosTotales)); //30 del ancho de la etiquieta
        posicion = posicion - 3 + (-3 * (pasosReales / pasosTotales)); //correcciones para centrar fecha de etiqueta
        etiqueta.innerHTML = this.textoAMostar;
        etiqueta.setAttribute('style', 'left: ' + posicion + 'px');
        box.setAttribute('style', 'width: ' + (posicion + 7) + 'px');
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Slider.prototype, "step", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Slider.prototype, "date", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Slider.prototype, "min", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Slider.prototype, "value", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Slider.prototype, "max", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Slider.prototype, "idComponent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Slider.prototype, "idElement", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Slider.prototype, "nameComponent", void 0);
    Slider = __decorate([
        core_1.Component({
            selector: 'tasa-slider',
            templateUrl: 'components/tasa_slider.html',
            pipes: [currencyString_1.CurrencyString]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], Slider);
    return Slider;
}());
exports.Slider = Slider;
//# sourceMappingURL=tasa_slider.js.map