const mongoose = require('mongoose');
const Schema = mongoose.Schema;



  const User = new Schema({
    username: { type: String, required: true, minlength:6, unique: true},
    email: { type: String, required: true, minlength:6, unique: true},
    password: { type: String, required: true, minlength: 6, unique: true},
    admin: { type: Boolean, default: false},
}, {
 timestamps: true
});

module.exports = mongoose.model('User', User,'users');