import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbCarouselModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { environment } from './../environments/environment';
import { AuthService } from './../service/auth.service';
import { UserService } from './../service/user.service';
import { CategoryService } from './../service/category.service';
import { ProductService } from './../service/product.service';
import { NavigationService } from './../service/navigation.service';
import { ShoppingCartService } from './../service/shopping-cart.service';
import { AdminAuthGuard } from './../guards/admin-auth.guard';
import { AuthGuard } from './../guards/auth.guard';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { LoginComponent } from './login/login.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { ErrorComponent } from './error/error.component';
import { ProductFilterComponent } from './products/product-filter/product-filter.component';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { FooterComponent } from './footer/footer.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

// For using Realtime Database in Firebase
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ProductFormComponent } from './admin/product-form/product-form.component';

// For using Cloud Firestore in Firebase
// import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    LoginComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    ProductFormComponent,
    ErrorComponent,
    ProductFilterComponent,
    ProductCardComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    NgbModule,
    NgbCarouselModule,
    NgbModalModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatTooltipModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    ImageCropperModule
  ],
  // providers: [AngularFirestore],
  providers: [
    AuthService,
    UserService,
    CategoryService,
    ProductService,
    NavigationService,
    ShoppingCartService,
    AuthGuard,
    AdminAuthGuard,
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
