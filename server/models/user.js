var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `It is not a valid email`
        }
    },
    password: {
        minlength: 6,
        type: String,
        required: true,       
    },
    tokens: [{
        access: {
            type: String,
            required:true
        },
        token: {
            type: String,
            required:true            
        }
    }]
});

UserSchema.set('usePushEach', true);

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.toJSON = function (){
    return _.pick(this.toObject(), ['email', '_id'])
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    
    try{
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.pre('save', function (next) {
    user = this;
    console.log('pre is called');
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                console.log(user.password);
                next();
            });
        });
    }
    else {
        console.log('else');
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};