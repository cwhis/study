var express = require('express');
var app = express.Router();

/* GET home page. */

app.get('/', function(req, res, next) {
  res.render('index', {title: 'Tech Space'});
});

// login page
app.get('/login', function (req, res) {
    res.render('login',{title: '用户登录' });
});

// doLogin page
app.post('/login', function (req, res) {
    var user = {
    	username : 'admin',
    	password : 'admin'
    }
   	if(req.body.username===user.username && req.body.password===user.password){
		res.redirect('/home');
	}
});

	// logout page
app.get('/logout', function (req, res) {
    res.redirect('/');
});

// home page
app.get('/home', function (req, res) {
	var user = {
		username : 'admin',
		password : 'admin'
	}
    res.render('home',{title: 'My Tech Space',user: user});
});
	
module.exports = app;
