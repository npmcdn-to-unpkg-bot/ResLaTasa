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
var tasa_aviso_privacy_1 = require('./tasa_aviso_privacy');
var internationalization_1 = require('../utilities/pipes/internationalization');
var Footer = (function () {
    function Footer() {
    }
    Footer.prototype.showModal = function () {
        var currentLocation = window.location.pathname;
        window.location.href = currentLocation + "#modal";
    };
    Footer = __decorate([
        core_1.Component({
            selector: 'tasa-footer',
            templateUrl: 'components/tasa_footer.html',
            directives: [tasa_aviso_privacy_1.AvisoPrivacy],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [])
    ], Footer);
    return Footer;
}());
exports.Footer = Footer;
//# sourceMappingURL=tasa_footer.js.map