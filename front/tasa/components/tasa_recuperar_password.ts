import {Component,AfterViewInit} from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { Subscription }   from 'rxjs/Subscription';
import { ControlMessages } from './tasa_control_messages';
import {PasswordModel} from '../models/recuperar_password';
import {RecuperaPass} from '../services/RecuperaPass';
import { Validations } from '../utilities/validations';
import { Router } from '@angular/router';
import { Loading } from './tasa_loading';
import { I18n } from '../utilities/pipes/internationalization';


@Component({
	selector: 'tasa_recuperar_password',
	templateUrl: 'components/tasa_recuperar_password.html',
  directives: [ControlMessages,Loading],
  providers:[RecuperaPass],
  pipes: [I18n]
})

export class  RecuperaPassword implements AfterViewInit{
 autenticacionForm: ControlGroup;
 prestatarioUrl = "/prestatario_alta_page"
 loginref = "/login"
 show: boolean = false;
 closeLoading: boolean = false;
    constructor(
    private formBuilder: FormBuilder,
    private password: RecuperaPass,
        private router: Router
    ) {
   this.autenticacionForm = this.formBuilder.group({
      'password':['',Validators.compose([Validators.required,Validations.emailValidator])]
  });
  }


 SendEmail(){
    this.showModalCarga();
   if(this.autenticacionForm.dirty && this.autenticacionForm.valid){
      var passwordModel = new PasswordModel(
        this.autenticacionForm.value.password.trim()
      )
      this.password.access(passwordModel).subscribe(
        respuesta => {
          if(respuesta){
            this.router.navigate(['/EnvioCorreo']);
          }
        },
        error => {
           this.closeModelCarga();
           this.show = true; 
         
        }
      );
    }
  }


handleEvent(event: any) {
  if(this.show)
    this.show = false; 
  }

back(){

    this.router.navigate(['/']);
  }

  private showModalCarga(){
      this.closeLoading = true;
   }
     private closeModelCarga(){
        this.closeLoading = false;
  }  

 ngAfterViewInit(){
    (<any>window).Waves.init();// Para agregar los efectos a los botones
  }


}