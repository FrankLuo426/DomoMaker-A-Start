
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */

const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};
// const { Domo } = models;

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    age: {
        type: Number,
        min: 0,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});


DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
    sex: doc.sex,
});
DomoSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId),
    };
    return DomoModel.find(search).select('name age sex').lean().exec(callback);
};
DomoModel = mongoose.model('Domo', DomoSchema);
module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
