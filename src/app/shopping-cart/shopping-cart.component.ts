import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from './../../service/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  shoppingCartData: any = [];
  loading: boolean = false;

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.loadShoppingCartData();
    // console.log(this.shoppingCartData);
  }

  async loadShoppingCartData() {
    this.loading = true;
    let cart = await this.cartService.getCartRef();
    cart.snapshotChanges().subscribe(data => {
      // console.log(data?.payload?.val()['items']);
      // A check when the cart is empty so their will be no cartRef in the database.
      if(!data?.key) {
        this.loading = false;
        return;
      }
      for (const [key,value] of Object.entries(data?.payload?.val()['items'])) {
        // console.log(key,value);
        let obj = {
          key: key,
          quantity: value?.['quantity'],
          ...value?.['product']
        }
        this.shoppingCartData.push(obj);
      }
      this.loading = false;
      // console.log(this.shoppingCartData);
    });
  }

  calculateTotalAmount(): number {
    let total = 0;
    for (let i = 0; i < this.shoppingCartData.length; i++) {
      total += (this.shoppingCartData[i]?.quantity * this.shoppingCartData[i]?.price);
    }
    return total;
  }

  calculateTotalQuantity(): number {
    let quantity = 0;
    for (let i = 0; i < this.shoppingCartData.length; i++) {
      quantity += this.shoppingCartData[i]?.quantity;
    }
    return quantity;
  }

}
