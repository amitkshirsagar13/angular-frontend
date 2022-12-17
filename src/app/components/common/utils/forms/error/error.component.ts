import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  @Input() fieldControl: AbstractControl | AbstractControlDirective;

  errorMessage: any = {
    'required'  : (params: any| null)  => `${params} field is required`,
    'maxlength' : (params: any| null)  => `Maximum ${params.requiredLength} characters are allowed`,
    'minlength' : (params: any| null)  => `Minimum ${params.requiredLength} characters are required`,
    'pattern'   : (params: any| null)  => `Invalid format`,
    'min'       : (params: any| null)  => `Minimum amount should be ₹ ${params.min}`,
    'whitespace': (params: any| null)  => `White spaces are not allowed`
  };
  
  errorMsgList: any = [];

  listErrors() {
    if (!this.fieldControl) return [];

    if (this.fieldControl.errors) {
      this.errorMsgList = [];
      Object.keys(this.fieldControl.errors).forEach( (error:string) => {
        console.log(this.fieldControl.errors);
        let errorMessage = this.fieldControl.touched || this.fieldControl.dirty ?
          this.errorMessage[error](error):`undefined error type ${error}`;
          this.errorMsgList.push(errorMessage);
      });
      return this.errorMsgList;
    } else {
      return [];
    }
  }
}
