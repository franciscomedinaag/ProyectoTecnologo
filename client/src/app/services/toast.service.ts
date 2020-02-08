import { Injectable,ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ToastService {

  constructor(public toastr: ToastrService) {    
	}

	showSuccess(msg) {
    return this.toastr.success(msg, 'Correcto');
  }
    
  showError(msg) {
    return this.toastr.error(msg, 'Error');
  }
    
  showWarning(msg) {
    return this.toastr.warning(msg, 'Alerta!');
  }
    
  showInfo(msg) {
    return this.toastr.info(msg);
  }
}
