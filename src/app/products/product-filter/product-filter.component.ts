import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from '../../../service/category.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {

  @Input('category') category: string;
  categories: any = [];

  constructor( private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
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

}
