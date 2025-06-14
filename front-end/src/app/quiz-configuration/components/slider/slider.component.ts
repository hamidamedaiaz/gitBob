import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent implements ControlValueAccessor {

  @Input() label: string = 'Valeur';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;

  value: number = 0;
  disabled: boolean = false;

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = Number(input.value);
    this.onChange(this.value);
    this.onTouched();
  }


  writeValue(value: number): void {
    this.value = value;
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

  private onChange: (value: number) => void = () => {
  };

  private onTouched: () => void = () => {
  };
}
