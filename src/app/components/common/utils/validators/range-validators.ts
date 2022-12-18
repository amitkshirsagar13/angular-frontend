import { AbstractControl, FormControl } from '@angular/forms';

export function rangeValidator( minProperty: string, maxProperty: string ) {
  return function ( group: AbstractControl) {
    const minControl: AbstractControl | null = group.get(minProperty);
    const maxControl: AbstractControl | null = group.get(maxProperty);

    const minValue = minControl?.value;
    const maxValue = maxControl?.value;
    
    if ( minValue && maxValue) {
      if ( minValue >= maxValue ) {
        return {
          rangeInvalid: true
        };
      }
    }
    return null;
  };
}
