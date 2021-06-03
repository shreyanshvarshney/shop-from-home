import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { ProductDataModels } from './../../../data-models/ProductDataModels';
import { ShoppingCartService } from './../../../service/shopping-cart.service';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('void => *',[
        // style({opacity: 0}),
        // animate(200, style({opacity: 1}))
        // This above is same as the below: as angular is smart enough to know that in my target state(* default state) element opacity should be 1.
        // I dont need to explicitly specify here do to transition from opacity 0 to 1.
        style({opacity: 0}),
        animate(200)
      ])
    ]),
    trigger('fadeIn500ms', [
      transition('void => *', [
        style({opacity: 0}),
        animate(500)
      ])
    ])
  ]
})
export class ProductCardComponent implements OnInit {

  @Input('product') product: ProductDataModels;
  @Input('cart-data') cartData;

  constructor(private cartService :ShoppingCartService) { }

  ngOnInit(): void {
  }

  addToCart() {
    this.cartService.addProductToCart(this.product);
    // console.log(this.product);
  }

  removeFromCart() {
    this.cartService.removeProductFromCart(this.product);
  }

  getQuantity(): number {
    if(!this.cartData) return 0;
    return this.cartData?.items[this.product.key] ? this.cartData?.items[this.product.key]?.quantity : 0
  }

}
