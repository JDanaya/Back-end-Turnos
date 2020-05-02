'use strict'

const queries = require('./../sql/queries');
const driver = require('./../sql/driver');  
const moment = require('moment');

/**
 * ------ PERSONAS -------
 */

/** LOGIN */
async function login(req,res){

  if( !req.body.user || !req.body.password ) return res.status(200).send({  
    status: 200,
    data: 'faltan parametros!'
  })

  const R = await driver.QUERY(queries.SELECT_LOGIN( req.body.password, req.body.user ))

    //handle success response
    if(!R.code){

      if( R.length === 0 ){
        return res.status(200).send({  
          status: 200,
          data: 'El usuario no existe!'
        })
      }
      console.log('-----')
      console.log(R)

      if(R[0].user_tipe !== 'estudiante' && R[0].user_tipe !== 'invitado'){
        return res.status(200).send({  
          status: 200,
          data: 'Usted no tiene permisos en la plataforma!'
        })
      }

      return res.status(200).send( 
        {  
          status: 200, 
          data: R
        }
      )
    }
    
    //handle ER_DUP_ENTRY response error
    if(R.code === 'ER_DUP_ENTRY'){
      return res.status(500).send( 
        {  
          status: 500, 
          data: '¡El usuario que intenta registrar ya existe!'
        }
      )
    }

    //handle ER_DUP_ENTRY response error
    if(R.code === 'ER_BAD_FIELD_ERROR'){
      return res.status(500).send( 
        {  
          status: 500, 
          data: '¡El usuario no existe!'
        }
      )
    }
  
    //handle an other error unexpected
    return res.status(500).send({  
      status: 500, 
      data: {code: R.code, message: R.sqlMessage}
    })
  
}

/** REGISTRO */
async function registro(req,res){

  //handle validations params or body
  if(!req.body.first_name || 
    !req.body.last_name  || 
    !req.body.doc_tipe   || 
    !req.body.document   ||
    !req.body.phone      || 
    !req.body.email      
    ){
    
    res.status(200).send({  
      status: 200,
      data: 'faltan datos!'
    })
  }

  //handle create user
  const R = await driver.QUERY(queries.INSERT_REGISTER(
    req.body.first_name,
    req.body.last_name,
    req.body.doc_tipe,
    req.body.document,
    req.body.phone,
    req.body.email
  ))

  //handle success response
  if(!R.code){
    return res.status(200).send( 
      {  
        status: 200, 
        data: 'Usuario creado exitosamente'
      }
    )
  }
  
  //handle ER_DUP_ENTRY response error
  if(R.code === 'ER_DUP_ENTRY'){
    return res.status(500).send( 
      {  
        status: 500, 
        data: '¡El usuario que intenta registrar ya existe!'
      }
    )
  }

  //handle an other error unexpected
  return res.status(500).send({  
    status: 500, 
    data: {code: R.code, message: R.sqlMessage}
  })
}

/**  PEDIR TURNO  */
async function pedirTurno(req,res){
  
  if( !req.body.user || !req.body.password || !req.body.category ) return res.status(200).send({  
    status: 200,
    data: 'faltan parametros!'
  })

  const Raux = await driver.QUERY(queries.SELECT_LOGIN(req.body.password, req.body.user));

  if(!Raux){
    return res.status(200).send({  
      status: 200,
      data: 'Usted no tiene permisos!'
    })
  }
  if(!Raux[0]){
    return res.status(200).send({  
      status: 200,
      data: 'Usted no tiene permisos!'
    })
  }
  if(Raux){
    if(Raux[0].user_tipe !== 'estudiante' && Raux[0].user_tipe !== 'invitado'){
      return res.status(200).send({  
        status: 200,
        data: 'Usted no tiene permisos en la plataforma!'
      })
    }
  }

  if( req.body.category ){

    if(req.body.category !== 1 && 
      req.body.category !== 11 && 
      req.body.category !== 21 &&
      req.body.category !== 31 ){
      return res.status(200).send({  
        status: 200,
        data: 'datos erroneos!'
      })
    }

  }

  const RGTURNO = await driver.QUERY(queries.SELECT_MAX_TURN());

  let TURNO= RGTURNO[0].Mayor_ID+1
  //GENERACION DEL TURNO
  switch(req.body.category){
    case 1:
      TURNO= 'AD'+TURNO
      break;
    case 11:
      TURNO= 'GN'+TURNO
      break;
    case 21: 
      TURNO= 'FA'+TURNO
      break;
    case 31:
      TURNO= 'ID'+TURNO
      break;
  }
  console.log(TURNO)
  
  const TODAY = `${moment(new Date()).format('YYYY-MM-DD')} 00:00:00`
  console.log(TODAY)
  const R = await driver.QUERY(queries.INSERT_NEWTURN(
    TURNO,
    TODAY,
    Raux[0].id_user,
    req.body.category
  ))

  //handle success response
  if(!R.code){
    return res.status(200).send( 
      {  
        status: 200, 
        data: {
          msg: 'TURNO CREADO EXITOSAMENTE',
          turno: TURNO
        }
      }
    )
  }

  //handle an other error unexpected
  return res.status(500).send({  
    status: 500, 
    data: {code: R.code, message: R.sqlMessage}
  })
  
}

async function showCategories(req,res){
  
  const R = await driver.QUERY(queries.SELECT_CATEGORY())

  //handle success response
  if(!R.code){
    return res.status(200).send( 
      {  
        status: 200, 
        data: R
      }
    )
  }

  //handle an other error unexpected
  return res.status(500).send({  
    status: 500, 
    data: {code: R.code, message: R.sqlMessage}
  })
  
}

/**
 * ------ ADMIN -------
 */

 /** LOGIN */
async function loginAdmin(req,res){

  if( !req.body.user || !req.body.password ) return res.status(200).send({  
    status: 200,
    data: 'faltan parametros!'
  })

  const R = await driver.QUERY(queries.SELECT_LOGIN( req.body.password, req.body.user ))

    //handle success response
    if(!R.code){

      if( R.length === 0 ){
        return res.status(200).send({  
          status: 200,
          data: 'El usuario no existe!'
        })
      }
      console.log('-----')
      console.log(R)

      if(R[0].user_tipe !== 'administrativo'){
        return res.status(200).send({  
          status: 200,
          data: 'Usted no tiene permisos en la plataforma!'
        })
      }

      return res.status(200).send( 
        {  
          status: 200, 
          data: R
        }
      )
    }
    
    //handle ER_DUP_ENTRY response error
    if(R.code === 'ER_DUP_ENTRY'){
      return res.status(500).send( 
        {  
          status: 500, 
          data: '¡El usuario que intenta registrar ya existe!'
        }
      )
    }

    //handle ER_DUP_ENTRY response error
    if(R.code === 'ER_BAD_FIELD_ERROR'){
      return res.status(500).send( 
        {  
          status: 500, 
          data: '¡El usuario no existe!'
        }
      )
    }
  
    //handle an other error unexpected
    return res.status(500).send({  
      status: 500, 
      data: {code: R.code, message: R.sqlMessage}
    })
  
}

const sendNotification = async function(data) {
  console.log('llego sendNotification')
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic ZTY2NzgxYmYtNDViZS00NmYwLTkxYTItYzVlOTc0MGJhM2Ri"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  console.log(`Llego ${data}`)
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

/*var message = (turno)=> { 
  console.log('llego message')
  return{
    app_id: "016b254a-eed8-4683-a703-acdf33a89391",  
  contents: {"en": `Es tu turno ${turno}`},
  included_segments: ["All"]
  }
};*/

const message = (turno)=>{
  return { 
    app_id: "016b254a-eed8-4683-a703-acdf33a89391",
    headings: {"en": `Turno Actual:  ${turno}`},
    contents: {"en": "¡Esta Atento!"},
    included_segments: ["Active Users"],
    filters: [
      {"field": "last_session", "relation": "<", "hours_ago": "0.1"}
    ]
  }
};

/* ATENDER SIGUIENTE TURNO  */
async function nextTurn(req,res){

  if( !req.body.user || !req.body.password || !req.body.module ) return res.status(200).send({  
    status: 200,
    data: 'faltan parametros!'
  })

  if(req.body.module !== 1 && 
    req.body.module !== 11 && 
    req.body.module !== 21 &&
    req.body.module !== 31 ){
    return res.status(200).send({  
      status: 200,
      data: 'modulo erroneo!'
    })
  }

  const Raux = await driver.QUERY(queries.SELECT_LOGIN(req.body.password, req.body.user));

  if(!Raux){
    return res.status(200).send({  
      status: 200,
      data: 'Usted no tiene permisos!'
    })
  }

  if(Raux){
    console.log(Raux)
    if(Raux[0].user_tipe !== 'administrativo'){
      return res.status(200).send({  
        status: 200,
        data: 'Usted no tiene permisos en la plataforma!'
      })
    }
  }

  const YESTERDAY_DAY = `${moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')} 00:00:00`
  console.log(YESTERDAY_DAY)
  if( req.body.category ){

    if(req.body.category !== 1 || 
      req.body.category !== 11 || 
      req.body.category !== 21 ||
      req.body.category !== 31 ){
      return res.status(200).send({  
        status: 200,
        data: 'datos erroneos!'
      })
    }

  }

  const R = await driver.QUERY(queries.NEXT_TURN(YESTERDAY_DAY, req.body.category));

  if( !R[0] || R[0].category === null || R[0].fecha === null || R[0].Menor_ID === null ){
    return res.status(200).send( 
      {  
        status: 200, 
        data: 'No hay turnos pendientes'
      }
    )
  }

  const MODULE = req.body.module
  console.log(MODULE)

  await driver.QUERY(queries.UPDATE_TURN(0, R[0].Menor_ID, MODULE));
  const msg = message(R[0].turno)
  await sendNotification(msg);
  return res.status(200).send( 
    {  
      status: 200, 
      data: R
    }
  )

}



async function totalTurn(req,res){

  if( !req.body.user || !req.body.password ) return res.status(200).send({  
    status: 200,
    data: 'faltan parametros!'
  })

  const Raux = await driver.QUERY(queries.SELECT_LOGIN(req.body.password, req.body.user));

  if(!Raux){
    return res.status(200).send({  
      status: 200,
      data: 'Usted no tiene permisos!'
    })
  }

  if(Raux){
    if(Raux[0].user_tipe !== 'administrativo'){
      return res.status(200).send({  
        status: 200,
        data: 'Usted no tiene permisos en la plataforma!'
      })
    }
  }

  const YESTERDAY_DAY = `${moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')} 00:00:00`
  console.log(YESTERDAY_DAY)
  
  const R = await driver.QUERY( queries.SHOW_CANT_TURN(YESTERDAY_DAY) );

  return res.status(200).send( 
  {  
    status: 200, 
    data: R[0]
  }
  )

}

async function totalTurnByCategory(req,res){

  if( !req.body.user || !req.body.password || !req.body.category ) return res.status(200).send({  
    status: 200,
    data: 'faltan parametros!'
  })

  const Raux = await driver.QUERY(queries.SELECT_LOGIN(req.body.password, req.body.user));

  if(!Raux){
    return res.status(200).send({  
      status: 200,
      data: 'Usted no tiene permisos!'
    })
  }

  if(Raux){
    if(Raux[0].user_tipe !== 'administrativo'){
      return res.status(200).send({  
        status: 200,
        data: 'Usted no tiene permisos en la plataforma!'
      })
    }
  }

  if( req.body.category ){

    if(req.body.category !== 1 && 
      req.body.category !== 11 && 
      req.body.category !== 21 &&
      req.body.category !== 31 ){
      return res.status(200).send({  
        status: 200,
        data: 'datos erroneos!'
      })
    }

  }

  const YESTERDAY_DAY = `${moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')} 00:00:00`
  console.log(YESTERDAY_DAY)
  
  const R = await driver.QUERY( queries.SHOW_TURN_PENDING(YESTERDAY_DAY, req.body.category) );

  return res.status(200).send( 
  {  
    status: 200, 
    data: R
  }
  )

}
//Çmoment('2016-03-12 13:00:00')
async function diaMayorAfluencia(req, res){
  const R = await driver.QUERY(queries.MAYOR_AFLUENCIA())

  return res.status(200).send( 
    {  
      status: 200,
      data: {
        cantidad: R[0].mayor_afluencia,
        dia: moment(R[0].date).locale('es').format('dddd')
      }
    }
  )
}



module.exports = {login, loginAdmin, registro, pedirTurno, nextTurn, totalTurn, totalTurnByCategory, diaMayorAfluencia, showCategories}