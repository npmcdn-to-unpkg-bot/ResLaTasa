import { Component, Host } from '@angular/core';
import { NgFormModel } from '@angular/common';
import { Validations } from '../utilities/validations';

@Component({
  selector: 'control-messages',
  inputs: ['controlName: control'],
  template: '<div class="error-message"*ngIf="errorMessage !== null" style="margin-bottom: -15px">{{errorMessage}}</div>'
})
export class ControlMessages {
  controlName: string;
  constructor( @Host() private _formDir: NgFormModel) {  }


  get errorMessage() {
    var c;
    if (this.controlName.indexOf('.') !== -1) {
      var controls = this.controlName.split('.');
      c = this._formDir.form.find(controls[0]).find(this.controlName);
    } else {
      c = this._formDir.form.find(this.controlName);
    }

    for (let propertyName in c.errors) {
      if (c.errors.hasOwnProperty(propertyName) && c.touched) {
        return Validations.getValidatorErrorMessage(propertyName);
      }
    }

    return null;
  }
}