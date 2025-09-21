import express from 'express';
const userRouter =  express.Router();
import ctrl from '../controller/userController/usersetup.js'
import { verifyJWT } from '../auth/loginAuthentication.js';
userRouter.post('/signup',ctrl.signup);
userRouter.post('/login',ctrl.login);
userRouter.get('/get-user',verifyJWT,ctrl.getUserInfo)

export default userRouter;