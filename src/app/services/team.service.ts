import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Team, TeamCreationRequest, TeamInvitation } from '../models/Team';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = `${environment.apiUrl}/teams`;
  private invitationsUrl = `${environment.apiUrl}/invitations`;
  
  constructor(private http: HttpClient) {}

  createTeam(teamRequest: TeamCreationRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, teamRequest);
  }

  getManagerTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl).pipe(
      tap(teams => {
        console.log('Teams received:', teams);
        teams.forEach(team => {
          console.log(`Team ${team.name} has ${team.members?.length || 0} members`);
        });
      })
    );
  }

  addMembersToTeam(teamId: number, memberIds: number[]): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/members`, memberIds);
  }

  removeTeamMember(teamId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}/members/${userId}`);
  }

  validateInvitation(token: string): Observable<TeamInvitation> {
    return this.http.get<TeamInvitation>(`${this.invitationsUrl}/validate?token=${token}`);
  }

  getInvitationDetails(token: string): Observable<TeamInvitation> {
    return this.http.get<TeamInvitation>(`${this.invitationsUrl}/details?token=${token}`);
  }

  acceptInvitation(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invitations/accept?token=${token}`, {});
  }

  processAcceptedInvitations(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/invitations/process-accepted`);
  }
}
