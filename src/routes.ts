import express from 'express'
const routes = express.Router()

import { createUser, updateUser, deleteUser, findUser, findAllUsers, findFilterUsers, authenticationUser, decodeTokenUser } from './controllers/UserControllers';
import { createProcess, updateProcess, deleteProcess, findProcess, findAllProcess, findFilterProcess } from './controllers/ProcessControllers';
import { createUserProcess, updateUserProcess, deleteUserProcess, findUserProcess, findAllUserProcess } from './controllers/UserProcessControllers';
import { checkStudentToken } from './middlewares/checkStudentToken';
import { checkUserToken } from './middlewares/checkUserToken';
import { checkCoordinatorToken } from './middlewares/checkCoordinatorToken';

// User Routes
routes.get('/users', checkCoordinatorToken, findAllUsers)
routes.get('/user/:id', checkCoordinatorToken, findUser)
routes.get('/filterUsers', checkCoordinatorToken, findFilterUsers)
routes.post('/auth/registerUser', createUser)
routes.post('/auth/loginUser', authenticationUser)
routes.put('/user/:id', checkUserToken, updateUser)
routes.delete('/user/:id', checkUserToken, deleteUser)
routes.post('/decodeToken', decodeTokenUser)

// Process Routes
routes.get('/process', findAllProcess)
routes.get('/process/:id', findProcess)
routes.get('/filterProcess', findFilterProcess)
routes.post('/process', checkCoordinatorToken, createProcess)
routes.put('/process/:id', checkCoordinatorToken, updateProcess)
routes.delete('/process/:id', checkCoordinatorToken, deleteProcess)

// User Process Routes
routes.get('/userProcess', findAllUserProcess)
routes.get('/userProcess/:id', findUserProcess)
routes.post('/userProcess', checkStudentToken, createUserProcess)
routes.put('/userProcess/:id', updateUserProcess)
routes.delete('/userProcess/:id', deleteUserProcess)

export default routes;