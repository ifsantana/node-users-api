var express = require('express');
var router = express.Router();
const { User } = require('../models');
const sequelize = require('../config/sequelize');
const {Transaction} = require("sequelize");

// var users = [
//     { id: 1, name: 'John', email: 'test@gmail.com', age: 35 },
//     { id: 2, name: 'Jane', email: 'test2@gmail.com', age: 28 },
// ]

router.get('/', async (req, res) => {
    const users = await User.findAll();
    return res.status(200).json(users);
});

router.post('/', async (req, res) => {
    let { id, name, email, age } = req.body;

    const user = await managedTransactionalUserCreation({ id, name, email, age });

    console.log(user);
    return res.status(201).json(user);
});

router.delete('/:id', async (req, res) => {
    let { id } = req.params;
    // in memory logic
    // let indexToRemove = users.findIndex(user => user.id.toString() === id);
    // users.splice(indexToRemove, 1);
    let result = await User.destroy({ where: { id } });

    if(result >= 1) {
        return res.sendStatus(204);
    } else {
        return res.status(404).send('Not Found');
    }
})

router.put('/:id', async (req, res) => {
    let { id } = req.params;
    let { name, email, age } = req.body;
    // in memory logic
    // let currentUser = users.find(user => user.id.toString() === id);
    // if (currentUser) {
    //     currentUser.name = name;
    //     currentUser.email = email;
    //     currentUser.age = age;
    // }
    let result = await User.update(
        { name, email, age },
        { where: { id } }
    );

    if(result.length === 1) {
        let updatedUser = await User.findOne( { where: {id} });
        return res.status(200).json(updatedUser);
    } else {
        return res.status(409).json({})
    }
})

async function inMemoryUserCreation(req, res) {
    // in memory

    // let newId = users.length + 1;
    // users.push({ id: , name, email, age });
}

async function nonTransactionalUserCreation(user) {
    await User.create(user);
}

async function defaultUnmanagedTransactionalUserCreation(user) {
    // unmanaged (not managed by sequelize) transaction with default isolation level (isolation level = db isolation level)
    let t = await sequelize.transaction()

    try {
        let newUser = await User.create(user,  { transaction: t });
        await t.commit();
        return newUser;
    } catch (error) {
        console.error(error);
        await t.rollback();
    }
}

async function customUnmanagedTransactionalUserCreation(user) {
    // unmanaged transaction custom isolation level
    const t = await sequelize.transaction( { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED } );

    try {
        let newUser = await User.create(user,  { transaction: t });
        await t.commit();
        return newUser;
    } catch (error) {
        console.error(error);
        await t.rollback();
    }
}

async function managedTransactionalUserCreation(user) {
    // transaction managed by sequelize (locks, commits and rollbacks)
    const result = await sequelize.transaction(async t => {
        const newUser = await User.create(user, {transaction: t});

        // If something goes wrong, we throw an error manually, so that Sequelize handles (rollback) everything automatically.
        if(!newUser) {
            throw new Error();
        }

        return newUser;
    });

    return result;
}

module.exports = router;
