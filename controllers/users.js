var express = require('express');
var router = express.Router();
const { User } = require('../models');

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
    // let newId = users.length + 1;
    // in memory
    // users.push({ id: , name, email, age });
    let newUser = await User.create({ id, name, email, age })
    console.log(newUser);
    return res.status(201).json(newUser);
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

module.exports = router;
