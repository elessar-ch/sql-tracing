const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')

require('dotenv').config()

const port = process.env.PORT || 3000;

const app = express()
app.use(express.json({ limit: '5MB', extended: true }));
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Hello from express server')
})

// Routes goes here
app.use('/api', routes);

app.listen(port, () => console.log(`Listening on port ${port}.`))