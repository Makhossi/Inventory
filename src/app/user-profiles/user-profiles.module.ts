import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilesPageRoutingModule } from './user-profiles-routing.module';

import { UserProfilesPage } from './user-profiles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilesPageRoutingModule
  ],
  declarations: [UserProfilesPage]
})
export class UserProfilesPageModule {}
