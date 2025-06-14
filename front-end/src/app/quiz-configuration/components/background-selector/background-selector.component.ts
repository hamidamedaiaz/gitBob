import {Component, forwardRef} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-background-selector',
  standalone: true,
  imports: [
    NgStyle,
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './background-selector.component.html',
  styleUrl: './background-selector.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BackgroundSelectorComponent),
    multi: true
  }]
})
export class BackgroundSelectorComponent implements ControlValueAccessor {
  value: { type: string, value: string } = {type: 'color', value: '#3498db'};

  selectedOption: 'color' | 'presetImage' | 'customImage' = 'color';

  presetColors = [
    {nom: 'Bleu', valeur: '#3498db'},
    {nom: 'Rouge', valeur: '#e74c3c'},
    {nom: 'Vert', valeur: '#2ecc71'}
  ];

  presetImages = [
    {nom: 'Image 1', url: 'assets/background.jpg'},
  ];

  selectedColor: string = this.presetColors[0].valeur;
  selectedImageUrl: string = this.presetImages[0].url;
  customImageData: string | null = null;

  get backgroundStyle(): { [key: string]: string } {
    if (this.selectedOption === 'color') {
      return {'background-color': this.selectedColor};
    }
    if (this.selectedOption === 'presetImage') {
      return {'background-image': `url(${this.selectedImageUrl})`};
    }
    if (this.selectedOption === 'customImage' && this.customImageData) {
      return {'background-image': `url(${this.customImageData})`};
    }
    return {};
  }

  onOptionChange(): void {
    if (this.selectedOption === 'color') {

      this.value = {type: 'color', value: this.selectedColor};
    } else if (this.selectedOption === 'presetImage') {

      this.value = {type: 'presetImage', value: this.selectedImageUrl};
    } else if (this.selectedOption === 'customImage' && this.customImageData) {
      this.value = {type: 'customImage', value: this.customImageData};
    }

    this.onChange(this.value);
    this.onTouched();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file: File = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.customImageData = reader.result as string;
        this.value = {type: 'image', value: this.customImageData};
        this.onChange(this.value);
        this.onTouched();
      };
      reader.readAsDataURL(file);
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;

      if (value.type === 'color') {
        this.selectedOption = 'color';
        this.selectedColor = value.value;
      } else {
        this.selectedOption = 'presetImage';
        this.selectedImageUrl = value.value;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onChange: (value: any) => void = () => {
  };

  private onTouched: () => void = () => {
  };
}
