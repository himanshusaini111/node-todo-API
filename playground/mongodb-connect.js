//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return  console.log('Unable to Connect to MongoDB Server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to to',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to Insert Todos');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Himanshu Saini',
        age: 20,
        location: 'Dhanbad'
    }, (err, result) => {
        if(err){
            return console.log('Unable to Insert in Users');
        }
        
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    })

    db.close();
});