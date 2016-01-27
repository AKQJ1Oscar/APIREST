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
  	// Move track to nas directory
  	fse.move(cancion.path, '/mnt/nas/canciones/' + cancion.originalname, function (err) {
   		if (err) return console.error('ERROR: ' + err);
  		console.log('OK: Track uploaded successfully')
	});
	// Upload cover if exists
	if (req.files['image'] !== undefined) {
		console.log('INFO: A cover for the track is being uploaded');
		var imagen = req.files['image'][0];
		// Move cover to nas directory
		fse.move(imagen.path, '/mnt/nas/imagenes/' + imagen.originalname, function (err) {
			if (err) return console.error('ERROR: ' + err);
			console.log('OK: Cover uploaded successfully');
		});
	}
	res.send(200);
});

// GET request - Get track
app.get('/cancion/:trackname', function(req, res) {
	res.sendfile('/mnt/nas/canciones/' + req.params.trackname);
});


// DELETE request - Delete track
app.delete('/cancion/:trackname', function(req, res) {
	fse.unlink('/mnt/nas/canciones/' + req.params.trackname, function(err){
		if (err) return console.error('ERROR: ' + err);
		console.log('OK: Track deleted successfully');
	});
	res.send(200);
});

// GET request - Get cover
app.get('/imagen/:imagename', function(req, res) {
	res.sendfile('/mnt/nas/imagenes/' + req.params.imagename);
});

// DELETE request - Delete cover
app.delete('/imagen/:imagename', function(req, res) {
	fse.unlink('/mnt/nas/imagenes/' + req.params.imagename, function(err){
		if (err) return console.error('ERROR: ' + err);
		console.log('OK: Cover deleted successfully');
	});
	res.send(200);
});
