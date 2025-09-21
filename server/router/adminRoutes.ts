import express from 'express';
import { verifyJWT } from '../auth/loginAuthentication.js';
import ctrl from '../controller/adminController/admin.js';
const adminRouter =  express.Router();

adminRouter.post('/update-bug',verifyJWT,ctrl.updatebug);
adminRouter.get('/get-all-bugs',verifyJWT,ctrl.getallbugs)
export default adminRouter;