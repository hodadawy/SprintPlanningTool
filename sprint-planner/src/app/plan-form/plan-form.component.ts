import { Component } from '@angular/core'; 
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { SprintService } from '../plan-service';
import { formatDate } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
// Adjust the path as needed 
@Component({ 
  selector: 'app-plan-form', 
  templateUrl: './plan-form.component.html', 
  styleUrls: ['./plan-form.component.css']

}) 
  export class PlanFormComponent { 
    planForm: FormGroup; 
    days: number[] = Array.from({length: this.sprintDuration}, (_, i) => i+ 1);
    result: any[] = [];
    startDate: string =  this.getCurrentDate(); 
    readonly date = new FormControl(new Date());
    developerNames: string = ''; 
    developers: number[] = []; 
    isCollapsed = false;

    constructor(private fb: FormBuilder, 
      private planService: SprintService) { 
        this.planForm = this.fb.group({
           num_developers: [3, [Validators.required, Validators.min(1)]], 
           sprint_duration: [10, [Validators.required, Validators.min(1)]], 
           tickets: this.fb.array([]) }); // Initialize with at least one ticket form
           this.addTicket(); 
      } 

      get num_of_devs(): any {
        return this.planForm.get('num_developers')?.value;
      }
    
      set num_of_devs(value: any) {
        if(this.planForm){
          const oldValue = this.planForm.get('num_developers')?.value;
          if(value != oldValue){
            this.planForm.get('num_developers')?.setValue(value);
          }
        }
      }

      
      get sprintDuration(): any {
        if(this.planForm)
          return this.planForm.get('sprint_duration')?.value;
      }
    
      set sprintDuration(value: any) {
        if(this.planForm )
        {
          const oldValue = this.planForm.get('sprint_duration')?.value;
          if(value != oldValue){
            this.planForm.get('sprint_duration')?.setValue(value);
          }
        }
        this.days = Array.from({length: value}, (_, i) => i+ 1);
      }

      get tickets() {
         return this.planForm.get('tickets') as FormArray; 
      } 
      addTicket() { 
        const ticketForm = this.fb.group({ 
          id: ['', Validators.required],
          days: ['', [Validators.required, Validators.min(1)]], 
          priority: ['', [Validators.required, Validators.min(1)]] });
        this.tickets.push(ticketForm);
      } 
      
      removeTicket(index: number) { 
        this.tickets.removeAt(index);
      }
      
      onSubmit() { 
        if (this.planForm.valid) {
           this.planService.planSprint(this.planForm.value).subscribe(response => { 
            this.result = response.sprints;
            console.log(response); 
          }, 
          error => { console.error('Error:', error); }); 
      }
    
    } 

    getDeveloperLabel(dev: number): string {
      if(this.developerNames.length > 0) {
        const names = this.developerNames.split(',');
        if(dev < names.length)
          return names[dev] ;
      } 
      
      return `Developer ${dev + 1}`;

    }

    getDateInSprint(n: number, m: number): string {
      if(this.startDate){
        const startDate = new Date(this.startDate);
        const sprintStartDate = this.getSprintStartDate(startDate, m);
        const desiredDate = this.addWorkingDays(sprintStartDate, n - 1);
        return formatDate(desiredDate, 'dd MMM yyyy', 'en-US');
      } else {
         return n.toString();
      }
    }
  
    // Function to calculate the start date of the mth sprint
    private getSprintStartDate(startDate: Date, sprintNumber: number): Date {
      const daysBetweenSprints = (sprintNumber - 1) * this.sprintDuration;
      const sprintStartDate = new Date(startDate);
      sprintStartDate.setDate(sprintStartDate.getDate() + daysBetweenSprints);
      return sprintStartDate;
    }
  
    // Function to add working days to a given date
    private addWorkingDays(startDate: Date, days: number): Date {
      let resultDate = new Date(startDate);
      while (days > 0) {
        resultDate.setDate(resultDate.getDate() + 1);
        if (resultDate.getDay() !== 0 && resultDate.getDay() !== 6) { // Exclude weekends (0 = Sunday, 6 = Saturday)
          days--;
        }
      }
      return resultDate;
    }


    getDevelopers(sprint: any): number[] { 
      console.log(sprint)
      if (sprint && sprint.length) { 
        return Array.from(new Set(sprint.map((t:any) => t.developer)));
       } 
       
       return []; 
    } 
    
    getDeveloperTasks(sprint: any, developer: number): any[] { 
      return sprint.filter((task:any) => task.developer === developer);
    
    }

    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    }

    getDeliveryDate() : any {
      if (!this.startDate || !this.result || this.result.length <= 0) {
        return ''
      }
  
      let lastSprintEndDate = this.calculateSprintEndDate();
  
      return this.addBusinessDays(lastSprintEndDate, 0);
    }
  
    calculateSprintEndDate(): Date {
      let currentDate = new Date(this.startDate);
      let sprintEndDate = new Date(currentDate);
  
      for (let i = 0; i < this.result.length; i++) {
        sprintEndDate = this.addBusinessDays(sprintEndDate, this.sprintDuration);
      }
  
      return sprintEndDate;
    }
  
    addBusinessDays(date: Date, days: number): Date {
      let result = new Date(date);
      let addedDays = 0;
  
      while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0 && result.getDay() !== 6) {
          addedDays++;
        }
      }
  
      return result;
    }

    getCurrentDate(): string {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }

    getUniqueDevelopersCount(): number {
      const uniqueDevs = new Set<number>();
      this.result.forEach(sprint => {
        sprint.tasks.forEach((task:any) => uniqueDevs.add(task.developer));
      });
      return uniqueDevs.size;
    }

    getLeftTimeline(item: any): any{
      return (item.start_day - 1) / this.sprintDuration * 100 + '%';
    }

    getWidthTimeline(item: any): any{
      return (item.end_day - item.start_day + 1)/ this.sprintDuration * 100 + '%';
    }

  
  }
