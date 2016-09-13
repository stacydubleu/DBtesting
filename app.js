var express = require('express');
var mySQL= require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var app=express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'pug');

var pool = mySQL.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "mysql",
	database: "SIP"
});

app.get("/", function(req,res){
	pool.getConnection(function(err, connection){
		connection.query("SELECT * from child", function(err, results){
		//	console.log(JSON.stringify(results));
			res.render(__dirname+'/index', {title: 'Child Table', datas: results[0].CHILD_ID } );
		});
	});
});

app.post("/", function(req, res){
	var checkNull= function(stuff){
		if (stuff==''){
			return null;
		}
		else{
			return stuff;
		}
	}
  var addEntry={
  		CHILD_ID: req.body.childID,
  		MOTHER_ID: checkNull(req.body.motherID),
  		DOB: checkNull(req.body.DOB),
  		GENDER: checkNull(req.body.gender),
  		RACE: checkNull(req.body.race)
	};
	console.log(req.body.childID);
  pool.getConnection(function(err, connection){
  	console.log(addEntry);
  	connection.query('SET FOREIGN_KEY_CHECKS=0');
		connection.query('INSERT INTO `CHILD` SET ?', addEntry, function(err){
			  if (err) console.log(err.message);
        console.log('success');
		});
		connection.query('SET FOREIGN_KEY_CHECKS=1');
	});
});

app.listen(3000);