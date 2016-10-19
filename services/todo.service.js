import mongoose from 'mongoose';
import connections from './../config/connections';
import { Schema } from 'mongoose';

let DATABASE_URL = connections.local;

const Todo = new Schema({
    author:      { type: String },
    title:       { type: String },
    description: { type: String },
    due:         { type: Number, default: Date.now() },
    done:        { type: Boolean, default: false },
    deleted:     { type: Boolean, default: false },
    created:     { type: Date },
    modified:    { type: Date }
});
Todo.pre('save', function(next) {
    const now = new Date();
    this.modified = now;
    if (!this.created) {
        this.created = now;
    }
    next();
});

export default class TodoService {
    constructor() {
        if(process.env.DB && connections[process.env.DB]) {
            DATABASE_URL = connections[process.env.DB];
        }else{
            DATABASE_URL = connections.local;
        }
        console.log('> [DB] Using db ' + DATABASE_URL);        
    }

    /**
     *  CREATES NEW TODO
     *  POST request
     */
    saveTodo(todo) {
        let db = null;
        return new Promise((resolve, reject) => {
            db = mongoose.createConnection(DATABASE_URL, err => {
                if(err) {
                    console.error(err);
                    reject(err);
                }else{
                    const todoModel = db.model('Todos', Todo);
                    const newTodo = new todoModel(todo);
                    newTodo.save(err => {
                        db.close();
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log('> [NEW] Created new todo: ' + newTodo._id);
                            resolve(newTodo);
                        }
                    });
                }
            });
        })
    };

    /**
     *  GETS ALL UNDELETED TODOS
     *  GET request
     */
    getTodos(skip=0, limit=20, sort='-created') {
        let db = null;
        return new Promise((resolve, reject) => {
            db = mongoose.createConnection(DATABASE_URL, err => {
                if(err) {
                    console.error(err);
                    reject(err);
                }else{
                    const todoModel = db.model('Todos', Todo);
                    todoModel.find({ deleted: false }).sort(sort).skip(skip).limit(limit).exec('find', (err, todos) => {
                        db.close();
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log('> [GET] Read all todos: ' + todos.length);
                            resolve(todos);
                        }
                    });
                }
            });
        })
    };

    /**
     *  GETS SPECIFIC TODO (including deleted todos)
     *  GET:id request
     */
    getTodoById(id) {
        let db = null;
        return new Promise((resolve, reject) => {
            //-  CHECK IF ID IS VALID
            if(!mongoose.Types.ObjectId.isValid(id)){
                reject('Invalid id')
            }else{
                db = mongoose.createConnection(DATABASE_URL, err => {
                    if(err) {
                        console.error(err);
                        reject(err);
                    }else{
                        const todoModel = db.model('Todos', Todo);
                        todoModel.findById(id, (err, todo) => {
                            db.close();
                            if (err || !todo) {
                                console.error(err);
                                reject(err);
                            } else {
                                console.log('> [GET] Read todo: ', todo._id);
                                resolve(todo);
                            }
                        });
                    }
                });
            }
        })
    };

    /**
     *  UPDATES EXISTING TODO (creates new if doesnt exist)
     *  PUT:id request
     */
    updateTodo(id, newTodo) {
        let db = null;
        return new Promise((resolve, reject) => {
            db = mongoose.createConnection(DATABASE_URL, err => {
                if(err) {
                    console.error(err);
                    reject(err);
                }else{
                    const todoModel = db.model('Todos', Todo);
                    
                    //- Handle invalid ObjectId
                    if(!mongoose.Types.ObjectId.isValid(id)){
                        id = mongoose.Types.ObjectId();
                    }
                    const now = new Date();
                    newTodo.modified = now;
                    if (!newTodo.created) {
                        newTodo.created = now;
                    }

                    delete newTodo._id; //-  ensure no id modification
                    todoModel.findOneAndUpdate({ _id: id }, newTodo, { upsert: true, new: true }, (err, todo) => {
                        db.close();
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log('> [UPD] Updated todo: ' + todo._id);
                            resolve(todo);
                        }
                    });
                }
            });
        })
    };

    /**
     *  REMOVES EXISTING TODO
     *  -- UNUSED
     */
    deleteTodo(id) {
        let db = null;
        return new Promise((resolve, reject) => {
            if(!mongoose.Types.ObjectId.isValid(id)){
                reject('Invalid id')
            }else{
                db = mongoose.createConnection(DATABASE_URL, err => {
                    if(err) {
                        console.error(err);
                        reject(err);
                    }else{
                        const todoModel = db.model('Todos', Todo);
                        todoModel.remove({ _id: id }, (err, todo) => {
                            db.close();
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                console.log('> [RMV] Removed todo: ' + id);
                                resolve(todo);
                            }
                        });
                    }
                });
            }
        })
    };
}