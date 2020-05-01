
 /** const LOGIN = `
    select *
    from heroku_a16fa1788047e89.user as user
    where user.email = 'jonhatan.anaya15@gmail.com' and user.document = '1007692973'


INSERT INTO heroku_a16fa1788047e89.user (
    heroku_a16fa1788047e89.user.first_name,
    heroku_a16fa1788047e89.user.last_name,
    heroku_a16fa1788047e89.user.doc_tipe,
    heroku_a16fa1788047e89.user.document,
    heroku_a16fa1788047e89.user.phone,
    heroku_a16fa1788047e89.user.email,
    heroku_a16fa1788047e89.user.user_tipe
    )
    VALUES ("Piter", "Prado", "pasaporte", "1007692856", "3008456589", "piter_72@gmail.com", "estudiante" );



Update heroku_a16fa1788047e89.user Set heroku_a16fa1788047e89.user.first_name='Papo' Where heroku_a16fa1788047e89.user.id_user='1'
`

`AGREGAR COLUMBA A LA TABLA

alter table heroku_a16fa1788047e89.turn
add is_pending boolean default 1

`

const TURN = `
select *
from heroku_a16fa1788047e89.turn as turn
where turn.turn = 'BQ3' 

select * from heroku_a16fa1788047e89.turn as turn where turn.id_turn = '121'

select * from heroku_a16fa1788047e89.turn as turn where turn.date= '2020-04-15'

SELECT COUNT(heroku_a16fa1788047e89.turn.id_turn), date
FROM heroku_a16fa1788047e89.turn
GROUP BY date;

update heroku_a16fa1788047e89.turn as turn set turn.turn = 'BQ6' where turn.id_turn = '121'


 INSERT INTO heroku_a16fa1788047e89.turn (
        heroku_a16fa1788047e89.turn.turn,
        heroku_a16fa1788047e89.turn.date,
        heroku_a16fa1788047e89.turn.User_id_user,
        heroku_a16fa1788047e89.turn.Category_id_category,
        heroku_a16fa1788047e89.turn.Module_id_module,
		heroku_a16fa1788047e89.turn.is_pending
        )
        VALUES ( 'BQ48', '2020-04-24 00:00:00', '51', '31', '21', '0')
`*/