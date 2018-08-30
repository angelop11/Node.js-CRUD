'use strict'

var express = require('express'),
	//path = require('path'),ya no uso el path.join para unir porque uso``
	favicon = require('serve-favicon'),
	bodyParser=require('body-parser'),//para manejar formularios como cadenas
	morgan = require('morgan'),//muestra en consola todo lo que consume la app
	jade = require('jade'),
	routes = require('./routes/index'),//toda la logica
	//faviconURL = `${__dirname}/public/img/icono.png`,//contrsuye url
	publicDir = express.static(`${__dirname}/public`),//archivos publicos
	viewDir = `${__dirname}/views`,//definicion de vistas
	port = (process.env.PORT || 3000),
	app = express()


app
	//configurando app
	.set('views', viewDir)
	.set('view engine', 'jade')
	.set('port', port)
	//ejecutando middlewares
	//.use( favicon(faviconURL) )
	//pase application/json
	.use( bodyParser.json() )
	//toda la info se parsee con application/x-www-form-urlencoded que es como se manejar la info en el backend
	.use( bodyParser.urlencoded({extended: false}) )
	.use( morgan('dev'))//logger
	.use(publicDir)
	//ejecutando el middleware enrutador
	//.use('/', routes)
	.use(routes)//hace que escuche solo a reutes y no solo una ruta como es arriba

//aca solo estan las cosas para mostrar en la pagina, las cosas de servidor y conexion estan en models
module.exports = app