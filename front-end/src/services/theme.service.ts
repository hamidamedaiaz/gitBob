import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Theme } from '../models/theme.model';
import {serverUrl} from "../configs/server.config";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiUrl = serverUrl + "/themes";

  constructor(private http: HttpClient) {}


  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching themes:', error);
        return of([]);
      })
    );
  }


  getThemeById(id: string): Observable<Theme> {
    return this.http.get<Theme>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching theme by id:', error);
        throw error;
      })
    );
  }


  addTheme(theme: Theme): Observable<Theme> {
    return this.http.post<Theme>(this.apiUrl, theme).pipe(
      catchError(error => {
        console.error('Error adding theme:', error);
        throw error;
      })
    );
  }


  updateTheme(theme: Theme): Observable<Theme> {
    return this.http.put<Theme>(`${this.apiUrl}/${theme.id}`, theme).pipe(
      catchError(error => {
        console.error('Error updating theme:', error);
        throw error;
      })
    );
  }


  deleteTheme(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting theme:', error);
        throw error;
      })
    );
  }
}
