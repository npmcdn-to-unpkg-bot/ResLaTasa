	import {Component, Input, ElementRef, AfterViewChecked, Renderer, OnDestroy} from '@angular/core';
	import { CurrencyString } from '../utilities/pipes/currencyString'
	import { DecimalPipe } from '@angular/common'

	@Component({
		selector: 'tasa-slider',
		templateUrl: 'components/tasa_slider.html',
	 	pipes: [CurrencyString]	
	})

	export class Slider implements OnDestroy{

		@Input()
		step: number;
		@Input()
		date: number; 
		@Input()
		min: number;
		@Input()
		value: number;
		@Input()
		max: number;
		@Input()
		idComponent: string;
		@Input()
		idElement: string;
		@Input()
		nameComponent: string;
		
		listenFuncInput: Function;
		listenFuncResize: Function;
		textoAMostar:string;

	  constructor(elementRef: ElementRef, renderer: Renderer){ 
			this.textoAMostar =  this.value + 'meses';
			this.listenFuncInput = renderer.listen(elementRef.nativeElement, 'input', () => this.moverEtiqueta());
			this.listenFuncResize = renderer.listenGlobal('window', 'resize', () => this.moverEtiqueta());
	  }

		ngOnInit(){
			this.inicalizarEtiqueta();
		}

		ngOnDestroy() {
	    
	    // eliminar listeners!
	    this.listenFuncInput();
	    this.listenFuncResize();
	  }

	 	inicalizarEtiqueta(){	
			var convertCurrency;
			if (this.nameComponent=="monto"){
				this.textoAMostar = new CurrencyString().transform(this.value.toString(), 'USD', true);
			}else{
				this.textoAMostar = this.value.toString() + " meses";
			}
		}

		moverEtiqueta(){
				let etiqueta = document.querySelector('#'+this.idElement);
				let slider = <HTMLInputElement>document.querySelector('#'+this.idComponent);
					let box = document.querySelector('#' + 'box' + this.idComponent);
					let posicion = 0;
					if (slider.name == "monto") {
						this.textoAMostar = new CurrencyString().transform(slider.value, 'USD', true);;
					} else {
						this.textoAMostar = slider.value + ' meses';
					}
					let pasosTotales = (this.max - this.min) / this.step;
					let sliderWidth = parseFloat(window.getComputedStyle(slider, null).getPropertyValue('width'));
					let pxls = sliderWidth / pasosTotales;
					let pasosReales = (parseInt(slider.value) - this.min) / this.step;
					posicion = pasosReales * pxls;
					posicion = posicion - (30 * (pasosReales / pasosTotales)); //30 del ancho de la etiquieta
					posicion = posicion - 3 + (-3 * (pasosReales / pasosTotales)); //correcciones para centrar fecha de etiqueta
					etiqueta.innerHTML = this.textoAMostar;
					etiqueta.setAttribute('style', 'left: ' + posicion + 'px');
					box.setAttribute('style', 'width: ' + (posicion + 7) + 'px');
			}
		
	}	