import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../utilities/rxjs-operators';

import {ServiceResponse} from '../models/service_response'
import { PrestatarioSender } from '../models/prestatario_sender'


@Injectable()
export class CreatePersonalInformation{
   
  private endPoint = 'https://urmdamghr3.execute-api.us-east-1.amazonaws.com/development/guardainfopersonales';
  constructor(private http: Http) { }
  
  createPersonalInformation(body: PrestatarioSender): Observable<boolean> {
      return this.http.post(this.endPoint,JSON.stringify(body))
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
      if (respuesta.err ==0) {
        return true
      } else {
        throw new Error('repeat');
      }
    }
  }

  private handleError(error: any) {
    return Observable.throw(new Error(error.message));
  }

}