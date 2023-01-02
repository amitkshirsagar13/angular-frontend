import { Component, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputError } from '../error/error.model';
import { executeFilters } from '../keyEventFilter';

@Component({
  selector: 'app-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements ControlValueAccessor {

  @Input()
  id: string;

  @Input()
  type: string;

  @Input()
  label: string;

  @Input()
  showLabel: boolean;

  @Input()
  placeholder: string;

  @Input()
  error: InputError;

  @Input()
  allowedFilters: any;

  onChange: any = () => {}

  onTouch: any = () => {}

  filterKeystrokes(event: any): Boolean {
    if(!this.allowedFilters) {
      return true;
    }
    return executeFilters(event, this.allowedFilters);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  input: string;

  writeValue(input: string) {
    this.input = input;
  }
}
