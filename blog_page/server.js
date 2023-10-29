const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const jwt = require('jsonwebtoken');





const server = express()
const PORT = 6969;
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());






server.get('/',(req,res)=>{
    res.status(200).json({
        message:'hello'
    })
})




server.listen(process.env.PORT||PORT,(req,res)=>{
    console.log(`server running on  port:${process.env.PORT||PORT}`);
})