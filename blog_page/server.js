const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer')
const {getUserByEmail,uploadThumbnail,addBlog,getBlog,deleteBlog,incrementLikes,getAllBlogs} =require('./FunctionModules/DbFunction')





const server = express()
const PORT = 6969;
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());
const upload = multer();


//API's

server.post('/getRole',async(req,res)=>{
    const user =  await getUserByEmail(req.body.email);
    if(user){
        res.json({
            status:200,
            user:user
        })
    }
    else{
        res.json({
            status:404,
            user:null
        })
    }
})

server.post('/blog/create',upload.single('image'),async(req,res)=>{
    try{
        const imageBuffer = req.file.buffer;
        const originalFileName = req.file.originalname;
        const response = await uploadThumbnail(req.file.buffer,req.file.originalname);
        var thumbnailId=null;
        if(response.status==200){
            thumbnailId=response.weblink;
            res.json({
                status: await addBlog(req.body.userid,req.body.title,req.body.content,thumbnailId),
                message: 'uploaded'
            });
        }
        else{
            res.json({
                status: 500,
                message: 'error while uploading blog'
            });
        }
    }
    catch(err){
        console.error(err);
        res.json({
            status: 500,
            message: 'error while uploading blog'
        });
    }
})

server.get('/blog/:blogID/like',async(req,res)=>{
    const response= await incrementLikes(req.params.blogID);
    if(response==-1){
        res.json({
            status:500,
            message:'error occured'
        })
    }
    else{
        res.json({
            status:200,
            message:'updation successfull'
        })
    }
})

server.delete('/blog/:blogID',async(req,res)=>{
    const response = await deleteBlog(req.params.blogID);
    if(response==200){
        res.json({
            status:response,
            message:'deletion successful'
        })
    }
    else{
        res.json({
            status:response,
            message:'error occured while deletion'
        })
    }
})

server.get('/blog/:blogID',async(req,res)=>{
    // console.log(req.params.blogID);
    res.json(await getBlog(req.params.blogID));
})


server.get('/listout',async(req,res)=>{
    const blogs = await getAllBlogs();
    if(blogs){
        res.json({
            status:200,
            data:blogs
        })
    }
    else{
        res.json({
            status:404,
            data:[]
        })
    }
})



server.listen(process.env.PORT||PORT,(req,res)=>{
    console.log(`server running on  port:${process.env.PORT||PORT}`);
})