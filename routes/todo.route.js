import express from 'express';
const router = express.Router();

import TodoController from './../controllers/todo.controller';
const todoController = new TodoController();

//-  REST methods
router.post('/',      todoController.post);     // CREATE NEW
router.get('/',       todoController.get);      // GET ALL
router.get('/:id',    todoController.getById);  // GET ONE
router.put('/:id',    todoController.put);      // UPDATE/CREATE
router.delete('/:id', todoController.delete);   // DELETE

export default router;