import { provideRouter, RouterConfig }  from '@angular/router';

import {PrestatarioPerfil} from '../components/prestatario_perfil';
import {PrestatarioCotizador} from '../components/prestatario_cotizador';
import {AvisoAnimadoCuenta} from '../components/tasa_aviso_animado_cuenta';
import {DatosEstadoLaboral} from '../components/datos_estado_laboral';
import {PrestatarioPersonalInformation} from '../components/prestatario_personal_information';
import {PrestatarioDomicilio} from '../components/prestatario_domicilio';
import {AvisoPrivacy} from '../components/tasa_aviso_privacy';
import {Preaprobacion} from '../components/tasa_preaprovacion';

export const PRESTATARIO_ROUTER_PROVIDERS = [
  provideRouter(
    [
      { path: '', component: PrestatarioCotizador },
      { path: 'Cotizador', component: PrestatarioCotizador },
      { path: 'Perfil', component: PrestatarioPerfil },
      { path: 'CuentaCreada', component: AvisoAnimadoCuenta },
      { path: 'PersonalInformation', component: PrestatarioPersonalInformation},
      { path: 'DatosLaborales', component: DatosEstadoLaboral },
      { path: 'PrestatarioDomicilio', component: PrestatarioDomicilio},
      { path: 'PreAprobacion', component: Preaprobacion }
    ]
  )
] 