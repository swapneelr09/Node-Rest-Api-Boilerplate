const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true, unique: true },
    address: { type: String, required: true, trim: true },
});


/* Mongoose -> Document Middleware
userSchema.pre('save', async function (next) {
});
*/


const userModel = mongoose.model('users', userSchema);
module.exports = userModel;