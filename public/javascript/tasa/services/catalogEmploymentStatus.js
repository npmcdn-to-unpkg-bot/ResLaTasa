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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var service_response_1 = require('../models/service_response');
require('../utilities/rxjs-operators');
var catalogEmploymentStatus = (function () {
    function catalogEmploymentStatus(http) {
        this.http = http;
        this.sector = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/csector';
        this.estudios = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/cnivelestudios';
        this.tipo_Comprobante = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/ctipocomprobante';
        this.tipo_Contratacion = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/ctipocontratacion';
        this.actividad_Profesional = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/cactividadprofesional';
        this.save_DatosLaborales = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/deviva/post/tasa_estado_laboral';
        this.gastos_mensuales = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/cgastosmensualesactividad';
    }
    catalogEmploymentStatus.prototype.getSector = function () {
        return this.http.get(this.sector)
            .map(this.extractData)
            .catch(this.handleError);
    };
    catalogEmploymentStatus.prototype.getNivelEstudios = function () {
        return this.http.get(this.estudios)
            .map(this.extractData)
            .catch(this.handleError);
    };
    catalogEmploymentStatus.prototype.getTipoComprobante = function (estadolaboral) {
        return this.http.post(this.tipo_Comprobante, JSON.stringify({ 'tipo': estadolaboral }))
            .map(this.extractData)
            .catch(this.handleError);
    };
    catalogEmploymentStatus.prototype.getTipoContratacion = function () {
        return this.http.get(this.tipo_Contratacion)
            .map(this.extractData)
            .catch(this.handleError);
    };
    catalogEmploymentStatus.prototype.getActividadProfe = function () {
        return this.http.get(this.actividad_Profesional)
            .map(this.extractData)
            .catch(this.handleError);
    };
    catalogEmploymentStatus.prototype.getGastosMensuales = function () {
        return this.http.get(this.gastos_mensuales)
            .map(this.extractData)
            .catch(this.handleError);
    };
    catalogEmploymentStatus.prototype.saveDatosLaborales = function (body) {
        return this.http.post(this.save_DatosLaborales, JSON.stringify(body))
            .map(this.extractData)
            .catch(this.handleError);
    };
    catalogEmploymentStatus.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('ServiceError');
        }
        var respuesta = new service_response_1.ServiceResponse();
        respuesta.fromJson(res.json());
        if (respuesta.isError()) {
            throw new Error('ServiceError');
        }
        else {
            return respuesta.p_data || {};
        }
    };
    catalogEmploymentStatus.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(new Error(error.message));
    };
    catalogEmploymentStatus = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], catalogEmploymentStatus);
    return catalogEmploymentStatus;
}());
exports.catalogEmploymentStatus = catalogEmploymentStatus;
//# sourceMappingURL=catalogEmploymentStatus.js.map