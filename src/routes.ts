import express from 'express'
const routes = express.Router()

import { createUser, updateUser, deleteUser, findUser, findAllUsers } from './controllers/UserControllers';

// User Routes
routes.get('/users', findAllUsers)
routes.get('/user/:id', findUser)
routes.post('/user', createUser)
routes.post('/user/:id', updateUser)
routes.delete('/user/:id', deleteUser)

export default routes;