import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

import { finalize, switchMap } from 'rxjs/operators';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user$: Observable<any> = of(null);

  constructor(
    private firestore: AngularFirestore,private loadingController: LoadingController, private auth:AngularFireAuth,private navCtrl: NavController ,private afs: AngularFirestore,private alertController: AlertController,
    private toastController: ToastController,private modalController: ModalController
   
  ) {

    
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      // Firebase authentication persistence enabled
      // Proceed with your existing code
  
      this.user$ = of(firebase.auth().currentUser).pipe(
        switchMap((user) => {
          if (user) {
            const query = this.afs.collection('Users', ref => ref.where('email', '==', user.email));
            return query.valueChanges().pipe(
              switchMap((documents: any[]) => {
                if (documents.length > 0) {
                  const userProfile = documents[0];
                  
                  console.log(userProfile);
                  return of(userProfile);
                } else {
                  console.log('No matching documents.');
                  return of(null);
                }
              })
            );
          } else {
            return of(null);
          }
        })
      );
    })
    .catch((error) => {
      // An error occurred while enabling persistence
      console.error("Error enabling Firebase authentication persistence:", error);
    });
  

  }

  ngOnInit() {
   
  }

 
}
