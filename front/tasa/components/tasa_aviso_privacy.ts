
import {Component, Input} from '@angular/core';
import { I18n } from '../utilities/pipes/internationalization';


@Component({
  selector: 'aviso-privacy',
  templateUrl: 'components/tasa_aviso_privacy.html',
  pipes: [I18n]
  
})
export class AvisoPrivacy {

  constructor() { }

  hideModal(){
	var currentLocation = window.location.pathname;
	window.location.href = currentLocation + "#";
  }
}