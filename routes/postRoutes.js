import express from 'express';

import postController from '../controllers/postController.js';

const router = express.Router();

router.post("/sign-up", postController.signUp);

export default router;