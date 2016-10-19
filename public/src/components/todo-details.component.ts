import { Component, Input } from '@angular/core';

import * as moment from 'moment';

import { Todo } from './../classes/todo';

import { TodoService } from './../services/todo.service';

@Component({
    selector: 'todo-details',
    templateUrl: '/views/todo-details.component.html',
    styleUrls: [ '../../css/todo-details.component.css' ]
})

export class TodoDetailsComponent {
    @Input()
    selectedTodo: Todo;
    
    @Input()
    todos: Todo[];

    newTodo: Todo = {
        done: false,
        deleted: false
    } as Todo;
    frame: string;
    formError: string;
    loading: boolean = false;

    constructor(
        private todoService: TodoService
    ) {}
    
    validateTodo(todo): boolean {
        this.formError = null;

        if(!todo.dueStr) this.formError = 'Set a due date, please.';
        if(!todo.description) this.formError = 'Write a description please.';
        if(!todo.title) this.formError = 'Write a title, please.';

        return this.formError ? false : true;
    }

    setFrame(w: string): void {
        console.log('Setting frame ' + w);
        this.frame = w;
    }

    closeFrame(w: string): void {
        this.frame = null;
        this.selectedTodo = null;
    }

    done(done: boolean): void {
        this.loading = true;
        this.selectedTodo.done = done;
        this.todoService
            .done(this.selectedTodo)
            .then(res => { this.loading = false; });
    }

    add(): void {
        this.loading = true;
        //-  validate
        if(!this.validateTodo(this.newTodo)){ return }
        
        this.newTodo.due = Number(moment(this.newTodo.dueStr).format('x'));
        this.todoService.create(this.newTodo)
            .then(todo => {
                console.log(todo);
                this.todos.unshift(todo);
                this.setFrame(null);
                this.selectedTodo = todo;
                this.loading = false;
            });
    }

    save(): void {
        this.loading = true;
        //-  validate
        if(!this.validateTodo(this.selectedTodo)){ return }

        this.selectedTodo.due = Number(moment(this.selectedTodo.dueStr).format('x'));
        this.todoService.update(this.selectedTodo)
            .then(() => { 
                this.setFrame(null);
                this.loading = false;
            });
    }

}