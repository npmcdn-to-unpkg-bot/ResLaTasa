"use strict";
var router_1 = require('@angular/router');
var tasa_recuperar_respuesta_1 = require('../components/tasa_recuperar_respuesta');
var tasa_login_1 = require('../components/tasa_login');
var tasa_recuperar_password_1 = require('../components/tasa_recuperar_password');
exports.LOGIN_ROUTER_PROVIDERS = [
    router_1.provideRouter([
        { path: '', component: tasa_login_1.Login },
        { path: 'RecuperarPassword', component: tasa_recuperar_password_1.RecuperaPassword },
        { path: 'EnvioCorreo', component: tasa_recuperar_respuesta_1.RecuperaRespuesta }
    ])
];
//# sourceMappingURL=login.js.map