import { expect } from 'chai';

import TodoService from './../services/todo.service'

describe('Todo Unit Test', () => {
    let id = null;
    let id2 = null;
    const todoService = new TodoService();
    const todo1 = {
        author:      'alex',
        title:       'Todo 1',
        description: 'Do dishes',
        due: (new Date('2016-10-20')).getTime()
    };

    const todo2 = {
        author:      'alex',
        title:       'Todo 2',
        description: 'Change bulbs',
        due: (new Date('2016-10-25')).getTime()
    };
    
    const todo3 = {
        author:      'alex',
        title:       'Todo 3',
        description: 'Mown grass',
        due: (new Date('2016-10-25')).getTime()
    };

    it('Create new todo', function (done) {
        todoService.saveTodo(todo2).then(
            res => {
                id = res._id;
                expect(todo2.title).to.eql(res.title);
                expect(todo2.author).to.eql(res.author);
                expect(todo2.description).to.eql(res.description);
                expect(todo2.due).to.eql(res.due);
                done();
            },
            err => expect.fail()
        );  
    });

    it('Get all todos', (done) => {
        todoService.getTodos().then(
            res => {
                expect(Number(res.length)).to.be.above(0);
                done()
            },
            err => expect.fail()
        );    
    });

    it('Get non-existing todo', (done) => {
        todoService.getTodoById('000000000000').then(
            res => {
                expect.fail()
            },
            err => done()
        );  
    });

    it('Get invalid id todo', (done) => {
        todoService.getTodoById('HUE').then(
            res => {
                expect.fail()
            },
            err => done()
        );  
    });

    it('Get todo ' + id, (done) => {
        todoService.getTodoById(id).then(
            res => {
                done();
            },
            err => expect.fail()
        );  
    });

    it('Delete todo ' + id, (done) => {
        todoService.deleteTodo(id).then(
            res => {
                done();
            },
            err => expect.fail()
        );  
    });

    it('Delete non-existing todo', (done) => {
         todoService.deleteTodo('hue').then(
            res => {
                expect.fail();
            },
            err => done()
        );  
    });
});