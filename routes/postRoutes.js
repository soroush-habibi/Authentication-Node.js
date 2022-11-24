import express from 'express';

import postController from '../controllers/postController.js';

const router = express.Router();

router.post("/sign-up", postController.signUp);
router.post("/login", postController.login);

export default router;