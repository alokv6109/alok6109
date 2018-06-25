var express = require('express');
var app = express();
var md5 = require('md5');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:true})
app.use(urlencodedParser);
var mysql = require('mysql');
var con = mysql.createConnection
({
  host:"localhost",
  user:"root",
  password:"alokverma",
  database:"vndb"
})
con.connect(function(err)
{
  if(err) throw err;
  console.log("connected! yo db");
});
app.get('/index', function(req , res)
{
  console.log("your index page has loaded successfully");
  res.sendFile(__dirname + "/" +  "index.html");
})
app.get('/newUser', function(req , res)
{
  console.log("this is the get method");
  res.sendFile(__dirname + "/" +  "newaccount.htm");
})

app.get('/login', function(req , res)
{
  console.log("this is the get method");
  res.sendFile(__dirname + "/" +  "loginform.html");
})


app.post('/process' , function(req, res){
  console.log(md5('alok'));
  //console.log(req);
    var sql = "select * from registration_details where username = ?";
    con.query(sql, [req.body.username], function(err , result)
{
      if(err) throw err;

        if(result.length<=0)
        {
          res.end("Please! check your username once");
        }
        else {
            if((result[0].password)==(md5(req.body.password)))
            res.sendFile(__dirname +"/" + "thanks.html" );
            else {
              res.end("WRONG CREDENTIALS");
            }
      }
    })
})


//post method
app.post('/SignUp' , function(req, res){
  console.log(req.body.username);
    var sql = "select * from registration_details where username = ?";
    con.query(sql , [req.body.username], function(err, result){
            if(err) throw err;
            if(result.length>0){
              res.end("username already exist");
            }else{
            var sql = "insert into registration_details(firstname, lastname, emailid, mobileno, username, password) values(?,?,?,?,?,?)";
            con.query(sql,[req.body.firstname, req.body.lastname, req.body.email, req.body.mobile, req.body.username, md5(req.body.password) ],  function(err , result)
        //con.query("delete from index_form where last_name=NULL", function(req, result)
             {
              if(err) throw err;
            //console.log("values deleted");
            console.log("value added");
            var k= result.insertId;
            console.log("user added to db with ID " + k);
            })
            res.sendFile(__dirname +"/" + "success_regis.html" );
          }
        })
})
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
