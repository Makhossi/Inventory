import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddInventoryStoreroomPageRoutingModule } from './add-inventory-storeroom-routing.module';

import { AddInventoryStoreroomPage } from './add-inventory-storeroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddInventoryStoreroomPageRoutingModule
  ],
  declarations: [AddInventoryStoreroomPage]
})
export class AddInventoryStoreroomPageModule {}
