import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../utilities/rxjs-operators';

import {ServiceResponse} from '../models/service_response'
@Injectable()
export class AmazonUtilities {
  constructor(private http: Http) { }
  private endPointCredentials = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devg/getCredentialsS3';
  private endPointDelete = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devg/deleteObjectsS3';

  getS3Credentials() {
    return this.http.get(this.endPointCredentials)
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
      throw new Error('ServiceError');

    } else  {
      return respuesta.p_data;
    }
  }

  private handleError(error: any) {
    console.error(error.message);
    return Observable.throw(new Error(error.message));
  }

  deleteS3Objects(file: string) {
    return this.http.post(this.endPointDelete, JSON.stringify({'key': file}))
      .map(this.extractDataDelete)
      .catch(this.handleError);
  }

  private extractDataDelete(res: Response) {
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
      return true;
    }
  }
}