import { Component } from '@angular/core'; 
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { SprintService } from '../plan-service';
// Adjust the path as needed 
@Component({ 
  selector: 'app-plan-form', 
  templateUrl: './plan-form.component.html', 
  styleUrls: ['./plan-form.component.css'] }) 
  export class PlanFormComponent { 
    planForm: FormGroup; 
    days: number[] = Array.from({length: 10}, (_, i) => i+ 1);
    result: any;
    
    constructor(private fb: FormBuilder, 
      private planService: SprintService) { 
        this.planForm = this.fb.group({
           num_developers: [3, [Validators.required, Validators.min(1)]], 
           tickets: this.fb.array([]) }); // Initialize with at least one ticket form
           this.addTicket(); 
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
            this.result = response;
            console.log(response); 
          }, 
          error => { console.error('Error:', error); }); 
      }
    
    } 

    getDevelopers(): number[] { 
      console.log(this.result)
      if (this.result && this.result.length) { 
        return Array.from(new Set(this.result.map((t:any) => t.developer)));
       } 
       
       return []; 
    } 
    
    getDeveloperTasks(developer: number): any[] { 
      return this.result.filter((task:any) => task.developer === developer);
    
    }

  
  }
