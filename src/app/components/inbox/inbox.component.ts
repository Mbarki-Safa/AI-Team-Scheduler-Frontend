import { Component } from '@angular/core';

interface Message {
  id: number;
  sender: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
  messages: Message[] = [
    {
      id: 1,
      sender: 'John Smith',
      subject: 'Team Meeting Tomorrow',
      content: 'Hi team, just a reminder about our meeting tomorrow at 10am.',
      date: '2024-10-05',
      read: false
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      subject: 'Project Update',
      content: 'Here is the latest update on our project. We are on track to meet our deadline.',
      date: '2024-10-04',
      read: true
    },
    {
      id: 3,
      sender: 'Michael Brown',
      subject: 'Conference Details',
      content: 'Please find attached the details for the upcoming conference. Let me know if you have any questions.',
      date: '2024-10-03',
      read: true
    }
  ];
  
  selectedMessage: Message | null = null;
  
  selectMessage(message: Message): void {
    this.selectedMessage = message;
    message.read = true;
  }
}
