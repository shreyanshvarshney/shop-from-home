import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase';

import { UserDataModels } from './../data-models/UserDataModels';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  addUser(user: firebase.default.User) {
    // Cannot use this BECAUSE this will create an unique key for each user inside its uid Object
    // (users -> uid 1 -> unique_key 1 -> user 1 details) I dont want this.
    // this.db.list('users/' + user.uid).push({
    //   name: user?.displayName,
    //   email: user?.email,
    //   profile_pic: user?.photoURL
    // });
    // This will create like this (users -> uid1 -> user 1 details)
    this.db.object('users/' + user?.uid).update({
      name: user?.displayName,
      email: user?.email,
      profile_pic: user?.photoURL
    });
  }

  getUser(uid: string): AngularFireObject<UserDataModels> {
    return this.db.object('users/' + uid);
  }

}
