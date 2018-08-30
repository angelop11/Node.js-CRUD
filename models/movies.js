//aca esta la conexion a la base de datos y la logica
'use strict'

var mysql=require('mysql'),
	//para que considere la conexion cmo un middleware
	myConnection=require('express-myconnection'),
	dpOption={//json siempre trabja con comillas dobles, no simples. js si simples
		host:'localhost',
		port: 3306,//predeterminado
		user:'root',
		password:'',
		database: 'movies'
	},
	Movies = myConnection(mysql, dpOption, 'request')

module.exports=Movies
