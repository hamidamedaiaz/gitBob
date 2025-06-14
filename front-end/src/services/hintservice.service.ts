// hint.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HintService {

  private highlightedSourceIdSubject = new BehaviorSubject<number | null>(null);
  highlightedSourceId$: Observable<number | null> = this.highlightedSourceIdSubject.asObservable();
  private highlightedTargetIdSubject = new BehaviorSubject<number | null>(null);
  highlightedTargetId$: Observable<number | null> = this.highlightedTargetIdSubject.asObservable();

  constructor() {
  }


  highlightPair(sourceId: number, targetId: number, durationMs: number = 5000): void {

    this.highlightedSourceIdSubject.next(sourceId);
    this.highlightedTargetIdSubject.next(targetId);


    setTimeout(() => {
      this.clearHighlights();
    }, durationMs);
  }


  clearHighlights(): void {
    this.highlightedSourceIdSubject.next(null);
    this.highlightedTargetIdSubject.next(null);
  }


  isSourceHighlighted(id: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.highlightedSourceId$.subscribe(highlightedId => {
        observer.next(highlightedId === id);
      });
    });
  }

  isTargetHighlighted(id: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.highlightedTargetId$.subscribe(highlightedId => {
        observer.next(highlightedId === id);
      });
    });
  }
}
