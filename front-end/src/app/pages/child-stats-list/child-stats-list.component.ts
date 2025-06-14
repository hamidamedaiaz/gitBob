import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Child} from 'src/models/child.model';
import {ChildStatsService} from 'src/services/child-stats.service';

@Component({
  selector: 'app-child-stats-list',
  templateUrl: './child-stats-list.component.html',
  styleUrls: ['./child-stats-list.component.scss']
})
export class ChildStatsListComponent implements OnInit {
  children: Child[] = [];
  filteredChildren: Child[] = [];
  searchQuery: string = '';
  selectedFilter: string = 'alpha';

  constructor(private childStatsService: ChildStatsService, private router: Router) {
  }

  ngOnInit(): void {
    this.children = this.childStatsService.getChildren();
    this.filterChildren();
  }

  filterChildren(): void {

    let filtered = this.children.filter(child =>
      child.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      child.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );


    if (this.selectedFilter === 'alpha') {
      filtered.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (this.selectedFilter === 'date') {
      filtered.sort((a, b) => a.registrationDate.getTime() - b.registrationDate.getTime());
    } else if (this.selectedFilter === 'lastQuiz') {
    }
    this.filteredChildren = filtered;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.filterChildren();
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.filterChildren();
  }

  goToChildStats(childId: number): void {
    this.router.navigate(['/child-stats', childId]);
  }
}
