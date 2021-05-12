import { Injectable } from '@angular/core';

import { NavigationEnd, Router, Event as NavigationEvent } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  previousUrl: string;
  currentUrl: string;
  private prevUrl: BehaviorSubject<string> = new BehaviorSubject(null);
  public prevUrl$: Observable<string> = this.prevUrl.asObservable();

  constructor(private router: Router) {
    // Here I am piping the Observable by using filter() rxjs method 
    // to filter out only those events with NavigationEnd and then finally subscribing to the event.

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      console.log(this.currentUrl, 'current');
      console.log(this.previousUrl, 'previous');
    });
  }

  setPreviousUrl(previousUrl: string) {
    this.prevUrl.next(previousUrl);
  }
}
