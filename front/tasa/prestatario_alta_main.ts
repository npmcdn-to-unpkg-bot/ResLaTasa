import { enableProdMode } from '@angular/core'
import { bootstrap } from '@angular/platform-browser-dynamic';
import { PRESTATARIO_ROUTER_PROVIDERS } from './routes/prestatario';
import { FORM_PROVIDERS } from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';

import {AltaPrestatario} from './components/tasa_prestatario_alta';
//enableProdMode(); //Cuando esta en modo debug no muestra titulos
bootstrap(AltaPrestatario, [
    PRESTATARIO_ROUTER_PROVIDERS,
    FORM_PROVIDERS,
    HTTP_PROVIDERS
  ]
);