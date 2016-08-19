import {Component, OnInit, ViewChildren, QueryList, AfterViewInit    } from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control, NgClass, NgForm} from '@angular/common';
import { Router } from '@angular/router';
import { HeaderService } from '../services/header_service';
import { CatalogDomicileService } from '../services/catalogDataDomicile';
import { SetModelPrestatarioAlta } from '../services/model_prestatario_alta';
import { CreatePrestatarioDomicile } from '../services/createPrestatarioDomicile';
import { Observable } from 'rxjs/Observable';
import { Subscription }   from 'rxjs/Subscription';
import { Validations } from '../utilities/validations';
import { I18n } from '../utilities/pipes/internationalization';
import { ControlMessages } from './tasa_control_messages';
import { FocusDirective } from './input_focus';
import { PrestatarioDomicile } from '../models/prestatario_domicilio';
import { HeaderParameters } from '../models/header_parameters';
import { PrestatarioSender } from '../models/prestatario_sender';
import { PrestatarioAltaModel } from '../models/prestatario_alta';
import { PrestatarioPerfilModel } from '../models/prestatario_perfil';
import {UpLoadImages} from './tasa_upload_images';
import { Loading } from './tasa_loading';

@Component({
  selector: 'prestatario-domicilio',
  templateUrl: 'components/prestatario_domicilio.html',
  directives: [ControlMessages, UpLoadImages, Loading],
  providers: [CatalogDomicileService, CreatePrestatarioDomicile],
  pipes: [I18n]
})

export class PrestatarioDomicilio implements OnInit, AfterViewInit {
  title: string;
  domicilioForm: ControlGroup;
  presPerfilDModel: PrestatarioDomicile;
  prestatario_sender: PrestatarioSender;
  useVoucher: string = '';
  colonies: Array<any>;
  delegations: Array<any>;
  cities: Array<any>;
  state: Array<any>;
  model = new PrestatarioDomicile("", "", "", "", "", "", "", "", "");
  domicileService: any;
  isMovil: boolean;
  isTablet: boolean;
  validaFormDomi: boolean = false;
  closeLoading: boolean = false;
  @ViewChildren(UpLoadImages) archivos: QueryList<UpLoadImages>;

  errorMessageState: string;
  errorMessageCities: string;
  errorMessageColonies: string;
  errorMessageDelegations: string;
  comprobanteIFE: string;
  subscriptionModel: Subscription;
  prestatario_alta: PrestatarioAltaModel;
  permitirPeticion: boolean = true;
  domicileModel: PrestatarioDomicile;
  numberHas: string = '';
  numexterior: boolean = false;
  file_srcs: string[] = [];
  routeFront: string = '';
  errorImgFront: string;
  private presPerfilModel: PrestatarioDomicile;
  constructor(private headerService: HeaderService,
    private formBuilder: FormBuilder,
    private setModelService: SetModelPrestatarioAlta,
    private catalogDomicileService: CatalogDomicileService,
    private router: Router,
    private crearDomicile: CreatePrestatarioDomicile) {
    this.title = '¡Completa tu solicitud!';
    this.domicileService = catalogDomicileService;
    this.domicilioForm = this.formBuilder.group({
      'calle': ['', Validators.required],
      'codigoPostal': ['', Validators.compose([Validators.required, Validations.zipCodeValidator])],
      'estado': ['', Validators.required],
      'delegacion': ['', Validators.required],
      'colonia': ['', Validators.required],
      'numeros': formBuilder.group({
        'numeros.exterior': [''],
        'numeros.interior': ['']
      }, { validator: Validations.numberValidator('numeros.exterior', 'numeros.interior') })
    });

    this.prestatario_alta = this.setModelService.getModel();
    
    if(this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('domicilio')){
      this.showModalCarga();
      this.presPerfilModel = this.prestatario_alta.domicilio;
      this.getDataState({target: {value : this.presPerfilModel.id_estado}});
      this.getDataColony({target: {value : this.presPerfilModel.delegacion_municipio}});
      this.model = this.presPerfilModel;
      this.closeModelCarga();
    }
      
}


  saveDomicilio() {
    this.showModalCarga();
    for (var o = 0; o < this.state.length; o++) {
      if (this.state[o].id_estado == this.model.estado) {
        this.model.id_estado = this.model.estado;
        this.model.estado = this.state[o].estado;
        break;
      }
    }

    if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
      this.prestatario_alta = this.setModelService.getModel();
    }
    this.prestatario_alta.domicilio = this.model;
    this.prestatario_sender = new PrestatarioSender(this.prestatario_alta);
    this.prestatario_sender.username = this.prestatario_alta.perfil.username;
    this.prestatario_sender.token = "";
    this.crearDomicile.createDomicile(this.prestatario_sender).subscribe(
      respuesta => {
        this.permitirPeticion = true;
        if (respuesta) {
          this.router.navigate(['/DatosLaborales']);
        }
      },
      error => {
        this.permitirPeticion = true;
        alert(Validations.getValidatorErrorMessage('ServiceError'));
        this.closeModelCarga();
      }
    );
  }

  ngOnInit() {
    //TODO: Agregar validaciones para tokens
    this.headerService.setParameters(new HeaderParameters(this.title, true, true));
    this.getEstate();
  }

  back() {
    this.router.navigate(['/PersonalInformation']);
  }

  getEstate() {
    this.domicileService.getState()
      .subscribe(
      state => {
        this.errorMessageState = '';
        this.state = state.sort((a, b) => a.id_estado - b.id_estado);
      },
      error => {
        this.errorMessageState = <any>error
        this.errorMessageState = 'La información no puede ser cargada. Intente más tarde.'
      }
      );
  }

  cleanSelect(reference) {
    if (reference == "zipCode") {
      this.model.estado = "";
      this.domicilioForm.value.estado = "";
    }
    this.model.delegacion_municipio = "";
    this.domicilioForm.value.delegacion = "";
    this.model.colonia = "";
    this.domicilioForm.value.ciudad = "";
    this.model.ciudad = "";
    if (reference == "state") {
      this.model.codigo_postal = "";
    }
    this.delegations = [];
    this.colonies = [];
    this.cities = [];
  }


  getDataState(event) {
    if (event.target.value != '') {
      this.cleanSelect('state');
      this.domicileService.getDataState(event.target.value)
        .subscribe(
        response => {
          var ciudad = response.ciudad;
          var municipio = response.municipio;
          this.cities = ciudad.sort((a, b) => a.id_ciudad - b.id_ciudad);
          this.delegations = municipio.sort((a, b) => a.id_municipio - b.id_municipio);
          this.model.estado = this.domicilioForm.value.estado
        }, error => {
          if (error.message == "1") {
            this.domicilioForm.controls['estado'].setErrors({
              "noRecords": true
            })
          } else {
            this.domicilioForm.controls['estado'].setErrors({
              "ServiceError": true
            })
          }
        });
    }
  }


  getDataZipCode(event) {

    if (this.domicilioForm.controls['codigoPostal'].valid) {
      this.cleanSelect('zipCode');
      this.domicileService.getDataZipCode(event.target.value)
        .subscribe(
        response => {
          this.delegations = response.municipio;
          this.colonies = response.colonia;
          if(this.colonies.length==1){ 
            this.model.colonia=response.colonia[0].id_colonia;
          }
          this.cities = response.ciudad;
          this.model.ciudad = response.ciudad[0].id_ciudad;
          this.model.id_estado = response.estado[0].id_estado;
          this.model.delegacion_municipio = response.municipio[0].id_municipio;
        },
        
        error => {
          this.estableceError('codigoPostal', error);
        }
        );
    } else {
      if (this.domicilioForm.value.codigoPostal != '') {
        this.cleanSelect('zipCode');
      }
    }
  }

  getDataColony(event) {
    if (event.target.value != '') {
      this.domicileService.getDataColony(event.target.value)
        .subscribe(
        response => {
          this.colonies = response.colonia;
        },
        error => {
          this.estableceError('colonia', error);
        });
    }
  }

  getZipCodeByColony(event) {
    if (event.target.value != '') {
      this.domicileService.getZipCodeByColony(event.target.value)
        .subscribe(
        response => {
          this.model.codigo_postal = response[0].cp;
        },
        error => {
          this.estableceError('codigoPostal', error);
        });
    }
  }

  estableceError(campo, err) {

    if (err.message == "1") {
      this.domicilioForm.controls[campo].setErrors({
        "noRecords": true
      })
    } else {
      this.domicilioForm.controls[campo].setErrors({
        "ServiceError": true
      })
    }
    this.domicilioForm.controls[campo].markAsTouched();
  }

  private showModalCarga() {
    this.closeLoading = true;
  }
  private closeModelCarga() {
    this.closeLoading = false;
  }

  ngAfterViewInit() {
    (<any>window).Waves.init();
  }

}
