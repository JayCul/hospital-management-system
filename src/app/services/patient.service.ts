import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
// import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient, ) { }

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
    if (payload.page !== undefined && payload.page !== undefined) {
      params = params.set('page', payload.page).set('limit', payload.limit)
    }
    console.log(params)
    
    // if (payload.name !== "") {
    //   params = params.set('name', payload.name); // Add 'status' only if it's defined
    // }
      return this.http.get(`${environment.patientUrl}/search-by-name`, { params });
    }

  listAllPatients(){
    return this.http.get(`${environment.patientUrl}/list-names`);
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
    const headers = { 'Content-Type': 'application/json' }
    return this.http.put(`${environment.patientUrl}/${id}`, patientData, {headers});
  }
  
  admitPatient(id: string, patientData: any){
    const headers = { 'Content-Type': 'application/json' }
    return this.http.post(`${environment.patientUrl}/${id}/register-returning`, patientData, {headers});
  }
  
  assignDoctor(id: string, body: any){
    const headers = { 'Content-Type': 'application/json' }
    // const {doctorId, additionalRemarks} = body
    return this.http.post(`${environment.patientUrl}/${id}/to-doctor`, body, {headers});
  }
  
  assignNurse(id: string, nurseId: string){
    const headers = { 'Content-Type': 'application/json' }
    const body = {}
    return this.http.post(`${environment.patientUrl}/${id}/to-nurse`, nurseId, {headers});
  }
  
  assignScientist(id: string, mlsId: string){
    const headers = { 'Content-Type': 'application/json' }
    return this.http.post(`${environment.patientUrl}/${id}/to-lab`, mlsId, {headers});
  }
  
  sendResults(id: string, doctorId: string, labResult: string){
    const headers = { 'Content-Type': 'application/json' }
    const body = {doctorId, labResult}
    return this.http.post(`${environment.patientUrl}/${id}/after-lab`, body, {headers});
  }
  
  prescribe(pharmacistId: string, prescription: any){
    const headers = { 'Content-Type': 'application/json' }
    const id = prescription.patient;
    const body = {pharmacistId, prescription}
    return this.http.post(`${environment.patientUrl}/${id}/prescribe`, body, {headers});
  }
  
  discharge(id: string){
    const headers = { 'Content-Type': 'application/json' }
    return this.http.post(`${environment.patientUrl}/${id}/discharge`, {headers});
  }


}
