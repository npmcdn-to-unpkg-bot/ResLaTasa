import {Component, OnInit, ViewChild, ViewChildren, QueryList, AfterContentInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ControlGroup, Control, NgClass, NgForm} from '@angular/common';

import { CurrencyString } from '../utilities/pipes/currencyString'
import { Validations } from '../utilities/validations';
import { I18n } from '../utilities/pipes/internationalization';

import { ControlMessages } from './tasa_control_messages';

import {PrestatarioLaboral} from '../models/prestatario_laboral'
import {PrestatarioLaboralOtro} from '../models/prestatario_laboral_otro'
import {PrestatarioLaboralEmpleado} from '../models/prestatario_laboral_empleado'
import {PrestatarioLaboralEmpresario} from '../models/prestatario_laboral_empresario'
import { PrestatarioAltaModel } from '../models/prestatario_alta'
import {ComprobantesIngreso} from '../models/comprobantes_ingresos'
import { HeaderParameters } from '../models/header_parameters'
import { PrestatarioSender } from '../models/prestatario_sender';

import {ComprobanteIngresos} from './tasa_comprobante_ingreso';

import { HeaderService } from '../services/header_service';
import { SetModelPrestatarioAlta } from '../services/model_prestatario_alta';
import { catalogEmploymentStatus } from '../services/catalogEmploymentStatus';

import { Loading } from './tasa_loading';

@Component({
  selector: 'datos-estado-laboral',
  templateUrl: 'components/datos_estado_laboral.html',
  directives: [ControlMessages,Loading, ComprobanteIngresos],
  providers: [catalogEmploymentStatus],
  pipes: [CurrencyString, I18n]
})
export class DatosEstadoLaboral implements OnInit {
  title: string;
  prestatario_alta: PrestatarioAltaModel;
  closeLoading: boolean = false;
  puestoFinal: string = '';
  datosLaboralesForm: ControlGroup;
  como_compruebas: any;

  /**
   *Arreglos para selects 
   */
  sector: Array<any>;
  nivelEstudio: Array<any>;
  tipoContrataciones: Array<any>;
  actividadProfesionales: Array<any>;
  gastosMensuales: Array<any>;
  /**
   * Deficion Items tipo comprobantes
   */
  @ViewChildren(ComprobanteIngresos) comprobantes: QueryList<ComprobanteIngresos>;
  existeComprobante: boolean = false;
  username: string;
  imagen: string;

  itemsTipoComprobante: Array<number> = [1];
  count: number = 1;
  isValidForm: boolean = true;
  isValid: boolean = false;
  tipoComprobante: number;
  subirDespues: boolean = false;
  /**
   * Definicion de modelo
   */
  modelDatosLaborales: PrestatarioLaboral;
  prestatario_sender: PrestatarioSender;

  constructor(private headerService: HeaderService,
    private router: Router,
    private setModelService: SetModelPrestatarioAlta,
    private stateLaborService: catalogEmploymentStatus,
    private formBuilder: FormBuilder
  ) {

    this.prestatario_alta = this.setModelService.getModel();
    this.title = '¡Completa tu solicitud!'
    this.username = this.prestatario_alta.perfil.username;
    this.datosLaboralesForm = this.formBuilder.group({});
    this.modelDatosLaborales = new PrestatarioLaboralEmpleado();
    this.datosLaboralesForm.addControl('ingreso', new Control(this.modelDatosLaborales.ingreso_mensual_libre,
      Validators.compose([
        Validators.required,
        Validations.onlyNumericValidator,
        Validations.zeroValidator
      ])));

    this.datosLaboralesForm.addControl('nivelEstudio', new Control(this.modelDatosLaborales.nivelestudios, Validators.required));

    this.datosLaboralesForm.addControl('clave_ciec', new Control(this.modelDatosLaborales.clave_ciec, Validators.compose([
      Validators.required,
      Validations.ciecValidator
    ])));

    if (this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('laboral')) {
      this.modelDatosLaborales = this.prestatario_alta.laboral;

      this.como_compruebas = (this.modelDatosLaborales.clave_ciec != null) ? 1 : 2;
      this.subirDespuesDocumentos({checked:this.modelDatosLaborales.subir_despues});
      this.comoCompruebas(this.como_compruebas);
      if (this.modelDatosLaborales.comprobante.length > 0) {
        this.existeComprobante = true;
        for (let i = 1; i < this.modelDatosLaborales.comprobante.length; i++) {
          this.itemsTipoComprobante.push(i);
        }
      }
      this.changeOcupation(this.prestatario_alta.laboral.ocupacion);
    } else {
      this.modelDatosLaborales.subir_despues = false;
      this.modelDatosLaborales.nivelestudios = '';
    }

  }

  ngAfterViewInit() {
    if (this.existeComprobante) {
      window.setTimeout(() => {
        let cont = 0;
        this.comprobantes.forEach(comprobante => {
          comprobante.imagen = this.modelDatosLaborales.comprobante[cont].img_comprobante_ingresos;

          comprobante.comprobante.id = this.modelDatosLaborales.comprobante[cont].tipo_comprobante;
        });
        cont++;
      });
    }
  }

  ngOnInit() {
    //TODO:verificar tokens
    this.headerService.setParameters(new HeaderParameters(this.title, true, true));
    this.getNivelEstudios();
    this.getSector();
    this.getTipoContratacion();
    this.getActividadProfesional();
    this.getGastosMensuales();
  }


  getSector() {
    this.stateLaborService.getSector()
      .subscribe(
      sector => {
        this.sector = sector;
        this.sector.forEach(cadena => {
          cadena.sector = this.primeraMayuscula(cadena.sector.toLocaleLowerCase());
        });
      },
      error => {
        console.error(error);
        alert(Validations.getValidatorErrorMessage('ServiceError'));
      }
      );
  }

  getNivelEstudios() {
    this.stateLaborService.getNivelEstudios()
      .subscribe(
      nivelEstudio => {
        this.nivelEstudio = nivelEstudio;
        this.nivelEstudio.forEach(cadena => {
          cadena.nivel = this.primeraMayuscula(cadena.nivel.toLocaleLowerCase());
        });
      },
      error => {
        console.error(error);
        alert(Validations.getValidatorErrorMessage('ServiceError'));
      }
      );
  }

  getTipoContratacion() {
    this.stateLaborService.getTipoContratacion()
      .subscribe(
      tipoContrataciones => {
        this.tipoContrataciones = tipoContrataciones;
        this.tipoContrataciones.forEach(cadena => {
          cadena.contratacion = this.primeraMayuscula(cadena.contratacion.toLocaleLowerCase());
        });
      },
      error => {
        console.error(error);
        alert(Validations.getValidatorErrorMessage('ServiceError'));
      }
      );
  }

  getActividadProfesional() {
    this.stateLaborService.getActividadProfe()
      .subscribe(
      actividadProfesionales => {
        this.actividadProfesionales = actividadProfesionales;
        this.actividadProfesionales.forEach(cadena => {
          cadena.actividad = this.primeraMayuscula(cadena.actividad.toLocaleLowerCase());
        });
      },
      error => {
        console.error(error);
        alert(Validations.getValidatorErrorMessage('ServiceError'));
      }
      );
  }

  getGastosMensuales() {
    this.stateLaborService.getGastosMensuales()
      .subscribe(
      gastosMensuales => {
        this.gastosMensuales = gastosMensuales;
      },
      error => {
        console.error(error);
        alert(Validations.getValidatorErrorMessage('ServiceError'));
      }
      );
  }
  setCurrency(event: any) {
    event.target.value = new CurrencyString().transform(event.target.value, 'USD', true, '.2-2');
  }

  back() {
    this.router.navigate(['/PrestatarioDomicilio']);
  }

  saveDatosLaborales(modelDatosLaborales: PrestatarioLaboral) {
    this.showModalCarga();
    if (this.prestatario_alta === undefined || this.prestatario_alta === null) {
      this.prestatario_alta = this.setModelService.getModel();
    }
    modelDatosLaborales.comprobante = [];
    modelDatosLaborales.ocupacion = this.puestoFinal;
    if (this.tipoComprobante == 2) {
      modelDatosLaborales.clave_ciec = null;
      if (!this.subirDespues) {

        this.comprobantes.forEach(comprobante => {
          if (comprobante.isValid) {
            modelDatosLaborales.comprobante.push(new ComprobantesIngreso(comprobante.comprobante.id, comprobante.file));
          }
        });
      }
    }
    this.prestatario_alta.laboral = this.modelDatosLaborales;
    this.prestatario_sender = new PrestatarioSender(this.prestatario_alta);
    this.prestatario_sender.username = this.prestatario_alta.perfil.username;
    this.prestatario_sender.token = "";

    this.stateLaborService.saveDatosLaborales(this.prestatario_sender).subscribe(
      respuesta => {
        if (respuesta) {
          this.prestatario_alta.laboral = respuesta;
          this.setModelService.setModel(this.prestatario_alta);
          this.router.navigate(['/PreAprobacion']);
        }
      },
      error => {
        this.closeModelCarga();
        console.error(error);
        alert(Validations.getValidatorErrorMessage('ServiceError'));
      }
    );

  }

  addElement() {
    if (this.itemsTipoComprobante.length <= 20) {
      this.itemsTipoComprobante.push(++this.count);
    } else {
      return;
    }
  }

  validaComprobante(respuesta: boolean) {
    this.isValid = false;
    this.comprobantes
    this.comprobantes.forEach(item => {

      if (item.isValid) {
        this.isValid = true;
        return;
      }
    });
    if (!this.subirDespues) {
      this.isValidForm = this.isValid;
    }
  }


  changeOcupation(puesto: any) {
    this.puestoFinal = puesto;
    let res_ingreso = this.modelDatosLaborales.ingreso_mensual_libre;
    let res_ciec = this.modelDatosLaborales.clave_ciec;
    let res_nivelestudios = this.modelDatosLaborales.nivelestudios;
    let res_subier = this.modelDatosLaborales.subir_despues;
    this.clearForm();
    switch (this.puestoFinal) {
      case 'empleado':
        this.modelDatosLaborales = new PrestatarioLaboralEmpleado();
        this.datosLaboralesForm.addControl('sector', new Control('', Validators.required));
        this.datosLaboralesForm.addControl('tipocontra', new Control('', Validators.required));
        this.datosLaboralesForm.addControl('aniosempleo', new Control('', Validators.compose([
          Validators.required,
          Validations.onlyNumericValidator,
          Validations.maxlength
        ])));
        this.datosLaboralesForm.addControl('actividadprofe', new Control('', Validators.compose([
          Validators.required,
          Validations.onlyLettersValidator,
          Validators.maxLength(50)
        ])));
        (<PrestatarioLaboralEmpleado>this.modelDatosLaborales).sector = '';
        (<PrestatarioLaboralEmpleado>this.modelDatosLaborales).tipo_contratacion = '';
        break;

      case 'empresario':
        this.modelDatosLaborales = new PrestatarioLaboralEmpresario();
        this.datosLaboralesForm.addControl('actividadProfeEmpresario', new Control('', Validators.required));
        this.datosLaboralesForm.addControl('aniosActiEmpre', new Control('', Validators.compose([
          Validators.required,
          Validations.onlyNumericValidator,
          Validations.maxlength
        ])));
        this.datosLaboralesForm.addControl('gastoMensual', new Control('', Validators.required));

        (<PrestatarioLaboralEmpresario>this.modelDatosLaborales).actividad_profesional = '';
        (<PrestatarioLaboralEmpresario>this.modelDatosLaborales).gastos_mensuales = '';
        break;

      case 'otro':
        this.modelDatosLaborales = new PrestatarioLaboralOtro();
        this.datosLaboralesForm.addControl('recibesIngresos', new Control('', Validators.compose([
          Validators.required,
          Validations.onlyLettersValidator,
          Validators.maxLength(50)
        ])));
        break;
    }
    //TODO:setear modelos nuevamente
    if (this.prestatario_alta != undefined && this.prestatario_alta != null && this.prestatario_alta.hasOwnProperty('laboral')) {
      if (this.puestoFinal == this.prestatario_alta.laboral.ocupacion) {
        this.modelDatosLaborales = this.prestatario_alta.laboral;
      }
    }
    if (res_ciec !== undefined) {
      this.modelDatosLaborales.clave_ciec = res_ciec
    }
    if (res_ingreso !== undefined) {
      this.modelDatosLaborales.ingreso_mensual_libre = res_ingreso;
    }
    if (res_nivelestudios !== undefined) {
      this.modelDatosLaborales.nivelestudios = res_nivelestudios;
    }
    if (res_subier !== undefined) {
      this.modelDatosLaborales.subir_despues = res_subier;
    }
  }

  comoCompruebas(tipoComprobante: any) {
    if (tipoComprobante == 1) {
      this.como_compruebas = tipoComprobante;
      this.tipoComprobante = tipoComprobante;
      this.isValidForm = true;
    } else if (tipoComprobante == 2) {
      if (this.itemsTipoComprobante.length == 0) {
        this.itemsTipoComprobante.push(this.count);
      } else {
        this.count = 1;
        this.itemsTipoComprobante = [];
        this.itemsTipoComprobante.push(this.count);
      }
      this.datosLaboralesForm.controls['clave_ciec'].setErrors(null);
      this.isValidForm = false;
      this.como_compruebas = tipoComprobante;
      this.tipoComprobante = tipoComprobante;
    }
  }

  clearForm() {
    for (var control in this.datosLaboralesForm.controls) {
      if (control != 'ingreso' && control != 'nivelEstudio' && control != 'clave_ciec') {
        this.datosLaboralesForm.removeControl(control);
      }
    }

  }

  subirDespuesDocumentos(event) {
    if (event.checked) {
      this.isValidForm = true;
      this.subirDespues = true;
      this.modelDatosLaborales.subir_despues = true;
    } else {
      this.modelDatosLaborales.subir_despues = false;
      if (!this.isValid) {
        this.isValidForm = false;
      }
      this.subirDespues = false;
    }
  }

  primeraMayuscula(cadena: string) {
    return cadena.charAt(0).toLocaleUpperCase() + cadena.slice(1);
  }

  private showModalCarga(){
      this.closeLoading = true;
   }

  private closeModelCarga(){
        this.closeLoading = false;
  } 
}