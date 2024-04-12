import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddInventoryPage } from './add-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: AddInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddInventoryPageRoutingModule {}
