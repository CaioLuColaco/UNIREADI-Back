import express from 'express';
import cors from 'cors';
import routes from './routes'
import { PORT } from './config';
const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(PORT || 3000, function(){
    console.log(`SERVER IS RUNNING ON PORT: ${PORT? PORT : 3000}!`)
})