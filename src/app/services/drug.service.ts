import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DrugService {

  constructor(private http: HttpClient) { }

  getDrugs(payload?: any) {
  
    if (payload){
      const params = new HttpParams()
        .set('page', payload.page)
        .set('limit', payload.limit);
        return this.http.get(`${environment.drugUrl}`, {params})
      }
      
      return this.http.get(`${environment.drugUrl}`)
    }
    
  searchDrugByText(text: string, payload: any){
    const params = new HttpParams()
    .set('name', text)
    .set('page', payload.page)
    .set('limit', payload.limit);
    

    return this.http.get(`${environment.drugUrl}/search-by-name`, {params})

  }

  updateDrug(id: string, drug: any){
    return this.http.put(`${environment.drugUrl}/update/${id}`, drug)
  }
}
