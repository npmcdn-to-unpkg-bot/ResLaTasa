import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ServiceResponse} from '../models/service_response';
import '../utilities/rxjs-operators'

@Injectable()
export class CatalogOrigin {
  
  private endPoint = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/nacionalidad';
  constructor(private http: Http) { }

  get(): Observable<any>{
  return this.http.get(this.endPoint)
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