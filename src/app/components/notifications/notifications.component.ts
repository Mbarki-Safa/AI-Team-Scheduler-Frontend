import { Component } from '@angular/core';

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notifications: Notification[] = [
    {
      id: 1,
      message: 'Meeting reminder: Team sync at 10:00 AM tomorrow',
      date: '2024-10-05',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      message: 'New message from John Smith',
      date: '2024-10-04',
      read: true,
      type: 'info'
    },
    {
      id: 3,
      message: 'Your calendar has been updated with 3 new events',
      date: '2024-10-03',
      read: true,
      type: 'success'
    },
    {
      id: 4,
      message: 'System maintenance scheduled for tonight at 11:00 PM',
      date: '2024-10-02',
      read: true,
      type: 'warning'
    }
  ];
  
  markAsRead(notification: Notification): void {
    notification.read = true;
  }
  
  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
  }
  
  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter(notification => notification.id !== id);
  }
}
