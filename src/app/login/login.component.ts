import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.afAuth.signInWithRedirect(new firebase.default.auth.GoogleAuthProvider())
    .then(() => {
      console.log("Login Successfull.");
    },
    (reason) => {
      console.log(reason);
    });
  }

}
