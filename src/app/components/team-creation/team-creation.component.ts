import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Team } from 'src/app/models/Team';

@Component({
  selector: 'app-team-creation',
  templateUrl: './team-creation.component.html',
  styleUrls: ['./team-creation.component.scss']
})
export class TeamCreationComponent {
  teamForm: FormGroup;
  availableUsers: {name: string, email: string}[] = [];
  managerTeams: Team[] = [];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.teamForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(3)]],
      invitedEmails: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.loadAvailableUsers();
    this.processAcceptedInvitations();
  }

  loadAvailableUsers() {
    this.userService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
      },
      error: (err) => {
        this.snackBar.open('Failed to load available users', 'Close', { duration: 3000 });
      }
    });
  }

  loadManagerTeams() {
    this.teamService.getManagerTeams().subscribe({
      next: (teams) => {
        console.log('Teams loaded:', teams);
        this.managerTeams = teams;
        // Ensure teams with undefined members are properly handled
        this.managerTeams.forEach(team => {
          if (!team.members) {
            team.members = [];
          }
        });
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
      }
    });
  }

  processAcceptedInvitations() {
    this.teamService.processAcceptedInvitations().subscribe({
      next: () => {
        this.loadManagerTeams();
      },
      error: (err) => {
        console.error('Error processing accepted invitations:', err);
        // Load teams anyway even if processing fails
        this.loadManagerTeams();
      }
    });
  }

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamService.createTeam(this.teamForm.value).subscribe({
        next: (team) => {
          this.snackBar.open('Team created successfully! Invitations sent.', 'Close', { duration: 3000 });
          this.teamForm.reset();
        },
        error: (err) => {
          this.snackBar.open('Failed to create team', 'Close', { duration: 3000 });
        }
      });
    }
  }

  removeTeamMember(teamId: number, userId: number) {
    this.teamService.removeTeamMember(teamId, userId).subscribe({
      next: () => {
        this.snackBar.open('Team member removed successfully', 'Close', { duration: 3000 });
        // Update the local teams list by removing the user from the specific team
        this.managerTeams = this.managerTeams.map(team => {
          if (team.id === teamId) {
            return {
              ...team,
              members: team.members.filter(member => member.id !== userId)
            };
          }
          return team;
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to remove team member', 'Close', { duration: 3000 });
      }
    });
  }

}
