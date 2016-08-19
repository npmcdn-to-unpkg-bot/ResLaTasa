import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
import {Footer} from './tasa_footer';

import { I18n } from '../utilities/pipes/internationalization';


@Component({
  selector: 'tasa-inicio-session-prestatario',
  templateUrl: 'components/tasa_inicio_session_prestatario.html',
  directives: [Footer, ROUTER_DIRECTIVES],
  pipes: [I18n]
})

export class LoginR{

  title: string = 'inicioSesion';
  subscriptionTitle: Subscription;
  subscriptionModel: Subscription;

  constructor() {
   
   
  }

  ngOnDestroy() {
    this.subscriptionTitle.unsubscribe();
    this.subscriptionModel.unsubscribe();
  }

}