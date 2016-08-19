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
var internationalization_1 = require('../internationalization');
var I18n = (function () {
    function I18n() {
    }
    I18n.prototype.transform = function (properties, language) {
        if (language === void 0) { language = 'es'; }
        return this.getProperty(internationalization_1.Internationalization[language], properties);
    };
    I18n.prototype.getProperty = function (objectToScan, properties) {
        var porpertiesArray = properties.split('.');
        var firtsProperty = porpertiesArray.shift();
        var answer = objectToScan[firtsProperty];
        if (porpertiesArray.length > 0) {
            answer = this.getProperty(answer, porpertiesArray.join('.'));
        }
        return answer;
    };
    I18n = __decorate([
        core_1.Pipe({
            name: 'i18n'
        }), 
        __metadata('design:paramtypes', [])
    ], I18n);
    return I18n;
}());
exports.I18n = I18n;
//# sourceMappingURL=internationalization.js.map