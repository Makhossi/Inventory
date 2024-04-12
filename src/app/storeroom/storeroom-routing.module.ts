import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreroomPage } from './storeroom.page';

const routes: Routes = [
  {
    path: '',
    component: StoreroomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreroomPageRoutingModule {}
