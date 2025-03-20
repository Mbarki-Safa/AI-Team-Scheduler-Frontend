import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBasedRedirectComponent } from './role-based-redirect.component';

describe('RoleBasedRedirectComponent', () => {
  let component: RoleBasedRedirectComponent;
  let fixture: ComponentFixture<RoleBasedRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleBasedRedirectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleBasedRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
