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
var ValidateExist = (function () {
    function ValidateExist(http) {
        this.http = http;
    }
    ValidateExist.prototype.Exist = function (value, userName, endPoint) {
        var dataURL;
        if (userName == null) {
            dataURL = endPoint.replace('{value}', value);
            return this.http.get(dataURL)
                .map(this.extractData)
                .catch(this.handleError);
        }
        else {
            var dataRFC = {
                "rfc": value,
                "username": userName
            };
            return this.http.post(endPoint, JSON.stringify(dataRFC))
                .map(this.extractData)
                .catch(this.handleError);
        }
    };
    ValidateExist.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('ServiceError');
        }
        var respuesta = new service_response_1.ServiceResponse();
        respuesta.fromJson(res.json());
        if (respuesta.isError()) {
            throw new Error('ServiceError');
        }
        else {
            if (respuesta.p_data.existe === 0) {
                return null;
            }
            else {
                throw new Error('repeat');
            }
        }
    };
    ValidateExist.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(new Error(error.message));
    };
    ValidateExist = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ValidateExist);
    return ValidateExist;
}());
exports.ValidateExist = ValidateExist;
//# sourceMappingURL=validateExist.js.map