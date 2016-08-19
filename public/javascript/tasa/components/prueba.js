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
var Prueba = (function () {
    function Prueba() {
        var _this = this;
        this.token = 'Vacio tasa';
        debugger;
        this.tokens = new window.UserPool('borosio@gmail.com', 'EstaD1ficil');
        this.tokens.signin(function (res) {
            _this.token = res.accessToken.jwtToken;
        });
        this.tokens.signin(function (result) {
            this.token = result;
        });
    }
    Prueba.prototype.setToken = function (result) {
        this.token = result.accessToken.jwtToken;
    };
    Prueba = __decorate([
        core_1.Component({
            selector: 'token',
            templateUrl: 'components/prueba.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Prueba);
    return Prueba;
}());
exports.Prueba = Prueba;
//# sourceMappingURL=prueba.js.map