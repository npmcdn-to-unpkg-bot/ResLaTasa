import {Component,OnInit,AfterViewInit} from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { Subscription }   from 'rxjs/Subscription';
import { ControlMessages } from './tasa_control_messages';
import {LoginModel} from '../models/login';
import {loginAccess} from '../services/loginAccess';
import { Validations } from '../utilities/validations';
import { I18n } from '../utilities/pipes/internationalization';
import { Router } from '@angular/router';
import { Loading } from './tasa_loading';

@Component({
  selector: 'tasa-login',
  templateUrl: 'components/tasa_login.html',
  directives: [ControlMessages,Loading],
  providers:[loginAccess],
  pipes: [I18n]
})

export class Login implements OnInit, AfterViewInit{
 show: boolean = false;
 showMessageError: boolean = false;
 prestatarioUrl = "/prestatario_alta_page"
 closeLoading: boolean = false;
 autenticacionForm: ControlGroup;

 //login
 userPool:any;
 token:string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private login: loginAccess
    ) {

   this.autenticacionForm = this.formBuilder.group({
      'nameuser':['', Validators.required],
      'password':['',Validators.compose([Validators.required, Validations.passwordValidator])]
    });
  }

  loginAccess(){
   
     this.showMessageError = false; 
   if(this.autenticacionForm.dirty && this.autenticacionForm.valid){
      this.showModalCarga();
      var loginModel = new LoginModel(
        this.autenticacionForm.value.nameuser.trim(),
        this.autenticacionForm.value.password.trim()
      )
      this.userPool = new (<any>window).UserPool(loginModel.user,loginModel.password);
      this.userPool.signin((res) => {
        if(!res.isError){
          this.login.access(loginModel).subscribe(
        respuesta => {
          if(respuesta.hasOwnProperty('username') && respuesta.hasOwnProperty('correo')){
            sessionStorage.clear();
            respuesta.token = res.accessToken.jwtToken;
            sessionStorage["tasa_data"] = JSON.stringify(respuesta);
            window.location.href = "/prestatario_alta_page";
            this.closeModelCarga();
          }
        },
        error => {
          this.closeModelCarga();    
          this.showMessageError = true;
        }
      );
        }else{
          this.closeModelCarga();    
          this.showMessageError = true;
        }
        
      });
    }
  }

  next(){
    this.router.navigate(['/RecuperarPassword']);
  }

  handleEvent(event: any) {

  var keyCode = event.which;
	var shiftKey: boolean = false;
  if(keyCode == 16){
     shiftKey = true;
    }
    
  if(((keyCode >= 65 && keyCode <= 90) && !shiftKey) || ((keyCode >= 97 && keyCode <= 122) && shiftKey)){
    this.show = true; 
  }else{
    this.show = false;
  }
}

  changeMessage(){
    if(this.showMessageError){
      this.showMessageError = false;
    }
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

  ngOnInit(){}
}