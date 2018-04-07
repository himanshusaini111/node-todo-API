const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pass = '123abc';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pass, salt, (err, hash) => {
        console.log(hash);
    })
});

hashedpass = '$2a$10$JVZZysCEqbLhZAkPXD41oeUxaZh9MnkaTnaPcZxx.clNUBnySp7e2';
              $2a$10$sRdahjRWfN80afRCV4IhYuzdDHNY6enBY41GfmUTQzxJDH6xeq3Bu

bcrypt.compare(pass, hashedpass, (err, res) => {
    console.log(res);
})

// var data = {
//     id:10
// };

// var token =  jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var msg = 'I am user number 3';
// var hash = SHA256(msg).toString();

// console.log(`Message: ${msg}`);
// console.log(`Hash: ${hash}`);

// //And much more which was just to understand the concepts of hashing and salting