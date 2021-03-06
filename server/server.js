require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => res.status(400).send(e));
})

app.get('/todos/:id', (req,res) => {
    id = req.params.id;

    if(!ObjectId.isValid(id)) return res.status(400).send();
    
    Todo.findById(id).then((todo) => {
        if(!todo) return res.status(404).send();
    
        res.status(200).send({todo});
    }).catch((e) => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
    id = req.params.id;

    if(!ObjectId.isValid(id)) return res.status(400).send();

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) return res.status(404).send();

        res.status(200).send({todo});
    }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(id))   return res.status(400).send();   

    if(_.isBoolean(body.completed)&&body.completed)    body.completedat = new Date().getTime();
    else{
        body.completed = false;
        body.completedat = null;
    }
    
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) return res.status(404).send();

        res.status(200).send(todo);
    }).catch((e) => {
        res.status(400).send();
    })
});

app.post('/users', (req, res) => {
    var user = new User(_.pick(req.body, ['email', 'password']));

    user.save().then((user) => {      
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

module.exports = {app};