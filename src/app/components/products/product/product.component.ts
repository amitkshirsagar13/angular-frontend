import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { fileValidationRules } from '../../common/utils/upload-file-validators';

import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { convertFileToBase64 } from '../../common/utils/fileToBase64';
import { markAllAsDirty, toPayload } from '../../common/utils/forms/form-processor';


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
  progress: number = 0;
  success: boolean = false;
  backend: string = environment.backend;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.reactiveForm.controls.productImage.valueChanges.subscribe((file: any) => {
      setTimeout(async () => {
        const previewImageElement = document.getElementById('previewImage');
        if(this.reactiveForm.controls.productImage.valid) {
          const imageData: any = await convertFileToBase64(file);
          previewImageElement?.setAttribute('src', imageData);
          document.getElementById('previewFileImage')?.setAttribute('src', imageData);
        } else {
          previewImageElement?.removeAttribute('src');
        }
      })
    });
  }

  reactiveForm = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    productMaterial: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    productImage: new FormControl('', [Validators.required, fileValidationRules(['jpg','png'], 50)])
  });

  async onSubmit() {
    console.log(this.reactiveForm.value);
    this.success = false;
    if ( !this.reactiveForm.valid ) {
      markAllAsDirty(this.reactiveForm);
      return;
    }
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar', 'Content-Type': 'application/json' };
    const payload = await toPayload(this.reactiveForm.value, ['productImage']);
    this.http.post(this.backend + '/products', payload, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      uploadProgress((progress) => {
        this.progress = progress;
      }),
      toResponseBody()
    ).subscribe(res => {
      // this.progress = 0;
      this.success = true;
      this.reactiveForm.reset();
    });
  }

  hasError( field: string, error: string ) {
    const control:any = this.reactiveForm.get(field);
    return control.dirty && control.hasError(error);
  }
}
