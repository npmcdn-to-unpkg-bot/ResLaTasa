"use strict";
var ServiceResponse = (function () {
    function ServiceResponse() {
    }
    ServiceResponse.prototype.isError = function () {
        return this.err != 0 ? true : false;
    };
    ServiceResponse.prototype.fromJson = function (json) {
        try {
            this.err = json.err;
            this.message = json.message;
            this.p_data = json.p_data;
        }
        catch (Error) {
            throw Error;
        }
    };
    return ServiceResponse;
}());
exports.ServiceResponse = ServiceResponse;
//# sourceMappingURL=service_response.js.map