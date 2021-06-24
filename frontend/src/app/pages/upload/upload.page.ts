import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BackendService } from '../../services/backend.service';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  templateUrl: './upload.page.html'
})
export class UploadPage {

  _image: File;

  constructor(
    public _router: Router,
    public _backendService: BackendService,
    public _sessionStorageService: SessionStorageService
  ) {
    this._image = null;
  }

  onExploreImage(): void {
    var explorer = document.getElementById('imageExplorer') as HTMLInputElement;
    explorer.click();
  }

  onImageChange(file: File): void {
    var type: string[] = file.type.split('/');
    if(type[0] == 'image') {
      console.log(file);
      this._image = file;
      var data: FormData = new FormData();
      data.append('image', this._image);
      this._backendService.uploadImage(data)
      .then((res: any) => {
        if(res.status == 0) {
          this._sessionStorageService.setSize(res.n, res.m);
          this._router.navigateByUrl('/segment');
        }
      });
    }
  }

}
