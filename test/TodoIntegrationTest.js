import { expect } from 'chai';
import app from './../app.js';
import supertest from 'supertest';
const request = supertest(app);

import TodoService from './../services/todo.service'

const API_VERSION = '1.0';
const PORT = process.env.PORT || '3000';

describe('Todo Integration Test', () => {
    let id;
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


    before((done) => {
        todoService.saveTodo(todo1).then(
            res => {
                id = res._id;
                console.log('ID: '+ id)
                done()
            },
            err => expect.fail()
        );        
    });

    it('Force app 404', (done) => {
        request
        .get(`/api/-/todo`)
        .expect(404)
        .end((err, res) => {
            done();
        });
    });

    it('Force app index 200 (webapp)', (done) => {
        request
        .get(`/`)
        .expect(404)
        .end((err, res) => {
            done();
        });
    });

    it('Get all todos', (done) => {
        request
        .get(`/api/${API_VERSION}/todo`)
        .expect(200)
        .end((err, res) => {
            if (err) throw err;
            expect(Number(res.body.length)).to.be.above(0);
            done();
        });
    });

    it('Get todo ' + id, (done) => {
        request
        .get(`/api/${API_VERSION}/todo/${id}`)
        .expect(200)
        .end((err, res) => {
            if (err) throw err;
            expect(todo1.title).to.eql(res.body.title);
            expect(todo1.author).to.eql(res.body.author);
            expect(todo1.description).to.eql(res.body.description);
            expect(todo1.due).to.eql(res.body.due);
            done();
        });
    });

    it('Get non-existing todo', (done) => {
        request
        .get(`/api/${API_VERSION}/todo/000000000000`)
        .expect(404)
        .end((err, res) => {
            if (err) throw err;
            done();
        });
    });

    it('Get invalid id todo', (done) => {
        request
        .get(`/api/${API_VERSION}/todo/hue`)
        .expect(404)
        .end((err, res) => {
            if (err) throw err;
            done();
        });
    });

    it('Create new todo', function (done) {
        request 
        .post(`/api/${API_VERSION}/todo`)
        .type('json')
        .send(JSON.stringify(todo2))
        .expect(201)
        .end((err, res, body) => {
            if (err) {
                expect.fail(err);
            }
            id2 = res.body._id;
            expect(todo2.title).to.eql(res.body.title);
            expect(todo2.author).to.eql(res.body.author);
            expect(todo2.description).to.eql(res.body.description);
            expect(todo2.due).to.eql(res.body.due);
            done();
        });
    });

    it('Update non-existing todo', (done) => {
        request 
        .put(`/api/${API_VERSION}/todo/0`)
        .type('json')
        .send(JSON.stringify(todo2))
        .expect(200)
        .end((err, res, body) => {
            if (err) {
                expect.fail(err);
            }
            expect(todo2.title).to.eql(res.body.title);
            expect(todo2.author).to.eql(res.body.author);
            expect(todo2.description).to.eql(res.body.description);
            expect(todo2.due).to.eql(res.body.due);
            done();
        });
    });
    
    it(`Update todo ${id}`, (done) => {
        request 
        .put(`/api/${API_VERSION}/todo/${id}`)
        .type('json')
        .send(JSON.stringify(todo3))
        .expect(200)
        .end((err, res, body) => {
            if (err) {
                console.log(err);
                expect.fail(err);
            }
            expect(todo3.title).to.eql(res.body.title);
            expect(todo3.author).to.eql(res.body.author);
            expect(todo3.description).to.eql(res.body.description);
            expect(todo3.due).to.eql(res.body.due);
            done();
        });
    });

    it(`Delete todo ${id2}`, (done) => {
        request 
        .delete(`/api/${API_VERSION}/todo/${id2}`)
        .type('json')
        .expect(200)
        .end((err, res, body) => {
            if (err) {
                expect.fail(err);
            }
            done();
        });
    });

    it(`Delete non-existing todo`, (done) => {
        request 
        .delete(`/api/${API_VERSION}/todo/0`)
        .type('json')
        .expect(500)
        .end((err, res, body) => {
            done();
        });
    });


    after((done) => {
        todoService.deleteTodo(id).then(
            res => done(),
            err => {
                console.log(err);
                expect.fail()
            }
        );
    });
});