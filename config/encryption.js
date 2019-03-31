const crypto = require('crypto');
const key = "vvgrhfvghgfherfhbchjbvhjervhbvfr";
const iv = crypto.randomBytes(16);

module.exports = { 
 encrypt:(entry)=>{
let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(entry);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
},

 decrypt: (entry)=> {
let iv = Buffer.from(entry.iv, 'hex');
 let encryptedText = Buffer.from(entry.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}
}


