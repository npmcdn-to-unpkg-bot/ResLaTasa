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
var CurrencyString = (function () {
    function CurrencyString() {
    }
    CurrencyString.prototype.transform = function (value, currencyCode, symbolDisplay, digits) {
        var parseNumber = Number(value);
        if (isNaN(parseNumber)) {
            return value;
        }
        else {
            return new common_1.CurrencyPipe().transform(parseNumber, currencyCode, symbolDisplay, digits);
        }
    };
    CurrencyString = __decorate([
        core_1.Pipe({ name: 'currencyString' }), 
        __metadata('design:paramtypes', [])
    ], CurrencyString);
    return CurrencyString;
}());
exports.CurrencyString = CurrencyString;
//# sourceMappingURL=currencyString.js.map