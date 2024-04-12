import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInventoryPage } from './add-inventory.page';

describe('AddInventoryPage', () => {
  let component: AddInventoryPage;
  let fixture: ComponentFixture<AddInventoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
