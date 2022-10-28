import { FormGroup } from "@angular/forms";
import { convertFileToBase64 } from "../fileToBase64";

export function markAllAsDirty( form: FormGroup ) {
  for ( const control of Object.keys(form.controls) ) {
    form.controls[control].markAsDirty();
  }
}

export async function toPayload( formValue: any, imageControls: string[] = []) {
  const payload: any = {};
  for ( const key of Object.keys(formValue) ) {
    let value = formValue[key];
    if(imageControls.includes(key)) {
      value = await convertFileToBase64(value);
    }
    payload[key] = value;
  }
  payload['createdAt'] = new Date().toISOString();
  return payload;
}
