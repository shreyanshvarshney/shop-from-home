import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  fireToast(type: string, title: string) {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
    this.getAlert(toast, type, title);
  }

  getAlert(toast: any, type: string, title: string) {
    toast.fire({
      icon: type,
      title: title 
    });
  }
}
