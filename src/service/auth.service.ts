import { Injectable, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from './user.service';
import { UserDataModels } from './../data-models/UserDataModels';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  user$: Observable<firebase.default.User>;
  isLoggedIn: boolean = false;

  constructor(private afAuth: AngularFireAuth, private userServie: UserService) {
    // Every time a user "log in" or "log out" this user$ Observable will emit a value either null or an firebase.User object.
    this.user$ = afAuth.authState;
    this.user$.subscribe((data) => {
      if(data) this.isLoggedIn = true;
    });
    
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
    this.isLoggedIn = false;
    return this.afAuth.signOut();
  }

  getRedirectResult() {
    return this.afAuth.getRedirectResult();
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  get userDetails$(): Observable<UserDataModels> {
    return this.user$.pipe(
      switchMap((user) => {
        if(user) return this.userServie.getUser(user?.uid).valueChanges();
        else return of(null);
      })
    );
  }

}
