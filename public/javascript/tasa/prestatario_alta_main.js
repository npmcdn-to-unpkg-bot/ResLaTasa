"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var prestatario_1 = require('./routes/prestatario');
var common_1 = require('@angular/common');
var http_1 = require('@angular/http');
var tasa_prestatario_alta_1 = require('./components/tasa_prestatario_alta');
//enableProdMode(); //Cuando esta en modo debug no muestra titulos
platform_browser_dynamic_1.bootstrap(tasa_prestatario_alta_1.AltaPrestatario, [
    prestatario_1.PRESTATARIO_ROUTER_PROVIDERS,
    common_1.FORM_PROVIDERS,
    http_1.HTTP_PROVIDERS
]);
//# sourceMappingURL=prestatario_alta_main.js.map