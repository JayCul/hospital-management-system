import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  getPatients(payload:any){
    let params = new HttpParams()
        .set('page', payload.page)
        .set('limit', payload.limit);
    
    if (payload.status !== undefined) {
      params = params.set('status', payload.status); // Add 'status' only if it's defined
    }
    
    return this.http.get(`${environment.patientUrl}`, { params });
  }
  
  
  searchPatientByName( name: string, payload:any){
    let params = new HttpParams()
    .set('name', name)
    .set('page', payload.page)
    .set('limit', payload.limit)

    console.log(params)
    
    // if (payload.name !== "") {
    //   params = params.set('name', payload.name); // Add 'status' only if it's defined
    // }
      return this.http.get(`${environment.patientUrl}/search-by-name`, { params });
    }

  addPatient(body: any){
    // body = JSON.stringify(body);
    console.log(body);
    return this.http.post(`${environment.patientUrl}/new`, body);
  }
 
  getPatientById(id: any){
    return this.http.get(`${environment.patientUrl}/${id}`);
  }

  updatePatient(id: string, patientData: any){
    const body = JSON.stringify(patientData);
    return this.http.put(`${environment.patientUrl}/${id}/update`, body);
  }
}
