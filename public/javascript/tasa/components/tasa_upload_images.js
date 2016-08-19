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
var http_1 = require('@angular/http');
var amazonUtilities_1 = require('../services/amazonUtilities');
var internationalization_1 = require('../utilities/pipes/internationalization');
var validations_1 = require('../utilities/validations');
var upload_file_parameters_1 = require('../models/upload_file_parameters');
var UpLoadImages = (function () {
    function UpLoadImages(amazonUtilities, elementRef) {
        this.amazonUtilities = amazonUtilities;
        this.elementRef = elementRef;
        this.imageSelected = new core_1.EventEmitter();
        //Para Validar el tamaño se tomo el kilo = 1024, 8388608 Bytes en 1Mb * 10 = 83886080
        this.MAX_SIZE = 10485760;
        this.prevent = false;
        this.errorMessage = null;
        this.isValid = false;
        this.accessKeyId = "AKIAJBRKBNUYNAO35WFA";
        this.region = "us-east-1";
        this.uploadProgress = 0;
        this.bucketURL = 'http://latasa.s3.amazonaws.com/';
        this.isValid = false;
        this.existPhoto = false;
    }
    UpLoadImages.prototype.ngOnInit = function () {
        var _this = this;
        this.amazonUtilities.getS3Credentials().subscribe(function (response) { return _this.setSecurity(response); });
        if (this.parameters.s3URL.length > 0) {
            this.setFile(this.parameters.s3URL);
        }
        else {
            this.s3URL = this.parameters.s3URL;
        }
        this.showWebCam();
    };
    UpLoadImages.prototype.ngAfterViewInit = function () {
        var video = document.createElement('video');
        this.setStreaming(video);
        var containerVideo = this.elementRef.nativeElement.getElementsByTagName("video-container")[0];
        containerVideo.appendChild(video);
    };
    UpLoadImages.prototype.setSecurity = function (response) {
        this.policy = response.policy;
        this.s3signature = response.signature;
        this.timestamp = response.timestamp;
    };
    UpLoadImages.prototype.fileChange = function (fileInput) {
        var _this = this;
        var reader = new FileReader();
        this.errorMessage = null;
        this.file = null;
        this.isValid = false;
        if (fileInput.target.files.length > 0) {
            this.file = fileInput.target.files[0];
            this.errorMessage = validations_1.Validations.fileSizeValidator(this.file.size, this.MAX_SIZE);
            if (this.errorMessage === null) {
                if (this.s3URL.length > 0) {
                    this.amazonUtilities.deleteS3Objects(this.s3URL).subscribe(function (res) {
                        if (res) {
                            _this.upload();
                        }
                    }, function (error) {
                        _this.clearFile();
                    });
                }
                else {
                    this.upload();
                }
            }
        }
        else {
            if (this.s3URL.length > 0) {
                this.amazonUtilities.deleteS3Objects(this.s3URL).subscribe(function (res) {
                    if (res) {
                        _this.s3URL = '';
                    }
                }, function (error) {
                    _this.clearFile();
                });
            }
            this.clearFile();
        }
        this.imageSelected.emit(this.isValid);
    };
    UpLoadImages.prototype.clearFile = function () {
        this.file = null;
        this.s3URL = '';
        var input = this.elementRef.nativeElement.getElementsByTagName('input')[0];
        input.value = null;
        this.isValid = false;
        this.uploadProgress = 0;
        this.imageSelected.emit(this.isValid);
    };
    UpLoadImages.prototype.setFile = function (url) {
        this.file = null;
        this.s3URL = url;
        var input = this.elementRef.nativeElement.getElementsByTagName('input')[0];
        input.value = null;
        this.isValid = true;
        this.imageSelected.emit(this.isValid);
    };
    UpLoadImages.prototype.upload = function () {
        var _this = this;
        var formData = new FormData();
        var xhr = new XMLHttpRequest();
        xhr.onerror = function (e) {
            _this.clearFile();
            _this.errorMessage = validations_1.Validations.getValidatorErrorMessage('ServiceError');
            console.error("S3 error: " + xhr.statusText);
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status <= 300) {
                    _this.isValid = true;
                    _this.imageSelected.emit(_this.isValid);
                }
                else {
                    _this.clearFile();
                    _this.errorMessage = validations_1.Validations.getValidatorErrorMessage('ServiceError');
                }
            }
        };
        xhr.upload.addEventListener("progress", function (evt) {
            _this.uploadProgress = Math.round((evt.loaded / evt.total) * 100);
        }, false);
        var fileName = this.parameters.type + (this.file.type.split('/')[1] ? '.' + this.file.type.split('/')[1] : '');
        this.key = [this.parameters.rol, this.parameters.userName, this.parameters.context, fileName].join('/');
        this.s3URL = this.bucketURL + this.key;
        //Build AWS S3 Request
        formData.append('key', this.key);
        formData.append('acl', 'public-read-write');
        formData.append('x-amz-meta-uuid', '14365123651274');
        formData.append('x-amz-meta-tag', '');
        //Put in your access key here
        formData.append('X-Amz-Credential', this.accessKeyId + '/' + this.timestamp + '/' + this.region + '/s3/aws4_request');
        formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
        formData.append('X-Amz-Date', this.timestamp + 'T000000Z');
        formData.append('Policy', this.policy);
        formData.append('X-Amz-Signature', this.s3signature);
        formData.append('file', this.file);
        xhr.open('POST', this.bucketURL, true);
        xhr.send(formData);
    };
    UpLoadImages.prototype.fileClick = function (event) {
        if (this.prevent) {
            event.preventDefault();
        }
    };
    UpLoadImages.prototype.showWebCam = function () {
        var currentLocation = window.location.pathname;
        window.location.href = currentLocation + "#webCam";
    };
    UpLoadImages.prototype.hideWebCam = function () {
        var currentLocation = window.location.pathname;
        window.location.href = currentLocation + "#";
    };
    UpLoadImages.prototype.takePhoto = function () {
        var video = this.elementRef.nativeElement.getElementsByTagName('video')[0];
        var canvas = document.createElement('canvas');
        canvas.height = video.offsetHeight;
        canvas.width = video.offsetWidth;
        canvas.getContext("2d").drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
        var containerCanvas = this.elementRef.nativeElement.getElementsByTagName("canvas-container")[0];
        containerCanvas.appendChild(canvas);
        var containerVideo = this.elementRef.nativeElement.getElementsByTagName("video-container")[0];
        containerVideo.removeChild(video);
        this.existPhoto = true;
    };
    UpLoadImages.prototype.removePhoto = function () {
        var containerCanvas = this.elementRef.nativeElement.getElementsByTagName("canvas-container")[0];
        var canvas = this.elementRef.nativeElement.getElementsByTagName("canvas")[0];
        var video = document.createElement('video');
        video.height = canvas.offsetHeight;
        video.width = canvas.offsetWidth;
        this.setStreaming(video);
        var containerVideo = this.elementRef.nativeElement.getElementsByTagName("video-container")[0];
        containerVideo.appendChild(video);
        containerCanvas.removeChild(canvas);
        this.existPhoto = false;
    };
    UpLoadImages.prototype.setStreaming = function (video) {
        var tsNavigator = navigator;
        if (tsNavigator.getUserMedia) {
            tsNavigator.getUserMedia({ video: true }, function (stream) {
                video.src = stream;
                video.play();
            }, function () {
                alert("No Video");
            });
        }
        else if (tsNavigator.webkitGetUserMedia) {
            tsNavigator.webkitGetUserMedia({ video: true }, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            }, function () {
                alert("No Video");
            });
        }
        else if (tsNavigator.mozGetUserMedia) {
            tsNavigator.mozGetUserMedia({ video: true }, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            }, function () {
                alert("No Video");
            });
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', upload_file_parameters_1.UpLoadFileParametersModel)
    ], UpLoadImages.prototype, "parameters", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], UpLoadImages.prototype, "imageSelected", void 0);
    UpLoadImages = __decorate([
        core_1.Component({
            selector: 'upload-images',
            templateUrl: 'components/tasa_upload_images.html',
            providers: [amazonUtilities_1.AmazonUtilities, http_1.HTTP_PROVIDERS],
            pipes: [internationalization_1.I18n]
        }), 
        __metadata('design:paramtypes', [amazonUtilities_1.AmazonUtilities, core_1.ElementRef])
    ], UpLoadImages);
    return UpLoadImages;
}());
exports.UpLoadImages = UpLoadImages;
//# sourceMappingURL=tasa_upload_images.js.map