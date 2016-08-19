import { Component, Input,ElementRef, Renderer, AfterViewInit } from '@angular/core';

@Component({
  selector: 'tasa-tooltip',
  templateUrl: 'components/tasa_tooltip.html'
})

export class TasaTooltip implements AfterViewInit{
  @Input()
  text: string
  @Input()
  position: string //top, bottom, left, right
  @Input()
  height: string

  constructor(public el: ElementRef, public renderer: Renderer) { 
    this.position = 'top';
    this.text = 'tooltip';
    this.height= '40px';
  }

  ngAfterViewInit(){
    window.setTimeout(() =>{
      this.renderer.setElementStyle(this.el.nativeElement.getElementsByTagName('div')[0], 'display', 'block');
    });
  }
}
