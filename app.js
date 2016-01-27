// Dependencies
var express = require('express');
var fse = require('fs-extra');
var http = require('http');
    http.createServer(app).listen(3000, function() {
	console.log('NodeJS server running on :3000');
    });
var mongoose = require('mongoose');
var multer = require('multer');
var qs = require('querystring');

var app = express();
app.use(app.router);
app.use(express.methodOverride());
app.use(express.limit('50mb'));

// petición POST para subir una canción
app.post('/', multer({ dest: 'uploads/' }).fields([{ name: 'image', maxCount: 1 }, { name: 'track', maxCount: 1 }]), function (req, res, next) {
  console.log('Datos de la canción subida: ' + req.files['track'][0]);
  var cancion = req.files['track'][0];
  //mover la canción de directorio a los nas
  fse.move(cancion.path, '/mnt/nas/canciones/' + cancion.originalname, function (err) {
   	if (err) return console.error(err);
  	console.log("success!")
  });
	//comprobación de si existe imagen
  if (req.files['image'] !== undefined) {
	  console.log('Datos de la portada subida: ' + req.files['image'][0]);
	  var imagen = req.files['image'][0];
		//copia la imagen de forma síncrona a los nas		
		try {
			fse.copySync(imagen.path, '/mnt/nas/imagenes/' + imagen.originalname);
		} catch (err) {
			console.error('Oh no, there was an error: ' + err.message)
		}
		fse.unlink(imagen.path, function(err){
			if (err) return console.error(err);
			console.log('delete success');
		});
	}
	res.send(200);
})

// petición GET para obtener una canción
app.get('/cancion/:trackname', function(req, res) {
  res.sendfile('/mnt/nas/canciones/' + req.params.trackname);
});

// petición GET para obtener una imagen
app.get('/imagen/:imagename', function(req, res) {
  res.sendfile('/mnt/nas/imagenes/' + req.params.imagename);
});

// petición DELETE para borrar una canción
app.delete('/cancion/:trackname', function(req, res) {
  fse.unlink('/mnt/nas/canciones/' + req.params.trackname, function(err){
		if (err) return console.error(err);
		console.log('delete success');
  });
  res.send(200);
});

// petición DELETE para borrar una imagen
app.delete('/imagen/:imagename', function(req, res) {
  fse.unlink('/mnt/nas/imagenes/' + req.params.imagename, function(err){
		if (err) return console.error(err);
		console.log('delete success');
  });
  res.send(200);
});
