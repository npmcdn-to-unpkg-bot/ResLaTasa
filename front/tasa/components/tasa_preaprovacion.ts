import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { I18n } from '../utilities/pipes/internationalization';
import { HeaderParameters } from '../models/header_parameters';
import { HeaderService } from '../services/header_service';
import { Validations } from '../utilities/validations';

@Component({
  selector: 'aviso-animado-privacy',
  templateUrl: 'components/tasa_preaprovacion.html',
  pipes: [I18n]
})
export class Preaprobacion {
  identificacionForm: ControlGroup;
  title = 'Un último detalle...'

  constructor(private headerService: HeaderService, private formBuilder: FormBuilder) {
    this.identificacionForm = this.formBuilder.group({
      'terminos': ['true', Validations.chekboxRequiredValidator]
    });
  }

  ngOnInit() {
    //TODO: Agregar validaciones para tokens
    this.headerService.setParameters(new HeaderParameters(this.title, true, true));
  }

  next() {
    window.location.href = "/";
  }

  showModal() {
    var currentLocation = window.location.pathname;
    window.location.href = currentLocation + "#modal";
  }
}