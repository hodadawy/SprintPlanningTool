import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
 import { Observable } from 'rxjs';
  @Injectable({ providedIn: 'root' }) 
  export class SprintService { 
    private apiUrl = 'http://127.0.0.1:5000/plan'; 
    constructor(private http: HttpClient) { } 
    
    planSprint(data: any): Observable<any> { 
        return this.http.post<any>(this.apiUrl, data);
    }
 }