const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const ejs = require('ejs')
const {addUser,findUser}= require('./FunctionModule/DbFuntions')

require('dotenv').config()


// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.SECRET,
//     baseURL: process.env.BASEURL,
//     clientID: process.env.CLIENTID,
//     issuerBaseURL: process.env.ISSUERBASEURL
//   };


const server = express()
const PORT = 6969;
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine','ejs')
server.set('views', path.join(__dirname, 'views'));
server.use(express.static(path.join(__dirname, 'views')));





server.get('/',(req,res)=>{
    // console.log(req.oidc.isAuthenticated())
    res.render('index')
})

server.post('/login',async(req,res)=>{
    const response = await findUser(req.body.email,req.body.password);
    if(response.status===200){
        res.send(response.user);
    }
    else if(response.status===404){
        res.send('user does not exist.... x_x')
    }
    else{
        res.send('error while loggin in..... >_<')
    }
})

server.post('/signup',async(req,res)=>{
    var response = await addUser(req.body.username,req.body.email,req.body.password);
    if(response===201){
        res.send('user added!!');
    }
    else if(response===409){
        res.send('email id already exists, use another email id');
    }
    else{
        res.send('error occured during account creation!...');
    }
})



server.listen(process.env.PORT||PORT,()=>{
    console.log(`server running... on ${PORT}`)
})