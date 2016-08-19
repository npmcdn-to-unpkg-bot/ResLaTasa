import {Component,AfterViewInit} from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { Subscription }   from 'rxjs/Subscription';
import { ControlMessages } from './tasa_control_messages';
import {PasswordModel} from '../models/recuperar_password';
import {RecuperaPass} from '../services/RecuperaPass';
import { Validations } from '../utilities/validations';
import { Router } from '@angular/router';
import { I18n } from '../utilities/pipes/internationalization';


@Component({
	selector: 'tasa_recuperar_respuesta',
	templateUrl: 'components/tasa_recuperar_respuesta.html',
  directives: [ControlMessages],
  providers:[RecuperaPass],
  pipes: [I18n]
})

export class  RecuperaRespuesta implements AfterViewInit{
 autenticacionForm: ControlGroup;
 prestatarioUrl = "/prestatario_alta_page"
 show: boolean = false;


constructor(
        private router: Router,
        private formBuilder: FormBuilder
    ) {this.autenticacionForm = this.formBuilder.group({}) }

back(){
    this.router.navigate(['/']);
  }

  ngAfterViewInit(){
    (<any>window).Waves.init();// Para agregar los efectos a los botones
  }

}