import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';
import { AlertService } from 'src/service/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;

  constructor(private auth: AuthService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.loading = true;
    this.auth.getRedirectResult()
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
    this.auth.login();
    this.loading = true;
  }

}
