import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

interface SelectOption {
  value: string;
  text: string;
}

@Component({
  selector: 'app-hint-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './hint-form.component.html',
  styleUrl: './hint-form.component.scss'
})
export class HintFormComponent {

  @Input() group: FormGroup;


  hintTypeOptions: SelectOption[] = [
    {value: '1', text: 'Texte'},
    {value: '2', text: 'Image'},
    {value: '3', text: 'Audio'},
    {value: '4', text: 'Vidéo'},
    {value: '5', text: 'Texte + Image'},
    {value: '6', text: 'Texte + Audio'},
    {value: '7', text: 'Texte + Vidéo'},
    {value: '8', text: 'Image + Audio'},
    {value: '9', text: 'Image + Vidéo'},
    {value: '10', text: 'Audio + Vidéo'}
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  get selectedOptionText(): string {
    const selectedValue = this.form.get('hintType')?.value;
    const option = this.hintTypeOptions.find(opt => opt.value === selectedValue);
    return option ? option.text : '';
  }

  get showText(): boolean {
    return this.selectedOptionText.includes('Texte');
  }

  get showImage(): boolean {
    return this.selectedOptionText.includes('Image');
  }

  get showAudio(): boolean {
    return this.selectedOptionText.includes('Audio');
  }

  get showVideo(): boolean {
    return this.selectedOptionText.includes('Vidéo');
  }

  ngOnInit(): void {


    this.form = this.fb.group({
      hintType: [''],
      text: [''],
      image: [null],
      audio: [null],
      video: [null]
    });
  }


}
