import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddInventoryPageRoutingModule } from './add-inventory-routing.module';

import { AddInventoryPage } from './add-inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddInventoryPageRoutingModule
  ],
  declarations: [AddInventoryPage]
})
export class AddInventoryPageModule {}
