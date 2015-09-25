var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Osedea' });
});

/* POST authentication request */
router.post('/login', function(req, res,next){
	var username=req.body.username,
		password=req.body.password;

	// Authorized user
	res.status(200).json({username: username, password: password});

	// Unauthorized user
	// res.status(401).json({message:'Unauthorized',username: username, password: password});

	// Unknown Error
	// res.status(400).json({username: username, password: password});
});

module.exports = router;
