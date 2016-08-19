import {Component, Input} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';
import { I18n } from '../utilities/pipes/internationalization';

@Component({
  selector: 'tasa-video',
  templateUrl: 'components/tasa_video.html',
  pipes: [I18n]
})
export class Video {
  
  isShow = false
  
  @Input()
  url: string;
  private videoUrl: SafeResourceUrl;
  constructor(private sanitationService:DomSanitizationService) {
    this.videoUrl = sanitationService.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/kuL7VmuqTVY");
  }
  
  showVideo(){
    this.isShow = true;
  }

  close(){
    this.isShow = false;
  }
}