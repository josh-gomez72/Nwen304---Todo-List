var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var cors = require('cors');
var bodyParser = require('body-parser');
var pg = require('pg').native;
var connectionString = "postgres://gomezjosh:password@depot:5432/gomezjosh_nodejs";

var client = new pg.Client(connectionString);
client.connect();

app.use(bodyParser.json());
app.use(cors());


var ERROR_LOG = console.error.bind(console);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res){
  res.send("Hello World");
});

app.get('/get/tasks/', function(req, res){
  console.log('getting tasks');
  //Extend this later to return tasks from the database
});

app.listen(port, function(){
  console.log('Example app listening on port 8080');
});


app.put('/task/create/', function(req, res){
  //console.log(req.body.task);
  console.log("INSERT into todo (item, completed) values ('" + req.body.task + "' , false)")
  var query = client.query("INSERT into todo (item, completed) values ('" + req.body.task + "' , false)", function(error, result){
  	if (error){
  		console.error(error)
  	}
  });
  console.log('creating new task: ' + req.body.task);
  
});

app.post('/task/update/', function(req, res){
	//console.log(req.body.task);
	var query = client.query("UPDATE todo SET completed = true WHERE item = '" + req.body.task + "'", function(error, result){
  	if (error){
  		console.error(error)
  	}
  });
	console.log("Updating completed field for: " + req.body.task);
});

app.delete('/task/delete/', function(req, res){
	//console.log(req.body.task);
	var query = client.query("DELETE FROM todo WHERE item = '" + req.body.task + "'", function(error, result){
  	if (error){
  		console.error(error)
  	}
  });
	console.log("Deleting: " + req.body.task);
});

app.get('/test_database', function(req, res){

	var query = client.query("SELECT * FROM todo", function(error, result){
  	if (error){
  		console.error(error)
  	}
  });
	var results = [];
	//Stream results back one row at a time
	query.on('row', function(row){
		results.push(row);
	});
	
	
	//After all data is returned, close connection and return results
	query.on('end', function(){
		res.json(results);
	});
});