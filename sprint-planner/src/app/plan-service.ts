import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
 import { Observable } from 'rxjs';
  @Injectable({ providedIn: 'root' }) 
  export class SprintService { 
    private apiUrl = 'http://192.168.4.1/plan'; 
    constructor(private http: HttpClient) { } 
    
    planSprint(data: any): Observable<any> { 
        return this.http.post<any>(this.apiUrl, data);
    }
 }