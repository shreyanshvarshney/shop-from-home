import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // Using state: RouterStateSnapshot -> I can get the url which user tried to access when this AuthGuard came into play.
      // Mapped this Observale using map() in rxjs so that it will return Obervable<boolean> as required by canActivate().
      return this.auth.user$.pipe(
        map((data) => {
          if (data) return true;
          else {
            this.router.navigate(['/login'], { queryParams: {returnUrl: state.url} });
            return false;
          }
        })
      );
  }

}
