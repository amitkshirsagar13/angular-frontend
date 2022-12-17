import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlDirective, FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  ngOnInit() {
  }
  @Input() errors: any | null;
  @Input() showErrors: boolean;

  errorMessage: any = {
    'required'  : (params: any| null)  => `Field is required`,
    'maxlength' : (params: any| null)  => `Maximum ${params.requiredLength} characters are allowed`,
    'minlength' : (params: any| null)  => `Minimum ${params.requiredLength} characters are required`,
    'pattern'   : (params: any| null)  => `Invalid format`,
    'min'       : (params: any| null)  => `Minimum amount should be ₹ ${params.min}`,
    'whitespace': (params: any| null)  => `White spaces are not allowed`
  };
  
  errorMsgList: any = [];
  ngOnChanges() {
    this.listErrors();
  } 

  listErrors() {
    console.log('listErrors')
    this.errorMsgList = [];
    if (this.errors && this.showErrors) {
      Object.keys(this.errors).forEach( (error) => {
        let errorMessage = this.errorMessage[error](this.errors[error]);
        this.errorMsgList.push(errorMessage);
      });
    }
    return this.errorMsgList;
  }
}
