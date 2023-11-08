const mongoose = require('mongoose');
require('dotenv').config()
const { google } = require('googleapis');
const path = require('path')
const fs = require('fs')
const { Readable } = require('stream');
const { MongoClient,ObjectId } = require("mongodb");


// Connect to MongoDB without specifying a database
mongoose.connect(process.env.DBCONNECTURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(error => console.error('Error connecting to MongoDB Atlas:', error));
const db = mongoose.connection.useDb('cts-project');
const client = new MongoClient(process.env.DBCONNECTURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const credentials = require('./credentials.json');
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });
const IMGfolderId ='1WHHVoqDicd_MCgrbLXO15uz7y18P94uF';
const BlogSchema= new mongoose.Schema({
  userid: String,
  title:String,
  content:String,
  thumbnail:String,
  likes:Number,
})

const BlogUserSchema = new mongoose.Schema({
  email: String,
  username:String,
  role:String,
});
const Blog = db.model('blogs',BlogSchema );

const Bloguser = db.model('blog-users',BlogUserSchema);

async function uploadThumbnail(fileBuffer, originalname) {
  try {
    // Convert the fileBuffer to a readable stream
    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    const fileMetadata = {
        name: originalname,
        mimeType: 'image/jpeg', 
        parents: [IMGfolderId],
    };
    const media = {
        mimeType: 'image/jpeg', // Set the appropriate MIME type for your image format
        body: fileStream, // Use the converted readable stream
    };
    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,webViewLink',
    });
    const viewLink = response.data.id;
    // console.log(response)
    const finalResponse = {
        status: 200,
        weblink: viewLink,
    };
    return finalResponse;
} catch (error) {
    console.error('Error uploading to Google Drive:', error);
    const finalResponse = {
        status: 500,
        weblink: "1NH2kdoZC3EG3QUgLpX6htbgZHyHuwNV2",
    };
    return finalResponse;
}
}

async function incrementLikes(blogId) {
  try {
    const blog = await Blog.findOne({ _id: blogId });

    if (!blog) {
      return -1; // Blog not found
    }

    const likes = blog.likes;
    const result = await Blog.updateOne(
      { _id: blogId },
      { $inc: { likes: 1 } }
    );
    if (result.nModified === 0) {
      return -1; // Update failed
    }
    return likes+1;
  } catch (error) {
    console.error('Error incrementing likes:', error.message);
    return -1; // Error occurred
  }
}

async function getBlog(blogID){
  try {
    const blog = await Blog.findById(blogID);

    if (!blog) {
      return {
        status:404,
        blog :null
      }
    }
    return {
      status:200,
      blog:blog
    }
  } catch (error) {
    console.error(error);
    return {
      status:500,
      blog:null
    }
  }
}

async function deleteBlog(blogId) {
  try {
    const result = await Blog.deleteOne({ _id: blogId });
    if (result.deletedCount === 0) {
      return 404;
    }
    return 200;
  } catch (error) {
    console.error('Error deleting blog:', error.message);
    return 500;
  }
}

async function getAllBlogs() {
    try {
      // Connect to the MongoDB server
      await client.connect();
      // console.log("Connected to MongoDB Atlas");
  
      // Access the database and collection
      const database = client.db("cts-project");
      const collection = database.collection("blogs");
  
      // Find all documents with the specified projection
      const documents = await collection.find({}).toArray();
  
      return documents;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      client.close();
    }
}

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
            return 200;
        }
    }
    catch(err){
        return 500;
    }
}

async function getUserByEmail(email) {
  try {
    await client.connect();
    const database = client.db('cts-project');
    const collection = database.collection('blog-users');

    const user = await collection.findOne({ email: email });
    return user;
  } catch (error) {
    // Handle any errors that occurred during the query
    console.error('Error retrieving user by email:', error.message);
    throw error;
  } finally {
    await client.close();
  }
}




//https://drive.google.com/uc?export=view&id=
module.exports ={
    addBlog:addBlog,
    uploadThumbnail:uploadThumbnail,
    getBlog:getBlog,
    deleteBlog:deleteBlog,
    incrementLikes:incrementLikes,
    getAllBlogs:getAllBlogs,
    getUserByEmail:getUserByEmail
}

 
