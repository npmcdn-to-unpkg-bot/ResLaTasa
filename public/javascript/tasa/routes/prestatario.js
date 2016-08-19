"use strict";
var router_1 = require('@angular/router');
var prestatario_perfil_1 = require('../components/prestatario_perfil');
var prestatario_cotizador_1 = require('../components/prestatario_cotizador');
var tasa_aviso_animado_cuenta_1 = require('../components/tasa_aviso_animado_cuenta');
var datos_estado_laboral_1 = require('../components/datos_estado_laboral');
var prestatario_personal_information_1 = require('../components/prestatario_personal_information');
var prestatario_domicilio_1 = require('../components/prestatario_domicilio');
var tasa_preaprovacion_1 = require('../components/tasa_preaprovacion');
exports.PRESTATARIO_ROUTER_PROVIDERS = [
    router_1.provideRouter([
        { path: '', component: prestatario_cotizador_1.PrestatarioCotizador },
        { path: 'Cotizador', component: prestatario_cotizador_1.PrestatarioCotizador },
        { path: 'Perfil', component: prestatario_perfil_1.PrestatarioPerfil },
        { path: 'CuentaCreada', component: tasa_aviso_animado_cuenta_1.AvisoAnimadoCuenta },
        { path: 'PersonalInformation', component: prestatario_personal_information_1.PrestatarioPersonalInformation },
        { path: 'DatosLaborales', component: datos_estado_laboral_1.DatosEstadoLaboral },
        { path: 'PrestatarioDomicilio', component: prestatario_domicilio_1.PrestatarioDomicilio },
        { path: 'PreAprobacion', component: tasa_preaprovacion_1.Preaprobacion }
    ])
];
//# sourceMappingURL=prestatario.js.map