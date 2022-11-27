import express from 'express';

import postController from '../controllers/postController.js';

const router = express.Router();

router.post("/sign-up", postController.signUp);

router.post("/sign-out", postController.signOut);

export default router;