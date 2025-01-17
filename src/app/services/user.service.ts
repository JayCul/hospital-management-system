import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(payload: any) {
    let params = new HttpParams()
      .set('page', payload.page)
      .set('limit', payload.limit);
  
    if (payload.status !== undefined) {
      params = params.set('status', payload.status); // Add 'status' only if it's defined
    }
  
    return this.http.get(`${environment.userUrl}`, { params });
  }
  
  getUserStats() {  
    return this.http.get(`${environment.userUrl}/stats`);
  }


  getRoleName(value: string): string {
    const roles = [
      { name: 'Admin', value: 'admin' },
      { name: 'Doctor', value: 'doctor' },
      { name: 'Nurse', value: 'nurse' },
      { name: 'Pharmacist', value: 'pharmacist' },
      { name: 'Medical Laboratory Scientist', value: 'medLabScientist' },
      { name: 'User', value: 'user' },
    ];
    
    const role = roles.find(r => r.value === value);
    return role ? role.name : ""; // Return the name if found, otherwise return null
  }
    
  searchUserByText(text: string, payload: any){
    const params = new HttpParams()
    .set('name', text)
    .set('page', payload.page)
    .set('limit', payload.limit);
    

    return this.http.get(`${environment.userUrl}/search-by-name`, {params})

  }

  updateUser(id: string, User: any){
    return this.http.put(`${environment.userUrl}/update/${id}`, User)
  }
}
