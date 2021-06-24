import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadPage } from './pages/upload/upload.page';
import { SegmentPage } from './pages/segment/segment.page';
import { ClassifyPage } from './pages/classify/classify.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/upload',
    pathMatch: 'full'
  },
  {
    path: 'upload',
    component: UploadPage
  },
  {
    path: 'segment',
    component: SegmentPage
  },
  {
    path: 'classify',
    component: ClassifyPage
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
