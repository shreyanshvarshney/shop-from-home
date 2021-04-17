import { Component, OnDestroy } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  item$: Observable<any[]>;
  items: any = [];
  subscription: Subscription;
  person: any;
  itemsRef: AngularFireList<any>;
  dataObject: any = [];
  updateValue: boolean = false;

  constructor(private db: AngularFireDatabase) {

    this.subscription =  this.db.list('items').snapshotChanges().subscribe((action: any) => {
      console.log(action);
      this.item$ = action;
      console.log(this.item$);
      
      // this.formatData(action);
    });

    // this.item$ = this.db.list('items').valueChanges();
    // this.subscription = this.item$.subscribe((data) => {
    //   this.items = data;
    //   console.log(data);
    // });

    this.db.object('person').valueChanges()
    .subscribe((data) => {
      this.person = data;
      console.log(this.person);
    });
  }

  formatData(data) {
    for(let i = 0; i < data.length; i++) {
      this.dataObject.push(this.formatAndFilterArray(data[i])); 
    }
    console.log(this.dataObject);
  }

  formatAndFilterArray(data) {
    let obj = {
      key: data?.key,
      value: data?.payload?._delegate?._node?.value_
    }
    return obj;
  }

  add(fruit: HTMLInputElement) {
    this.db.list('items').push(fruit.value)
    .then(() => {
      fruit.value = '';
      console.log('successfully added')
    })
    .catch(err => console.log(err, 'You do not have access!'));
  }

  update(key,value) {
    console.log(key);
    this.updateValue = true;
    this.db.list('items').set(key,value + ' updated')
    .then(() => {
      console.log('successfully updated');
    })
    .catch((err) => {
      console.log(err);
    })
  }

  delete(key) {
    this.db.list('items').remove(key)
    .then(() => {
      console.log('successfully deleted');
    })
    .catch((err) => {
      console.log(err);
    })
  }

  updateItem(key,input: HTMLInputElement) {
    this.db.list('items').set(key,input.value);
  }

  // For avoiding memory leaks from the server
  ngOnDestroy() {
    this.subscription.unsubscribe();    
  }
}
