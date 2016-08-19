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
var internationalization_1 = require('../utilities/pipes/internationalization');
var Header = (function () {
    function Header() {
        this.loginUrl = "/login";
        this.loggoutHeader = new core_1.EventEmitter();
        this.showButton = true;
        this.title = '';
        this.isLogged = false;
        this.isLanding = true;
    }
    Header.prototype.ngAfterViewInit = function () {
        window.Waves.init(); // Para agregar los efectos a los botones
    };
    Header.prototype.loggout = function () {
        this.loggoutHeader.emit(true);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Header.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Header.prototype, "isLogged", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Header.prototype, "isLanding", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Header.prototype, "showButton", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Header.prototype, "loggoutHeader", void 0);
    Header = __decorate([
        core_1.Component({
            selector: 'tasa-header',
            templateUrl: 'components/tasa_header.html',
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [])
    ], Header);
    return Header;
}());
exports.Header = Header;
//# sourceMappingURL=tasa_header.js.map