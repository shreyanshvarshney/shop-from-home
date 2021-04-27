import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from './../../../service/product.service';
import { AlertService } from 'src/service/alert.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  search: string;
  products: any = [];
  subscription: Subscription;

  constructor(private productService: ProductService, 
              private router: Router,
              private alertService: AlertService) { }

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
    // if user clicks the cancel button we will simply return from the delete function.
    if(!window.confirm('Are you sure you want to delete this product?')) return;
    this.productService.delete(key)
    .then(() => {
      this.alertService.fireToast('success', 'Product deleted successfully.');
    })
    .catch((reason) => {
      console.log(reason);
      this.alertService.fireToast('error', 'Some error occurred.');
    });
  }

  onSubmitSearch() {
    console.log(this.search);
    this.search = '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
