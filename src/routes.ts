import express from 'express'
const routes = express.Router()

import { createUser, updateUser, deleteUser, findUser, findAllUsers, findFilterUsers, authenticationUser } from './controllers/UserControllers';
import { createProcess, updateProcess, deleteProcess, findProcess, findAllProcess, findFilterProcess } from './controllers/ProcessControllers';
import { checkToken } from './middlewares/checkToken';

// User Routes
routes.get('/users', checkToken, findAllUsers)
routes.get('/user/:id', findUser)
routes.get('/filterUsers', findFilterUsers)
routes.post('/auth/registerUser', createUser)
routes.post('/auth/loginUser', authenticationUser)
routes.put('/user/:id', updateUser)
routes.delete('/user/:id', deleteUser)

// Process Routes
routes.get('/process', findAllProcess)
routes.get('/process/:id', findProcess)
routes.get('/filterProcess', findFilterProcess)
routes.post('/process', createProcess)
routes.put('/process/:id', updateProcess)
routes.delete('/process/:id', deleteProcess)

export default routes;