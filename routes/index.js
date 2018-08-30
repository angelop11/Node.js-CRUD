'use strict'

var movies= require('../models/movies'),
	express = require('express'),
	router = express.Router()

function error404(req, res, next){
	let error= new Error(),
		locals={
			title: 'Error 404',
			description:'Recurso no encontrado',
			error:error
		}

	error.status=404
		//pasa la variable locals
	res.render('error', locals)
	//por buena practica dejar el 404 a pesar de que no le sigue otro
	next()
}
//va next porque estamos con middlesware y trabajamos con rutas
router
		.use(movies)
		//lo siguiente es un midleware
		.get('/', (req, res, next)=>{
			req.getConnection((err, movies)=>{//si no hay error devuelve las filas
				movies.query('SELECT * FROM movies', (err, rows)=>{
					if(err){next(new Error('No hay registros de peliculas'))}
					else{
						let locals={//pasar parametros a la vista
							title: 'Lista de Películas',
							data: rows
						}//renderiza index
						res.render('index', locals)	
					}
				})
			})
			//next()no siemore se ejecuta el siguiente midleware, solo se ejecuta cuando tienen dependencias
			//pero aca le digo que ejecute el siguiente y el siguiente era el error 404
		})
		.get('/agregar',(req, res, next)=>{
			//llamando una vista
			res.render('add-movie', {title:'Agregar Pelicula'})
		})
		.post('/',(req, res, next)=>{
			req.getConnection((err, movies)=>{
				let movie={
					movie_id : req.body.movie_id,
					title : req.body.title,
					release_year : req.body.release_year,
					rating : req.body.rating,
					image : req.body.image
				}
				console.log(movie)
				//? es un comodin que se remmplaza por movie
				movies.query('INSERT INTO movies SET ?', movie, (err, rows)=>{
					return (err) ? next(new Error('Error al insertar')): res.redirect('/')
				})
			})
		})
		//paso de parametros en express es el siguiente y no #{movie.movie_id}
		.get('/editar/:movie_id', (req, res, next)=>{
			//params para cachar parametros pasados por get 
			let movie_id= req.params.movie_id
			console.log(movie_id)
			req.getConnection((err, movies)=>{
				movies.query('SELECT * FROM movies WHERE movie_id= ?',movie_id, (err, rows)=>{
					console.log(err, '---', rows)
					if(err)//arroja el error median throw
					{
						//throw(err)
						next(new Error('Registro no encontrado'))
					}
					else{
						let locals = {//objeto js porque json es ""
							title : 'Editar Pelicula',
							data : rows
						}

						res.render('edit-movie', locals)
					}
				})
			})
		})
		.post('/actualizar/:movie_id', (req, res, next)=>{

			req.getConnection((err, movies)=>{
				let movie={
					movie_id : req.body.movie_id,
					title : req.body.title,
					release_year : req.body.release_year,
					rating : req.body.rating,
					image : req.body.image
				}
				console.log(movie)
				//? es un comodin que se remmplaza por movie-- va un array por usar 2 comodines
				movies.query('UPDATE movies SET ? WHERE movie_id=?', [movie, movie.movie_id], (err, rows)=>{
					return (err) ? next(new Error('Error al actualizar')): res.redirect('/')
				})
			})

		})
		.post('/eliminar/:movie_id', (req, res,next) =>{

			//params para cachar parametros pasados por get 
			let movie_id= req.params.movie_id
			req.getConnection((err, movies)=>{
				movies.query('DELETE FROM movies WHERE movie_id= ?',movie_id, (err, rows)=>{
					return (err) ? next(new Error('Registro no encontrado')) : res.redirect('/')
				})//se usa el next en el ternario porque el siguiente middleware es el error404
			})

		})
	  //usa el middleware y debe estar definido al final
	  .use(error404)


module.exports = router