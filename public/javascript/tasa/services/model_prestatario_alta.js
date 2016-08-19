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
var prestatario_alta_1 = require('../models/prestatario_alta');
var SetModelPrestatarioAlta = (function () {
    function SetModelPrestatarioAlta() {
        // Observable string sources
        //private prestatario_alta  = new Subject<PrestatarioAltaModel>();
        this.modelo = new prestatario_alta_1.PrestatarioAltaModel();
    }
    // Observable string streams
    //prestatario_alta$ = this.prestatario_alta.asObservable();
    // Service message commands
    SetModelPrestatarioAlta.prototype.setModel = function (model) {
        this.modelo = model;
        //this.prestatario_alta.next(this.modelo);
    };
    SetModelPrestatarioAlta.prototype.getModel = function () {
        return this.modelo;
    };
    SetModelPrestatarioAlta = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SetModelPrestatarioAlta);
    return SetModelPrestatarioAlta;
}());
exports.SetModelPrestatarioAlta = SetModelPrestatarioAlta;
//# sourceMappingURL=model_prestatario_alta.js.map