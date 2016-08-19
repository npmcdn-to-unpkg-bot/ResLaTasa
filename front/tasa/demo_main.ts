
import {bootstrap} from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

import {UIKit} from './components/UIKit';

bootstrap(UIKit, [
  disableDeprecatedForms(),
  provideForms()
 ]).catch((err: any) => console.error(err));