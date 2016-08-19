import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ServiceResponse} from '../models/service_response';
import { PrestatarioSender } from '../models/prestatario_sender'

import '../utilities/rxjs-operators'

@Injectable()
export class catalogEmploymentStatus {
  constructor(private http: Http) { 

  }

  private sector = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/csector';
  private estudios = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/cnivelestudios';
  private tipo_Comprobante = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/ctipocomprobante';
  private tipo_Contratacion = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/ctipocontratacion';
  private actividad_Profesional= 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/cactividadprofesional';
  private save_DatosLaborales = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/deviva/post/tasa_estado_laboral';
  private gastos_mensuales = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/cgastosmensualesactividad';
getSector(): Observable<any> {
  return this.http.get(this.sector)
      .map(this.extractData)
      .catch(this.handleError);
  }

getNivelEstudios(): Observable<any>{
  return this.http.get(this.estudios)
      .map(this.extractData)
      .catch(this.handleError);
  }  

getTipoComprobante(estadolaboral:any): Observable<any>{
  return this.http.post(this.tipo_Comprobante,JSON.stringify({'tipo':estadolaboral}))
        .map(this.extractData)
        .catch(this.handleError);
}

getTipoContratacion(): Observable<any>{
  return this.http.get(this.tipo_Contratacion)
      .map(this.extractData)
      .catch(this.handleError);
}

getActividadProfe(): Observable<any> {
  return this.http.get(this.actividad_Profesional)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
getGastosMensuales(): Observable<any> {
    return this.http.get(this.gastos_mensuales)
      .map(this.extractData)
      .catch(this.handleError);
 }

  saveDatosLaborales(body: PrestatarioSender): Observable<any> {
  return this.http.post(this.save_DatosLaborales,JSON.stringify(body))
        .map(this.extractData)
        .catch(this.handleError);
  }
  
  
  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('ServiceError');
    }
    var respuesta = new ServiceResponse();
    respuesta.fromJson(res.json());
    if (respuesta.isError()) {
      throw new Error('ServiceError');
    } else {      
      return respuesta.p_data || {};
    }
  }

  private handleError(error: any) {
    return Observable.throw(new Error(error.message));
  }
}