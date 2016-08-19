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
var CatalogDomicileService = (function () {
    function CatalogDomicileService(http) {
        this.http = http;
        this.stateUrl = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/estados';
        this.electorCredentialURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/bajarimagen';
        this.zipCodeURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devm/buscainfocp/';
        this.dataStateURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devm/ciudad_y_municipio/';
        this.dataColonyURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/colonia/';
        this.dataZipCodeByColonyURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/buscacp/';
    }
    CatalogDomicileService.prototype.getState = function () {
        return this.http.get(this.stateUrl)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CatalogDomicileService.prototype.getFrontImg = function (data) {
        return this.http.post(this.electorCredentialURL, JSON.stringify(data))
            .map(this.extractData)
            .catch(this.handleError);
    };
    CatalogDomicileService.prototype.getDataZipCode = function (zipCode) {
        return this.http.get(this.zipCodeURL + zipCode)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CatalogDomicileService.prototype.getDataState = function (state) {
        return this.http.get(this.dataStateURL + state)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CatalogDomicileService.prototype.getDataColony = function (idMunicipy) {
        return this.http.get(this.dataColonyURL + idMunicipy)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CatalogDomicileService.prototype.getZipCodeByColony = function (idColony) {
        return this.http.get(this.dataZipCodeByColonyURL + idColony)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CatalogDomicileService.prototype.extracError = function (res) {
        var respuesta = new service_response_1.ServiceResponse();
        respuesta.fromJson(res.json());
        return respuesta.p_data || {};
    };
    CatalogDomicileService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error("2");
        }
        var respuesta = new service_response_1.ServiceResponse();
        respuesta.fromJson(res.json());
        if (respuesta.isError) {
            if (respuesta.err == 1) {
                throw new Error("1");
            }
            else if (respuesta.err == 0) {
                return respuesta.p_data || {};
            }
            else {
                throw new Error("ServiceError");
            }
        }
        throw new Error("ServiceError");
    };
    CatalogDomicileService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(new Error(error.message));
    };
    CatalogDomicileService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CatalogDomicileService);
    return CatalogDomicileService;
}());
exports.CatalogDomicileService = CatalogDomicileService;
//# sourceMappingURL=catalogDataDomicile.js.map