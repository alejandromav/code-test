import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>
    res.render('index', { title: 'ToDos' })
);

export default router;
