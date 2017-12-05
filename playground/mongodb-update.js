//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return  console.log('Unable to Connect to MongoDB Server');
    }
    console.log('Connected to MongoDB server');

//    db.collection('Todos').findOneAndUpdate({_id: new ObjectID('5a25b6168ef1d53e2ed9b4b7')}, { 
//        $set: {completed: true}
//    }, {returnOriginal: false}).then((result) => {
//        console.log(result);
//    });

    db.collection('Users').findOneAndUpdate({_id: new ObjectID("5a25a9cafb9bb62e048b53ea")}, {
        $set:{name: 'Himanshu Saini'},
        $inc:{age:-1}
    }, {returnOriginal: false}).then((result) => {
        console.log(result);
    });
    db.close();
});