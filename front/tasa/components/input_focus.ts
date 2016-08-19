import {Directive, Input, ElementRef, Inject} from '@angular/core';
@Directive({
    selector: '[focusValidate]'
})
export class FocusDirective {
    @Input('focusValidate')
    hashFocus:boolean;
    constructor(@Inject(ElementRef) private element: ElementRef) {}
    
    ngOnChanges(changes) {
        if (this.hashFocus) {
            this.element.nativeElement.focus();
            this.element.nativeElement.blur();
            //this.element.nativeElement.focus = false;
        }
    }   
}