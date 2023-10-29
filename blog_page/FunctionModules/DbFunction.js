const mongoose = require('mongoose');
require('dotenv').config()

// Connect to MongoDB without specifying a database
mongoose.connect(process.env.DBCONNECTURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection.useDb('cts-project');

const Blog = db.model('blogs', new mongoose.Schema({
    userid: String,
    title:String,
    content:String,
    thumbnail:String,
    likes:Number,
}));

const Bloguser = db.model('blog-users', new mongoose.Schema({
    username: String,
    name:String,
    role:String,
}));



// Save the document to the database
async function addBlog(userid,title,content,thumbnail){
    // Create a document
    try{
        const newBlog = new Blog({
            userid: userid,
            title:title,
            content:content,
            thumbnail:thumbnail,
            likes:0,
        });
        const response = await newBlog.save();
        if(response){
            return 201;
        }
    }
    catch(err){
        return 500;
    }
}
addBlog()

 
