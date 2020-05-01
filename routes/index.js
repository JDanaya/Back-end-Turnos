'use strict'

const express = require('express')
const api = express.Router()

const turnoCtrl = require('./../controllers/turnoControllers');

api.get('/', (req,res)=>{
    res.status(200).send( { msg: 'escriba su ruta' } )
}) 

api.get('/hello/:name', (req,res)=>{
    res.status(200).send( { msg: `Hola ${req.params.name}` } )
})

/** ----PERSONAS----- */

/** LOGIN */
api.post('/login',turnoCtrl.login);

/** registro */
api.post('/register',turnoCtrl.registro);

/** PEDIR TURNO */
api.post('/turn',turnoCtrl.pedirTurno);

/** MOSTRAR CATEGORIAS */
api.get('/showcategories',turnoCtrl.showCategories);

/** ----ADMIN----- */


/** LOGIN */
api.post('/loginAdmin',turnoCtrl.loginAdmin);

/** ATENDER SIGUIENTE TURNO */
api.post('/admin/turn',turnoCtrl.nextTurn);

/** CONTADOR GENERAL */
api.post('/admin/total',turnoCtrl.totalTurn);

/** CONTADOR BY CATEGORY */
api.post('/admin/totalbycategory',turnoCtrl.totalTurnByCategory);

/** DIA MAYOR AFLUENCIA */
api.get('/admin/diamayorafluencia',turnoCtrl.diaMayorAfluencia);



module.exports = api