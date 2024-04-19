import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router'; // Import Router
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  name: any;
  email: any;
  password: any;
  confirm_password: any;
  selectedRole:any;

  constructor(
    private db: AngularFirestore,
    private Auth: AngularFireAuth,
    private router: Router // Inject Router
    ,private loadingController: LoadingController,
    private toastController: ToastController 
  ) { }

  ngOnInit() {
  }

  async Register() {
    if (!this.name || !this.email || !this.password || !this.confirm_password || !this.selectedRole) {
      this.presentToast("Please fill in all fields");
      return;
    }
  
    if (this.password !== this.confirm_password) {
      this.presentToast("Passwords do not match");
      return;
    }
  
    const loader = await this.loadingController.create({
      message: 'Registering you...',
      cssClass: 'custom-loader-class'
    });
  
    await loader.present();
  
    this.Auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential: any) => {
        if (userCredential.user) {
          this.db.collection('Users').add({
            name: this.name,
            email: this.email,
            status: "pending",
            role: this.selectedRole,
          })
            .then(() => {
              loader.dismiss();
              alert("added")
              console.log('User data added successfully');
              // this.router.navigate(['/profile']);
            })
            .catch((error: any) => {
              loader.dismiss();
              alert(error )
              console.error('Error adding user data:', error);
              this.presentToast("Error adding user data: " + error.message); // Display error message as toast
            });
        } else {
          console.error('User credential is missing');
          this.presentToast("User credential is missing");
        }
      })
      .catch((error: any) => {
        loader.dismiss();
        alert(error )
        console.error('Error creating user:', error);
        this.presentToast("Error creating user: " + error.message); // Display error message as toast
      });
  }
  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'bottom' // Position of the toast
    });
    toast.present();
  }
  
  
  
}
