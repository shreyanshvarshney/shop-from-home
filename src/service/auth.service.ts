import { Injectable, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  // user$: Observable<firebase.default.User>;

  constructor(private afAuth: AngularFireAuth) { }

  ngOnInit() {
    // this.user$ = this.afAuth.authState;
  }

  login() {
    return this.afAuth.signInWithRedirect(new firebase.default.auth.GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.signOut();
  }

  getAuthState() {
    return this.afAuth.authState;
  }
}
