import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('void => *',[
        // style({opacity: 0}),
        // animate(200, style({opacity: 1}))
        // This above is same as the below: as angular is smart enough to know that in my target state(* default state) element opacity should be 1.
        // I dont need to explicitly specify here do to transition from opacity 0 to 1.
        style({opacity: 0}),
        animate(200)
      ])
    ])
  ]
})
export class ProductCardComponent implements OnInit {

  @Input('product') product;

  constructor() { }

  ngOnInit(): void {
  }

}
