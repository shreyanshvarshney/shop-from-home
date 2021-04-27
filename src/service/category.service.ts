import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list('categories', (ref: firebase.default.database.Reference) => {
      return ref.orderByChild('name')
    }).snapshotChanges();
  }

  get() { }

  create() { }

  delete() { }

  update() { }

}
