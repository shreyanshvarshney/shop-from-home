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
