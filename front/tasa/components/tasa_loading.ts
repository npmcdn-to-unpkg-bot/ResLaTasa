import {Component, OnInit, Input,Output} from '@angular/core';

@Component({
	selector: 'tasa-loading',
	properties: ['fontSize'],
    events: ['fontSizeChange'],
	templateUrl: 'components/tasa_loading.html',
})

export class Loading implements OnInit{
	private _closeLoadingBoolean;
	elementUno : boolean= true;
	elementoTwo : boolean= true;
	elementThree : boolean = true;
	elementFour : boolean= true;
	@Input()
	stop: boolean;
	@Input()
	closeLoading: boolean;
	@Input()
	set closeLoadingBoolean(valueClose){
		
		if (valueClose) {
			this._closeLoadingBoolean = valueClose;
			this.stop = false;
			var currentLocation = window.location.pathname;
			window.location.href = currentLocation + "#modaloading"
			this.setTimeElement();
		}
		else{
			this.stop = true;
			this.elementUno = true;
			this.elementoTwo = true;
			this.elementFour = true;
			this.elementThree = true;			
			var currentLocation = window.location.pathname;
			window.location.href = currentLocation + "#";
		}
	}
	constructor() {
	}

	ngOnInit() {
		this.elementUno = true;
		this.elementoTwo = true;
		this.elementThree = true;
		this.elementFour = true;	
	}

	private setTimeElement() {
		if (!this.stop) {
			this.elementUno = false;
			this.elementoTwo = false;
			this.elementFour = false;
			this.elementThree = false;
		}
	}		
}