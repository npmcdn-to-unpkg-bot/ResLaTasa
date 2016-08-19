import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { Router } from '@angular/router';

import { ControlMessages } from './tasa_control_messages';

import { SetModelPrestatarioAlta } from '../services/model_prestatario_alta';
import { HeaderService } from '../services/header_service';
import { CreatePrestatarioPerfil } from '../services/createPrestatarioPerfil';

import { PrestatarioAltaModel } from '../models/prestatario_alta'
import { PrestatarioPerfilModel } from '../models/prestatario_perfil';
import { PrestatarioCotizadorModel } from '../models/prestatario_cotizador';
import { PrestatarioSender } from '../models/prestatario_sender';
import { HeaderParameters } from '../models/header_parameters';

import { Validations } from '../utilities/validations';
import { I18n } from '../utilities/pipes/internationalization';

import { Loading } from './tasa_loading';
import { TasaTooltip } from './tasa_tooltip';

@Component({
  selector: 'prestatario-perfil',
  templateUrl: 'components/prestatario_perfil.html',
  directives: [ControlMessages,Loading,TasaTooltip],
  providers: [CreatePrestatarioPerfil],
  pipes: [I18n]
})

export class PrestatarioPerfil implements OnInit {

  title: string;
  identificacionForm: ControlGroup;
  prestatario_alta: PrestatarioAltaModel;
  permitirPeticion: boolean = true;
  closeLoading: boolean = false;
  private presPerfilModel: PrestatarioPerfilModel;
  prestatario_sender: PrestatarioSender;
  constructor(
    private headerService: HeaderService,
    private formBuilder: FormBuilder,
    private setModelService: SetModelPrestatarioAlta,
    private crearPerfil: CreatePrestatarioPerfil,
    private router: Router
  ) {
    this.title = '¡Vamos a crear tu perfil!';
    this.prestatario_alta = this.setModelService.getModel();
    
    
    if(this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('perfil')){
      this.presPerfilModel = this.prestatario_alta.perfil;
    }
    else{
      this.presPerfilModel = new PrestatarioPerfilModel('','','','','','');  
    }
    
    this.identificacionForm = this.formBuilder.group({
      'nombres': ['', Validators.compose([Validators.required, Validations.onlyLettersValidator])],
      'apaterno': ['', Validators.compose([Validators.required, Validations.onlyLettersValidator])],
      'amaterno': ['', Validators.compose([Validators.required, Validations.onlyLettersValidator])],
      'username': ['', Validators.compose([Validators.required, Validations.noWhiteSpaceValidator])],
      'correo': ['', Validators.compose([Validators.required, Validations.emailValidator])],
      'passwords': formBuilder.group({
        'passwords.password': ['', Validators.compose([Validators.required, Validations.passwordValidator])],
        'passwords.repeatPass': ['', Validators.required]
      }, { validator: Validations.samePasswordValidator('passwords.password', 'passwords.repeatPass') }),
      'terminos': ['true', Validations.chekboxRequiredValidator]
    });   
  }
  
  ngOnInit() {
    this.headerService.setParameters(new HeaderParameters(this.title,false,false));
  }
  
  validateUser() {
    var controlUserName = this.identificacionForm.find('username');
    Validations.asyncValidator(<Control>controlUserName, 'UserName',null);
  }

  validateEmail() {
    var controlUserName = this.identificacionForm.find('correo');
    Validations.asyncValidator(<Control>controlUserName, 'Email', null);
  }
   
  saveUser() {
    if (this.identificacionForm.dirty && this.identificacionForm.valid && this.permitirPeticion) {
      this.showModalCarga();
      this.permitirPeticion = false;

      if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
        this.prestatario_alta = this.setModelService.getModel();
      }
      this.prestatario_alta.perfil = this.presPerfilModel;
      this.prestatario_sender = new PrestatarioSender(this.prestatario_alta);
      this.prestatario_sender.username = this.presPerfilModel.username;
      this.prestatario_sender.token = "";
      this.crearPerfil.createPerfil(this.prestatario_sender).subscribe(
        respuesta => {
          this.permitirPeticion = true;
          if (respuesta) {
            this.setModelService.setModel(this.prestatario_alta);
            this.router.navigate(['/CuentaCreada']);
          }
        },
        error => {
          this.closeModelCarga();
          this.permitirPeticion = true;
          alert(Validations.getValidatorErrorMessage('ServiceError'));
        }
      );
    }
    
  }

  showModal(){
    var currentLocation = window.location.pathname;
    window.location.href = currentLocation + "#modal";
  }

  private showModalCarga(){
      this.closeLoading = true;
   }

  private closeModelCarga(){
        this.closeLoading = false;
  }  

}