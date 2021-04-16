import { Component } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  item$: Observable<any[]>;
  items: any = [];

  constructor(db: AngularFireDatabase) {
    this.item$ = db.list('items').valueChanges();
    this.item$.subscribe((data) => {
      this.items = data;
      console.log(data);
    });
    
  }
}
