import { AbstractControl, FormControl } from '@angular/forms';

export const rangeValidator = ( minProperty: string, maxProperty: string, minValueRef: number = 0, maxValueRef: number = 10000 ) => {
  return ( group: AbstractControl) => {
    const minControl: AbstractControl | null = group.get(minProperty);
    const maxControl: AbstractControl | null = group.get(maxProperty);

    const minValue = minControl?.value;
    const maxValue = maxControl?.value;
    const errors: any = {};    
    if ( minValue && maxValue) {
      if ( minValue >= maxValue ) {
        errors.rangeInvalid = true
      }
    }
    
    if ( minValue ) {
      if ( minValue < minValueRef ) {
        errors.invalidMin= {
            allowedMin: minValueRef
          }
      }
    }

    if ( maxValue ) {
      if ( maxValue > maxValueRef ) {
        errors.invalidMax= {
            allowedMax: maxValueRef
          }
      }
    }

    return errors;
  };
}
