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
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var internationalization_1 = require('../utilities/pipes/internationalization');
var Video = (function () {
    function Video(sanitationService) {
        this.sanitationService = sanitationService;
        this.isShow = false;
        this.videoUrl = sanitationService.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/kuL7VmuqTVY");
    }
    Video.prototype.showVideo = function () {
        this.isShow = true;
    };
    Video.prototype.close = function () {
        this.isShow = false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Video.prototype, "url", void 0);
    Video = __decorate([
        core_1.Component({
            selector: 'tasa-video',
            templateUrl: 'components/tasa_video.html',
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
    ], Video);
    return Video;
}());
exports.Video = Video;
//# sourceMappingURL=tasa_video.js.map