import { FormControl } from '@angular/forms';

export const fileValidationRules = ( types: string[], maxAllowedSize:number = 1024 * 1024) => {
  return ( control: FormControl ) => {
    const file = control.value;
    if ( file ) {
      const extension = file.name.split('.')[1].toLowerCase();
      if ( !types.map((type) => type.toLowerCase()).includes(extension.toLowerCase()) ) {
        return {
          requiredFileType: { types, extension }
        };
      }
      const size = file.size / 1024;
      if ( size > maxAllowedSize ) {
        return {
          requiredFileSize: { maxAllowedSize, size }
        };
      }
    }
    return null;
  };
}
