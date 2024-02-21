const express = require('express');
const mysql=require('mysql');
const cors = require('cors');
const bodyParser=require('body-parser');
const app= express();
app.use(cors('*'));
const port = 3023;

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies



const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'test',
    port:3306
});

connection.connect(err => {
    if(err){
        console.log('error',err)
    }else{
        console.log('connected to Database')
    }
});
//retrive data from task table
app.get('/data',(req,res)=>{
    // console.log('get all users');
    let qrr =`SELECT * FROM task`;
    connection.query(qrr,(err,results)=>{
        if (err){
            console.log(err,"error 404");
        }
        if (results.length>0){
            res.send({
                data:results
            });
        };
    });
});

//retrive data from task table by id
app.get('/data/:id', (req, res) => {
    let id = Number(req.params.id);

    let query = `SELECT * FROM task WHERE id = ${id}`;
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err, "error 404");
            res.status(500).send({ error: 'Internal server error' });
            return;
        }
        if (results.length > 0) {
            res.send({
                data: results
            });
        } else {
            console.log("No data found for ID:", id);
            res.status(404).send({ error: 'Data not found' });
        }
    });
});


//post data to task table

app.post('/pTask', (req, res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let Email = req.body.email;
    let phNm = req.body.pno;

    let qry = `INSERT INTO task (firstName, lname, email, phnum) VALUES (?, ?, ?, ?)`;
    connection.query(qry, [fname, lname, Email, phNm], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Internal server error" });
        }
        res.send({ message: "Data created!", data: results });
    });
});

//update data in task table by id
app.put('/uTask/:id',(req,res)=>{
    // console.log(req.body,"update data")
    let uId = Number(req.params.id);
    let fname = req.body.fname;
    let lname = req.body.lname;
    let Email = req.body.email;
    let phNm = req.body.pno;
    let qrg=`update task set firstName = '${fname}' ,Lname = '${lname}' , email = '${Email}' , phnum = '${phNm}' where id = ${uId}`;
    connection.query(qrg,(err,results)=>{
        if(err){console.log(err)};
        
            res.send({
            message:" Data updated success!",
            data:results
        });
    
    });
});


//delete data from task table


// delete data
app.delete('/dTask/:id',(req,res)=>{
    let uId=Number(req.params.id);
    let qr= `delete from task where id=${uId}`;
    connection.query(qr,(err,results)=>{
        if(err){console.log(error)}
        res.send({
            message:"data deleted success...",
            data:results
        })
    })
})

app.listen(port,(req,res) =>{
    console.log(`server connected on ${port}`)
})