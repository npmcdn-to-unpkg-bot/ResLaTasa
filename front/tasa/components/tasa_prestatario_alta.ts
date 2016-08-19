import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import {Header} from './tasa_header';
import {Footer} from './tasa_footer';
import {Loading} from './tasa_loading';

import { HeaderService } from '../services/header_service';
import { SetModelPrestatarioAlta } from '../services/model_prestatario_alta';

import { PrestatarioAltaModel } from '../models/prestatario_alta';

import {Page} from '../utilities/enumPage';



@Component({
  selector: 'tasa-prestatario-alta',
  templateUrl: 'components/tasa_prestatario_alta.html',
  directives: [ROUTER_DIRECTIVES, Header, Footer],
  providers: [HeaderService, SetModelPrestatarioAlta]
})

export class AltaPrestatario {

  title: string = 'Alta prestatario';
  showHeaderButton: boolean = false;
  isLogged: boolean = false;
  prestatario_alta: PrestatarioAltaModel = new PrestatarioAltaModel();
  data:any;
  page = Page;
  subscriptionTitle: Subscription;

  constructor(private headerService: HeaderService, private setModelService: SetModelPrestatarioAlta, 
    router: Router) {

    this.subscriptionTitle = headerService.header$.subscribe( 
      parameters => { 
        window.setTimeout(() => { 
          this.title = parameters.title; 
          this.isLogged = parameters.isLogged; 
          this.showHeaderButton = parameters.showButton; 
        })
    });

    window.setTimeout(() => {
      let ruta: string = '/';
      if(sessionStorage['tasa_data'] != null){
        this.data = JSON.parse(sessionStorage['tasa_data']);
        sessionStorage.clear();
        if(this.data.hasOwnProperty('solicitud')){
          ruta = ruta + this.page[this.data.solicitud.pantalla]; 
        }
        if(this.prestatario_alta != null){
         this.prestatario_alta = this.data;
         this.setModelService.setModel(this.prestatario_alta);
        }
      }
      router.navigate([''+ruta+''])}); 
  }

  loggout(event: boolean){
    this.setModelService.setModel(null);
    window.location.href = "/";
  }

}