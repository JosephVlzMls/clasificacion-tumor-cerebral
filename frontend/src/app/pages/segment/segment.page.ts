import { Component } from '@angular/core';
import { Router } from '@angular/router'

import { BackendService } from '../../services/backend.service';
import { UtilitiesService } from '../../services/utilities.service';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  templateUrl: './segment.page.html',
  styleUrls: ['./segment.page.css']
})
export class SegmentPage {

  _view: number;
  _size: number;
  _mode: boolean;
  _edit: boolean;
  _mask: number[][];
  _backup: number[][];

  _canvas: any;
  _urlROI: string;

  xtemp: number = 0;
  ytemp: number = 0;

  _maskLineX: number[];
  _maskLineY: number[]; 

  constructor(
    public _router: Router,
    public _backendService: BackendService,
    public _utilitiesService: UtilitiesService,
    public _sessionStorageService: SessionStorageService
  ) {
    this._view = 1;
    this._size = 1;
    this._mode = true;
    this._edit = false;
    this._mask = null;
    this._urlROI = null;
    this._maskLineX = null;
    this._maskLineY = null;
    this.loadImage();
  }

  loadImage(): void {
    this._backendService.loadImage()
    .then((res: any) => {
      if(res.status == 0) {
        var image = new Image();
        image.src = this._utilitiesService.imageUrl(res.image.data);

        this._canvas = document.getElementById('image') as any;
        var [n, m] = this._sessionStorageService.getSize();            
        [this._canvas.height, this._canvas.width] = [n, m];
        console.log("Image 1: ", image);
        this._canvas.getContext('2d').drawImage(image, 0, 0);
        this._mask = Array(n).fill(0).map((a) => { return Array(m).fill(0); });  
        this._backup = Array(n).fill(0).map((a) => { return Array(m).fill(-1); });  

        /*
        var url = this._utilitiesService.imageUrl(res.image.data);        
        var base64 = url.substring(22);
        var stringBuffer = atob(base64);
        var buffer: any = Array.from(stringBuffer).map(function(x) { return x.charCodeAt(0); });
        console.log(buffer);

        var png =  new File(buffer, 'mask.png', {type: "image/png"});
        console.log(png);
        
        var data: FormData = new FormData();
        data.append('mask', png);
        this._backendService.uploadMask(data)
        .then((res: any) => {
          console.log(res);
        });
        */
        
      }
    });
  }

  onMaskChange(file: File): void {
    var type: string[] = file.type.split('/');
    if(type[0] == 'image') {

    }
  }

  onMouseDown(event: any): void {
    this._edit = true
    this.onMouseMove(event);
    /*
    var bouding = this._canvas.getBoundingClientRect();
    var x = Number.parseInt((event.clientX - bouding.left).toString());
    var y = Number.parseInt((event.clientY - bouding.top).toString());
    this.xtemp = x;
    this.ytemp = y;
    */
  }

  onMouseUp(): void {
    this._edit = false;
    /*
    this._backendService.uploadMask(this._mask)
    .then((res: any) => {
      console.log(res);
    });
    */
  }

  onMouseMove(event: any): void {
    if(this._edit) {
      var bouding = this._canvas.getBoundingClientRect();
      var offset = (this._size - 1) / 2;
      var x = Number.parseInt((event.clientX - bouding.left).toString()) - offset;
      var y = Number.parseInt((event.clientY - bouding.top).toString()) - offset;

      if(this._mode == true) this.draw(x, y);
      else this.erase(x, y);

      //this._maskLineX.push(x);
      //this._maskLineY.push(y);
      /*
      ///////// linea recta ////////////////////  
      canvas.getContext('2d').beginPath();
      canvas.getContext('2d').strokeStyle = 'red';
      canvas.getContext('2d').lineWidth = this._size;
      canvas.getContext('2d').moveTo(this.xtemp, this.ytemp);
      canvas.getContext('2d').lineTo(x, y);
      canvas.getContext('2d').stroke();
      canvas.getContext('2d').closePath();
      this.xtemp = x;
      this.ytemp = y;
      */
    }
  }

  draw(x: number, y: number): void {
    for(var i = 0; i < this._size; ++i) {
      for(var j = 0; j < this._size; ++j) {
        this._backup[y+i][x+j] = this.getPixel(x+j, y+i);
        this._mask[y+i][x+j] = 1;
      }
    }
    this._canvas.getContext('2d').fillStyle = 'red';
    this._canvas.getContext('2d').fillRect(x, y, this._size, this._size);
  }

  erase(x: number, y: number): void {
    for(var i = 0; i < this._size; ++i) {
      for(var j = 0; j < this._size; ++j) {
        this._mask[y+i][x+j] = 0;
        var pixel = this.getPixel(x+j, y+i);
        this._canvas.getContext('2d').fillStyle = `rgb(${pixel}, ${pixel}, ${pixel})`;
        this._canvas.getContext('2d').fillRect(x+j, y+i, 1, 1);
      }
    }
  }

  getPixel(x: number, y: number): any {
    var rgba = this._canvas.getContext('2d').getImageData(x, y, 1, 1).data;
    return rgba[0] == rgba[1] ? rgba[0] : this._backup[y][x];
  }

  onClassify(): void {
    this._backendService.uploadMask(this._mask)
    .then((res: any) => {
      if(res.status == 0) {
        this._router.navigateByUrl('/classify');
      }
    });
  }

  onLoadROI(): void {
    this._urlROI = null;
    this._backendService.uploadMask(this._mask)
    .then((res: any) => {
      if(res.status == 0) {
        this._backendService.loadROI()
        .then((res: any) => {
          if(res.status == 0) {
            this._view = 2;
            this._urlROI = this._utilitiesService.imageUrl(res.image.data);
          }
        });
      }
    });
  }

}
