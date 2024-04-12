import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInventoryStoreroomPage } from './add-inventory-storeroom.page';

describe('AddInventoryStoreroomPage', () => {
  let component: AddInventoryStoreroomPage;
  let fixture: ComponentFixture<AddInventoryStoreroomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryStoreroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
