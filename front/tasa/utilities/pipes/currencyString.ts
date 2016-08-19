import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
 
@Pipe({ name: 'currencyString' })
export class CurrencyString implements PipeTransform {
    transform(value: string, currencyCode?: string, symbolDisplay?: boolean, digits?: string): string {
        var parseNumber = Number(value);
        if (isNaN(parseNumber)) {
            return value;
        }
        else {
            return new CurrencyPipe().transform(parseNumber, currencyCode, symbolDisplay, digits);
        }
    }
}
