import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthService } from './../service/auth.service';
import { UserService } from './../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    // this.auth.user$.pipe(
    //   map((user: firebase.default.User) => {
    //     this.userService.getUser(user.uid).valueChanges().subscribe((data) => {
    //       if(data.isAdmin) return true;
    //       return false;
    //     });
    //   }),
    //   map(())
    // );
    return this.auth.user$.pipe(
      switchMap((user: firebase.default.User) => {
        return this.userService.getUser(user.uid).valueChanges();
      }),
      map((data) => {
        // return data.isAdmin ? true : false;
        if (data.isAdmin) return true;
        else {
          this.router.navigate(['/']);
          return false;
        }
      })
    );
    // return this.auth.userDetails$.pipe(
    //   map((data) => {
    //     return data.isAdmin ? true : false;
    //   })
    // );

    // return this.auth.user$.pipe(
    //   map((user: firebase.default.User) => {
    //     return this.userService.getUser(user.uid).valueChanges();
    //   }),
    //   map((value) => {
    //     let isAdmin: boolean;
    //     value.subscribe((data) => {
    //       console.log(data.isAdmin);

    //       isAdmin = data.isAdmin;
    //     });
    //     console.log(isAdmin);

    //     return isAdmin;
    //   }),
    //   map((value) => {
    //     return value ? true : false;
    //   })
    // );
  }

}
