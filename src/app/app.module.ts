import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptorInterceptor } from './interceptor/auth-interceptor.interceptor';
import { CalendarComponent } from './components/calendar/calendar.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

// PrimeNG Imports

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { RoleBasedRedirectComponent } from './components/role-based-redirect/role-based-redirect.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { TeamCreationComponent } from './components/team-creation/team-creation.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    CalendarComponent,
    InboxComponent,
    PreferencesComponent,
    NotificationsComponent,
    UsersListComponent,
    RoleBasedRedirectComponent,
    UnauthorizedComponent,
    TeamCreationComponent,
        
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatInputModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    RippleModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    BrowserAnimationsModule, // Required for most Angular Material components
    MatSnackBarModule, 
    MatExpansionModule,
    MatListModule,
    MatIconModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true },
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
