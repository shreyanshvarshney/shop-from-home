import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment';
import { AngularFireModule } from '@angular/fire';

// For using Realtime Database in Firebase
import { AngularFireDatabaseModule } from '@angular/fire/database';

// For using Cloud Firestore in Firebase
// import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  // providers: [AngularFirestore],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
