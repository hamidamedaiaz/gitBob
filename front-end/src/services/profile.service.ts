import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Profile} from '../models/profile.model';

import {catchError, map} from 'rxjs/operators';

import {serverUrl} from "../configs/server.config";


@Injectable({
  providedIn: 'root'
})
export class ProfileService {



  private profilesUrl = serverUrl + "/profiles";

  private selectedProfileSubject = new BehaviorSubject<Profile | null>(null);

  selectedProfile$ = this.selectedProfileSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.profilesUrl).pipe(
      catchError(error => {
        console.error('Error fetching profiles:', error);
        return of([]);
      })
    );
  }

  getProfile(id: number): Observable<Profile | undefined> {
    const url = `${this.profilesUrl}/${id}`;
    return this.http.get<Profile>(url).pipe(
      catchError(error => {
        console.error('Error fetching profile:', error);
        return of(undefined);
      })
    );
  }

  searchProfiles(term: string): Observable<Profile[]> {
    if (!term.trim()) {
      return this.getProfiles();
    }

    return this.getProfiles().pipe(
      map(profiles => profiles.filter(profile =>
        profile.firstName.toLowerCase().includes(term.toLowerCase()) ||
        profile.lastName.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }


  selectProfile(profile: Profile): void {
    this.selectedProfileSubject.next(profile);
  }

  clearSelectedProfile(): void {
    this.selectedProfileSubject.next(null);
  }

  createProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.profilesUrl, profile).pipe(
      catchError(error => {
        console.error('Error creating profile:', error);
        throw error;
      })
    );
  }

  updateProfile(id: number, profile: Profile): Observable<Profile> {
    const url = `${this.profilesUrl}/${id}`;
    return this.http.put<Profile>(url, profile).pipe(
      catchError(error => {
        console.error('Error updating profile:', error);
        throw error;
      })
    );
  }

  deleteProfile(id: number): Observable<void> {
    const url = `${this.profilesUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(error => {
        console.error('Error deleting profile:', error);
        throw error;
      })
    );
  }
}
