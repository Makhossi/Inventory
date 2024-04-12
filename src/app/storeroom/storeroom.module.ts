import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreroomPageRoutingModule } from './storeroom-routing.module';

import { StoreroomPage } from './storeroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreroomPageRoutingModule
  ],
  declarations: [StoreroomPage]
})
export class StoreroomPageModule {}
