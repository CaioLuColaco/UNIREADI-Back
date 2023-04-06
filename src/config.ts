import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY

export { PORT, AUTH_SECRET_KEY }