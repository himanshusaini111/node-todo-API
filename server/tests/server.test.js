const expect = require('expect');
const request = require('supertest');

const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
       var text = 'Test todo text 3';
           
       request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create a todo with bad input', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) return done(err);
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET /todos/:id', (done) => {
    it('should fetch todo by ID', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${(new ObjectId()).toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 400 for invalid ID', (done) => {
        request(app)
        .get(`/todos/1323`)
        .expect(400)
        .end(done);
    });

});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        request(app)
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            }).end((err, res) => {
                if(err) return done(err);

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should return 404 if todo not found',(done) => {
        request(app)
            .delete(`/todos/${(new ObjectId()).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should get 400 for invalid id', (done) => {
        request(app)
            .delete(`/todos/1323`)
            .expect(400)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should get update a todo', (done) => {
        todoU = {
            text: 'Updated test text 1',
            completed: true
        };

        request(app)
            .patch(`/todos/${todos[0]._id}`)
            .send(todoU)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todoU.text);
                expect(res.body.completed).toBe(true);
                expect(typeof (res.body.completedat)).toBe('number');
            }).end((err, res) => {
                if(err) return done(err);

                Todo.findOne({text: todoU.text}).then((doc) => {
                    expect(doc.completed).toBe(true);
                    expect(typeof (doc.completedat)).toBe('number');

                    done();
                }).catch((e) => done(e));
            });
    });

    it('should clear completedat when todo is not completed', (done) => {
        todoU = {
            text: 'Updated test text 2',
            completed: false
        }
        request(app)
            .patch(`/todos/${todos[1]._id}`)
            .send(todoU)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todoU.text);
                expect(res.body.completed).toBe(false);
                expect(res.body.completedat).toBe(null);
            }).end((err, res) => {
                if(err) return done(err);

                Todo.findOne({text: todoU.text}).then((doc) => {
                    expect(doc.text).toBe(todoU.text);
                    expect(doc.completed).toBe(false);
                    expect(doc.completedat).toBe(null);

                    done();
                }).catch((e) => done(e));
            });
    });
});