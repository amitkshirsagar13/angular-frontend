import { Component, Input, OnInit } from '@angular/core';
import { InputError } from './error.model';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  ngOnInit() {}
  @Input() error: InputError | null;
  @Input() showAllErrors: boolean = false;

  errorMessage: any = {
    'required'  : (params: any| null)  => `Field is required`,
    'maxlength' : (params: any| null)  => `Maximum ${params.requiredLength} characters are allowed`,
    'minlength' : (params: any| null)  => `Minimum ${params.requiredLength} characters are required`,
    'pattern'   : (params: any| null)  => `Invalid format|pattern`,
    'min'       : (params: any| null)  => `Minimum value allowed ${params.min}`,
    'max'       : (params: any| null)  => `Maximum value allowed ${params.max}`,
    'whitespace': (params: any| null)  => `White spaces are not allowed`,
    'requiredFileType': (params: any| null)  => `Only ${params.types} 🤡`,
    'requiredFileSize': (params: any| null)  => `Allowed only size ${params.maxAllowedSize}kb 🤡`,
    'rangeInvalid': (params: any| null)  => `Min value should be smaller than max value`,
    'invalidMin'  : (params: any| null)  => `Maximum value allowed ${params.allowedMin}`,
    'invalidMax'  : (params: any| null)  => `Maximum value allowed ${params.allowedMax}`,
  };
  
  errorMsgList: any = [];

  ngOnChanges() {
    this.showErrors();
  }

  showErrors() {
    this.errorMsgList = [];
    if (this.error && this.error.canShow) {
      const errors = Array.isArray(this.error.items) ? this.error.items : Object.keys(this.error.items);
      errors.forEach( (error) => {
        const msgFn = this.errorMessage[error];

        let errorMessage = msgFn ? msgFn(this.error?.items[error]): `Undefined error with key: ${error}`;
        this.errorMsgList.push(errorMessage);
      });
    }
    return this.errorMsgList;
  }
}
