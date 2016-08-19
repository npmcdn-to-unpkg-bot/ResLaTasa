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
require('../utilities/rxjs-operators');
var service_response_1 = require('../models/service_response');
var AmazonUtilities = (function () {
    function AmazonUtilities(http) {
        this.http = http;
        this.endPointCredentials = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devg/getCredentialsS3';
        this.endPointDelete = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devg/deleteObjectsS3';
    }
    AmazonUtilities.prototype.getS3Credentials = function () {
        return this.http.get(this.endPointCredentials)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AmazonUtilities.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            console.error('BadResponse: ' + res.status);
            throw new Error('ServiceError');
        }
        var respuesta = new service_response_1.ServiceResponse();
        respuesta.fromJson(res.json());
        if (respuesta.isError()) {
            console.error('ErrorInResponse: ' + respuesta.message);
            throw new Error('ServiceError');
        }
        else {
            return respuesta.p_data;
        }
    };
    AmazonUtilities.prototype.handleError = function (error) {
        console.error(error.message);
        return Observable_1.Observable.throw(new Error(error.message));
    };
    AmazonUtilities.prototype.deleteS3Objects = function (file) {
        return this.http.post(this.endPointDelete, JSON.stringify({ 'key': file }))
            .map(this.extractDataDelete)
            .catch(this.handleError);
    };
    AmazonUtilities.prototype.extractDataDelete = function (res) {
        if (res.status < 200 || res.status >= 300) {
            console.error('BadResponse: ' + res.status);
            throw new Error('ServiceError');
        }
        var respuesta = new service_response_1.ServiceResponse();
        respuesta.fromJson(res.json());
        if (respuesta.isError()) {
            console.error('ErrorInResponse: ' + respuesta.message);
            throw new Error(respuesta.message);
        }
        else {
            return true;
        }
    };
    AmazonUtilities = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AmazonUtilities);
    return AmazonUtilities;
}());
exports.AmazonUtilities = AmazonUtilities;
//# sourceMappingURL=amazonUtilities.js.map