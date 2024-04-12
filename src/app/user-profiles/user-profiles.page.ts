import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface User {
  email: string;
  name: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-user-profiles',
  templateUrl: './user-profiles.page.html',
  styleUrls: ['./user-profiles.page.scss'],
})
export class UserProfilesPage implements OnInit {

  users!: Observable<User[]>;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.users = this.firestore.collection<User>('Users').valueChanges();
  }

  approveUser(user: User) {
    const usersRef = this.firestore.collection('Users', ref =>
      ref.where('email', '==', user.email)
    );
  
    usersRef.get().toPromise().then(querySnapshot => {
      if (querySnapshot && !querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const userDocRef = this.firestore.collection('Users').doc(docId);
  
        userDocRef.update({ status: 'active' })
          .then(() => console.log('User approved successfully'))
          .catch(error => {
            console.error('Error updating user:', error);
          });
      } else {
        console.error('User document with the provided email does not exist');
      }
    }).catch(error => {
      console.error('Error fetching user document:', error);
    });
  }
  
  declineUser(user: User) {
    const usersRef = this.firestore.collection('Users', ref =>
      ref.where('email', '==', user.email)
    );
  
    usersRef.get().toPromise().then(querySnapshot => {
      if (querySnapshot && !querySnapshot?.empty) {
        const docId = querySnapshot.docs[0].id;
        const userDocRef = this.firestore.collection('Users').doc(docId);
  
        userDocRef.update({ status: 'denied' })
          .then(() => console.log('User declined successfully'))
          .catch(error => {
            console.error('Error updating user:', error);
          });
      } else {
        console.error('User document with the provided email does not exist');
      }
    }).catch(error => {
      console.error('Error fetching user document:', error);
    });
  }
  


}
