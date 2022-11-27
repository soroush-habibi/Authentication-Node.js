import express from 'express';

import getControllers from '../controllers/getController.js';

const router = express.Router();

router.get("/", getControllers.homeController);

router.get("/login", getControllers.login);

router.get("/verify", getControllers.authorization);

export default router;