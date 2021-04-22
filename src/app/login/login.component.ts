import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';
import { AlertService } from 'src/service/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  returnUrl: string;

  constructor(private auth: AuthService, 
              private router: Router, 
              private alertService: AlertService,
              private activatedRoute: ActivatedRoute) {
               this.activatedRoute.queryParams
               .subscribe((queryParams) => {
                 console.log(queryParams);
                 this.returnUrl = queryParams.returnUrl || '/';
                //  console.log(this.returnUrl);
               }); 
              // I can use LocalStorage to store the query params if they are lost due to routing.
              // Here I can also use "snapshot" because I dont have navigation buttons like previous and next on my Login page so route parameters will not change with a single instance of the Login Component in the DOM. And in snapshot I dont need to subscribe to an Observale.
              // this.returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl')
              }

  ngOnInit(): void {
    this.loading = true;
    this.auth.getRedirectResult()
    .then((result) => {      
      console.log(result);
      if(result.user) {
        // this.router.navigate([this.returnUrl]);
        this.router.navigateByUrl(this.returnUrl);
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
