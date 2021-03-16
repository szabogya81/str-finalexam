import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  endpoint: string = 'http://localhost:3000/users';

  httpOptions = {
    headers: new HttpHeaders(
      { 'Content-Type': 'application/json' }
    )
  }

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Get all users from the database.
   * @returns on observable with all users.
   */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.endpoint}`);
  }

  /**
   * Get a specified user from the database by id.
   * @param id {number} user id.
   * @returns an observable with a user object.
   */
  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/${id}`);
  }

  getUsers(filterStr: string = '', sortKey = 'id'): Observable<User[]> {
    let url: string = this.endpoint;
    if (filterStr) {
      let filter = this.handleSpecialCharacters(filterStr);
      url = `${url}?name_like=${filter}&`;
    }
    if (sortKey) {
      url += `${filterStr ? '' : '?'}_sort=${sortKey}`;
    }
    return this.http.get<User[]>(url);
  }

  /**
   * Delete a user from the database.
   * The method is: this.http.delete
   */
  delete(user: User | number): Observable<User> {
    let id = typeof (user) === 'number' ? user : user.id;
    return this.http.delete<User>(`${this.endpoint}/${id}`, this.httpOptions);
  }

  /**
   * Create a user in the database.
   * The method is: this.http.post
   */
  create(user: User): Observable<User> {
    user.id = 0;
    return this.http.post<User>(`
      ${this.endpoint}`, user, this.httpOptions);
  }

  /**
   * Update a user in the database.
   * The method is: this.http.patch
   */
  update(user: User): Observable<User> {
    return this.http.put<User>(`
      ${this.endpoint}/${user.id}`, user, this.httpOptions);
  }

  handleSpecialCharacters(input: string): string {
    let result = input.replace(/[.$?+*^{}()[|\]\\]/g, '\\$&');
    return encodeURIComponent(result);
  }
}
