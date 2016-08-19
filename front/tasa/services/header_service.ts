import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { HeaderParameters } from '../models/header_parameters';

@Injectable()
export class HeaderService {
  // Observable string sources
  private headerSource = new Subject<HeaderParameters>();
  
  // Observable string streams
  header$ = this.headerSource.asObservable();
  
  // Service message commands
  setParameters(title: HeaderParameters) {
    this.headerSource.next(title)
  }
}