import { Injectable }    from '@angular/core';
import { Http, Headers } from '@angular/http';
import globals = require('./../globals');

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { Todo } from './../classes/todo';

@Injectable()
export class TodoService {
    private todosUrl = `${globals.API_URL}/todo`;
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http){

    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getTodos(): Promise<Todo[]> {
        return this.http.get(this.todosUrl)
            .toPromise()
            .then(response => {
                let todos = response.json() as Todo[]
                todos.map(t => {
                    t.dueStr = moment(t.due).format('YYYY-MM-DD');
                });
                return todos;
            })
            .catch(this.handleError);
    }

    getTodo(id: string): Promise<Todo> {
        return this.http.get(`${this.todosUrl}/${id}`)
            .toPromise()
            .then(response =>  response.json() as Todo)
            .catch(this.handleError);
    }

    update(todo: Todo): Promise<Todo> {
        const url = `${this.todosUrl}/${todo._id}`;
        return this.http
            .put(url, JSON.stringify(todo), { headers: this.headers })
            .toPromise()
            .then(() => todo)
            .catch(this.handleError);
    };

    create(todo: Todo): Promise<Todo> {
        return this.http
            .post(this.todosUrl, JSON.stringify(todo), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Todo)
            .catch(this.handleError);
    }

    done(todo: Todo): Promise<Todo> {
        const url = `${this.todosUrl}/${todo._id}`;
        return this.http
            .put(url, JSON.stringify(todo), { headers: this.headers })
            .toPromise()
            .then(() => todo)
            .catch(this.handleError);
    };

    delete(id: string): Promise<void> {
        const url = `${this.todosUrl}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }    
}