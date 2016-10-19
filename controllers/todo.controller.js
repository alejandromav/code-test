import TodoService from './../services/todo.service'

const todoService = new TodoService();

export default class TodoController {

    /** 
     *  HANDLE POST REQUEST
     *  creates new todo task     
     * 
     **/
    post(req, res, next) {
        todoService.saveTodo(req.body)
        .then(
            todo => res.status(201).send(todo),
            err   => {
                console.error(err);
                res.status(500).send(err);
            } 
        );
    };

    /** 
     *  HANDLE GET REQUEST
     *  reads all todos
     * 
     **/
    get(req, res, next) {
        const skip = req.params.skip;
        const limit = req.params.limit;
        const sort = req.params.sort;
        todoService.getTodos(skip, limit, sort)
        .then(
            todos => res.send(todos),
            err   => {
                console.error(err);
                res.status(500).send(err);
            } 
        );
    };

    /** 
     *  HANDLE GET REQUEST
     *  reads todo wuth id
     * 
     **/
    getById(req, res, next) {
        todoService.getTodoById(req.params.id)
        .then(
            todo => res.send(todo),
            err  => {
                console.error(err);
                res.status(404).send(err);
            } 
        );
    };

    /** 
     *  HANDLE PUT REQUEST
     *  updates or creates a todo task     
     * 
     **/
    put(req, res, next) {
        todoService.updateTodo(req.params.id, req.body)
        .then(
            todo => res.send(todo),
            err  => {
                console.error(err);
                res.status(500).send(err);
            } 
        );
    };

    /** 
     *  HANDLE DELETE REQUEST
     *  deletes existing todo task (soft-delete with update)     
     * 
     **/
    delete(req, res, next) {
        req.body.deleted = true; // soft-delete
        todoService.updateTodo(req.params.id, req.body)
        .then(
            todo => res.send(todo),
            err  => {
                console.error(err);
                res.status(500).send(err);
            } 
        );
    };
}
