import {Quiz} from '../models/quiz.model';

export const QUIZ_LIST: Quiz[] = [
  // ------------ CULTURE GÉNÉRALE QUIZZES ------------
  {
    id: 1,

    name: 'Quiz de Culture Générale - Niveau 1',
    theme: 'culture-generale',
    config: {
      taillePolice: 14,
      tailleImage: 30,
      luminosite: 70,
      feedbackSucces: "Bravo, c'est la bonne réponse!",
      feedbackEchec: "Dommage, réessaie.",
      typeIndice: true,
      chronometre: true,
      ordreAleatoire: false,
      background: {
        type: 'color',
        value: '#ffffff'
      },
      hint: {
        text: "Regardez bien les détails...",
        image: null,
        audio: null,
        video: null
      }
    },
  },
  {
    id: 2,

    name: 'Quiz de Culture Générale - Niveau 2',
    theme: 'culture-generale',
    config: {
      taillePolice: 14,
      tailleImage: 30,
      luminosite: 70,
      feedbackSucces: "Excellent travail!",
      feedbackEchec: "Pas tout à fait, essayez encore.",
      typeIndice: true,
      chronometre: true,
      ordreAleatoire: false,
      background: {
        type: 'color',
        value: '#f0f8ff'
      },
      hint: {
        text: "Pensez à la géographie...",
        image: null,
        audio: null,
        video: null
      }
    }
  },

  // ------------ ANIMAUX QUIZZES ------------
  {
    id: 3,
    name: 'Quiz des Animaux - Débutant',
    theme: 'animals',
    config: {
      taillePolice: 16,
      tailleImage: 40,
      luminosite: 80,
      feedbackSucces: "Super! Tu connais bien les animaux!",
      feedbackEchec: "Ce n'est pas ça, essaie encore!",
      typeIndice: true,
      chronometre: false,
      ordreAleatoire: true,
      background: {
        type: 'color',
        value: '#e6ffe6'
      },
      hint: {
        text: "Écoutez le son que fait l'animal...",
        image: null,
        audio: null,
        video: null
      }
    }
  },
  {
    id: 4,
    name: 'Quiz des Animaux - Avancé',
    theme: 'animals',
    config: {
      taillePolice: 14,
      tailleImage: 35,
      luminosite: 65,
      feedbackSucces: "Excellent! Tu es un expert des animaux!",
      feedbackEchec: "Pas tout à fait correct, réessaie!",
      typeIndice: true,
      chronometre: true,
      ordreAleatoire: false,
      background: {
        type: 'color',
        value: '#d9f2d9'
      },
      hint: {
        text: "Pensez aux continents où vivent ces animaux...",
        image: null,
        audio: null,
        video: null
      }
    }
  },

  // ------------ COLORS AND SHAPES QUIZZES ------------
  {
    id: 5,
    name: 'Couleurs et Formes - Niveau 1',
    theme: 'colors',
    config: {
      taillePolice: 18,
      tailleImage: 45,
      luminosite: 90,
      feedbackSucces: "Bravo! Tu reconnais bien les couleurs et les formes!",
      feedbackEchec: "Essaie encore, tu peux y arriver!",
      typeIndice: false,
      chronometre: false,
      ordreAleatoire: true,
      background: {
        type: 'color',
        value: '#fffaf0'
      },
      hint: {
        text: "Regarde autour de toi pour trouver cette couleur...",
        image: null,
        audio: null,
        video: null
      }
    }
  },
  {
    id: 6,
    name: 'Couleurs et Formes - Niveau 2',
    theme: 'colors',
    config: {
      taillePolice: 16,
      tailleImage: 40,
      luminosite: 85,
      feedbackSucces: "Parfait! Tu connais bien les nuances!",
      feedbackEchec: "Pas tout à fait, observe mieux les couleurs!",
      typeIndice: true,
      chronometre: true,
      ordreAleatoire: false,
      background: {
        type: 'color',
        value: '#f0f8ff'
      },
      hint: {
        text: "Pense au mélange des couleurs primaires...",
        image: null,
        audio: null,
        video: null
      }
    }
  },

  // ------------ DAILY OBJECTS QUIZZES ------------
  {
    id: 7,
    name: 'Objets du Quotidien - Débutant',
    theme: 'daily-objects',
    config: {
      taillePolice: 16,
      tailleImage: 35,
      luminosite: 75,
      feedbackSucces: "Bravo! Tu connais bien les objets du quotidien!",
      feedbackEchec: "Ce n'est pas ça, essaie encore!",
      typeIndice: true,
      chronometre: false,
      ordreAleatoire: true,
      background: {
        type: 'color',
        value: '#fff5e6'
      },
      hint: {
        text: "Pense à ce que tu utilises pour...",
        image: null,
        audio: null,
        video: null
      }
    }
  },
  {
    id: 8,
    name: 'Objets du Quotidien - Avancé',
    theme: 'daily-objects',
    config: {
      taillePolice: 14,
      tailleImage: 30,
      luminosite: 70,
      feedbackSucces: "Excellent! Tu es un expert!",
      feedbackEchec: "Pas tout à fait correct, réessaie!",
      typeIndice: true,
      chronometre: true,
      ordreAleatoire: false,
      background: {
        type: 'color',
        value: '#ffebcc'
      },
      hint: {
        text: "Pense à l'usage de cet objet...",
        image: null,
        audio: null,
        video: null
      }
    }
  }
];
