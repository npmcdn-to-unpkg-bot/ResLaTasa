import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../utilities/rxjs-operators';

import {ServiceResponse} from '../models/service_response'
import { PrestatarioDomicile } from '../models/prestatario_domicilio'
import { PrestatarioSender } from '../models/prestatario_sender'


@Injectable()
export class CreatePrestatarioDomicile {

  //private endPoint = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/guardainformaciondomicilio'
   private endPoint = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devm/guardainformaciondomicilio'
  constructor(private http: Http) { }

  createDomicile(body: PrestatarioSender): Observable<boolean> {
    return this.http.post(this.endPoint, JSON.stringify(body))
      .map(this.extractData)
      .catch(this.handleError);

  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      console.error('BadResponse: ' + res.status);
      throw new Error('ServiceError');
    }

    var respuesta = new ServiceResponse();
    respuesta.fromJson(res.json());
    if (respuesta.isError()) {
      throw new Error('ServiceError');

    } else {
      if (respuesta.p_data.guardado = 1) {
        return true
      } else {
        throw new Error('repeat');
      }
    }
  }

  private handleError(error: any) {
    console.error(error.message);
    return Observable.throw(new Error(error.message));
  }

}