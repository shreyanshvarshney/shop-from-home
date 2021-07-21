import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/service/navigation.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  previousUrl = '';

  constructor(public navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.prevUrl$.subscribe((prevUrl: string) => {
      this.previousUrl = prevUrl;
    });
  }

}
