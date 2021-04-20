import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../service/auth.service';
import { AlertService } from './../../service/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userData: any = {};
  user: firebase.default.User;

  constructor(public auth: AuthService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.auth.getAuthState()
    .subscribe((data) => {
      this.user = data;
      this.formatUserData(data);
      console.log(this.user);
      
      console.log(this.userData);
      // if(data !== null) {
      //   this.alertService.fireToast('success','Login Successfull');
      // }
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
    this.auth.logout()
    .then(() => {
      console.log('successfully logged out.');
      this.router.navigate(['/']);
      this.alertService.fireToast('success','Logged Out');
    },
    (reason) => {
      console.log(reason);    
    });
  }

}
