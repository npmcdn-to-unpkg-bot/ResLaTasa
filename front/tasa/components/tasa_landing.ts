import {Component} from '@angular/core';

import {Header} from './tasa_header';
import {Footer} from './tasa_footer';
import {Video} from './tasa_video';

import { I18n } from '../utilities/pipes/internationalization';
    
@Component({
  selector: 'tasa-landing',
  templateUrl: 'components/tasa_landing.html',
  directives: [Header, Footer, Video],
  pipes: [I18n]
})
export class Landing {
  prestatarioUrl = "/prestatario_alta_page"
  constructor() {}  
}