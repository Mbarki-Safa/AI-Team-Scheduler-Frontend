import { Component } from '@angular/core';

interface TimeSlot {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface WorkingDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface UserPreferences {

  workingDays: WorkingDays;
  holidays: string[];
  workingTimeSlots: TimeSlot[];
}
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent {
  preferences: UserPreferences = {   
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    holidays: [], // Now explicitly defined as string[]
    workingTimeSlots: [
      { id: 1, dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00' }
    ]
  };
  
  newHoliday: string = '';
  newTimeSlot = {
    dayOfWeek: 'monday',
    startTime: '09:00',
    endTime: '17:00'
  };
  
  daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];
  
  addHoliday(): void {
    if (this.newHoliday && !this.preferences.holidays.includes(this.newHoliday)) {
      this.preferences.holidays.push(this.newHoliday);
      this.newHoliday = '';
    }
  }
  
  removeHoliday(holiday: string): void {
    this.preferences.holidays = this.preferences.holidays.filter(h => h !== holiday);
  }
  
  addTimeSlot(): void {
    const newId = this.preferences.workingTimeSlots.length > 0 ? 
      Math.max(...this.preferences.workingTimeSlots.map(slot => slot.id)) + 1 : 1;
    
    this.preferences.workingTimeSlots.push({
      id: newId,
      dayOfWeek: this.newTimeSlot.dayOfWeek,
      startTime: this.newTimeSlot.startTime,
      endTime: this.newTimeSlot.endTime
    });
  }
  
  removeTimeSlot(id: number): void {
    this.preferences.workingTimeSlots = this.preferences.workingTimeSlots.filter(slot => slot.id !== id);
  }
  
  savePreferences(): void {
    // Logic to save preferences would go here
    console.log('Saving preferences:', this.preferences);
    alert('Preferences saved successfully!');
  }

  isWorkingDay(day: string): boolean {
    return this.preferences.workingDays[day as keyof WorkingDays];
  }
  
  setWorkingDay(day: string, value: boolean): void {
    this.preferences.workingDays[day as keyof WorkingDays] = value;
  }
  
}
