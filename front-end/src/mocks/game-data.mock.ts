import {SourceImage, TargetImage} from '../models/game.model';


export const LEVEL_1_SOURCE_IMAGES: SourceImage[] = [
  {id: 2, src: 'assets/ballon.jpg', alt: 'Ballon', pair: 2},
  {id: 1, src: 'assets/brosee.png', alt: 'brosse à dents', pair: 1},

  {id: 3, src: 'assets/crayon.jpg', alt: 'Crayon', pair: 3}
];

export const LEVEL_1_TARGET_IMAGES: TargetImage[] = [
  {id: 1, src: 'assets/brosser-dents.png', alt: 'Se brosser les dents', label: 'Se brosser les dents', pair: 1},
  {id: 2, src: 'assets/jouer-ballon.jpg', alt: 'Jouer au ballon', label: 'Jouer au ballon', pair: 2},
  {id: 3, src: 'assets/ecrire.jpg', alt: 'Écrire', label: 'Écrire', pair: 3}
];

export const LEVEL_3_SOURCE_IMAGES: SourceImage[] = [
  {id: 4, src: 'assets/pic1.png', alt: 'Étape 1', pair: 4},
  {id: 6, src: 'assets/pic3.png', alt: 'Étape 3', pair: 6},
  {id: 5, src: 'assets/pic2.png', alt: 'Étape 2', pair: 5},

];

export const LEVEL_3_TARGET_IMAGES: TargetImage[] = [
  {id: 4, src: 'assets/prendreServiette.png', alt: 'Prendre une assiette', label: 'Prendre une assiette', pair: 4},
  {id: 5, src: 'assets/manger.png', alt: 'Se servir du repas', label: 'Se servir du repas', pair: 5},
  {id: 6, src: 'assets/mangerCuillere.png', alt: 'Manger avec une cuillère', label: 'Manger avec une cuillère', pair: 6}
];


export const LEVEL_2_SOURCE_IMAGES: SourceImage[] = [
  {id: 8, src: 'assets/pairs/chaussures.png', alt: 'Lacet de chaussure', pair: 8},
  {id: 7, src: 'assets/pairs/fourchette.png', alt: 'Fourchette', pair: 7},
  {id: 9, src: 'assets/crayon.jpg', alt: 'Crayon', pair: 9},

];

export const LEVEL_2_TARGET_IMAGES: TargetImage[] = [
  {id: 7, src: 'assets/pairs/faireunenoeud.png', alt: 'Faire un nœud', label: 'Faire un nœud', pair: 8},
  {id: 8, src: 'assets/pairs/ecrirelettre.png', alt: 'Écrire une lettre', label: 'Écrire une lettre', pair: 9},
  {id: 9, src: 'assets/pairs/pickeraliment.png', alt: 'Piquer un aliment', label: 'Piquer un aliment', pair: 7}
];


export const GAME_LEVELS = [
  {
    id: 1,
    name: 'Objets et Actions',
    description: 'Associe chaque objet à l\'action correspondante',
    sourceImages: LEVEL_1_SOURCE_IMAGES,
    targetImages: LEVEL_1_TARGET_IMAGES,
    difficulty: 'easy'
  },
  {
    id: 2,
    name: 'Succession d\'actions quotidiennes',
    description: 'Replace les étapes dans le bon ordre pour réaliser une tâche',
    sourceImages: LEVEL_2_SOURCE_IMAGES,
    targetImages: LEVEL_2_TARGET_IMAGES,
    difficulty: 'medium'
  },
  {
    id: 3,
    name: 'Actions de motricité fine',
    description: 'Associe l\'objet à l\'action précise demandant de la coordination',
    sourceImages: LEVEL_3_SOURCE_IMAGES,
    targetImages: LEVEL_3_TARGET_IMAGES,
    difficulty: 'hard'
  }
];
