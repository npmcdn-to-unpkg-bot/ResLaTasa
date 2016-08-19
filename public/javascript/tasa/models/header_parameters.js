"use strict";
var HeaderParameters = (function () {
    function HeaderParameters(title, isLogged, showButton, isLanding) {
        if (isLanding === void 0) { isLanding = false; }
        this.title = title;
        this.isLogged = isLogged;
        this.showButton = showButton;
        this.isLanding = isLanding;
    }
    return HeaderParameters;
}());
exports.HeaderParameters = HeaderParameters;
//# sourceMappingURL=header_parameters.js.map