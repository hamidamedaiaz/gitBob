// front-end/src/services/quiz-builder.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Quiz } from '../models/quiz.model';
import { QuizConfig } from '../models/quiz-config.model';
import { Question } from '../models/question.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizBuilderService {
  private apiUrl = 'http://localhost:9428/api';

  // Store creation data
  private creationDataSubject = new BehaviorSubject<Partial<{
    name: string;
    theme: string;
    questions: Question[];
  }>>({});

  // Store config data with ALL required fields initialized
  private configDataSubject = new BehaviorSubject<Partial<QuizConfig>>({
    taillePolice: 16,
    tailleImage: 100,
    luminosite: 100,
    feedbackSucces: 'Bravo !',
    feedbackEchec: 'Essaye encore !',
    typeIndice: false,
    chronometre: false,
    ordreAleatoire: false,
    background: {
      type: 'color',
      value: '#ffffff'
    },
    hint: {
      text: '',
      image: null,
      audio: null,
      video: null
    }
  });

  creationData$ = this.creationDataSubject.asObservable();
  configData$ = this.configDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  setCreationData(data: Partial<{
    name: string;
    theme: string;
    questions: Question[];
  }>): void {
    const current = this.creationDataSubject.value;
    this.creationDataSubject.next({ ...current, ...data });
  }

  setConfigData(config: Partial<QuizConfig>): void {
    const current = this.configDataSubject.value;
    // Merge new config with existing to maintain all required fields
    this.configDataSubject.next({ ...current, ...config });
  }

  getFinalQuizSync(): any {
    const creationData = this.creationDataSubject.value;
    const configData = this.configDataSubject.value;

    console.log('Creation data:', creationData);
    console.log('Config data:', configData);

    // Ensure all required config fields are present
    const finalConfig: QuizConfig = {
      taillePolice: configData.taillePolice ?? 16,
      tailleImage: configData.tailleImage ?? 100,
      luminosite: configData.luminosite ?? 100,
      feedbackSucces: configData.feedbackSucces || 'Bravo !',
      feedbackEchec: configData.feedbackEchec || 'Essaye encore !',
      typeIndice: configData.typeIndice ?? false,
      chronometre: configData.chronometre ?? false,
      ordreAleatoire: configData.ordreAleatoire ?? false,
      background: configData.background || {
        type: 'color',
        value: '#ffffff'
      },
      hint: configData.hint || {
        text: '',
        image: null,
        audio: null,
        video: null
      }
    };

    // Transform questions to match backend format
    const transformedQuestions = (creationData.questions || []).map(q => ({
      type: q.type,
      pairsCount: q.pairsCount,
      pairs: (q.pairs || []).map(p => ({
        description: p.description || '',
        sourceImage: {
          file: p.sourceImage?.preview || 'placeholder.jpg',
          preview: p.sourceImage?.preview || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        targetImage: {
          file: p.targetImage?.preview || 'placeholder.jpg',
          preview: p.targetImage?.preview || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        }
      }))
    }));

    const quiz = {
      name: creationData.name || '',
      theme: creationData.theme || '',
      config: finalConfig,
      questions: transformedQuestions
    };

    console.log('Final quiz to be sent:', quiz);
    return quiz;
  }

  createQuiz(quiz: any): Observable<Quiz> {
    console.log('Sending quiz to backend:', quiz);

    return this.http.post<Quiz>(`${this.apiUrl}/quizzes`, quiz).pipe(
      tap(response => {
        console.log('Quiz created successfully:', response);
      }),
      catchError(error => {
        console.error('Error creating quiz:', error);
        console.error('Error details:', error.error);
        return throwError(() => error);
      })
    );
  }

  deleteQuiz(quizId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/quizzes/${quizId}`).pipe(
      tap(() => {
        console.log(`Quiz ${quizId} deleted successfully.`);
      }),
      catchError(error => {
        console.error(`Error deleting quiz with ID ${quizId}:`, error);
        return throwError(() => error);
      })
    );
  }

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/quizzes`).pipe(
      catchError(error => {
        console.error('Error fetching quizzes:', error);
        return throwError(() => error);
      })
    );
  }

  getQuizById(quizId: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/quizzes/${quizId}`).pipe(
      tap(quiz => {
        console.log('Quiz loaded by ID:', quiz);
      }),
      catchError(error => {
        console.error(`Error fetching quiz with ID ${quizId}:`, error);
        return throwError(() => error);
      })
    );
  }

  updateQuiz(quizId: string, quiz: any): Observable<Quiz> {
    console.log('Updating quiz with ID:', quizId, quiz);

    return this.http.put<Quiz>(`${this.apiUrl}/quizzes/${quizId}`, quiz).pipe(
      tap(response => {
        console.log('Quiz updated successfully:', response);
      }),
      catchError(error => {
        console.error('Error updating quiz:', error);
        console.error('Error details:', error.error);
        return throwError(() => error);
      })
    );
  }

  // ✅ CORRECTION : Fonction pour charger un quiz pour édition
  loadQuizForEdit(quizId: string): Observable<void> {
    return this.getQuizById(quizId).pipe(
      map(quiz => {
        console.log('Loading quiz for edit:', quiz);
        
        // ✅ Convertir les questions du backend vers le format d'édition
        const editableQuestions: Question[] = quiz.questions?.map(q => ({
          id: q.id,
          type: q.type,
          pairsCount: q.pairs?.length || 1,
          // ✅ CORRECTION PRINCIPALE : Utiliser les bons chemins d'images
          pairs: q.pairs?.map(p => ({
            description: p.description || '',
            sourceImage: {
              // ✅ Créer un fichier factice mais garder le preview pour l'affichage
              file: new File([], 'existing-image.jpg'),
              // ✅ Utiliser le chemin de l'image stockée sur le serveur
              preview: p.sourceImage?.file ? `http://localhost:9428${p.sourceImage.file}` : p.sourceImage?.preview || ''
            },
            targetImage: {
              file: new File([], 'existing-image.jpg'),
              preview: p.targetImage?.file ? `http://localhost:9428${p.targetImage.file}` : p.targetImage?.preview || ''
            }
          })) || []
        })) || [];

        console.log('Converted questions for editing:', editableQuestions);

        // ✅ Mettre à jour les subjects avec les données converties
        this.setCreationData({
          name: quiz.name,
          theme: quiz.theme || '',
          questions: editableQuestions
        });

        this.setConfigData(quiz.config);
      }),
      catchError(error => {
        console.error('Error loading quiz for edit:', error);
        return throwError(() => error);
      })
    );
  }

  reset(): void {
    // Reset to default values
    this.creationDataSubject.next({});
    this.configDataSubject.next({
      taillePolice: 16,
      tailleImage: 100,
      luminosite: 100,
      feedbackSucces: 'Bravo !',
      feedbackEchec: 'Essaye encore !',
      typeIndice: false,
      chronometre: false,
      ordreAleatoire: false,
      background: {
        type: 'color',
        value: '#ffffff'
      },
      hint: {
        text: '',
        image: null,
        audio: null,
        video: null
      }
    });
  }

  /**
   * ✅ Prépare les données finales pour la mise à jour
   */
  getFinalQuizForUpdate(): any {
    return this.getFinalQuizSync(); // Même logique que la création
  }
}