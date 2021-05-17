import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './../../service/product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: any = [];
  filteredProducts: any = [];
  loading: boolean = true;
  category: string = '';

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadProducts();
    this.filterByQueryParams();
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
      this.filterByQueryParams();
    });
  }

  filterByQueryParams() {
    this.activatedRoute.queryParamMap
    .subscribe((queryParams: ParamMap) => {
      this.category = queryParams.get('category') || '';
      if(this.category !== '') {
        this.categoryFilter(this.category);
      }
      else {
        this.filteredProducts = this.products;
      }
    });
  }

  categoryFilter(category: string) {
    this.filteredProducts = this.products.filter((value: any) => {
      if(value?.category === category) return true;
    });
    // console.log(this.filteredProducts);
  }

  ngOnDestroy(): void {
  }

}
