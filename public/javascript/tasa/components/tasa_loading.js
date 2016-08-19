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
var Loading = (function () {
    function Loading() {
        this.elementUno = true;
        this.elementoTwo = true;
        this.elementThree = true;
        this.elementFour = true;
    }
    Object.defineProperty(Loading.prototype, "closeLoadingBoolean", {
        set: function (valueClose) {
            if (valueClose) {
                this._closeLoadingBoolean = valueClose;
                this.stop = false;
                var currentLocation = window.location.pathname;
                window.location.href = currentLocation + "#modaloading";
                this.setTimeElement();
            }
            else {
                this.stop = true;
                this.elementUno = true;
                this.elementoTwo = true;
                this.elementFour = true;
                this.elementThree = true;
                var currentLocation = window.location.pathname;
                window.location.href = currentLocation + "#";
            }
        },
        enumerable: true,
        configurable: true
    });
    Loading.prototype.ngOnInit = function () {
        this.elementUno = true;
        this.elementoTwo = true;
        this.elementThree = true;
        this.elementFour = true;
    };
    Loading.prototype.setTimeElement = function () {
        if (!this.stop) {
            this.elementUno = false;
            this.elementoTwo = false;
            this.elementFour = false;
            this.elementThree = false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Loading.prototype, "stop", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Loading.prototype, "closeLoading", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], Loading.prototype, "closeLoadingBoolean", null);
    Loading = __decorate([
        core_1.Component({
            selector: 'tasa-loading',
            properties: ['fontSize'],
            events: ['fontSizeChange'],
            templateUrl: 'components/tasa_loading.html',
        }), 
        __metadata('design:paramtypes', [])
    ], Loading);
    return Loading;
}());
exports.Loading = Loading;
//# sourceMappingURL=tasa_loading.js.map