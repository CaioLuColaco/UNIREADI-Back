import express from 'express'
const routes = express.Router()

import { createUser, updateUser, deleteUser, findUser, findAllUsers, findFilterUsers } from './controllers/UserControllers';

// User Routes
routes.get('/users', findAllUsers)
routes.get('/user/:id', findUser)
routes.get('/filterUsers', findFilterUsers)
routes.post('/user', createUser)
routes.put('/user/:id', updateUser)
routes.delete('/user/:id', deleteUser)

export default routes;