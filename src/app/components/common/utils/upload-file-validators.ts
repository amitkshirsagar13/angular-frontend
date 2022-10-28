import { FormControl } from '@angular/forms';

export function fileValidationRules( types: string[], maxAllowedSize:number ) {
  return function ( control: FormControl ) {
    const file = control.value;
    if ( file ) {
      const extension = file.name.split('.')[1].toLowerCase();
      if ( !types.map((type) => type.toLowerCase()).includes(extension.toLowerCase()) ) {
        return {
          requiredFileType: true
        };
      }
      const size = file.size / 1024;
      if ( size > maxAllowedSize ) {
        return {
          requiredFileSize: true
        };
      }
    }
    return null;
  };
}
