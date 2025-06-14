import {Component, EventEmitter, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss']
})
export class ProfileSearchComponent {
  @Output() searchTerms = new EventEmitter<string>();

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),


      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerms.emit(term);
    });
  }

  search(term: string): void {
    this.searchSubject.next(term);
  }

  clearSearch(): void {
    this.searchSubject.next('');
  }
}
