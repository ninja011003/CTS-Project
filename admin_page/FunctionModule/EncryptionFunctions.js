const crypto = require('crypto');
require('dotenv').config()



const algorithm = 'aes-256-cbc'; 
const secretKey = process.env.ENCRYPTIONKEY; 
const iv = process.env.IV;


function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}


function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

// const originalText = 'Hello, this is a secret!';
// const encryptedData = encrypt(originalText);
// console.log('Encrypted:', encryptedData);

// const decryptedText = decrypt('eb41f0ad5da3bf7b882aebb2f2834eda');
// console.log('Decrypted:', decryptedText);



module.exports= {
    encrypt: encrypt,
    decrypt: decrypt
}