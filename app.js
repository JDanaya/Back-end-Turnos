'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const api = require('./routes')
const cors = require('cors')

app.use(bodyParser.urlencoded( {extended:false} ))

app.use(bodyParser.json())

app.use(cors())

app.use('/api', api)

app.get('/', (req,res)=>{
    res.status(200).send('API Rest de iTurn')
})
app.use( (req,res)=>{
    res.status(404).send(`La ruta ${req.url} no existe`)
})

module.exports = app 