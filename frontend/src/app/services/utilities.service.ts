import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(
    private domSanitizer: DomSanitizer 
  ) {

  }

  imageUrl(data: any): string {
    var buffer: Uint8Array = new Uint8Array(data);
    var stringBuffer: string = buffer.reduce((data, byte) => { return data + String.fromCharCode(byte); }, '');
    var base64: string = btoa(stringBuffer);
    return 'data:image/png;base64,' + base64;
  }

}
