import {Router} from 'express';

const router = new Router();

router.get('/', async (req, res) => {
  res.render('static');
});

export default router

