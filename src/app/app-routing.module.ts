import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleBasedRedirectGuard } from './guards/role-based-redirect.guard';
import { RoleBasedRedirectComponent } from './components/role-based-redirect/role-based-redirect.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] , data: { roles: ['User', 'Manager'] }},
  { path: 'inbox', component: InboxComponent, canActivate: [AuthGuard] , data: { roles: ['User', 'Manager'] } },
  { path: 'preferences', component: PreferencesComponent, canActivate: [AuthGuard] , data: { roles: ['User', 'Manager'] } },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] , data: { roles: ['User', 'Manager'] }},
  { path: 'admin/users', component: UsersListComponent, canActivate: [AuthGuard] , data: { roles: ['Admin'] } },
  {
    path: '',
    canActivate: [RoleBasedRedirectGuard],
    component: RoleBasedRedirectComponent
  },
   // Catch-all for unauthorized access
   { path: 'unauthorized', component: UnauthorizedComponent },
   { path: '**', redirectTo: '' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
