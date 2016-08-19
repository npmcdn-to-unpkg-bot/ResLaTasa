import {Component} from '@angular/core';
import {AvisoPrivacy} from './tasa_aviso_privacy';
import { I18n } from '../utilities/pipes/internationalization';

@Component({
  selector: 'tasa-footer',
  templateUrl: 'components/tasa_footer.html',
  directives: [AvisoPrivacy],
  pipes: [I18n]
})
export class Footer {
  constructor() {}

  showModal(){
	var currentLocation = window.location.pathname;
	window.location.href = currentLocation + "#modal";
  }
}