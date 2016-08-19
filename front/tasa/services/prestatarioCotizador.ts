import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ServiceResponse} from '../models/service_response';
import '../utilities/rxjs-operators'

@Injectable()
export class CotizadorService {
  constructor(private http: Http) { }

  private montosUrl = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/catalogo/montoCotizador';
  private plazosUrl = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/catalogo/plazoCotizador';
  private quoteDataTable = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/datostablacotizacion';
  private dataAppliedOn = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/catalogodescripcionotros';

  getMontos(): Observable<any> {
    return this.http.get(this.montosUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPlazos(): Observable<any> {
    return this.http.get(this.plazosUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getQuoteDataTable(): Observable<any>{
    return this.http.get(this.quoteDataTable)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDataAppliedOn(): Observable<any>{
    return this.http.get(this.dataAppliedOn)
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