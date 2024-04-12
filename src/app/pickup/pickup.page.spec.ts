import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickupPage } from './pickup.page';

describe('PickupPage', () => {
  let component: PickupPage;
  let fixture: ComponentFixture<PickupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
