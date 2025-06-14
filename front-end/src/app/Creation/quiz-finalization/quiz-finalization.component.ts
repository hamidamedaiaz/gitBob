import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup} from '@angular/forms';
import {QuizConfig} from '../../../models/quiz-config.model';

@Component({
  selector: 'app-quiz-finalization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-finalization.component.html',
  styleUrls: ['./quiz-finalization.component.scss']
})
export class QuizFinalizationComponent {
  /** FormGroup de la création, injecté par le parent */
  @Input() generalInfoForm!: FormGroup;
  /** Données de configuration avancée, injectées par le parent */
  @Input() configData!: Partial<QuizConfig>;
  /** Callback pour récupérer le nom du thème, injecté par le parent */
  @Input() getThemeName!: (themeId: string) => string;
  /** Callback de navigation vers la configuration avancée, injecté par le parent */
  @Input() navigateToAdvancedConfig!: () => void;

  /** Check if theme is currently loading */
  isThemeLoading(): boolean {
    const themeName = this.getThemeDisplayName();
    return themeName === 'Chargement des thèmes...' || themeName === 'Chargement...';
  }

  /** Get theme display name with fallback */
  getThemeDisplayName(): string {
    const themeId = this.generalInfoForm?.get('theme')?.value;
    if (!themeId) {
      return 'Aucun thème sélectionné';
    }
    return this.getThemeName ? this.getThemeName(themeId) : 'Thème non disponible';
  }

  /** Retourne une étiquette lisible pour la taille de la police */
  getFontSizeLabel(size: number = 0): string {
    if (size < 14) return 'Petite';
    if (size <= 18) return 'Normale';
    if (size <= 24) return 'Grande';
    return 'Très grande';
  }

  /** Retourne une étiquette lisible pour la taille de l'image */
  getImageSizeLabel(size: number = 0): string {
    if (size < 50) return 'Petit';
    if (size <= 80) return 'Moyen';
    return 'Grand';
  }

  /** Retourne une étiquette lisible pour la luminosité */
  getLuminosityLabel(lum: number = 0): string {
    if (lum < 40) return 'Faible';
    if (lum <= 70) return 'Moyenne';
    return 'Élevée';
  }
}
