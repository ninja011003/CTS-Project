const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const ejs = require('ejs')
const {addUser,findUser}= require('./FunctionModule/DbFuntions')

require('dotenv').config();


const server = express()
const PORT = 6969;
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine','ejs')
server.set('views', path.join(__dirname, 'views'));
server.use(express.static(path.join(__dirname, 'views')));





server.get('/',(req,res)=>{
    res.json({
        response: "server running",
        status:200
    })
})

server.post('/login',async(req,res)=>{
    const response = await findUser(req.body.email,req.body.password);
    if(response.status===200){
        res.json({
            status:200,
            message: 'Login Successful.',
            _id:response.user._id,
            username:response.user.username
        });
    }
    else if(response.status===404){
        res.json({
            status:404,
            message:"User not found."
        })
    }
    else{
        res.json({
            status:500,
            message: 'Internal server error.'
        });
    }
})

server.post('/signup',async(req,res)=>{
    var response = await addUser(req.body.username,req.body.email,req.body.password);
    if(response===201){
        res.json({
            status:200,
            message: 'Registeration Successful.',
        });
    }
    else if(response===409){
        res.json({
            status:409,
            message: 'email id already exists, use another email id.',
        });
    }
    else{
        res.json({
            status:500,
            message: 'Internal server error.'
        });
    }
})

server.listen(process.env.PORT||PORT,()=>{
    console.log(`server running... on ${PORT}`)
})