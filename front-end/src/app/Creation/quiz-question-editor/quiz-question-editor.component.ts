import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Question} from "../../../models/question.model";
import {ImageWithPreview} from "../../../models/pair.model";


@Component({
  selector: 'app-quiz-question-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-question-editor.component.html',
  styleUrls: ['./quiz-question-editor.component.scss']
})
export class QuizQuestionEditorComponent {
  @Input() questions: Question[] = [];
  currentQuestionIndex: number = 0;


  selectQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }


  getCurrentQuestionType(): Question['type'] {
    return this.questions[this.currentQuestionIndex]?.type || 'action-objet';
  }

  setQuestionType(type: Question['type']): void {
    this.questions[this.currentQuestionIndex].type = type;
  }


  addPair(): void {
    this.questions[this.currentQuestionIndex].pairs.push({
      description: "",
      sourceImage: undefined,
      targetImage: undefined
    });
    this.questions[this.currentQuestionIndex].pairsCount = this.questions[this.currentQuestionIndex].pairs.length;
  }


  removePair(index: number): void {
    const pairs = this.questions[this.currentQuestionIndex].pairs;
    if (pairs.length > 1) {
      pairs.splice(index, 1);
      this.questions[this.currentQuestionIndex].pairsCount = pairs.length;
    }
  }

  onFileSelected(event: Event, pairIndex: number, imageType: 'source' | 'target'): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length && this.questions[this.currentQuestionIndex]?.pairs?.[pairIndex]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const preview = reader.result as string;

        const imageWithPreview: ImageWithPreview = {
          file,
          preview
        };

        const pair = this.questions[this.currentQuestionIndex].pairs[pairIndex];
        if (imageType === 'source') {
          pair.sourceImage = imageWithPreview;
        } else {
          pair.targetImage = imageWithPreview;
        }
      };

      reader.readAsDataURL(file);
    }
  }


  updatePairsCount(): void {
    const question = this.questions[this.currentQuestionIndex];
    const currentCount = question.pairs.length;
    const desiredCount = question.pairsCount;

    if (desiredCount > currentCount) {
      for (let i = currentCount; i < desiredCount; i++) {
        question.pairs.push({
          description: '',
          sourceImage: undefined,
          targetImage: undefined
        });
      }
    } else if (desiredCount < currentCount) {
      question.pairs.splice(desiredCount, currentCount - desiredCount);
    }
  }

}
