import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './../../service/product.service';
import { CategoryService } from './../../service/category.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: any = [];
  filteredProducts: any = [];
  categories: any = [];
  loading: boolean = true;

  constructor(private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAll()
    .subscribe((response) => {
      this.loading = true;
      this.filteredProducts = this.products = response.map((value => {
        const key = value?.key;
        const data: Object = value?.payload.val();

        const obj = {
          key: key,
          ...data
        };
        return obj;
      }));
      this.loading = false;
      // console.log(this.products);
    });
  }

  loadCategories() {
    this.categoryService.getAll()
    .subscribe((response) => {
      this.categories = response.map((value) => {
        const key = value?.key;
        const data: Object = value?.payload.val();

        const obj = {
          key: key,
          ...data
        };
        return obj
      });
      // console.log(this.categories);
    });
  }

  categoryFilter(category: string) {
    this.filteredProducts = this.products.filter((value) => {
      if(value?.category === category) return true;
    });
    // console.log(this.filteredProducts);
  }

  ngOnDestroy(): void {
  }

}
