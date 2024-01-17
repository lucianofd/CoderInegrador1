import express from 'express';
import UserManager from '../dao/UserManager';
import UserController from '../controller/userController';

const userRouter = express.Router();

const userController = UserController;
  
userRouter.get('/current', async ( req, res) => userController.currentUser(req, res) );

userRouter.put('/premium/:uid' , async ( req, res) => userController.updateUserRole(req, res))
