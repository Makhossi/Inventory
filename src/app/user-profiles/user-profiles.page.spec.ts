import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfilesPage } from './user-profiles.page';

describe('UserProfilesPage', () => {
  let component: UserProfilesPage;
  let fixture: ComponentFixture<UserProfilesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
