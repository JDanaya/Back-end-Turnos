'use strict'
const app = require('./app')
const port = process.env.PORT || 9001

app.listen(port, ()=>{
    console.log(`API Rest Corriendo en el puerto ${port}`) 
})