import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userDocument: any;
  showSlipTab: boolean = true;
  showManageProfilesTab: boolean = true; // Initially set to true
  showAnalyticsTab: boolean = true; // Initially set to true
  showStoreCard: boolean = true; // Initially set to true
  showAddTab: boolean = true;
  showStoreroomCard: boolean = true;


  constructor(private navCtrl: NavController,
              private auth: AngularFireAuth,
              private db: AngularFirestore,
              private toastController: ToastController) {}

  async ngOnInit() {
    try {
      await this.getUser();
    } catch (error) {
      console.error('Error initializing home page:', error);
    }
  }

  

  async getUser(): Promise<void> {
    try {
      const user = await this.auth.currentUser;
  
      if (user) {
        const querySnapshot = await this.db
          .collection('Users', ref => ref.where('email', '==', user.email))
          .valueChanges({ idField: 'id' })
          .pipe(first())
          .toPromise();
  
        if (querySnapshot && querySnapshot.length > 0) {
          this.userDocument = querySnapshot[0];
          console.log('User Document:', this.userDocument); // Log user document
  
          // Check user role to determine which tabs to hide
          switch (this.userDocument.role) {
            case 'Deliver':
              this.showSlipTab = false;
              this.showManageProfilesTab = false;
              this.showAnalyticsTab = false;
              this.showStoreCard = false; 
              break;
            case 'Manager':
              this.showManageProfilesTab = true;
              this.showAddTab = true;
              this.showSlipTab = true;
              this.showAnalyticsTab = true;
              this.showStoreCard = true;
              break;
            case 'Picker':
              // this.showAddTab = false;
              // this.showStoreCard = true;
              this.showStoreroomCard = false;
              this.showManageProfilesTab = false;
              this.showAnalyticsTab = false;
              break;
            default:
              // Handle other roles if needed
              break;
          }
        }
      }
    } catch (error) {
      console.error('Error getting user document:', error);
      throw error; // Rethrow error for better error handling
    }
  }
  
  

  async navigateBasedOnRole(page: string): Promise<void> {
    try {
      await this.getUser();

      let authorized = false;
      let message = '';

      if (this.userDocument && this.userDocument.role) {
        console.log('User Role:', this.userDocument.role); // Log user role
    
        switch (page) {
          case 'user-profiles':
            authorized = this.userDocument.role === 'Manager';
            message = authorized ? 'Authorized user for user profiles page.' : 'Unauthorized user for user profiles page.';
            break;
          case 'add-inventory':
            authorized = this.userDocument.role === 'Manager' || this.userDocument.role === 'Picker';
            message = authorized ? 'Authorized user for slips page.' : 'Unauthorized user for slips page.';
            break;
          case 'add-inventory-storeroom':
            authorized = this.userDocument.role === 'Deliver' || this.userDocument.role === 'Manager';
            message = authorized ? 'Authorized user for add inventory storeroom page.' : 'Unauthorized user for add inventory storeroom page.';
            break;
          case 'analytics':
            authorized = this.userDocument.role === 'Deliver' || this.userDocument.role === 'Manager';
            message = authorized ? 'Authorized user for analytics page.' : 'Unauthorized user for analytics page.';
            break;
          case 'storeroom':
            authorized = this.userDocument.role === 'Manager'  || this.userDocument.role === 'Deliver';
            message = authorized ? 'Authorized user for storeroom page.' : 'Unauthorized user for storeroom page.';
            break;
          case 'view':
            authorized = this.userDocument.role === 'Manager' || this.userDocument.role === 'Picker';
            message = authorized ? 'Authorized user for view page.' : 'Unauthorized user for view page.';
            break;
          default:
            authorized = false;
            message = 'Invalid page.';
            break;
        }
      } else {
        authorized = false;
        message = 'User document or role not found.';
      }

      if (authorized) {
        this.navCtrl.navigateForward('/' + page);
      } else {
        const toast = await this.toastController.create({
          message: 'Unauthorized Access: ' + message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    } catch (error) {
      console.error('Error navigating based on role:', error);
      throw error; // Rethrow error for better error handling
    }
  }

  navigateToUserProfiles(): Promise<void> {
    return this.navigateBasedOnRole('user-profiles');
  }

  navigateToAddInventory(): Promise<void> {
    return this.navigateBasedOnRole('add-inventory');
  }

  navigateToPickupInventory(): Promise<void> {
    return this.navigateBasedOnRole('add-inventory-storeroom');
  }

  navigateToDeliverInventory(): Promise<void> {
    return this.navigateBasedOnRole('analytics');
  }

  navigateToViewStoreRoom(): Promise<void> {
    return this.navigateBasedOnRole('storeroom');
  }

  navigateToStoreInventory(): Promise<void> {
    return this.navigateBasedOnRole('view');
  }
}
