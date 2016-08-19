import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { I18n } from '../utilities/pipes/internationalization';

import { HeaderParameters } from '../models/header_parameters';

import { HeaderService } from '../services/header_service';

@Component({
  selector: 'aviso_animado_cuenta',
  templateUrl: 'components/tasa_aviso_animado_cuenta.html',
  pipes: [I18n]

})
export class AvisoAnimadoCuenta {
  
  title = '¡Así de rápido!'
  
  constructor(private headerService: HeaderService, private router: Router) {}
  
   ngOnInit() {
    //TODO: Agregar validaciones para tokens
    this.headerService.setParameters(new HeaderParameters(this.title, true, true));
  }

  next(){
    this.router.navigate(['/PersonalInformation']);
  }
}