
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

//app.get('/images/\d+', function(req, res, next){
//  req.url = 'img/temp.png';
//  next();
//});

app.get('/temp', routes.index);

app.get('/bwtest_images/connection_test/:numbers', function(req, res, next){
  res.sendfile('static/img/test/pixel.png');
});
app.get('/bwtest_images/50KB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/50KB.png');
});
app.get('/bwtest_images/100KB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/100KB.png');
});
app.get('/bwtest_images/256KB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/256KB.png');
});
app.get('/bwtest_images/512KB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/512KB.png');
});
app.get('/bwtest_images/1MB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/1MB.png');
});
app.get('/bwtest_images/2MB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/2MB.png');
});
app.get('/bwtest_images/5MB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/5MB.png');
});
app.get('/bwtest_images/10MB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/10MB.png');
});
app.get('/bwtest_images/25MB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/25MB.png');
});
app.get('/bwtest_images/50MB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/50MB.png');
});
app.get('/bwtest_images/84MB/:numbers', function(req, res, next){
  res.sendfile('static/img/test/84MB.png');
});
    

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

