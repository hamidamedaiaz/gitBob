import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-quiz-association',
  standalone: true,
  imports: [],
  templateUrl: './quiz-association.component.html',
  styleUrls: ['./quiz-association.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuizAssociationComponent),
      multi: true
    }
  ]
})
export class QuizAssociationComponent implements ControlValueAccessor {

  value: string = 'enfant1';

  onChange: (value: any) => void = () => {
  };
  onTouched: () => void = () => {
  };

  writeValue(value: string): void {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.value = selectElement.value;
    this.onChange(this.value);
  }
}
