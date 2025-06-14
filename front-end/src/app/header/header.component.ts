import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ]
})
export class HeaderComponent implements OnInit {
  isSidebarCollapsed = false;
  isManagementMenuOpen = false;

  profileName = 'Er. Claire';
  profileImage = 'assets/ergotherapeute.jpg';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (this.isSidebarCollapsed) {
        mainContent.setAttribute('style', 'margin-left: 50px');
      } else {
        mainContent.setAttribute('style', 'margin-left: 250px');
      }
    }
  }

  toggleManagementMenu(): void {
    this.isManagementMenuOpen = !this.isManagementMenuOpen;
  }
}
