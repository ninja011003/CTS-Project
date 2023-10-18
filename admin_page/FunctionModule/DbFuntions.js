const mongodb = require('mongodb')
const {encrypt,decrypt} = require('./EncryptionFunctions')

require('dotenv').config()

const client = new mongodb.MongoClient(process.env.DBCONNECTURL, {
    serverApi: {
      version: mongodb.ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


async function addUser(username,email,password){
    try {
        await client.connect();
        const db = client.db('cts-project');
        const collection =db.collection('user-cred');
        const existingUser = await collection.findOne({ email: await encrypt(String(email)) });
        if (existingUser) {
            // console.log('User with the same email already exists');
            //
            return 409; // HTTP status code for conflict
        }
        const document ={
            username: await String(username),
            email:await encrypt(String(email)),
            password:await encrypt(String(password))
        }
        const result = await collection.insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);
        return 201;
    } catch (error) {
        console.error('Error inserting document', error);
        return 500;
        // throw error;
    }
    finally{
        await client.close();
    }
}

async function findUser(email, password) {
    try {
        await client.connect()
        const db = client.db('cts-project');
        const collection =db.collection('user-cred');
        const user = await collection.findOne({
            email:await encrypt(String(email)),
            password:await encrypt(String(password))
        });

        if (user) {
            // console.log('User found');
            const decryptedUser = {
                _id:user._id,
                username: await String(user.username),
                email:await decrypt(String(user.email)),
                password:await decrypt(String(user.password))
            }
            return {user:decryptedUser,
            status:200};
        } else {
            // console.log('User not found');
            return {user:null,
                status:404};
        }
    } catch (error) {
        console.error(error);
        // throw error;
        return {user:null,
            status:500};
    } finally {
        await client.close();
    }
}

module.exports={
    addUser:addUser,
    findUser:findUser
}