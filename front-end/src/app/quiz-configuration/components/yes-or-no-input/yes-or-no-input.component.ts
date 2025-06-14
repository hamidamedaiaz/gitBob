import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-yes-or-no-input',
  standalone: true,
  templateUrl: './yes-or-no-input.component.html',
  styleUrls: ['./yes-or-no-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => YesOrNoInputComponent),
    multi: true
  }]
})
export class YesOrNoInputComponent implements ControlValueAccessor {
  @Input() groupName: string = 'option';


  value: 'oui' | 'non' = 'non';
  disabled: boolean = false;

  writeValue(obj: any): void {

    const boolVal = !!obj;
    this.value = boolVal ? 'oui' : 'non';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  selectOption(option: 'oui' | 'non'): void {
    this.value = option;
    const boolVal = (option === 'oui');
    this.onChange(boolVal); // on émet true/false
    this.onTouched();
  }


  private onChange: (value: boolean) => void = () => {
  };
  private onTouched: () => void = () => {
  };
}
