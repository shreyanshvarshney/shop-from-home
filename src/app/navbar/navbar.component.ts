import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../service/auth.service';
import { AlertService } from './../../service/alert.service';
import { UserService } from './../../service/user.service';
import { Router } from '@angular/router';

import { UserDataModels } from './../../data-models/UserDataModels';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userData: any = {};
  userDetails: UserDataModels;
  constructor(private auth: AuthService, 
              private router: Router, 
              private alertService: AlertService) { }

  ngOnInit(): void {
    // authState returns an Observable which contains user auth details.
    // I can avoid this below implementation using "async" pipe in my HTML template.
    // async pipe will automatically subscribe, fetch new data, unsubscribe to the Observale<firebase.User>
    // Can "avoid" this below code when using async pipe

    // this.auth.getAuthState()
    // .subscribe((data) => {
    //   this.user$ = data;
    //   this.formatUserData(data);
    //   console.log(this.user$);
    //   console.log(this.userData);
    // });

    this.auth.userDetails$.subscribe((data) => {      
      this.userDetails = data;
      console.log(this.userDetails);
    });    
  }

  // formatUserData(data) {
  //   let obj = {
  //     name: this.user$?.displayName,
  //     email: this.user$?.email,
  //     profile_pic: this.user$?.photoURL
  //   }
  //   this.userData = obj;
  // }

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
