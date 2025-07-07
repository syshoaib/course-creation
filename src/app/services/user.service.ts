import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Simulate current user role
  private userRole: 'admin' | 'instructor' | 'student' = 'admin'; // Change as needed

  getRole(): string {
    return this.userRole;
  }
}
