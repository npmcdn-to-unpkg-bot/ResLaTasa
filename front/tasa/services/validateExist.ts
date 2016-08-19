import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ServiceResponse} from '../models/service_response'
import '../utilities/rxjs-operators';

@Injectable()
export class ValidateExist{
  constructor(private http: Http) {
   }

  Exist(value: string, userName: string, endPoint: string): Observable<any> {
  var dataURL;
  if(userName==null){
    dataURL=endPoint.replace('{value}', value);
    return this.http.get(dataURL)
        .map(this.extractData)
        .catch(this.handleError);
  }else{
      var dataRFC = 
      {
          "rfc": value,
          "username": userName
      }; 
      return this.http.post(endPoint, JSON.stringify(dataRFC))
          .map(this.extractData)
          .catch(this.handleError);  
  }    

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
      if (respuesta.p_data.existe === 0) {
        return null
      } else {
        throw new Error('repeat');
      }
    }
  }

  private handleError(error: any) {
    return Observable.throw(new Error(error.message));
  }

}