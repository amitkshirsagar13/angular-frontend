import { FormGroup } from "@angular/forms";

export function markAllAsDirty( form: FormGroup ) {
  for ( const control of Object.keys(form.controls) ) {
    form.controls[control].markAsDirty();
  }
}

export async function toPayload( formValue: any, imageControls: string[] = []) {
  const payload: any = {};
  for ( const key of Object.keys(formValue) ) {
    if(!imageControls.includes(key)) {
      let value = formValue[key];
      payload[key] = value;
    }
  }
  payload['createdAt'] = new Date().toISOString();
  return payload;
}

export async function toFilePayload( formValue: any, imageControls: string[] = []) {
  const formData = new FormData();
  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    if(imageControls.includes(key)) {
      formData.append(key, value);
    }
  }
  return formData;
}
