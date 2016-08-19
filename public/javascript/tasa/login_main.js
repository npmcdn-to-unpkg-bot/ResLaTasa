"use strict";
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var login_1 = require('./routes/login');
var common_1 = require('@angular/common');
var http_1 = require('@angular/http');
var tasa_inicio_session_prestatario_1 = require('./components/tasa_inicio_session_prestatario');
core_1.enableProdMode();
platform_browser_dynamic_1.bootstrap(tasa_inicio_session_prestatario_1.LoginR, [
    login_1.LOGIN_ROUTER_PROVIDERS,
    common_1.FORM_PROVIDERS,
    http_1.HTTP_PROVIDERS
]);
//# sourceMappingURL=login_main.js.map