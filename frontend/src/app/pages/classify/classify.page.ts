import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BackendService } from '../../services/backend.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  templateUrl: './classify.page.html'
})
export class ClassifyPage {

  _class: number;
  _imageUrl: string;

  constructor(
    public _router: Router,
    public _backendService: BackendService,
    public _utilitiesService: UtilitiesService
  ) {
    this._class = null;
    this._imageUrl = null;
    this.classify();
  }

  classify(): void {
    this._backendService.classify()
    .then((res: any) => {
      if(res.status == 0) {
        this._class = res.class;
        this.loadImage();
      }
    });
  }

  loadImage(): void {
    this._backendService.loadResult()
    .then((res: any) => {
      if(res.status == 0) {
        this._imageUrl = this._utilitiesService.imageUrl(res.image.data);
      }
    });
  }

}
