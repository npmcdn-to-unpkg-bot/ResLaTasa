import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ServiceResponse} from '../models/service_response';
import '../utilities/rxjs-operators'

@Injectable()
export class CatalogDomicileService {
  constructor(private http: Http) { 

  }

  private stateUrl = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/estados';
  private electorCredentialURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/bajarimagen';
  private zipCodeURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devm/buscainfocp/';
  private dataStateURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/devm/ciudad_y_municipio/';
  private dataColonyURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/colonia/';
  private dataZipCodeByColonyURL = 'https://l7cti0d4j1.execute-api.us-east-1.amazonaws.com/dev/buscacp/'


  getState(): Observable<any> {
    return this.http.get(this.stateUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFrontImg(data): Observable<any>{
    return this.http.post(this.electorCredentialURL, JSON.stringify(data))
      .map(this.extractData)
      .catch(this.handleError);

  }  

  getDataZipCode(zipCode): Observable<any>{
    return this.http.get(this.zipCodeURL+zipCode)
    .map(this.extractData)
      .catch(this.handleError);
  }

  getDataState(state): Observable<any>{
    return this.http.get(this.dataStateURL + state)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDataColony(idMunicipy): Observable<any>{
    return this.http.get(this.dataColonyURL + idMunicipy)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getZipCodeByColony(idColony): Observable<any>{
    return this.http.get(this.dataZipCodeByColonyURL + idColony)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extracError(res: Response){
    var respuesta = new ServiceResponse();
    respuesta.fromJson(res.json());   
return respuesta.p_data || {};
    
  }
  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error("2");
    }    

    var respuesta = new ServiceResponse();
    respuesta.fromJson(res.json());     
    
    if (respuesta.isError) {
    if (respuesta.err == 1) {
      throw new Error("1");
      
    }
    else if (respuesta.err == 0) {
      return respuesta.p_data || {};
    } else {
      throw new Error("ServiceError");
    }
  }
    throw new Error("ServiceError");
    
  }

  private handleError(error: any) {
    return Observable.throw(new Error(error.message));
  }
}