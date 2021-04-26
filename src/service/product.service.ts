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

  getAll() {
    return this.db.list('products').snapshotChanges();
  }

  get(key: string) {
    return this.db.list('products/' + key).snapshotChanges();
  }
}
