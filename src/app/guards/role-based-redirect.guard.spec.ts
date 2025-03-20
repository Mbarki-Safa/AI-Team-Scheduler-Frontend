import { TestBed } from '@angular/core/testing';

import { RoleBasedRedirectGuard } from './role-based-redirect.guard';

describe('RoleBasedRedirectGuard', () => {
  let guard: RoleBasedRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleBasedRedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
