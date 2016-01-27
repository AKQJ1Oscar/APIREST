// Dependencies
var express = require('express');
var app = express();
    app.use(app.router);
    app.use(express.methodOverride());
    app.use(express.limit('50mb'));
var fse = require('fs-extra');
var http = require('http');
    http.createServer(app).listen(3000, function() { console.log('NodeJS server running on :3000'); });
var mongoose = require('mongoose');
var multer = require('multer');
var qs = require('querystring');

// POST request - Upload track and cover
app.post('/', multer({ dest: 'uploads/' }).fields([{ name: 'image', maxCount: 1 }, { name: 'track', maxCount: 1 }]), function (req, res, next) {
	console.log('INFO: A track is being uploaded');
  	var cancion = req.files['track'][0];
  	// mover la canción de directorio a los nas
  	fse.move(cancion.path, '/mnt/nas/canciones/' + cancion.originalname, function (err) {
   		if (err) return console.error('ERROR: ' + err);
  		console.log("OK: Track uploaded successfully")
	});
	// Upload cover if exists
	if (req.files['image'] !== undefined) {
		console.log('INFO: A cover for the track is being uploaded');
		var imagen = req.files['image'][0];
		// copia la imagen de forma síncrona a los nas		
		try {
			fse.copySync(imagen.path, '/mnt/nas/imagenes/' + imagen.originalname);
		} catch (err) {
			console.error('ERROR: ' + err)
		}
//		fse.copySync(imagen.path, '/mnt/nas/imagenes/' + imagen.originalname, function (err) {
//			if (err) return console.error('ERROR: ' + err);
//			console.log('OK: Cover uploaded successfully');
//		});
		fse.unlink(imagen.path, function(err) {
			if (err) return console.error(err);
			console.log('OKiloko: Cover uploaded successfully');
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
