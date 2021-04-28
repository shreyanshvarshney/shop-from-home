import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from './../../../service/alert.service';
import { CategoryService } from './../../../service/category.service';
import { ProductService } from './../../../service/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  productForm: FormGroup;
  categories: any = [];
  subscription1: Subscription;
  subscription2: Subscription;

  product_key: string;
  productData: any = {};

  constructor(private fb: FormBuilder, 
              private router: Router,
              private alertService: AlertService, 
              private categoryService: CategoryService,
              private productService: ProductService,
              private activatedRoute: ActivatedRoute) { 
                // this.activatedRoute.paramMap
                // .subscribe((paramMap) => {
                //   this.product_key = paramMap.get('unique_key');
                // });
                // Using take() in rxjs because here I dont need new values, just want a route parameter.
                // then take() function will automatically unsubscribe the observable after taking 1 value.
                this.activatedRoute.paramMap
                .pipe(
                  take(1)
                ).subscribe((paramMap) => {
                    this.product_key = paramMap.get('unique_key');
                  });
              }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategoriesData();

    if(this.product_key && this.product_key !== '') {
      this.loadProductData();
    }
  }

  initializeForm() {
    this.productForm = this.fb.group({
      title: new FormControl('',[Validators.required, Validators.minLength(3)]),
      price: new FormControl('',[Validators.required, Validators.min(0)]),
      currency: new FormControl('INR',Validators.required),
      category: new FormControl('', [Validators.required]),
      image_url: new FormControl('')
    });
    // console.log(this.productForm);
  }

  loadCategoriesData() {
    this.subscription1 = this.categoryService.getAll()
    .subscribe((data) => {
      this.categories = data.map((value) => {
        const data: Object = value.payload.val();
        const key = value.payload.key;
        const obj = {
          ...data,
          key: key
        };
        return obj;
      });
    });
  }

  formatCategoriesData(data) {
    // Making my categories array empty everytime as firebase send data again on any modification.
    this.categories = [];
    // Iterating over all properties of an object send by the server and formatting them into an array.
    // As in HTML template *ngFor directive works for iteratives like Arrays.
    for(const item in data) {
      let obj = {
        key: item,
        name: data[item]?.name
      };
      this.categories.push(obj);
    }
  }

  onSubmit(form: FormGroup) {
    if(form.valid) {
      console.log(form.value);

      if(this.product_key && this.product_key !== '') {
        // Update this product in my Database.
        this.productService.update(this.product_key, form.value)
        .then(() => {
          this.alertService.fireToast('success', 'Product updated successfully.');
        })
        .catch((reason) => {
          console.log(reason);
          this.alertService.fireToast('error', 'Some error occurred.');
        });
      }
      else {
        // Creating this product in my Database.
        this.productService.create(form.value)
        .then(() => {
          form.reset();
          this.alertService.fireToast('success', 'Product added successfully.');
        })
        .catch((reason) => {
          console.log(reason);
          this.alertService.fireToast('error', 'Some error occurred.');
        });
      }
      this.router.navigate(['/admin/products/list']);
    }
    else {
      this.alertService.fireToast('error', 'Please fill the form correctly');
    }
  }

  loadProductData() {
    this.subscription2 = this.productService.get(this.product_key)
    .subscribe((data) => {
      data.map((value) => {
        const key = value?.payload?.key;
        const data = value?.payload?.val();
        // console.log(key,data);
        this.formatProductData(key,data);
      });
      console.log(this.productData);
      this.prefillForm();
    });
  }

  formatProductData(key: string, data: any) {
    this.productData[key] = data; 
  }

  prefillForm() {
    this.productForm.controls.title.setValue(this.productData?.title);
    this.productForm.controls.currency.setValue(this.productData?.currency);
    this.productForm.controls.price.setValue(this.productData?.price);
    this.productForm.controls.category.setValue(this.productData?.category);
    this.productForm.controls.image_url.setValue(this.productData?.image_url);
  }

  imageErrorHandler(event) {
    // console.log(event.target.src);
    if(this.image_url.value) this.alertService.fireToast('error','Enable to fetch your given image');
    event.target.src = './../../../assets/img/default-product-image.png';
  }

  // defined getter functions for directly accessing the form fields in HTML template
  get title() {
    return this.productForm.controls.title; 
  }
  get price() {
    return this.productForm.controls.price; 
  }
  get currency() {
    return this.productForm.controls.currency; 
  }
  get category() {
    return this.productForm.controls.category; 
  }
  get image_url() {
    return this.productForm.controls.image_url; 
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    if(this.product_key && this.product_key !== '') {
      this.subscription2.unsubscribe();
    }
  }
}
