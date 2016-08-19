import {Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {NgClass} from '@angular/common';

import { I18n } from '../utilities/pipes/internationalization';

@Component({
  selector: 'tasa-header',
  templateUrl: 'components/tasa_header.html',
  pipes: [I18n]
})

export class Header implements AfterViewInit{
  loginUrl = "/login"
  
  @Input()
  title: string;
  @Input()
  isLogged: boolean;
  @Input()
  isLanding: boolean;
  @Input()
  showButton: boolean;
  @Output()
  loggoutHeader = new EventEmitter<boolean>();
  constructor() {
    this.showButton = true;
    this.title = '';
    this.isLogged = false;
    this.isLanding = true;
  }

  ngAfterViewInit(){
    (<any>window).Waves.init();// Para agregar los efectos a los botones
  }

  loggout(){
    this.loggoutHeader.emit(true);
  }
}