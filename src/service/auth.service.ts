import { Injectable, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  user$: Observable<firebase.default.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = afAuth.authState;
  }

  ngOnInit() {}

  login() {
    // When I call signInWithRedirect -> my app is unloaded as the user is now on the Firebase auth page (look at the url).
    // After that it redirects BACK to your application to the same route it was on when you called it
    // So there is no point in trying to run code immediately AFTER calling signInWithRedirect, as that code is unreachable. 
    // This is why there is the method getRedirectResult - which should be somewhere in your startup routine.
    this.afAuth.signInWithRedirect(new firebase.default.auth.GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.signOut();
  }

  getRedirectResult() {
    return this.afAuth.getRedirectResult();
  }

  getAuthState() {
    return this.afAuth.authState;
  }
}
