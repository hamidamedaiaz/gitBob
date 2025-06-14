import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game-home',
  templateUrl: './game-home.component.html',
  styleUrls: ['./game-home.component.scss']
})
export class GameHomeComponent {

  constructor(private router: Router) {
  }

  createProfile(): void {
    this.router.navigate(['/management/profile/create']);
  }

  createQuiz(): void {
    this.router.navigate(['/creation']);
  }

  startGame(): void {
    const gameContainer = document.documentElement;

    if (gameContainer.requestFullscreen) {
      gameContainer.requestFullscreen()
        .then(() => {
          this.router.navigate(['/profile-selection']);
        })
        .catch(err => {
          console.error('Error attempting to enable fullscreen:', err);


          this.router.navigate(['/profile-selection']);
        });
    } else {


      console.warn('Fullscreen API is not supported by this browser');
      this.router.navigate(['/profile-selection']);
    }
  }
}
