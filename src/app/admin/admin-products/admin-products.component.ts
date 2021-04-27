import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from './../../../service/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  search: string;
  products: any = [];
  subscription: Subscription;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.subscription = this.productService.getAll()
    .subscribe((data) => {      
      this.products = data.map((value) => {
        // console.log(value);
        const key = value?.payload?.key;
        const data: Object = value?.payload?.val();

        const obj = {
          key: key,
          ...data
        };        
        return obj
      });
      console.log(this.products);
    });
    
    
  }

  updateProduct(key: string) {
    this.router.navigate(['/admin/products/update',key]);
  }

  deleteProduct(key: string) {
    
  }

  onSubmitSearch() {
    console.log(this.search);
    this.search = '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
