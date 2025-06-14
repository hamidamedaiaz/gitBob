import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FileInputComponent} from "../file-input/file-input.component";
import {TextInputComponent} from "../text-input/text-input.component";
import {CommonModule} from "@angular/common";
import {ButtonCComponent} from "../button-c/button-c.component";


interface Pair {
  image1?: File;
  image2?: File;
  description?: string;
}

@Component({
  selector: 'app-paires',
  templateUrl: './paires.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FileInputComponent,
    TextInputComponent,
    ButtonCComponent,

  ],
  styleUrls: ['./paires.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PairesComponent),
      multi: true
    }
  ]
})
export class PairesComponent implements ControlValueAccessor {

  pairs: Pair[] = [];

  onChange: (value: any) => void = () => {
  };
  onTouched: () => void = () => {
  };


  writeValue(value: any): void {
    if (Array.isArray(value)) {
      this.pairs = value;
    } else {
      this.pairs = [];
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


  addPair(): void {
    this.pairs.push({image1: undefined, image2: undefined, description: ''});
    this.onChange(this.pairs);
  }


  updatePairImage1(index: number, file: File): void {
    this.pairs[index].image1 = file;
    this.onChange(this.pairs);
  }


  updatePairImage2(index: number, file: File): void {
    this.pairs[index].image2 = file;
    this.onChange(this.pairs);
  }


  updatePairDescription(index: number, description: string): void {
    this.pairs[index].description = description;
    this.onChange(this.pairs);
  }


  removePair(index: number): void {
    this.pairs.splice(index, 1);
    this.onChange(this.pairs);
  }

  onPairDescriptionInput(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.updatePairDescription(index, value);
  }

}
