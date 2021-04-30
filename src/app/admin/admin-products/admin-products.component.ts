import { Component, OnInit, OnDestroy, Directive, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from './../../../service/product.service';
import { AlertService } from 'src/service/alert.service';
import { Sort, MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  search: string;
  products: any = [];
  filteredProducts: any = [];
  sortedData : any = [];
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
      this.sortedData = this.filteredProducts = this.products = data.map((value) => {
        // console.log(value);
        const key = value?.payload?.key;
        const data: Object = value?.payload?.val();

        const obj = {
          key: key,
          ...data
        };        
        return obj
      });
      // console.log(this.products);
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

  sortData(sort: Sort) {
    const data = this.sortedData.slice();

    // Condition to arrange the data as Default or coming from sever.
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.filteredProducts;
      return;
    }
    // console.log(sort);
    // console.log(data);

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      // console.log(isAsc)
      // console.log(a,b);
      
      switch (sort.active) {
        case 'name': return this.compare(a?.title, b?.title, isAsc);
        case 'price': return this.compare(a?.price, b?.price, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Implementing Client-side Searching.
  filter() {
    let query: string = this.search;
    this.filteredProducts = (query) ? this.products.filter((value) => {
      return value.title.toLowerCase().includes(query.toLowerCase());
    }) : this.products;
    // console.log(this.filteredProducts);
    this.sortedData = this.filteredProducts;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
