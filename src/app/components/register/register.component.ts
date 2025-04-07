import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterRequest, UserRole } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  invitationToken: string | null = null;
  invitationEmail: string | null = null;
  
  roles = [
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Manager, label: 'Manager' },
    { value: UserRole.User, label: 'User' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private teamService: TeamService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get token from query params
    this.route.queryParams.subscribe(params => {
      this.invitationToken = params['token'] || null;
      
      // If token exists, validate it to get invitation details
      if (this.invitationToken) {
        this.validateInvitation(this.invitationToken);
      }
    });
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.User, [Validators.required]]
    });
  }

  validateInvitation(token: string): void {
    this.teamService.getInvitationDetails(token)
        .pipe(first())
        .subscribe({
            next: (invitation) => {
                // Set the email field with the invitation email and disable it
                this.invitationEmail = invitation.email;
                this.registerForm.patchValue({ email: invitation.email });
                this.registerForm.get('email')?.disable();
                // Force User role for invited users
                this.registerForm.patchValue({ role: UserRole.User });
                this.registerForm.get('role')?.disable();
            },
            error: error => {
                this.error = error.error?.message || 'Invalid or expired invitation';
                // Clear token on error so user can register normally
                this.invitationToken = null;
            }
        });
}

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const registerRequest: RegisterRequest = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.registerForm.getRawValue().email, // Use getRawValue to include disabled controls
      password: this.f['password'].value,
      role: this.registerForm.getRawValue().role,
      invitationToken: this.invitationToken // Include the token if available
    };
    
    this.authService.register(registerRequest)
      .subscribe({
        next: () => {
          this.router.navigate(['/calendar']);
        },
        error: error => {
          this.error = error.error?.message || 'Registration failed';
          this.loading = false;
        }
      });
  }

}
