import {Router} from 'express';

const router = new Router();

router.get('/', async (req, res) => {
  res.render('static');
}).get('/upload', async (req, res) => {
  res.render('upload');
})

export default router

