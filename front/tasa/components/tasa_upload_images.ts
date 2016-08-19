import { Component, Input, Output, EventEmitter, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import { AmazonUtilities } from '../services/amazonUtilities';

import { I18n } from '../utilities/pipes/internationalization'
import { Validations } from '../utilities/validations';

import { UpLoadFileParametersModel } from '../models/upload_file_parameters'

@Component({
  selector: 'upload-images',
  templateUrl: 'components/tasa_upload_images.html',
  providers: [AmazonUtilities, HTTP_PROVIDERS],
  pipes: [I18n]
})

export class UpLoadImages implements OnInit, AfterViewInit {
  @Input()
  parameters: UpLoadFileParametersModel;

  @Output()
  imageSelected = new EventEmitter<boolean>();

  //Para Validar el tamaño se tomo el kilo = 1024, 8388608 Bytes en 1Mb * 10 = 83886080
  private MAX_SIZE: number = 10485760;
  prevent: boolean = false;
  errorMessage = null;
  isValid: boolean = false;
  file: File
  s3URL: string;
  existPhoto: boolean;
  //Amazon
  accessKeyId: string;
  region: string;
  policy: string;
  s3signature: string;
  uploadProgress: number;
  timestamp: string;
  bucketURL: string;
  key: string;

  constructor(private amazonUtilities: AmazonUtilities, private elementRef: ElementRef) {
    this.accessKeyId = "AKIAJBRKBNUYNAO35WFA";
    this.region = "us-east-1";
    this.uploadProgress = 0;
    this.bucketURL = 'http://latasa.s3.amazonaws.com/';
    this.isValid = false;
    this.existPhoto = false;
  }

  ngOnInit() {
    this.amazonUtilities.getS3Credentials().subscribe(response => this.setSecurity(response));
    if (this.parameters.s3URL.length > 0) {
      this.setFile(this.parameters.s3URL);
    } else {
      this.s3URL = this.parameters.s3URL;
    }
    this.showWebCam();
  }
  ngAfterViewInit(){
    let video = document.createElement('video');
    this.setStreaming(video);
    let containerVideo = this.elementRef.nativeElement.getElementsByTagName("video-container")[0];
    containerVideo.appendChild(video);
  }
  setSecurity(response) {
    this.policy = response.policy;
    this.s3signature = response.signature;
    this.timestamp = response.timestamp;
  }

  fileChange(fileInput: any) {
    var reader = new FileReader();
    this.errorMessage = null;
    this.file = null;
    this.isValid = false;

    if (fileInput.target.files.length > 0) {
      this.file = fileInput.target.files[0];
      this.errorMessage = Validations.fileSizeValidator(this.file.size, this.MAX_SIZE);
      if (this.errorMessage === null) {
        if (this.s3URL.length > 0) {
          this.amazonUtilities.deleteS3Objects(this.s3URL).subscribe(res => {
            if (res) {
              this.upload();
            }
          },
            error => {
              this.clearFile();
            }
          );
        } else {
          this.upload();
        }
      }

    } else {
      if (this.s3URL.length > 0) {
        this.amazonUtilities.deleteS3Objects(this.s3URL).subscribe(res => {
          if (res) {
            this.s3URL = '';
          }
        },
          error => {
            this.clearFile();
          }
        );
      }
      this.clearFile();
    }
    this.imageSelected.emit(this.isValid);
  }

  clearFile() {
    this.file = null;
    this.s3URL = '';
    let input = this.elementRef.nativeElement.getElementsByTagName('input')[0];
    input.value = null;
    this.isValid = false;
    this.uploadProgress = 0;
    this.imageSelected.emit(this.isValid);
  }

  setFile(url: string) {
    this.file = null;
    this.s3URL = url;
    let input = this.elementRef.nativeElement.getElementsByTagName('input')[0];
    input.value = null;
    this.isValid = true;
    this.imageSelected.emit(this.isValid);
  }

  upload() {
    let formData: FormData = new FormData();
    let xhr: XMLHttpRequest = new XMLHttpRequest();

    xhr.onerror = (e) => {
      this.clearFile();
      this.errorMessage = Validations.getValidatorErrorMessage('ServiceError');
      console.error("S3 error: " + xhr.statusText);

    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status <= 300) {
          this.isValid = true;
          this.imageSelected.emit(this.isValid);
        } else {
          this.clearFile();
          this.errorMessage = Validations.getValidatorErrorMessage('ServiceError');
        }

      }
    }

    xhr.upload.addEventListener("progress", (evt: any) => {
      this.uploadProgress = Math.round((evt.loaded / evt.total) * 100);
    }, false);

    let fileName = this.parameters.type + (this.file.type.split('/')[1] ? '.' + this.file.type.split('/')[1] : '');
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
  }

  fileClick(event: any) {
    if (this.prevent) {
      event.preventDefault();
    }
  }

  showWebCam(){
	  var currentLocation = window.location.pathname;
	  window.location.href = currentLocation + "#webCam";
  }

  hideWebCam(){
	  var currentLocation = window.location.pathname;
	  window.location.href = currentLocation + "#";
  }

  takePhoto(){
    let video = this.elementRef.nativeElement.getElementsByTagName('video')[0];
    let canvas = document.createElement('canvas');
    canvas.height = video.offsetHeight;
    canvas.width = video.offsetWidth;
    canvas.getContext("2d").drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);

    let containerCanvas = this.elementRef.nativeElement.getElementsByTagName("canvas-container")[0];
    containerCanvas.appendChild(canvas);

    let containerVideo = this.elementRef.nativeElement.getElementsByTagName("video-container")[0];
    containerVideo.removeChild(video);
    
    this.existPhoto = true;
  }

  removePhoto(){
    let containerCanvas = this.elementRef.nativeElement.getElementsByTagName("canvas-container")[0];
    let canvas = this.elementRef.nativeElement.getElementsByTagName("canvas")[0];
    
    let video = document.createElement('video');
    video.height = canvas.offsetHeight;
    video.width = canvas.offsetWidth;
    this.setStreaming(video);
    

    let containerVideo = this.elementRef.nativeElement.getElementsByTagName("video-container")[0];
    containerVideo.appendChild(video);

    containerCanvas.removeChild(canvas);

    this.existPhoto = false;
  }

  setStreaming(video: any){
    let tsNavigator = <any>navigator;
    if(tsNavigator.getUserMedia) { // Standard
				tsNavigator.getUserMedia({video: true}, function(stream) {
					video.src = stream;
					video.play();
				}, () => {
          alert("No Video");
        });
			} else if(tsNavigator.webkitGetUserMedia) { // WebKit-prefixed
				tsNavigator.webkitGetUserMedia({video: true}, function(stream){
					video.src = window.URL.createObjectURL(stream);
					video.play();
				}, () => {
          alert("No Video");
        });
			} else if(tsNavigator.mozGetUserMedia) { // WebKit-prefixed
				tsNavigator.mozGetUserMedia({video: true}, function(stream){
					video.src = window.URL.createObjectURL(stream);
					video.play();
				}, () => {
          alert("No Video");
        });
			}
  }
}