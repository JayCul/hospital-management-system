import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(private http: HttpClient) { }

  getStats(){
    return this.http.get(`${environment.prescriptionUrl}/stats`);
  }

  getPrescription(payload: any){
    let params = new HttpParams().set('page', payload.page).set('limit', payload.limit)

    if(payload.status !== undefined){
      params = params.set('stats', payload.status)
    }
    console.log(params)
    
    return this.http.get(`${environment.prescriptionUrl}`, {params})
  }
  
  findById(id: string){
    return this.http.get(`${environment.prescriptionUrl}/${id}`);
  }
  
  searchByPrescriptionId(id: string, payload: any){
    let params = new HttpParams().set('page', payload.page).set('limit', payload.limit).set('text', id)
    return this.http.get(`${environment.prescriptionUrl}/search`, {params})
  }


}
