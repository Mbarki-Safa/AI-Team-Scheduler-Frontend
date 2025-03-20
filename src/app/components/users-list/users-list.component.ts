import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class UsersListComponent implements OnInit{
  users: any[] = [];
  userDialog: boolean = false;
  userForm: FormGroup;
  loading: boolean = false;
  
  // Array of user roles - match your UserRole enum in the backend
  roles: string[] = [ 'User', 'Manager'];
  loggedInUserEmail: string | null = null; // Store logged-in admin's email


  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService ,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loggedInUserEmail = this.authService.getLoggedInUserEmail();
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.filter(user => user.email !== this.loggedInUserEmail);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        this.loading = false;
      }
    });
  }

  editUser(user: any): void {
    this.userForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
    this.userDialog = true;
  }

  confirmDeleteUser(user: any): void {
    console.log('Confirm delete called for user:', user);
   // console.log("Delete button clicked");
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Delete confirmed for user:', user.id);
        this.deleteUser(user.id);
      },
      reject: () => {
        console.log('Delete rejected');
      }
    });
  }

  deleteUser(id: number): void {
   // console.log(`Deleting user with ID: ${id}`);
    this.loading = true;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User deleted successfully'
        });
        this.loading = false;
        this.loadUsers();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user'
        });
        this.loading = false;
      }
    });
  }

  hideDialog(): void {
    this.userDialog = false;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly'
      });
      return;
    }

    const user = this.userForm.value;
    this.userService.updateUser(user.id, user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User updated successfully'
        });
        this.userDialog = false;
        this.loadUsers();
      },
      error: (error) => {
        let errorMessage = 'Failed to update user';
        if (error.status === 409) {
          errorMessage = 'Email is already in use';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    });
  }
    // Helper method to get appropriate CSS class for role badges
    getRoleClass(role: string): string {
      const lowerRole = role.toLowerCase();
      return lowerRole === 'admin' || lowerRole === 'user' || lowerRole === 'manager' 
        ? lowerRole 
        : 'user'; // Default fallback
    }
}
