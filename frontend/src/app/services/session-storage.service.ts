import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor(
    
  ) {

  }

  public setSize(n: number, m: number): void {
    sessionStorage.setItem('n', n.toString());
    sessionStorage.setItem('m', m.toString());
  }

  public getSize(): number[] {
    var n: number = Number.parseInt(sessionStorage.getItem('n'));
    var m: number  = Number.parseInt(sessionStorage.getItem('m'));
    return [n, m];
  }

}
