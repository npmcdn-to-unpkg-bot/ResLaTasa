"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var FocusDirective = (function () {
    function FocusDirective(element) {
        this.element = element;
    }
    FocusDirective.prototype.ngOnChanges = function (changes) {
        if (this.hashFocus) {
            this.element.nativeElement.focus();
            this.element.nativeElement.blur();
        }
    };
    __decorate([
        core_1.Input('focusValidate'), 
        __metadata('design:type', Boolean)
    ], FocusDirective.prototype, "hashFocus", void 0);
    FocusDirective = __decorate([
        core_1.Directive({
            selector: '[focusValidate]'
        }),
        __param(0, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], FocusDirective);
    return FocusDirective;
}());
exports.FocusDirective = FocusDirective;
//# sourceMappingURL=input_focus.js.map