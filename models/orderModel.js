const mongoose = require('mongoose');
const { User } = require('../models')

const Schema = mongoose.Schema;

/*
FOR REFERENCE 
-------------
var shirtSchema = new Schema({
    lengthFromShoulder: { type: Number, required: true },
    shoulderToChest: { type: Number, required: true },
    chest: { type: Number, required: true },
    shoulderLength: { type: Number, required: true },
    sleeveLength: { type: Number, required: true },
    armHole: { type: Number, required: true },
    neck: { type: Number, required: true },
    sleeveWidth: { type: Number, required: true },
});

var skirtSchema = new Schema({
    waist: { type: Number, required: true },
    length: { type: Number, required: true },
});

var shortSchema = new Schema({
    waist: { type: Number, required: true },
    thigh: { type: Number, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
});
*/

const orderSchema = new Schema({
    name: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ['male', 'female'] },
    type: { type: String, required: true, trim: true, enum: ['shorts', 'shirt', 'skirt'], lowercase: true },
    measurement: { type: Object, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: 0 }
});



const orderModel = mongoose.model('orders', orderSchema);
module.exports = orderModel;