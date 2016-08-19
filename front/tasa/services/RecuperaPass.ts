import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../utilities/rxjs-operators';

import {ServiceResponse} from '../models/service_response'
import { PasswordModel } from '../models/recuperar_password'

@Injectable()
export class RecuperaPass{
   
  private endPoint = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/getrecuperapassword'
  constructor(private http: Http) { }
  
  access(body: PasswordModel): Observable<boolean> {
    return this.http.post(this.endPoint,JSON.stringify(body))
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
      console.error('ErrorInResponse: ' + respuesta.message);
      throw new Error(respuesta.message);
    } else {
      if (respuesta.err == 0) {
        return true
      } else {
        throw new Error('repeat');
      }
    }
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw(new Error(error));
  }

}