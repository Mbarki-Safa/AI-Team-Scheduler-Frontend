import { Component, OnInit } from '@angular/core';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  startTime?: string; // Format: "HH:MM"
  endTime?: string;   // Format: "HH:MM"
  color: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  selectedDate = new Date();
  
  daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  calendarDays: any[] = [];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  viewMode = 'month'; // 'day', 'week', 'month'
  
  // Updated events with start and end times
  events: CalendarEvent[] = [
    { id: 1, title: 'Conference', date: '2024-10-03', startTime: '09:00', endTime: '12:00', color: '#b8c2ff' },
    { id: 2, title: 'Meeting', date: '2024-10-16', startTime: '14:30', endTime: '15:30', color: '#ffc2e0' },
    { id: 3, title: 'Team Building', date: '2024-10-20', startTime: '10:00', endTime: '18:00', color: '#ffe2c2' },
    { id: 4, title: 'Meeting With Client', date: '2024-10-25', startTime: '13:00', endTime: '14:30', color: '#c2d8ff' }
  ];
  
  // For week view
  weekDays: any[] = [];
  // For day view
  dayHours: string[] = [];
  // Time slots - now with 15-minute intervals instead of 5-minute
  dayHoursWithSlots: { hour: string; slots: { time: string; label: string }[] }[] = [];
  
  constructor() { 
    // Generate hours for day view
    for (let i = 0; i < 24; i++) {
      this.dayHours.push(i < 10 ? `0${i}:00` : `${i}:00`);
    }
  }
  
  ngOnInit(): void {
    this.generateCalendarDays();
    this.generateWeekDays();
    this.generateHoursWithSlots();

    if (this.viewMode === 'day') {
      setTimeout(() => this.scrollToCurrentTime(), 0);
    }
  }

  // 5 minutes slots 
  generateHoursWithSlots(): void {
    this.dayHoursWithSlots = [];
    
    // For each hour
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}` : `${i}`;
      const slots = [];
      
      // Generate 12 five-minute slots per hour
      for (let minute = 0; minute < 60; minute += 5) {
        const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
        slots.push({
          time: `${hour}:${minuteStr}`,
          // Use the full time format HH:MM instead of just minutes
          label: `${hour}:${minuteStr}`
        });
      }
      
      this.dayHoursWithSlots.push({
        hour: `${hour}:00`,
        slots: slots
      });
    }
  }

  generateCalendarDays(): void {
    this.calendarDays = [];
    
    // Current month's days
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    // Previous month's days needed to fill first row
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();
    
    // Add previous month's days
    for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
      this.calendarDays.push({
        day: i,
        month: this.currentMonth - 1,
        year: this.currentYear,
        isCurrentMonth: false
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({
        day: i,
        month: this.currentMonth,
        year: this.currentYear,
        isCurrentMonth: true
      });
    }
    
    // Add next month's days to complete the calendar
    const totalDaysAdded = firstDay + daysInMonth;
    const daysNeeded = Math.ceil(totalDaysAdded / 7) * 7;
    
    let nextMonthDay = 1;
    while (this.calendarDays.length < daysNeeded) {
      this.calendarDays.push({
        day: nextMonthDay++,
        month: this.currentMonth + 1,
        year: this.currentYear,
        isCurrentMonth: false
      });
    }
  }
  
  generateWeekDays(): void {
    this.weekDays = [];
    // Use selectedDate for week generation
    const startOfWeek = new Date(this.selectedDate);
    // Adjust to get Sunday as the first day of the week
    startOfWeek.setDate(this.selectedDate.getDate() - this.selectedDate.getDay());
    
    // Create 7 days for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      this.weekDays.push({
        date: date,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: date.getMonth() === this.currentMonth,
        isToday: this.isToday(date)
      });
    }
  }
  
  isToday(date: Date): boolean {
    return date.getDate() === this.today.getDate() && 
           date.getMonth() === this.today.getMonth() && 
           date.getFullYear() === this.today.getFullYear();
  }
  
  getEventsForDay(day: number, month: number, year: number): CalendarEvent[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return this.events.filter(event => event.date === dateStr);
  }
  
  getEventsForDate(date: Date): CalendarEvent[] {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return this.events.filter(event => event.date === dateStr);
  }

  // Calculate event position and height based on time
  calculateEventStyle(event: CalendarEvent): any {
    if (!event.startTime || !event.endTime) {
      return { top: '0', height: 'auto' };
    }
    
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    
    // Calculate top position (60px per hour)
    const topPosition = (startHour * 60) + startMinute;
    
    // Calculate duration in minutes
    const durationMinutes = ((endHour * 60) + endMinute) - ((startHour * 60) + startMinute);
    
    // Height is based on duration (1px per minute)
    return {
      top: `${topPosition}px`,
      height: `${durationMinutes}px`
    };
  }
  
  // Updated to work with 15-minute intervals
  calculateEventVerticalPosition(event: CalendarEvent): any {
    if (!event.startTime || !event.endTime) {
      return { hourRow: 0, slotStart: 0, slotSpan: 1 };
    }
    
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    
    // Calculate which hour row this belongs to
    const hourRow = startHour;
    
    // Calculate which slot it starts at (0-11 for 5-minute intervals)
    const slotStart = Math.floor(startMinute / 5);
    
    // Calculate how many slots it spans
    const startInMinutes = (startHour * 60) + startMinute;
    const endInMinutes = (endHour * 60) + endMinute;
    const durationMinutes = endInMinutes - startInMinutes;
    const slotSpan = Math.ceil(durationMinutes / 5);
    
    return {
      hourRow: String(hourRow).padStart(2, '0'),
      slotStart,
      slotSpan
    };
  }
  
  calculateEventWidth(events: CalendarEvent[], eventIndex: number): string {
    // This is a simple width calculation - more sophisticated overlap handling could be implemented
    const overlappingEvents = events.length;
    if (overlappingEvents <= 1) return '90%';
    
    return `${90 / overlappingEvents}%`;
  }
  
  calculateEventLeft(events: CalendarEvent[], eventIndex: number): string {
    // This is a simple position calculation - more sophisticated overlap handling could be implemented
    const overlappingEvents = events.length;
    if (overlappingEvents <= 1) return '5%';
    
    const width = 90 / overlappingEvents;
    return `${5 + (width * eventIndex)}%`;
  }
  
  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentYear--;
      this.currentMonth = 11;
    } else {
      this.currentMonth--;
    }
    this.generateCalendarDays();
    // Also update the week view if the month changes
    this.selectedDate = new Date(this.currentYear, this.currentMonth, 1);
    this.generateWeekDays();
  }
  
  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentYear++;
      this.currentMonth = 0;
    } else {
      this.currentMonth++;
    }
    this.generateCalendarDays();
    // Also update the week view if the month changes
    this.selectedDate = new Date(this.currentYear, this.currentMonth, 1);
    this.generateWeekDays();
  }
  
  previousWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.selectedDate = new Date(this.selectedDate);
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.generateWeekDays();
  }
  
  nextWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.selectedDate = new Date(this.selectedDate);
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.generateWeekDays();
  }
 
  previousDay(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    this.selectedDate = new Date(this.selectedDate);
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();

     // If date changed to today, scroll to current time
  const today = new Date();
  if (this.selectedDate.getDate() === today.getDate() && 
      this.selectedDate.getMonth() === today.getMonth() && 
      this.selectedDate.getFullYear() === today.getFullYear()) {
    setTimeout(() => this.scrollToCurrentTime(), 0);
  }
  }
  
  nextDay(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    this.selectedDate = new Date(this.selectedDate);
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();

     // If date changed to today, scroll to current time
  const today = new Date();
  if (this.selectedDate.getDate() === today.getDate() && 
      this.selectedDate.getMonth() === today.getMonth() && 
      this.selectedDate.getFullYear() === today.getFullYear()) {
    setTimeout(() => this.scrollToCurrentTime(), 0);
  }
  }
  
  goToToday(): void {
    this.selectedDate = new Date();
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.generateCalendarDays();
    this.generateWeekDays();

     // If in day view, scroll to current time
  if (this.viewMode === 'day') {
    setTimeout(() => this.scrollToCurrentTime(), 0);
  }
  }
  
  setViewMode(mode: string): void {
    this.viewMode = mode;
    // When switching to a new view, we should recalculate relevant data
    if (mode === 'week') {
      this.generateWeekDays();
    } else if (mode === 'day') {
      // Scroll to current time when day view is activated
      setTimeout(() => this.scrollToCurrentTime(), 0);
    }
  }
  
  formatWeekViewTitle(): string {
    if (this.weekDays.length === 0) return '';
    
    const firstDay = this.weekDays[0].date;
    const lastDay = this.weekDays[6].date;
   
    const firstMonth = this.monthNames[firstDay.getMonth()];
    const lastMonth = this.monthNames[lastDay.getMonth()];
    
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstMonth} ${firstDay.getFullYear()}`;
    } else {
      return `${firstMonth} - ${lastMonth} ${firstDay.getFullYear()}`;
    }
  }

  formatDayViewTitle(): string {
    return `${this.monthNames[this.selectedDate.getMonth()]} ${this.selectedDate.getDate()}, ${this.selectedDate.getFullYear()}`;
  }
  
  formatEventTime(event: CalendarEvent): string {
    if (!event.startTime || !event.endTime) return '';
    return `${event.startTime} - ${event.endTime}`;
  }

  //Scroll method to the current hour in day view 

  scrollToCurrentTime(): void {
    if (this.viewMode === 'day') {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Get the container element 
      setTimeout(() => {
        const container = document.querySelector('.day-grid-vertical');
        
        if (container) {
          // Find the actual time element that's closest to current time
          const currentHourStr = hours < 10 ? `0${hours}:00` : `${hours}:00`;
          const hourElement = document.querySelector(`[data-hour="${currentHourStr}"]`);
          
          if (hourElement) {
            const hourTop = hourElement.getBoundingClientRect().top + container.scrollTop;
            const minuteOffset = (minutes / 60) * hourElement.clientHeight;
            
            const viewportHeight = container.clientHeight / 2;
            container.scrollTop = Math.max(0, hourTop + minuteOffset - viewportHeight);
          } else {
            const pixelsPerHour = 60; 
            const scrollPosition = (hours * pixelsPerHour) + ((minutes / 60) * pixelsPerHour);
            container.scrollTop = Math.max(0, scrollPosition - container.clientHeight / 2);
          }
        }
      }, 100); 
    }
  }
}