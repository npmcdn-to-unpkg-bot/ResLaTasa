import { Injectable } from '@angular/core'
import { Subject }    from 'rxjs/Subject';
import { PrestatarioAltaModel } from '../models/prestatario_alta'

@Injectable()
export class SetModelPrestatarioAlta {
  // Observable string sources
  //private prestatario_alta  = new Subject<PrestatarioAltaModel>();
  private modelo = new PrestatarioAltaModel();
  // Observable string streams
  //prestatario_alta$ = this.prestatario_alta.asObservable();
  
  // Service message commands
  setModel(model: PrestatarioAltaModel) {
    this.modelo = model;
    //this.prestatario_alta.next(this.modelo);
    
  }
  getModel(): PrestatarioAltaModel {
    return this.modelo;
  }
}