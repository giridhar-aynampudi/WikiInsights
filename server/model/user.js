var mongoose = require('./db');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:{ type: String, required: true },
    email: { type: String, required: true },
    passwordHash:{ type: String, required: true },
},
    {
    versionKey: false
});

UserSchema.index({email: 1});

UserSchema.methods.createPasswordHash = function(password) {
    this.saltRounds = 12;
    this.passwordHash = bcrypt.hashSync(password, this.saltRounds);
  };
  
UserSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

var User = mongoose.model('User', UserSchema, 'users');

module.exports = User;