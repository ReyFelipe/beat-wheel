import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InstrumentService {

  constructor() { }
  private http = inject(HttpClient);
  private baseURL = environment.apiURL;

  public get(): Observable<any> {
    return this.http.get(this.baseURL  + '/get-instruments');
  }

}
