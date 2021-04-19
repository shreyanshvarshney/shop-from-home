import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userData: any = {};
  user: firebase.default.User;

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((data) => {
      this.user = data;
      this.formatUserData(data);
      console.log(this.user);
      
      console.log(this.userData);
      
    });
  }

  formatUserData(data) {
    let obj = {
      name: this.user?.displayName,
      email: this.user?.email,
      profile_pic: this.user?.photoURL
    }
    this.userData = obj;
  }

  logout() {
    this.afAuth.signOut()
    .then(() => {
      console.log('successfully logged out.');
      this.router.navigate(['/']);
    },
    (reason) => {
      console.log(reason);    
    });
  }

}
