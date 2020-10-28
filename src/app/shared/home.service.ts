import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { project } from '../models/project';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  formModel: project;
  constructor(private http:HttpClient) { }

  readonly baseURI = 'https://localhost:44306/api';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getProjects(): Observable<project[]>{
    return this.http.get<project[]>(this.baseURI+'/Project');
  }

  getProject(id): Observable<project>
  {
    return this.http.get<project>(this.baseURI+'/Project/'+id);
  }

  deleteProject(id : number)
  {
    return this.http.delete(this.baseURI+'/Project/'+id, {observe: 'response'});
  }

  addProject()
  {
    return this.http.post(this.baseURI+'/Project', this.formModel);
  }

  updateProject()
  {
    return this.http.put(this.baseURI+'/Project/'+this.formModel.id,this.formModel)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  errorHandler(error) {
    console.log(error);
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}
