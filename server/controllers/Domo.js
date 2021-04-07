/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */


// const { makerPage } = require('./Domo');
//

// const makerPage = (req, res) => {
//     res.render('app');
// };

const mongoose = require('mongoose');

//mongoose.Promise = global.Promise;
const _ = require('underscore');
const models = require('../models');
const Domo = models.Domo;
let DomoModel = {};
//const { Domo } = models;

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertld = mongoose.Types.Objectld;
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

const makeDomo = (req, res) => {
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({
            error: 'RAWR! Both name and age are required',
        });
    }
    const domoData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id,
    };
    const newDomo = new Domo.DomoModel(domoData);
    const domoPromise = newDomo.save();
    domoPromise.then(() => res.json({
        redirect: '/maker',
    }));
    domoPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({
                error: 'Domo already exists.',
            });
        }
        return res.status(400).json({
            error: 'An error occurred ',
        });
    });
    return domoPromise;
};

const makerPage = (req, res) => {
    Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'Am error occurred' });
        }

        return res.render('app', { domos: docs });
    });
};

DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
});
DomoSchema.statics.findByOwnor = (ownerld, callback) => {
    const search = {
        owner: convertld(ownerld),
    };
    return DomoModel.find(search).select('name age').lean().exec(callback);
};
DomoModel = mongoose.model('Domo', DomoSchema);
module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;


module.exports.makerPage = makerPage;
module.exports.make = makeDomo;