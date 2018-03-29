var {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = "5abd213b4b7ec953a0b42f9b"

if(!ObjectId.isValid(id)) return console.log('the object ID is not valid');

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log("Todos:",todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log("Todos:",todo);
// });

Todo.findById(id).then((todo) => {
    if(!todo) return console.log('Id was not found');
    console.log("Todos:",todo);
}).catch((e) => console.log(e));
