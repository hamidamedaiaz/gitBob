import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private resetFeedbackSource = new Subject<void>();
  resetFeedback$ = this.resetFeedbackSource.asObservable();

  resetFeedback(): void {
    this.resetFeedbackSource.next();
  }
}
