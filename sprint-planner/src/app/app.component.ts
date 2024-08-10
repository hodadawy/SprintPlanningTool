import { Component } from '@angular/core'; 
import { SprintService } from './plan-service'; 
@Component({ 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] })
  
export class AppComponent { 
  numDevelopers = 3; 
  tickets = [ 
    { id: 1, days: 3, priority: 1 }, 
    { id: 2, days: 5, priority: 2 }, 
    { id: 3, days: 2, priority: 3 } ];
  sprintTimeline: any; 
  
  constructor(private sprintService: SprintService) {} 
  
  // submitPlan() { 
  //   this.sprintService.planSprint(this.numDevelopers, this.tickets)
  //   .subscribe(response => { this.sprintTimeline = response; }, 
  //     error => { console.error('Error:', error); }); 
  // } 

}
