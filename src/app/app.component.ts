import { Component, OnDestroy } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  item$: Observable<any[]>;
  items: any = [];
  subscription: Subscription;

  constructor(db: AngularFireDatabase) {
    this.item$ = db.list('items').valueChanges();
    this.subscription = this.item$.subscribe((data) => {
      this.items = data;
      console.log(data);
    });
  }

  // For avoiding memory leaks from the server
  ngOnDestroy() {
    this.subscription.unsubscribe();    
  }
}
