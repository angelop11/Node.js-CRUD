'use strict'

var app= require('./app'),
	//obtento port de app
	server = app.listen(app.get('port'), ()=>{

		console.log(`Iniciando Express en el puerto ${app.get('port')}`)

	})
