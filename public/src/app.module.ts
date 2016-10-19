import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import './rxjs-extensions';

import { MomentModule } from 'angular2-moment';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppComponent }      from './components/app.component';

import { NavbarComponent }   from './components/navbar.component';
import { TodoListComponent }   from './components/todo-list.component';
import { TodoDetailsComponent }   from './components/todo-details.component';

import { TodoService } from './services/todo.service';

@NgModule({
    imports: [ 
        BrowserModule,
        FormsModule,
        HttpModule,
        MomentModule
    ],
    declarations: [ 
        AppComponent,
        NavbarComponent,
        TodoListComponent,
        TodoDetailsComponent
    ],
    bootstrap: [ AppComponent ],
    providers: [ 
        TodoService
    ]
})

export class AppModule { }

