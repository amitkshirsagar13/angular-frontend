import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { fileValidationRules } from '../../common/utils/validators/upload-file-validators';

import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { convertFileToBase64 } from '../../common/utils/fileToBase64';
import { markAllAsDirty, toFilePayload, toPayload } from '../../common/utils/forms/form-processor';
import { InputError } from '../../common/utils/forms/error/error.model';

export function uploadProgress<T>( cb: ( progress: number ) => void ) {
  return tap(( event: HttpEvent<T> ) => {
    if ( event.type === HttpEventType.UploadProgress && event.total) {
      let total: number = event.total;
      cb(Math.round((100 * event.loaded) / total));
    }
  });
}

export function toResponseBody<T>() {
  return pipe(
    map(( event: HttpEvent<T> ) => {
      if(event.type === HttpEventType.Response) {
        return event.body;
      }
      return undefined;
    })
  );
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.createOrRecreateForm();
  }
  
  // Always create method createForm and call it from the constructor
  reactiveForm: FormGroup;
  createOrRecreateForm() {
    this.reactiveForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.minLength(5)]],
      productMaterial: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(10), Validators.max(1000)]],
      department: ['', [Validators.required]],
      
      // product image upload can be validated only with change, and not with blur
      productImage: [
        // default value
        '',
        // options/validators
        {
          validators: [Validators.required, fileValidationRules(['jpg','png'], 30)],
          updateOn: 'change'
        }
      ]
    }, 
    // for all fields default validation trigger is blur [change|blur|submit]
    { updateOn: 'blur' }
    );
  }

  progress: number = 0;
  success: boolean = false;
  backend: string = environment.backend;

  showLabel: boolean = true;

  ngOnInit(): void {
    this.reactiveForm.controls['productImage'].valueChanges.subscribe((file: any) => {
      setTimeout(async () => {
        const previewImageElement = document.getElementById('previewImage');
        if(this.reactiveForm.controls['productImage'].valid) {
          const imageData: any = await convertFileToBase64(file);
          previewImageElement?.setAttribute('src', imageData);
          // document.getElementById('previewFileImage')?.setAttribute('src', imageData);
        } else {
          previewImageElement?.removeAttribute('src');
        }
      })
    });
  }

  async onSubmit() {
    this.success = false;
    if ( !this.reactiveForm.valid ) {
      markAllAsDirty(this.reactiveForm);
      return;
    }
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar', 'Content-Type': 'application/json' };
    const jsonPayload = await toPayload(this.reactiveForm.value, ['productImage']);
    const filePayload = await toFilePayload(this.reactiveForm.value, ['productImage']);

    this.http.post(this.backend + '/products', filePayload, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      uploadProgress((progress) => {
        this.progress = progress;
        console.log(progress);
      }),
      toResponseBody()
    ).subscribe((uploadRes: any) => {
      if(uploadRes) {
        jsonPayload['productImage'] = uploadRes.filePath;
        this.processFormSubmission(headers, jsonPayload);
      }
      
    });
  }
  processFormSubmission(headers: any, jsonPayload: any) {
    this.http.post(this.backend + '/products', jsonPayload, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      uploadProgress((progress) => {
        this.progress = progress;
      }),
      toResponseBody()
    ).subscribe((res) => {
      console.log(res);
      setTimeout(() => {
        this.progress = 0;
      }, 5000);
      this.success = true;
      this.reactiveForm.reset();
    });
  }

  error(field: string): InputError {
    const control:any = this.reactiveForm.get(field);
    return {
      canShow: control.touched || control.dirty,
      items: control.errors ? control.errors : {},
      field
    };
  }
}
