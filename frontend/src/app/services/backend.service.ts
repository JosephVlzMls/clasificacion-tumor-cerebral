import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private url: string = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) {
    
  }

  public uploadImage(data: FormData): Promise<any> {
    return this.http.post(`${this.url}/uploadImage`, data).toPromise()
    .then((res: any) => res)
    .catch((error) => null);
  }

  public uploadMask(mask: number[][]): Promise<any> {
    var str = mask.map((a) => { return a.join(''); }).join(';');
    var data: FormData = new FormData();
    data.append('mask', str);
    return this.http.post(`${this.url}/uploadMask`, data).toPromise()
    .then((res: any) => res)
    .catch((error) => null);
  }

  public loadImage(): Promise<any> {
    return this.http.get(`${this.url}/loadImage`).toPromise()
    .then((res: any) => res)
    .catch((error) => null);
  }

  public loadROI(): Promise<any> {
    return this.http.get(`${this.url}/loadROI`).toPromise()
    .then((res: any) => res)
    .catch((error) => null);
  }

  public loadResult(): Promise<any> {
    return this.http.get(`${this.url}/loadResult`).toPromise()
    .then((res: any) => res)
    .catch((error) => null);
  }

  public classify(): Promise<any> {
    return this.http.get(`${this.url}/classify`).toPromise()
    .then((res: any) => res)
    .catch((error) => null);
  }

}
