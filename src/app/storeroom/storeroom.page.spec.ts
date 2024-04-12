import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreroomPage } from './storeroom.page';

describe('StoreroomPage', () => {
  let component: StoreroomPage;
  let fixture: ComponentFixture<StoreroomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
