import express from 'express';
import { verifyJWT } from '../auth/loginAuthentication.js';
import ctrl from '../controller/reporterController/resporter.js';
const reporterRouter =  express.Router();

reporterRouter.post('/submit-bug',verifyJWT,ctrl.submitbug);
reporterRouter.get('/get-self-bugs',verifyJWT,ctrl.getallselfbugs)
export default reporterRouter;