import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddInventoryStoreroomPage } from './add-inventory-storeroom.page';

const routes: Routes = [
  {
    path: '',
    component: AddInventoryStoreroomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddInventoryStoreroomPageRoutingModule {}
