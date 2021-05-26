import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from './../../../service/alert.service';
import { CategoryService } from './../../../service/category.service';
import { ProductService } from './../../../service/product.service';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { AngularFireStorage } from '@angular/fire/storage';

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

  imageChangedEvent: any;
  croppedImage: any;
  productImage = {name: '', file: null, url: ''};
  imgSrcPreviewCard: string = '';
  downloadUrl: string;

  constructor(private fb: FormBuilder,
              private modalService: NgbModal,
              private router: Router,
              private alertService: AlertService,
              private storage: AngularFireStorage,
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
      upload_type: new FormControl(''),
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
      if(form.controls.upload_type.value === 'upload') {
        this.uploadImage(form);
      }
      this.addProduct(form);
    }
    else {
      this.alertService.fireToast('error', 'Please fill all the fields with valid information');
    }
  }

  addProduct(form: FormGroup) {
    if(this.product_key && this.product_key !== '') {
      // Update this product in my Database.
      const final_data = this.prepareAttributes(form.value);
      this.productService.update(this.product_key, final_data)
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
      const final_data = this.prepareAttributes(form.value);
      this.productService.create(final_data)
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

  uploadImage(form: FormGroup) {
    const url = 'products/' + (new Date().getTime() + '_' + this.productImage.name);
    this.productImage.url = url;
    console.log(url);
    const fileRef = this.storage.ref(url);
    // this.productService.uploadImage(url, this.productImage.file).snapshotChanges()
    // .subscribe(data => console.log(data.ref.getDownloadURL().then(url => {console.log(url)})));
    this.productService.uploadImage(url, this.productImage.file).snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.downloadUrl = url;
          console.log(this.downloadUrl);
          this.addProduct(form);
        });
      })
    ).subscribe();
  }

  prepareAttributes(data) {
    let image_url = '';
    if(this.productForm.controls.upload_type.value === 'upload') {
      image_url = this.downloadUrl;
    } else {
      image_url = data.image_url;
    }
    if(this.product_key && this.product_key !== '') {
      return {
        title: data.title,
        image_url: image_url,
        price: data.price,
        category: data.category,
        currency: data.currency,
        upload_type: data.upload_type,
        date_updated: new Date().toString(),
      };
    }
    return {
      title: data.title,
      image_url: image_url,
      price: data.price,
      category: data.category,
      currency: data.currency,
      upload_type: data.upload_type,
      date_created: new Date().toString(),
      date_updated: new Date().toString(),
    };
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
    if(this.image_url.value) {
      this.alertService.fireToast('error','Enable to fetch your given image');
    }
    event.target.src = './../../../assets/img/default-product-image.png';
  }

  fileChangeEvent(event, content) {
    this.productForm.controls.image_url.setValue('');
    const files = event.target.files;
    console.log(event.target.files);
    
    if (files.length > 0) {
      console.log(event.target.files[0]);
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'md',
      };
      this.imageChangedEvent = event;
      this.modalService.open(content, ngbModalOptions);
    } else {
      this.imgSrcPreviewCard = '';
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imgSrcPreviewCard = event.base64;
    const croppedImage = event.base64;
    this.croppedImage = this.base64ToFile(croppedImage, this.imageChangedEvent.target.files[0].name);
    this.productImage.file = this.croppedImage;
    console.log(this.productImage.file);
  }

  base64ToFile(data, filename) {
    const arr = data.split(',');
    const imageType = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: imageType});
  }

  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    this.modalService.dismissAll();
    this.alertService.fireToast('error', 'Image type not supported');
  }

  cropImage() {
    this.productImage.file = this.croppedImage;
    this.productImage.name = this.croppedImage.name;
    console.log(this.productImage);
    
    this.modalService.dismissAll();
    this.imageChangedEvent = null;
  }

  closeModal(modal: NgbActiveModal) {
    modal.dismiss();
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
  get upload_type() {
    return this.productForm.controls.upload_type; 
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
