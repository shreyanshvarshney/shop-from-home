import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../service/auth.service';
import { AlertService } from './../../service/alert.service';
import { UserService } from './../../service/user.service';
import { ShoppingCartService } from './../../service/shopping-cart.service';

import { UserDataModels } from './../../data-models/UserDataModels';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userData: any = {};
  userDetails: UserDataModels;
  isMenuCollapsed: boolean = true;

  cartQuantity: number = 0;

  constructor(private auth: AuthService, 
              private router: Router, 
              private alertService: AlertService,
              private cartService: ShoppingCartService) { }

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

    this.calculateCartItems();
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

  async calculateCartItems() {
    const cart = await this.cartService.getCartRef();
    // As I have subscribed to the cart service so everytime their is a change in cartData or I update the cart quantity from ui, 
    // lines 78 80 81 will be re-executed and will update the cart quantity items in navbar.
    cart.snapshotChanges().subscribe((data) => {
      // console.log(data.payload.val()['items'])
      this.cartQuantity = 0;
      // A check when the cart is empty so their will be no cartRef in the database.
      if(!data?.key) return;
      // Iterating the Object
      for (const [key,value] of Object.entries(data?.payload?.val()['items'])) {
        this.cartQuantity += value['quantity']
        // console.log(value);
      }
    });
  }

}
