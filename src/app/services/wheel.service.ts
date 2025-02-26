import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WheelService {

    constructor() { }
    private http = inject(HttpClient);
    private baseURL = environment.apiURL;
  
    public getWheels(): Observable<any> {
      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')})
      return this.http.get(this.baseURL + '/api/get-wheels', { headers: reqHeader });
    }

    public getWheel(id:string): Observable<any> {
      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')})
      return this.http.get(this.baseURL + '/api/get-wheel/' + id, { headers: reqHeader });
    }
    
    public createWheel(wheelModel:any) {
      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')})
      return this.http.post(this.baseURL + '/api/create-wheel', wheelModel, { headers: reqHeader });
    }

    public updateWheel(wheelModel:any) {
      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')})
      return this.http.put(this.baseURL + '/api/update-wheel/' + wheelModel.Id, wheelModel, { headers: reqHeader });
    }

    public deleteWheel(id:string) {
      const reqHeader = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')})
      return this.http.delete(this.baseURL + '/api/delete-wheel/' + id, { headers: reqHeader });
    }
}
