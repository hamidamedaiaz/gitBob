import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {PairesComponent} from '../paires/paires.component';
import {SuccessionDesTachesComponent} from '../succession-des-taches/succession-des-taches.component';

@Component({
  selector: 'app-quiztype',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PairesComponent,
    SuccessionDesTachesComponent,
    ReactiveFormsModule
  ],
  templateUrl: './quiztype.component.html',
  styleUrls: ['./quiztype.component.scss']
})
export class QUizTypeComponent {
  /** la valeur pilote l'affichage du composant */
  selectedOption: 'action-objet' | 'succession-taches' = 'action-objet';

  constructor() {
  }
}
