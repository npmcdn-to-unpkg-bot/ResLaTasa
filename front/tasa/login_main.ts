import {enableProdMode} from '@angular/core'
import {bootstrap} from '@angular/platform-browser-dynamic';
import {LOGIN_ROUTER_PROVIDERS} from './routes/login';
import { FORM_PROVIDERS } from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';

import {LoginR} from './components/tasa_inicio_session_prestatario';
enableProdMode()
bootstrap(LoginR, [
   LOGIN_ROUTER_PROVIDERS,
    FORM_PROVIDERS,
    HTTP_PROVIDERS
]);