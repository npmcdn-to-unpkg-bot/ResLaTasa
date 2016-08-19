import { provideRouter, RouterConfig }  from '@angular/router';

import {RecuperaRespuesta} from '../components/tasa_recuperar_respuesta';
import {Login} from '../components/tasa_login';
import {RecuperaPassword} from '../components/tasa_recuperar_password';

export const LOGIN_ROUTER_PROVIDERS =[
  provideRouter(
    [
      { path: '', component: Login },
      { path: 'RecuperarPassword', component: RecuperaPassword },
      { path: 'EnvioCorreo', component: RecuperaRespuesta }
    ]
  )
]