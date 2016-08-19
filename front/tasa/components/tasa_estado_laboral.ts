import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {NgSwitch, NgSwitchCase ,NgSwitchDefault} from '@angular/common';

import {PrestatarioLaboral} from '../models/prestatario_laboral';
import {PrestatarioLaboralOtro} from '../models/prestatario_laboral_otro';
import {PrestatarioLaboralEmpleado} from '../models/prestatario_laboral_empleado';
import {PrestatarioLaboralEmpresario} from '../models/prestatario_laboral_empresario';
import { PrestatarioAltaModel } from '../models/prestatario_alta';
import { HeaderParameters } from '../models/header_parameters';

import { HeaderService } from '../services/header_service';
import { SetModelPrestatarioAlta } from '../services/model_prestatario_alta';
import { I18n } from '../utilities/pipes/internationalization';


@Component({
  selector: 'estado-laboral',
  templateUrl: 'components/tasa_estado_laboral.html',
  directives: [NgSwitch,NgSwitchCase,NgSwitchDefault],
  pipes: [I18n]
})
export class EstadoLaboral {
  puesto='';
  title = '¡Llenemos tu expediente!'
  prestatario_alta: PrestatarioAltaModel;
  
  constructor(private headerService: HeaderService, 
    private router: Router,
    private setModelService: SetModelPrestatarioAlta) {    }
  
  ngOnInit() {
    this.headerService.setParameters(new HeaderParameters(this.title, false, false));
  }
  next(){
    let laboral: PrestatarioLaboral
    switch (this.puesto) {
      case 'empleado':
        laboral = new PrestatarioLaboralEmpleado();
        break;
      case 'empresario':
        laboral = new PrestatarioLaboralEmpresario();
        break;
      case 'otro':
        laboral = new PrestatarioLaboralOtro();
        break;
    }
    laboral.ocupacion = this.puesto;
    this.prestatario_alta = this.setModelService.getModel();
    this.prestatario_alta.laboral = laboral;
    this.setModelService.setModel(this.prestatario_alta);
    this.router.navigate(['/EstadoLaboralOcupacion']);
  }
  
  back() {
    this.router.navigate(['/Procedencia']);
  }
  
}
