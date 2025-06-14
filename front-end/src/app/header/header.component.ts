import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink, NavigationEnd} from "@angular/router";
import {NgClass, NgIf} from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    NgIf
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
    // Écouter les événements de navigation pour fermer le sidebar automatiquement
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeSidebar();
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.updateMainContentMargin();
  }

  closeSidebar(): void {
    this.isSidebarCollapsed = true;
    this.isManagementMenuOpen = false;
    this.updateMainContentMargin();
  }

  private updateMainContentMargin(): void {
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

  // Méthode pour gérer la navigation et fermer le sidebar
  navigateAndClose(route: string): void {
    this.router.navigate([route]);
    this.closeSidebar();
  }
}