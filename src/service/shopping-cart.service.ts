import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { ProductDataModels } from './../data-models/ProductDataModels';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create() {
    return this.db.list('shopping-carts').push({
      date_created: new Date().getTime()
    });
  }

  private getItemRef(cartId: string, productId: string) {
    return this.db.object('shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateId(): Promise<string> {
    let cartId = window.localStorage.getItem('cartId');
    if(cartId) {
      return cartId;
    } else {
      const response = await this.create();
      window.localStorage.setItem('cartId',response?.key);
      return response?.key;
    }
  }

  private async updateItemQuantity(product: ProductDataModels, change: number) {
    const cartId: string = await this.getOrCreateId();
    const item$ = this.getItemRef(cartId,product?.key);
    item$.snapshotChanges().pipe(
      take(1)
    ).subscribe((data) => {
      if(data.payload.exists()) {
        let quantity = data?.payload.val()['quantity'] + change;
        if(quantity === 0) item$.remove();
        else item$.update({quantity: quantity});
      } else {
        item$.set({product: product, quantity: 1});
      }
    });
  }

  async getCartRef() {
    let cartId = await this.getOrCreateId();
    return this.db.object('shopping-carts/' + cartId);
  }

  async clearCart() {
    const cartId = await this.getOrCreateId();
    this.db.object('shopping-carts/' + cartId + '/items').remove();
  }

  // Model of cart: carts -> cardId -> items -> (productId -> product details, quantity)...
  addProductToCart(product: ProductDataModels) {
    this.updateItemQuantity(product,1);
  }

  removeProductFromCart(product: ProductDataModels) {
    this.updateItemQuantity(product,-1);
    // const cartId: string = await this.getOrCreateId();
    // const item$ = this.getItemRef(cartId,product?.key);
    // item$.snapshotChanges().pipe(
    //   take(1)
    // ).subscribe((data) => {
    //   // Will work with only statement this also.
    //   // item$.update({quantity: data?.payload.val()['quantity'] - 1});
    //   // But added this check for more assurance.
    //   if(data.payload.exists()) {
    //     item$.update({quantity: data?.payload.val()['quantity'] - 1});
    //   }
    // });
  }

}
