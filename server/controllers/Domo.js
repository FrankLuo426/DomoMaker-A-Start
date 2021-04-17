/* eslint-disable linebreak-style */
/* eslint-disable indent */
const models = require('../models');

const nameField = ['Jacob', 'Ryan', 'Jae', 'Sean', 'Brad', 'Cullen', 'Oliver', 'Jonathan', 'Jared', 'Tom', 'Kippy', 'David', 'John', 'Frank'];
const sexField = ['male', 'Female'];

const {
    Domo,
} = models;

const makeDomo = (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.sex) {
        const domoData = {
            name: nameField[Math.floor(Math.random() * nameField.length)],
            age: Math.floor(Math.random() * 100),
            sex: sexField[Math.floor(Math.random() * sexField.length)],
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
    }
    const domoData = {
        name: req.body.name,
        age: req.body.age,
        sex: req.body.sex,
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

const makeRandomDomo = (req, res) => {
    const domoData = {
        name: "Random Name",
        age: 10,
        sex: "Male",
        owner: req.session.account._id,
    };
    const newDomo = new Domo.DomoModel(domoData);
    const domoPromise = newDomo.save();
    domoPromise.then(() => res.json({
        redirect: '/makeRandom',
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
            return res.status(400).json({
                error: 'Am error occurred',
            });
        }

        return res.render('app', {
            csrfToken: req.csrfToken(),
            domos: docs,
        });
    });
};


const getDomos = (request, response) => {
    const req = request;
    const res = response;
    return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'An error occurred'
            });
        }
        return res.json({
            domos: docs
        });
    });
};
module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.makeRandomDomo = makeRandomDomo;