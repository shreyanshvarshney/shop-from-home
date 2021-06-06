import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from './../../service/shopping-cart.service';

import { ProductDataModels } from './../../data-models/ProductDataModels';

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
        this.shoppingCartData = [];
        this.loading = false;
        return;
      }
      this.shoppingCartData = [];
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

  // This function can be replaced by getQuantity() function in product-card component
  // This function is returning the quantity of a single product in a cart.
  getQuantity(product: ProductDataModels): number {
    if(this.shoppingCartData.length === 0) return 0;
    for (let i = 0; i < this.shoppingCartData.length; i++) {
      if(this.shoppingCartData[i].quantity === product?.quantity) return product?.quantity;
    }
  }

  clearCart() {
    this.cartService.clearCart();
  }

  //Repeat Function
  addToCart(product: ProductDataModels) {
    this.cartService.addProductToCart(product);
  }

  //Repeat Function
  removeFromCart(product: ProductDataModels) {
    this.cartService.removeProductFromCart(product);
  }

}
