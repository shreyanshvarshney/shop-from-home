import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AlertService } from 'src/service/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;

  constructor(private afAuth: AngularFireAuth, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.loading = true;
    this.afAuth.getRedirectResult()
    .then((result) => {      
      console.log(result);
      if(result.user) {
        this.router.navigate(['/']);
        this.alertService.fireToast('success','Login Successfull');
      }
      else {
        this.loading = false;
      }
    });
  }

  login() {
    // this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
    // .then((result) => {
    //   console.log(result);
    //   this.router.navigate(['/']);
    //   this.alertService.fireToast('success','Login Successfull');
    // });
    this.afAuth.signInWithRedirect(new firebase.default.auth.GoogleAuthProvider());
    // .then(() => {
    //   console.log("Login Successfull.");
    //   this.alertService.fireToast('success','Login Successfull');
    // },
    // (reason) => {
    //   console.log(reason);
    // });
    this.loading = true;
  }

}
