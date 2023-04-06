import express from 'express'
const routes = express.Router()

import { createUser, updateUser, deleteUser, findUser, findAllUsers, findFilterUsers, authenticationUser } from './controllers/UserControllers';

// User Routes
routes.get('/users', findAllUsers)
routes.get('/user/:id', findUser)
routes.get('/filterUsers', findFilterUsers)
routes.post('/auth/registerUser', createUser)
routes.post('/auth/loginUser', authenticationUser)
routes.put('/user/:id', updateUser)
routes.delete('/user/:id', deleteUser)

export default routes;