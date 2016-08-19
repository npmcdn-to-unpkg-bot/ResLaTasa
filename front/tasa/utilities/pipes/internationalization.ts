import { Pipe, PipeTransform } from '@angular/core';
import { Internationalization } from '../internationalization';

@Pipe({
  name: 'i18n'
})

export class I18n implements PipeTransform {
  transform(properties: string, language = 'es'): string {
    return  this.getProperty(Internationalization[language],properties);
  }

  getProperty(objectToScan: any,properties: string ){
    let porpertiesArray = properties.split('.');
    let firtsProperty = porpertiesArray.shift()
    let answer = objectToScan[firtsProperty];
    if(porpertiesArray.length > 0){
      answer = this.getProperty(answer, porpertiesArray.join('.'));
    }
    return answer;
  }
}