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
var TasaTooltip = (function () {
    function TasaTooltip(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.position = 'top';
        this.text = 'tooltip';
        this.height = '40px';
    }
    TasaTooltip.prototype.ngAfterViewInit = function () {
        var _this = this;
        window.setTimeout(function () {
            _this.renderer.setElementStyle(_this.el.nativeElement.getElementsByTagName('div')[0], 'display', 'block');
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TasaTooltip.prototype, "text", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TasaTooltip.prototype, "position", void 0);
    __decorate([
        //top, bottom, left, right
        core_1.Input(), 
        __metadata('design:type', String)
    ], TasaTooltip.prototype, "height", void 0);
    TasaTooltip = __decorate([
        core_1.Component({
            selector: 'tasa-tooltip',
            templateUrl: 'components/tasa_tooltip.html'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], TasaTooltip);
    return TasaTooltip;
}());
exports.TasaTooltip = TasaTooltip;
//# sourceMappingURL=tasa_tooltip.js.map