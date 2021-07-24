import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images = [
    'https://www.bigbasket.com/media/uploads/banner_images/hp_cmc_m_MMS_400_150721.jpg',
    'https://www.bigbasket.com/media/uploads/banner_images/hp_kgp_m_GM_EP_400_150721.jpg',
    'https://www.bigbasket.com/media/uploads/banner_images/hp_cmc_m_hardinsasta_bangalore_400_210721.png',
    'https://www.bigbasket.com/media/uploads/banner_images/hp_emf_m_meatbanners-2_400_160721.jpg'
  ];

  constructor(public config: NgbCarouselConfig) { }

  ngOnInit(): void {
    this.config.interval = 4000;
    this.config.wrap = true;
    this.config.keyboard = true;
    this.config.pauseOnHover = false;
  }

}
