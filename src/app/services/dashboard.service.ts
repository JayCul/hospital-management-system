import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  fetchDashboardData(){
    return this.http.get(`${environment.dashboardUrl}`)
  }
  
  fetchGeneralStatistics(){
    return this.http.get(`${environment.dashboardUrl}/data`)

  }
}
