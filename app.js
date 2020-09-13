const express=require("express");
var path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const mongodb=require('mongodb');
const assert=require('assert')
;
const app=express();
 
const host='localhost';
const port='3000';
const url='mongodb://localhost:27017/alumni';

app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public/images'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname +'/home.html'));
});
app.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname +'/profile.html'));
});
app.get('/login', function(req, res) {
    res.render('login');
});
app.post('/login', function(req, res) {
    const authdata={
        useremail:req.body.uemail,
        userpass:req.body.upass
    }
    

   // mongodb.connect(url,(err,db)=>{
     //   assert.equal(null,err);
        //var authdetail=db.collection('alumni-data').find({},{email:authdata.useremail,password:authdata.userpass});

res.render('home',{msg:"Shailesh"});        //console.log(authdetail);
   // })
});
app.get('/gallery', function(req, res) {
    res.sendFile(path.join(__dirname +'/gallery.html'));
});
app.get('/directory', function(req, res) {
    var result= [];
    mongodb.connect(url,(err,db)=>{
        assert.equal(null,err);
        var details=db.collection('alumni-data').find();
        details.forEach((doc,err)=>{
        assert.equal(null,err);
        result.push(doc);
        },()=>{
            db.close();
                res.render('directory',{items:result});
        });
    });

});
app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname +'/about1.html'));
});
app.get('/registration', function(req, res) {
    res.sendFile(path.join(__dirname +'/signup.html'));
});
app.post('/registration',function(req,res) {
  var item={
    name: req.body.aname,
    email:req.body.aemail,
    password:req.body.apass,
    contact:req.body.acontact,
    company:req.body.acompany,
    designation:req.body.adesignation,
    address:req.body.aadd,
    passout:req.body.ayear,
    course:req.body.acourse,
    branch:req.body.abranch,
    gender:req.body.agender
  }
  console.log(item);
  mongodb.connect(url,(err,db)=>{
   assert.equal(null,err);
   db.collection('alumni-data').insertOne(item,(err,result)=>{
    assert.equal(null,err);
    console.log("data inserted");
    db.close();
    res.sendFile(path.join(__dirname +'/signup.html'));
   })
  })
});
app.listen(port,host,()=>{
	console.log(`server is running at port: ${port}`);
})