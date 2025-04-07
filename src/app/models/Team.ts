export interface Team {
    id: number;
    name: string;
    manager: any;
    members: any[];
  }
  
export interface TeamCreationRequest {
    teamName: string;
    invitedEmails: string[];
  }
  
export interface TeamInvitation {
    id: number;
    invitationToken: string;
    team: Team;
    email: string;
    createdAt: string;
    expiresAt: string;
    accepted: boolean;
  }