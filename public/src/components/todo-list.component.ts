import { Component, OnInit, Output } from '@angular/core';

import { Todo } from '../classes/todo';
import { TodoService } from '../services/todo.service';

@Component({
    moduleId: module.id,
    selector: 'todo-list',
    templateUrl: '/views/todo-list.component.html',
    styleUrls: [ 
        '../../css/todo-list.component.css'
    ]
})

export class TodoListComponent implements OnInit {
    @Output()
    todos: Todo[];
    @Output()
    selectedTodo: Todo;
    loading: boolean = true;

    constructor(
        private todoService: TodoService
    ) { 

    };

    onSelect(todo: Todo): void {
        this.selectedTodo = todo;
    };

    ngOnInit(): void {
        this.getTodos();
    };

    getTodos(): void {
        this.loading = true;
        this.todoService.getTodos().then(todos => { 
            this.todos = todos;
            this.loading = false;
        });
    };

    delete(todo: Todo): void {
        this.todoService
            .delete(todo._id)
            .then(() => {
                this.todos = this.todos.filter(t => t !== todo);
                if (this.selectedTodo === todo) { this.selectedTodo = null; }
            });
    }

    edit(todo: Todo): void {
        //- edit
    }

    done(todo: Todo, done: boolean): void {
        todo.done = done;
        this.todoService
            .done(todo)
            .then(() => {  });
    }
}