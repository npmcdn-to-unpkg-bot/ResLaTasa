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
var tasa_header_1 = require('./tasa_header');
var tasa_footer_1 = require('./tasa_footer');
var tasa_video_1 = require('./tasa_video');
var internationalization_1 = require('../utilities/pipes/internationalization');
var Landing = (function () {
    function Landing() {
        this.prestatarioUrl = "/prestatario_alta_page";
    }
    Landing = __decorate([
        core_1.Component({
            selector: 'tasa-landing',
            templateUrl: 'components/tasa_landing.html',
            directives: [tasa_header_1.Header, tasa_footer_1.Footer, tasa_video_1.Video],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [])
    ], Landing);
    return Landing;
}());
exports.Landing = Landing;
//# sourceMappingURL=tasa_landing.js.map