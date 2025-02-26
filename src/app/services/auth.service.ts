import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
  private http = inject(HttpClient);
  private baseURL = environment.apiURL;

  public createUser(formData:any) {
    return this.http.post(this.baseURL + '/api/signup', formData);
  }

  public signIn(formData:any) {
    return this.http.post(this.baseURL + '/api/signin', formData);
  }

  

}
