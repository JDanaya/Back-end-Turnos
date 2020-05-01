'use strict'


/** MOSTRAR UN USUARIO POR CORREO Y DOCUMENTO */
const SELECT_LOGIN = (
    UserDocument, 
    UserEmail)=>
    {
        return `select *
        from heroku_a16fa1788047e89.user as user 
        where user.email = '${UserEmail}' and user.document = ${UserDocument}`
}

/** BUSCAR ID DEL TURNO MAYOR POR FECHA */
const SELECT_MAX_TURN = ()=>
    {
        return `select heroku_a16fa1788047e89.turn.created_at as fecha, 
                max(heroku_a16fa1788047e89.turn.id_turn) as Mayor_ID
                from heroku_a16fa1788047e89.turn`
}

/** Atender siguiente turno: Automatico o por Categoria */
const NEXT_TURN = ( yesterday, id_category )=> {

    //per category
    if(id_category){
        return `
        select heroku_a16fa1788047e89.user.first_name, heroku_a16fa1788047e89.user.last_name, heroku_a16fa1788047e89.user.email, heroku_a16fa1788047e89.user.phone, heroku_a16fa1788047e89.category.name as categoria, heroku_a16fa1788047e89.category.id_category as id_category, heroku_a16fa1788047e89.turn.date as fecha, 
        heroku_a16fa1788047e89.turn.id_turn as Menor_ID
        from heroku_a16fa1788047e89.turn
        join heroku_a16fa1788047e89.user 
        on heroku_a16fa1788047e89.turn.User_id_user = heroku_a16fa1788047e89.user.id_user
        join heroku_a16fa1788047e89.category
        on heroku_a16fa1788047e89.turn.Category_id_category = heroku_a16fa1788047e89.category.id_category
        where heroku_a16fa1788047e89.turn.date >= '${yesterday}'
        and heroku_a16fa1788047e89.turn.is_pending = 1
        and heroku_a16fa1788047e89.turn.Category_id_category = ${id_category}
        order by fecha asc
        limit 1`
    }

    //automatic turn
    return `
        select heroku_a16fa1788047e89.user.first_name, heroku_a16fa1788047e89.user.last_name, heroku_a16fa1788047e89.user.email, heroku_a16fa1788047e89.user.phone, heroku_a16fa1788047e89.category.name as categoria, heroku_a16fa1788047e89.category.id_category as id_category, heroku_a16fa1788047e89.turn.date as fecha, 
        heroku_a16fa1788047e89.turn.id_turn as Menor_ID
        from heroku_a16fa1788047e89.turn
        join heroku_a16fa1788047e89.user 
        on heroku_a16fa1788047e89.turn.User_id_user = heroku_a16fa1788047e89.user.id_user
        join heroku_a16fa1788047e89.category
        on heroku_a16fa1788047e89.turn.Category_id_category = heroku_a16fa1788047e89.category.id_category
        where heroku_a16fa1788047e89.turn.date >= '${yesterday}'
        and heroku_a16fa1788047e89.turn.is_pending = 1
        order by fecha asc
        limit 1`
}

/** BUSCAR CANTIDAD DE TURNOS PENDIENTES POR CATEGORIA Y FECHA */
const SHOW_TURN_PENDING = (
    date, id_category)=> {

    return`
    select heroku_a16fa1788047e89.category.name as Categoria, 
  count(heroku_a16fa1788047e89.turn.id_turn) as Total_turnos_pendientes
  from heroku_a16fa1788047e89.turn
  JOIN heroku_a16fa1788047e89.category 
    ON heroku_a16fa1788047e89.turn.Category_id_category = heroku_a16fa1788047e89.category.id_category
  where heroku_a16fa1788047e89.turn.date >= '${date}'
  and heroku_a16fa1788047e89.turn.is_pending = 1
  and heroku_a16fa1788047e89.turn.Category_id_category = ${id_category}
    `
}

/** BUSCAR CANTIDAD DE TURNOS TOTALES PENDIENTES */
const SHOW_CANT_TURN = (
    date)=> 
    {
    return`
    select 
    count(heroku_a16fa1788047e89.turn.id_turn) as Total_turnos_pendientes
    from heroku_a16fa1788047e89.turn
    where heroku_a16fa1788047e89.turn.created_at >= '${date}'
    and heroku_a16fa1788047e89.turn.is_pending = 1
    `
}

/** REGISTRAR UN NUEVO USUARIO */
const INSERT_REGISTER = (
    first_name,
    last_name , 
    doc_tipe  , 
    document  , 
    phone     , 
    email     )=>
    {
    return ` 
    INSERT INTO heroku_a16fa1788047e89.user (
        heroku_a16fa1788047e89.user.first_name,
        heroku_a16fa1788047e89.user.last_name,
        heroku_a16fa1788047e89.user.doc_tipe,
        heroku_a16fa1788047e89.user.document,
        heroku_a16fa1788047e89.user.phone,
        heroku_a16fa1788047e89.user.email
        )
        VALUES ('${first_name}',
                '${last_name}' , 
                '${doc_tipe}'  , 
                 ${document}   , 
                '${phone}'     , 
                '${email}'     )
    `
}

/** ASIGNAR NUEVO TURNO */
const INSERT_NEWTURN = (
    turn , 
    date , 
    User_id_user, 
    Category_id_category
    )=>
    {
    return ` 
    INSERT INTO heroku_a16fa1788047e89.turn (
        heroku_a16fa1788047e89.turn.turn,
        heroku_a16fa1788047e89.turn.date,
        heroku_a16fa1788047e89.turn.User_id_user,
        heroku_a16fa1788047e89.turn.Category_id_category
        )
        VALUES ('${turn}', 
                '${date}', 
                ${User_id_user}, 
                ${Category_id_category})`
}

/** MOSTRAR TODOS LOS USUARIOS CON TURNO, CATEGORIA Y MODULO ASIGNADO */
const SHOW_ALLTURN =()=> {
    return `
    SELECT heroku_a16fa1788047e89.user.first_name as Usuario,
    heroku_a16fa1788047e89.turn.turn as Turno ,
    heroku_a16fa1788047e89.category.name as Tramite, 
    heroku_a16fa1788047e89.module.name as Modulo 
    FROM heroku_a16fa1788047e89.user
    JOIN heroku_a16fa1788047e89.turn 
    ON heroku_a16fa1788047e89.user.id_user = heroku_a16fa1788047e89.turn.User_id_user
    JOIN heroku_a16fa1788047e89.category 
    ON heroku_a16fa1788047e89.turn.Category_id_category = heroku_a16fa1788047e89.category.id_category
    JOIN heroku_a16fa1788047e89.module 
    ON heroku_a16fa1788047e89.turn.Module_id_module = heroku_a16fa1788047e89.module.id_module
    ORDER BY Turno;
 `
}

/** MOSTRAR TURNO POR EL ID DE UN USUARIO */
const SHOW_TURN = (
    Id_User)=> 
    {
    return`
    SELECT heroku_a16fa1788047e89.user.first_name as Usuario,
    heroku_a16fa1788047e89.turn.turn as Turno, 
    heroku_a16fa1788047e89.category.name as Tramite, 
    heroku_a16fa1788047e89.module.name as Modulo
    FROM heroku_a16fa1788047e89.user
    left JOIN heroku_a16fa1788047e89.turn 
    ON heroku_a16fa1788047e89.user.id_user = heroku_a16fa1788047e89.turn.User_id_user 
    left JOIN heroku_a16fa1788047e89.category 
    ON heroku_a16fa1788047e89.turn.Category_id_category = heroku_a16fa1788047e89.category.id_category
    left JOIN heroku_a16fa1788047e89.module 
    ON heroku_a16fa1788047e89.turn.Module_id_module = heroku_a16fa1788047e89.module.id_module
   WHERE heroku_a16fa1788047e89.user.id_user = ${Id_User}
   ORDER BY Turno;
    `
}

/**  MOSTRAR TODAS LAS CATEGORIAS*/
const SELECT_CATEGORY =()=>{
    return `
    select *
    from heroku_a16fa1788047e89.category
    `
}

/** Actualizar */
const UPDATE_TURN = (pending, ID_Turn, id_module)=>{
    return ` Update heroku_a16fa1788047e89.turn 
    Set heroku_a16fa1788047e89.turn.is_pending = ${pending},
    heroku_a16fa1788047e89.turn.Module_id_module = ${id_module}
    Where heroku_a16fa1788047e89.turn.id_turn  = ${ID_Turn}`
}

const MAYOR_AFLUENCIA = () =>{
    return `
    SELECT MAX(Cantidad_turnos) as mayor_afluencia, date FROM (SELECT count(heroku_a16fa1788047e89.turn.id_turn) as Cantidad_turnos, date 
    FROM heroku_a16fa1788047e89.turn
    group by date
    order by date desc
    limit 7
    ) as t`
}

module.exports = {
    SELECT_CATEGORY ,
    SHOW_ALLTURN    , 
    SELECT_LOGIN    , 
    INSERT_REGISTER , 
    UPDATE_TURN     , 
    SHOW_TURN       , 
    INSERT_NEWTURN  ,
    SELECT_MAX_TURN ,
    SHOW_TURN_PENDING,
    SHOW_CANT_TURN   ,
    NEXT_TURN,
    MAYOR_AFLUENCIA
}
