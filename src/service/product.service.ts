import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(data: any) {
    return this.db.list('products').push(data);
  }

  // getCount(): number {
  //   let ref: firebase.default.database.Reference;
  //   return ref.child('products').on("value",(a) => {return a.numChildren()});
  // }
  
  getAllPagination(pageSize: number, pageIndex: number, previousPageIndex: number, lastElementKey: string, firstElementKey: string) {
    return this.db.list('products', (ref: firebase.default.database.Reference) => {
      if(pageIndex === 0) {
        console.log('first');
        return ref.orderByKey().limitToFirst(pageSize);
      }
      else if(pageIndex > previousPageIndex) {  
        console.log('second');
        return ref.orderByKey().startAfter(lastElementKey).limitToFirst(pageSize);
      }
      else if(pageIndex < previousPageIndex) {
        console.log('third');
        return ref.orderByKey().endBefore(firstElementKey).limitToLast(pageSize);
      }
    }).snapshotChanges();
  }

  getAll() {
    return this.db.list('products').snapshotChanges();
  }

  get(key: string) {
    return this.db.list('products/' + key).snapshotChanges();
  }

  update(key: string, data: any) {
    return this.db.list('products').update(key,data);
    // return this.db.object('products/' + key).update(data);
  }

  delete(key: string) {
    return this.db.list('products').remove(key);
  }
}
