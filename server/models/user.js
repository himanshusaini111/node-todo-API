var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

var User = mongoose.model('User', UserSchema);

module.exports = {User};